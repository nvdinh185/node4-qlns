"use strict"
/**
 * các hàm tính toán trọng số của bộ phận
 * 
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');

/**
 * 
 * @param {*} parentId 
 */
const updateWeightPercentParent = (parentId) => {

    if (parentId > 0) {
        db.getRsts(`select a.* from departments_kpi a
                        where a.parent_id = ${parentId}
                        and a.status = 1`)
            .then(results => {
                let treeOrder = arrObj.createTreeWeight(results, 'id', 'parent_id', 'weight', parentId);
                treeOrder.forEach(async (el) => {
                    let jsonForUpdate = {
                        id: el.id,
                        weight_percent: el.$weight_percent, //trong so tinh toan %
                        parent_weight_percent: el.parent_weight_percent,  //lay trong so goc cay cu
                        root_weight_percent: el.$weight_percent * el.parent_weight_percent //trong so
                    }
                    await db.update(arrObj.convertSqlFromJson('departments_kpi', jsonForUpdate, ['id']))
                })
            })
            .catch(err => console.log('Loi query', err));
    }
}


/**
 * Tính lại trọng số cho toàn bộ cây KPI của bộ phận đó
 * Trường hợp có mã bộ phận mới tính
 * Còn nếu không có mã bộ phận thì thôi
 * @param {*} departmentId 
 */
const updateWeightPercentDepartment = (departmentId, isMLMT) => {

    if (departmentId > 0) {
        // gán lại trọng số giao cho bsc_id=22 
        // vì truyền lên là không có trọng số được giao
        //chỉ cập nhập tính toán lại các kpi có trạng thái status=1 mà thôi
        db.getRsts(`WITH RECURSIVE
                under_tree AS (
                select a.* from departments_kpi a
                where a.bsc_id in (21,22)
                and a.status=1 
                and a.organization_id = ${departmentId}
                UNION ALL
                SELECT b.*
                    FROM departments_kpi b
                     JOIN under_tree
                      ON b.parent_id = under_tree.id
                      and b.status=1
                ORDER BY order_1
                )
            SELECT * FROM under_tree`)
            .then(results => {

                // gán trọng số giao xuống cho kpi riêng khi chưa có
                let seperatedKpis = results.filter(x=>x.kpi_role==="C" || x.kpi_role==="Tr")
                let privateKpis = results.filter(x=>x.kpi_role==="Ts" || x.kpi_role==="Tz" || x.kpi_role==="R")
                let maxSeperatedWeight = arrObj.getMaxValue(seperatedKpis,"seperated_weight");
                
                // gán các trọng số cực đại vào cho kpi riêng để tính trọng số chung cho hợp lý
                privateKpis.forEach(el=>{
                    el.seperated_weight = el.seperated_weight || maxSeperatedWeight;
                    el.weight =  (el.seperated_weight || maxSeperatedWeight) * el.self_weight
                })

                let treeOrder = arrObj.createTreeWeight(results, 'id', 'parent_id', 'weight');
                // let isMLMT=true; // đây là cách tính của MLMT
                // tính trọng số chỉ của lá cây thôi
                // lọc lấy các trọng số tích hợp weight của this.departmentsKpis với status=1
                // phải cùng cấp 2 thì mới lọc được nhé
                let allActiveKpis = treeOrder.filter(x => x.status === 1 && x.$is_leaf === 1 && x.$level === 2);
                let sumWeightLeaf = allActiveKpis.map((o) => { return o['weight'] }).reduce((a, b) => a + b, 0);

                allActiveKpis.forEach((el, idx) => {
                    // Ghi tổng trọng số thành phần cùng cấp
                    el.$sum_weight_leaf = sumWeightLeaf;
                    el.$root_weight_percent_leaf = el['weight'] / sumWeightLeaf; // trọng số quy đổi kiểu mlmt
                });
                // end bổ sung version của mlmt trọng số con tất cả


                treeOrder.forEach(async (el) => {
                    let jsonForUpdate = {
                        id: el.id,
                        seperated_weight: el.seperated_weight,
                        weight: el.weight,
                        weight_percent: el.$weight_percent,
                        parent_weight_percent: el.$parent_weight_percent,
                        // trọng số lấy theo cây truyền từ gốc xuống
                        root_weight_percent: isMLMT && el.$is_leaf === 1 && el.$level === 2 ? el.$root_weight_percent_leaf : el.$root_weight_percent
                    }
                    await db.update(arrObj.convertSqlFromJson('departments_kpi', jsonForUpdate, ['id']))
                })
            })
            .catch(err => console.log('Loi query', err));
    }
}

/**
 * Cập nhập chỉ số của đơn vị sẽ tự động ăn xuống phân rã và nhân viên
 * @param {*} departmentsKpiId 
 * @param {*} jsonData 
 */
const updateRoleCFromDepartment = (departmentsKpiId, jsonData) => {
    // Dữ liệu đưa lên là: chuỗi jsonData từ user post lên
    // Tạo một chuỗi json để update các id liên quan xuống dưới từng bảng một
    return new Promise(async (resolve, reject) => {
        try {
            let jsonUpdated = {
                name: jsonData.name
                , unit: jsonData.unit
                , operator_method: jsonData.operator_method
                , calculating_description: jsonData.calculating_description
                , target_limit: jsonData.target_limit
                , target: jsonData.target
                , target_description: jsonData.target_description
                , result_min_limit: jsonData.result_min_limit
                , result_max_limit: jsonData.result_max_limit
                , frequency_review: jsonData.frequency_review
                , frequency_record: jsonData.frequency_record
                , status_description: jsonData.status_description
                , status: jsonData.status
            }

            // nếu chỉ là thay đổi trạng thái thì phải update hết cây C & Tr
            let jsonStatus = arrObj.clone(jsonUpdated);
            let onlyStatus = (jsonStatus.status !== undefined
                && jsonStatus.status_description !== undefined
                && Object.keys(jsonStatus).length === 2);

            // có cấp 2 thì có cấp 3
            // Lấy danh sách id của bảng departments_kpi vai trò C:
            let seperatedRoleIds = await db.getRsts(
                `select id from seperated_roles_kpi
                    where department_kpi_id in (${departmentsKpiId})`
                + (onlyStatus ? `` : `and kpi_role = 'C'
                `));

            if (Array.isArray(seperatedRoleIds) && seperatedRoleIds.length > 0) {

                // chuyển đổi array [{id:1}] thành [1,2,3...]
                seperatedRoleIds = seperatedRoleIds.map((o) => o['id']);

                let jsonUpdateSeperatedRole = arrObj.clone(jsonUpdated);
                // jsonUpdateSeperatedRole.id = seperatedRoleIds; // mệnh đề in
                jsonUpdateSeperatedRole.id = seperatedRoleIds; // test thử 1
                await db.update(db.convertSqlFromJson('seperated_roles_kpi', jsonUpdateSeperatedRole, ['id']));

                // có cấp 3 thì có cấp 4
                // Lấy danh sách id của bảng departments_kpi vai trò C:
                let staffsKpiIds = await db.getRsts(
                    `select id from staffs_kpi
                        where seperated_role_id in (${seperatedRoleIds.toString()})`
                    + (onlyStatus ? `` : `and kpi_role = 'C'`));

                if (Array.isArray(staffsKpiIds) && staffsKpiIds.length > 0) {
                    // chuyển đổi array [{id:1}] thành [1,2,3...]
                    staffsKpiIds = staffsKpiIds.map((o) => o['id']);

                    let jsonUpdateStaffsKpi = arrObj.clone(jsonUpdated);

                    jsonUpdateStaffsKpi.id = staffsKpiIds; // mệnh đề in
                    await db.update(db.convertSqlFromJson('staffs_kpi', jsonUpdateStaffsKpi, ['id']));

                }
            }
            // cập nhập xong 4 cấp từ bảng 
            // seperated_map_kpi --> departments_kpi --> seperated_roles_kpi --> staffs_kpi
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    updateWeightPercentParent,
    updateWeightPercentDepartment,
    updateRoleCFromDepartment
}
