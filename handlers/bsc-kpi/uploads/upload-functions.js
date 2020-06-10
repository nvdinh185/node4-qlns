"use strict"
/**
 * các hàm tạo cây upload trước
 * 
 */
const arrObj = require('../../../utils/array-object');
const db = require('../../../db/sqlite3/db-pool');

// lấy cây kpi của bộ phận
const getDepartmentKpiTree = (departmentId) => {
    return db.getRsts(`WITH RECURSIVE under_tree AS (
                        select a.* from departments_kpi a
                        where a.bsc_id in (21,22)
                        and a.organization_id = ${departmentId}
                        UNION ALL
                        SELECT b.*
                            FROM departments_kpi b 
                            JOIN under_tree 
                            ON b.parent_id = under_tree.id
                        ORDER BY order_1)
                        select * from under_tree`)
        .then(data => {
            // console.log('data', data);
            // chuyển đổi trật tự rồi trả về mảng
            return arrObj.createTreeOrder(data, "id", "parent_id")
        })
        .catch(err => {
            console.log('Lỗi câu lệnh getDepartmentKpiTree:', err);
            return []
        })
}

// tạo gốc cây kpi cho bộ phận
const createRootDepartment = (organizationId, departmentId) => {
    return new Promise(async (resolve) => {
        try {
            let roots = await db.getRsts(`select
                                            b.id,
                                            b.organization_id,
                                            b.name,
                                            b.weight,
                                            b.weight_percent,
                                            a.bsc_id,
                                            a.value as bsc_name,
                                            a.weight as bsc_weight
                                        from organizations_bsc a
                                        LEFT JOIN departments_kpi b
                                        on a.bsc_id = b.bsc_id
                                            and b.organization_id = ${departmentId}
                                        where a.organization_id = ${organizationId}
                                            and a.bsc_id in (21,22)`);
            for (let i = 0; i < roots.length; i++) {
                let el = roots[i];
                if (!el.id) { //chưa có id được tạo trong cây thì tạo để lấy id
                    //tạo dữ liệu json theo cột và giá trị 
                    let jsonData = {
                        organization_id: departmentId, //mã tổ chức cấp phòng
                        name: el.bsc_name,
                        weight: el.bsc_weight,
                        weight_percent: el.bsc_weight / (roots.map((o) => { return o['bsc_weight'] }).reduce((a, b) => a + b, 0)),
                        parent_weight_percent: 1,
                        root_weight_percent: el.bsc_weight / (roots.map((o) => { return o['bsc_weight'] }).reduce((a, b) => a + b, 0)),
                        bsc_id: el.bsc_id,
                        created_time: Date.now()
                    }
                    //tạo dữ liệu câu lệnh json để thực thi vào bảng csdl
                    let jsonInsert = arrObj.convertSqlFromJson("departments_kpi", jsonData, []);
                    //thực hiện chèn dữ liệu vào
                    await db.insert(jsonInsert);
                    //chèn thành công
                }
            };
        } catch (e) {
            console.log("Lỗi tạo kpi createRootDepartment:", e);
        } finally {
            resolve('OK')
        }
    })
}

// lấy gốc cây cho cá nhân
const getStaffKpiTree = (staffId) => {
    return db.getRsts(`WITH RECURSIVE under_tree AS (
                        select a.* from staffs_kpi a
                        where a.bsc_id in (23,24,25)
                        and a.staff_id = ${staffId}
                        UNION ALL
                        SELECT b.*
                            FROM staffs_kpi b 
                            JOIN under_tree 
                            ON b.parent_id = under_tree.id
                        ORDER BY order_1)
                        select * from under_tree`)
        .then(data => {
            // console.log('data', data);
            // chuyển đổi trật tự rồi trả về mảng
            return arrObj.createTreeOrder(data, "id", "parent_id")
        })
        .catch(err => {
            console.log('Lỗi câu lệnh getStaffKpiTree:', err);
            return []
        })
}

// tạo gốc cây cho cá nhân
const createRootStaff = (organizationId, staffId) => {
    return new Promise(async (resolve) => {
        try {

            // lấy mã bộ phận của nhân viên
            let { departmentId } = await db.getRst(`select organization_id as departmentId from staffs where id=${staffId}`);

            // console.log('DepartmentId:', departmentId, staffId);
            
            let roots = await db.getRsts(`select
                                            b.id,
                                            b.organization_id,
                                            b.staff_id,
                                            b.name,
                                            b.weight,
                                            b.weight_percent,
                                            a.bsc_id,
                                            a.value as bsc_name,
                                            a.weight as bsc_weight
                                        from organizations_bsc a
                                            LEFT JOIN staffs_kpi b
                                            on a.bsc_id = b.bsc_id
                                            and b.staff_id = ${staffId}
                                        where a.organization_id = ${organizationId}
                                            and a.bsc_id in (23,24,25)`);

            for (let i = 0; i < roots.length; i++) {
                let el = roots[i];
                if (!el.id) { //chưa có id được tạo trong cây thì tạo để lấy id
                    //tạo dữ liệu json theo cột và giá trị 
                    let jsonData = {
                        organization_id: departmentId, //mã tổ chức cấp phòng
                        staff_id: staffId,
                        name: el.bsc_name,
                        weight: el.bsc_weight,
                        weight_percent: el.bsc_weight / (roots.map((o) => { return o['bsc_weight'] }).reduce((a, b) => a + b, 0)),
                        parent_weight_percent: 1,
                        root_weight_percent: el.bsc_weight / (roots.map((o) => { return o['bsc_weight'] }).reduce((a, b) => a + b, 0)),
                        bsc_id: el.bsc_id,
                        created_time: Date.now()
                    }
                    //tạo dữ liệu câu lệnh json để thực thi vào bảng csdl
                    let jsonInsert = arrObj.convertSqlFromJson("staffs_kpi", jsonData, []);
                    //thực hiện chèn dữ liệu vào
                    await db.insert(jsonInsert);
                    //chèn thành công
                }
            };
        } catch (e) {
            console.log("Lỗi tạo kpi createRootStaff:", e);
        } finally {
            resolve('OK')
        }
    })

}

module.exports = {
    createRootDepartment,
    createRootStaff,
    getDepartmentKpiTree,
    getStaffKpiTree
}
