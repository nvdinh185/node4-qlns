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
        db.getRsts(`select a.* from staffs_kpi a
                        where a.parent_id=${parentId}
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
                    await db.update(arrObj.convertSqlFromJson('staffs_kpi', jsonForUpdate, ['id']))
                })
            })
            .catch(err => console.log('Loi query', err));
    }
}


/**
 * Tính lại trọng số cho toàn bộ cây KPI của nhân viên đó
 * Trường hợp có mã nhân viên mới tính
 * Còn nếu không có mã nhân viên thì thôi
 * @param {*} staffId 
 */
const updateWeightPercentStaff = (staffId, isMLMT) => {

    if (staffId > 0) {
        // gán lại trọng số giao cho bsc_id=22 
        // vì truyền lên là không có trọng số được giao
        //chỉ cập nhập tính toán lại các kpi có trạng thái status=1 mà thôi
        db.getRsts(`WITH RECURSIVE
                under_tree AS (
                select a.* from staffs_kpi a
                where a.bsc_id in (23,24,25)
                and a.status=1 
                and a.staff_id=${staffId}
                UNION ALL
                SELECT b.*
                    FROM staffs_kpi b JOIN under_tree ON b.parent_id = under_tree.id
                     and b.status=1
                ORDER BY order_1
                )
            SELECT * FROM under_tree`)
            .then(async results => {
                // gán trọng số giao xuống cho kpi riêng khi chưa có
                let seperatedKpis = results.filter(x => x.kpi_role === "C" || x.kpi_role === "Tr")
                let privateKpis = results.filter(x => x.kpi_role === "Ts" || x.kpi_role === "Tz" || x.kpi_role === "R")
                let maxSeperatedWeight = arrObj.getMaxValue(seperatedKpis, "seperated_weight");

                // gán các trọng số cực đại vào cho kpi riêng để tính trọng số chung cho hợp lý
                privateKpis.forEach(el => {
                    el.seperated_weight = el.seperated_weight || maxSeperatedWeight;
                    el.weight = (el.seperated_weight || maxSeperatedWeight) * el.self_weight

                })

                let treeOrder = arrObj.createTreeWeight(results, 'id', 'parent_id', 'weight');
                // console.log("Sau: ", treeOrder);

                // tính trọng số chỉ của lá cây thôi
                // lọc lấy các trọng số tích hợp weight của this.departmentsKpis với status=1
                // phải cùng cấp 2 thì mới lọc được nhé, tránh tường hợp lá cây nhưng mà là gốc mức 1 chưa có con
                let allActiveKpis = treeOrder.filter(x => x.status === 1 && x.$is_leaf === 1 && x.$level === 2);
                let sumWeightLeaf = allActiveKpis.map((o) => { return o['weight'] }).reduce((a, b) => a + b, 0);

                allActiveKpis.forEach((el, idx) => {
                    // Ghi tổng trọng số thành phần cùng cấp
                    el.$sum_weight_leaf = sumWeightLeaf;
                    el.$root_weight_percent_leaf = el['weight'] / sumWeightLeaf; // trọng số quy đổi kiểu mlmt
                });
                // end bổ sung version của mlmt trọng số con tất cả

                for (let idx = 0; idx < treeOrder.length; idx++) {
                    let el = treeOrder[idx];
                    let jsonForUpdate = {
                        id: el.id,
                        seperated_weight: el.seperated_weight,
                        weight: el.weight,
                        weight_percent: el.$weight_percent,
                        parent_weight_percent: el.$parent_weight_percent,
                        root_weight_percent: isMLMT && el.$is_leaf === 1 && el.$level === 2 ? el.$root_weight_percent_leaf : el.$root_weight_percent
                    }
                    await db.update(arrObj.convertSqlFromJson('staffs_kpi', jsonForUpdate, ['id']))
                }
            })
            .catch(err => console.log('Loi query', err));
    }
}

module.exports = {
    updateWeightPercentParent,
    updateWeightPercentStaff
}