"use strict"
/**
 * Bộ xử lý xóa, chỉ sử dụng cho super admin
 * 
 * Việc xóa kpi hoặc cây phân rã sẽ ảnh hưởng đến các báo cáo đã tạo ra 
 * Do vậy rất hạn chế việc xóa này, 
 * chỉ sử dụng trong trường hợp cần thiết bởi superadmin
 * 
 * version 1.0 ngày 02/11/2019
 * 
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');


// xóa từ bộ phận thì phải xóa cây phân rã chức danh và cá nhân
const delDepartmentKpi = (kpiId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // xóa kpi ngay bộ phận và truyền mã kpi để xóa các cây phân rã
            await db.delete(db.convertSqlFromJson('departments_kpi', { id: kpiId }, ['id']));
            // xóa cây phân rã xuống
            await delTreeFromDepartmentsKpi(kpiId);
            // seperated_map_kpi --> departments_kpi --> seperated_roles_kpi --> staffs_kpi
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * Xóa từ phân rã vai trò (s)
 * @param {*} seperatedRoleId 
 */
const delSeperatedRolesKpi = (seperatedRoleId) => {

    return new Promise(async (resolve, reject) => {
        try {

            let jsonUpdateSeperatedRole = {};
            jsonUpdateSeperatedRole.id = seperatedRoleId; // mệnh đề in
            await db.delete(db.convertSqlFromJson('seperated_roles_kpi', jsonUpdateSeperatedRole, ['id']));

            // console.log('seperatedRoleId', xx, seperatedRoleId);

            // có cấp 3 thì có cấp 4
            // Lấy danh sách id của bảng departments_kpi vai trò C:
            let staffsKpiIds = await db.getRsts(`select id from staffs_kpi
                        where seperated_role_id in (`+ (Array.isArray(seperatedRoleId) ? seperatedRoleId.toString() : seperatedRoleId) + `)`);

            if (Array.isArray(staffsKpiIds) && staffsKpiIds.length > 0) {
                // chuyển đổi array [{id:1}] thành [1,2,3...]
                staffsKpiIds = staffsKpiIds.map((o) => o['id']);

                let jsonUpdateStaffsKpi = {};

                jsonUpdateStaffsKpi.id = staffsKpiIds; // mệnh đề in
                await db.delete(db.convertSqlFromJson('staffs_kpi', jsonUpdateStaffsKpi, ['id']));

            }
            // cập nhập xong 3 cấp từ bảng 
            // seperated_map_kpi --> departments_kpi --> seperated_roles_kpi --> staffs_kpi
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * Xóa cây từ đơn vị (s)
 * @param {*} departmentsKpi 
 */
const delTreeFromDepartmentsKpi = (departmentsKpi) => {

    return new Promise(async (resolve, reject) => {
        try {
            // có cấp 2 thì có cấp 3
            // Lấy danh sách id của bảng departments_kpi vai trò C:
            let seperatedRoleIds = await db.getRsts(`select id from seperated_roles_kpi
                    where department_kpi_id in (`+ (Array.isArray(departmentsKpi) ? departmentsKpi.toString() : departmentsKpi) + `)`);

            if (Array.isArray(seperatedRoleIds) && seperatedRoleIds.length > 0) {

                // chuyển đổi array [{id:1}] thành [1,2,3...]
                seperatedRoleIds = seperatedRoleIds.map((o) => o['id']);

                // console.log('departmentsKpi, seperatedRoleIds', departmentsKpi, seperatedRoleIds);

                await delSeperatedRolesKpi(seperatedRoleIds);

            }
            // cập nhập xong 3 cấp từ bảng 
            // seperated_map_kpi --> departments_kpi --> seperated_roles_kpi --> staffs_kpi
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * Xóa các liên quan từ cấp phân rã
 * Thực hiện từ chức năng hủy phân rã (id trực tiếp Tr)
 * @param {*} seperatedMapId (s) từ một id hoặc một mảng [id]
 */
const delFromSeperatedMapKpi = (seperatedMapId) => {
    // Dữ liệu đưa lên là: chuỗi jsonData từ user post lên
    // Tạo một chuỗi json để update các id liên quan xuống dưới từng bảng một
    return new Promise(async (resolve, reject) => {
        try {
            // xóa chính nó
            let jsonUpdateSeperatedMapKpi = {};
            jsonUpdateSeperatedMapKpi.id = seperatedMapId; // mệnh đề in
            await db.delete(db.convertSqlFromJson('seperated_map_kpi', jsonUpdateSeperatedMapKpi, ['id']));

            // xóa con liên kết từ bảng departments_kpi
            let departmentsKpiIds = await db.getRsts(`select id from departments_kpi
                where seperated_map_id in (` + (Array.isArray(seperatedMapId) ? seperatedMapId.toString() : seperatedMapId) + `)`);

            if (Array.isArray(departmentsKpiIds) && departmentsKpiIds.length > 0) {

                // chuyển đổi array [{id:1}] thành [1,2,3...]
                departmentsKpiIds = departmentsKpiIds.map((o) => o['id']);

                let jsonUpdateDepartmentsKpi = {};
                jsonUpdateDepartmentsKpi.id = departmentsKpiIds; // mệnh đề in

                await db.delete(db.convertSqlFromJson('departments_kpi', jsonUpdateDepartmentsKpi, ['id']));

                await delTreeFromDepartmentsKpi(departmentsKpiIds);

            }
            // cập nhập xong 3 cấp từ bảng 
            // seperated_map_kpi --> departments_kpi --> seperated_roles_kpi --> staffs_kpi
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * Xóa cả cây phân rã xuống đến cấp nhân viên đã giao
 * Tức là xóa cả gốc cây
 * Từ kpi của bản đồ chiến lượt (chức năng xóa phân rã trong seperatedMapKpi)
 * @param {*} mapId 
 * @param {*} jsonData 
 */
const delTreeFromMap = (mapId) => {
    // Dữ liệu đưa lên là: chuỗi jsonData từ user post lên
    // Tạo một chuỗi json để update các id liên quan xuống dưới từng bảng một
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy danh sách id của bảng phân rã
            let seperatedMapIds = await db.getRsts(`select id from seperated_map_kpi
            where map_id in (
            select id from strategy_map
            where id in (`+ mapId + `) )`);

            if (Array.isArray(seperatedMapIds) && seperatedMapIds.length > 0) {

                // chuyển đổi array [{id:1}] thành [1,2,3...]
                seperatedMapIds = seperatedMapIds.map((o) => o['id']);

                await delFromSeperatedMapKpi(seperatedMapIds);

            }
            // cập nhập xong 4 cấp từ bảng 
            // seperated_map_kpi --> departments_kpi --> seperated_roles_kpi --> staffs_kpi
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}



/**
 * Khai báo các hàm tương tác với csdl
 * Lấy các tham số đầu vào từ req.json_data, req.paramS, req.form_data, req.user
 * Thực hiện chuyển đổi dữ liệu sang các câu lệnh sql tương thích với csdl
 * Và gọi đối tượng db. để thực thi với csdl
 */
class Handler {

    /**
     * Xóa từ bảng đồ chiến lượt
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async delSeperatedMapKpiTree(req, res, next) {

        let mapId = req.json_data ? req.json_data.id : undefined;

        //console.log(dataJson);
        try {

            await delTreeFromMap(mapId);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'OK', message: 'Xóa thành công cây phân rã từ MapKpi = ' + mapId }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));

        } catch (e) {
            console.log('Lỗi thực thi lệnh', e);
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: 'Lỗi thực thi delete' }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));
        }
    }

    /**
     * Xóa từ cây phân rã
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async delSeperatedMapKpi(req, res, next) {

        let seperatedMapKpi = req.json_data ? req.json_data.id : undefined;

        try {

            await delFromSeperatedMapKpi(seperatedMapKpi);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'OK', message: 'Xóa thành công cây phân rã từ SeperatedMapKpi = ' + seperatedMapKpi }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));

        } catch (e) {
            console.log('Lỗi thực thi lệnh', e);
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: 'Lỗi thực thi delete' }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));
        }
    }

    /**
     * Xóa cây từ phân rã bộ phận
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async delTreeFromDepartmentsKpi(req, res, next) {

        let departmentsKpi = req.json_data ? req.json_data.id : undefined;

        try {

            await delTreeFromDepartmentsKpi(departmentsKpi);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'OK', message: 'Xóa thành công cây phân rã từ DepartmentKpiId = ' + departmentsKpi }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));

        } catch (e) {
            console.log('Lỗi thực thi lệnh', e);
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: 'Lỗi thực thi delete' }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));
        }
    }

    // xóa cây phân rã co kpi của bộ phận này luôn
    async delDepartmentKpi(req, res, next) {
        let { id } = req.json_data;
        try {

            await delDepartmentKpi(id);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'OK', message: 'Xóa thành công kpi bộ phận' }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));

        } catch (e) {
            console.log('Lỗi thực thi lệnh', e);
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: 'Lỗi thực thi delete' }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));
        }
    }
    /**
     * Xóa cây từ phân rã vai trò
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async delSeperatedRoleKpi(req, res, next) {

        let seperatedRoleKpi = req.json_data ? req.json_data.id : undefined;

        try {

            await delSeperatedRolesKpi(seperatedRoleKpi);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'OK', message: 'Xóa thành công cây phân rã từ SeperatedRoleKpi = ' + seperatedRoleKpi }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));

        } catch (e) {
            console.log('Lỗi thực thi lệnh', e);
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: 'Lỗi thực thi delete' }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));
        }
    }

}

module.exports = new Handler()