"use strict"
/**
 * Bộ xử lý bản đồ chiến lược cho một công ty/Trung tâm/Đơn vị
 * 
 * ver 1.0 
 * Created by cuong.dq
 * date: 25/08/2019
 * 
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');


/**
 * Cập nhập cây chiến lược cùng cấp
 * @param {*} parentId 
 */
const updateWeightPercentParent = (parentId) => {

    if (parentId > 0) {
        db.getRsts(`select a.* from strategy_map a
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
                    await db.update(arrObj.convertSqlFromJson('strategy_map', jsonForUpdate, ['id']))
                })
            })
            .catch(err => console.log('Loi query', err));
    }
}


/**
 * Tính lại trọng số cho toàn bộ cây chiến lược
 * Trường hợp có mã Công ty/Trung tâm mới tính
 * @param {*} organizationId 
 */
const updateWeightPercentAll = (organizationId) => {

    if (organizationId > 0) {
        //chỉ cập nhập tính toán lại các kpi có trạng thái status=1 mà thôi
        db.getRsts(`WITH RECURSIVE
                under_tree AS (
                select a.* from strategy_map a
                where a.bsc_id in (11,12,13,14)
                and a.status=1 
                and a.organization_id=${organizationId} 
                UNION ALL
                SELECT b.*
                    FROM strategy_map b
                     JOIN under_tree
                      ON b.parent_id = under_tree.id
                      and b.status=1
                ORDER BY order_1
                )
            SELECT * FROM under_tree`)
            .then(results => {
                let treeOrder = arrObj.createTreeWeight(results, 'id', 'parent_id', 'weight');

                //console.log(JSON.stringify(treeOrder,null,2));

                treeOrder.forEach(async (el) => {
                    let jsonForUpdate = {
                        id: el.id,
                        depth: el.$level,                   // gán độ sâu
                        is_leaf: el.$is_leaf ? 1 : 0, // lá cây thể hiện giá trị 0, 1
                        weight_percent: el.$weight_percent,
                        parent_weight_percent: el.$parent_weight_percent,
                        root_weight_percent: el.$root_weight_percent
                    }
                    await db.update(arrObj.convertSqlFromJson('strategy_map', jsonForUpdate, ['id']))
                })
            })
            .catch(err => console.log('Loi query', err));
    }
}

/**
 * Cập nhập các thông tin từ Bản đồ chiến lược
 * Nếu được phân rã đến vai trò chủ trì bên dưới
 * 
 * Các trường được update xuống chủ trì dưới là:
 * 
, name 
, unit
, calculating_description
, target_limit
, target
, target_description
, result_min_limit
, result_max_limit
, frequency_review
, frequency_record
, status_description
, status

 * @param {*} mapId 
 * 
 * 
 */
const updateRoleCFromMap = (mapId, jsonData) => {
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

            // console.log('onlyStatus', onlyStatus);

            // Lấy danh sách id của bảng phân rã vai trò C:
            let seperatedMapIds = await db.getRsts(`select id from seperated_map_kpi
                where map_id in (
                select id from strategy_map
                where id in (${mapId}))`
                + (onlyStatus ? `` : `and kpi_role = 'C'`)
            );

            if (Array.isArray(seperatedMapIds) && seperatedMapIds.length > 0) {

                // chuyển đổi array [{id:1}] thành [1,2,3...]
                seperatedMapIds = seperatedMapIds.map((o) => o['id']);

                let jsonUpdateSeperatedMapKpi = arrObj.clone(jsonUpdated);
                jsonUpdateSeperatedMapKpi.id = seperatedMapIds; // mệnh đề in
                await db.update(db.convertSqlFromJson('seperated_map_kpi', jsonUpdateSeperatedMapKpi, ['id']));

                let departmentsKpiIds = await db.getRsts(`select id from departments_kpi
                where seperated_map_id in (${seperatedMapIds.toString()})`
                    + (onlyStatus ? `` : `and kpi_role = 'C'`));

                if (Array.isArray(departmentsKpiIds) && departmentsKpiIds.length > 0) {

                    // chuyển đổi array [{id:1}] thành [1,2,3...]
                    departmentsKpiIds = departmentsKpiIds.map((o) => o['id']);

                    let jsonUpdateDepartmentsKpi = arrObj.clone(jsonUpdated);
                    jsonUpdateDepartmentsKpi.id = departmentsKpiIds; // mệnh đề in

                    await db.update(db.convertSqlFromJson('departments_kpi', jsonUpdateDepartmentsKpi, ['id']));

                    // có cấp 2 thì có cấp 3
                    // Lấy danh sách id của bảng departments_kpi vai trò C:
                    let seperatedRoleIds = await db.getRsts(`select id from seperated_roles_kpi
                    where department_kpi_id in (${departmentsKpiIds.toString()})`
                        + (onlyStatus ? `` : `and kpi_role = 'C'`));

                    if (Array.isArray(seperatedRoleIds) && seperatedRoleIds.length > 0) {

                        // chuyển đổi array [{id:1}] thành [1,2,3...]
                        seperatedRoleIds = seperatedRoleIds.map((o) => o['id']);

                        let jsonUpdateSeperatedRole = arrObj.clone(jsonUpdated);
                        // jsonUpdateSeperatedRole.id = seperatedRoleIds; // mệnh đề in
                        jsonUpdateSeperatedRole.id = seperatedRoleIds; // test thử 1
                        await db.update(db.convertSqlFromJson('seperated_roles_kpi', jsonUpdateSeperatedRole, ['id']));

                        // có cấp 3 thì có cấp 4
                        // Lấy danh sách id của bảng departments_kpi vai trò C:
                        let staffsKpiIds = await db.getRsts(`select id from staffs_kpi
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


/**
 * Khai báo các hàm tương tác với csdl
 * Lấy các tham số đầu vào từ req.json_data, req.paramS, req.form_data, req.user
 * Thực hiện chuyển đổi dữ liệu sang các câu lệnh sql tương thích với csdl
 * Và gọi đối tượng db. để thực thi với csdl
 */
class Handler {

    /**
     * Tạo kpi và chỉnh sửa viễn cảnh, Chỉ tiêu, và kpi cho từng Chỉ tiêu
     * Chức năng này nhận dữ liệu bộ bản đồ chiến lược
     * thực hiện chèn và update vào bảng strategy_map
     * Tủy vào điều kiện id truyền lên như nào
     * nếu id<0 thì là tạo mới
     * nếu id>0 thì update
     * kết quả cuối cùng là có một parent_id và một organization_id
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createStrategyKpi(req, res, next) {

        let dataJson = req.json_data;

        dataJson.updated_time = Date.now();
        dataJson.signature = JSON.stringify({ username: req.user.username, time: Date.now() })

        //nếu đơn vị tính là % và giá trị target và giá trị target_limit là có thì phải /cho 100 trước khi update vào csdl
        if (dataJson.unit === '%' && dataJson.target_limit >= 0 && dataJson.target >= 0) {
            dataJson.target_limit = dataJson.target_limit / 100;
            dataJson.target = dataJson.target / 100;
        }

        if (dataJson.result_min_limit !== undefined && dataJson.result_max_limit !== undefined
            && dataJson.result_min_limit !== null && dataJson.result_max_limit !== null) {
            dataJson.result_min_limit = dataJson.result_min_limit / 100;
            dataJson.result_max_limit = dataJson.result_max_limit / 100;
        }

        //console.log(dataJson);
        try {
            if (dataJson.id < 0) {
                //cần tạo mới
                //Trước tiên phải xóa id để hệ thống tự tạo id mới
                delete dataJson["id"]; //xóa đi để tạo mới
                dataJson.created_time = Date.now();
                await db.insert(arrObj.convertSqlFromJson("strategy_map", dataJson, []));
                //select lấy kết quả vừa chèn bởi chuổi dataJson
                //Thực chất parent_id là lấy id của gốc rồi tính toán lại các con

            } else if (dataJson.id > 0) {
                //cần update
                await db.update(arrObj.convertSqlFromJson("strategy_map", dataJson, ["id"]));
                //trả về bảng ghi có id>0

                // Sửa ngày 01/11/2019 Theo yêu cầu lần 2 của duc.tb - MLMT
                // Yêu cầu sửa KPI thì sửa gốc cây của phân rã KPI đến phòng (C)
                // name ,unit,	calculating_description, target_limit, target,
                // đến luôn vai trò --> xuống luôn cá nhân nếu có
                await updateRoleCFromMap(dataJson.id, dataJson);

            }

            if (dataJson.organization_id > 0) {
                //nếu truyền lên có staff_id thì ta tính toán lại toàn bộ trọng số của cây nhân viên này
                updateWeightPercentAll(dataJson.organization_id)
            } else if (dataJson.parent_id > 0) {
                //nếu truyền lên là con của một cấp cha thì update toàn bộ nhánh cây con này trọng số mới
                updateWeightPercentParent(dataJson.parent_id)
            }

            //Sau khi cập nhập giá trị trong cây ta cần phải lấy chính xác bảng ghi đã chèn/sửa vào
            //thực hiện tính toán các phần trăm của cây bằng cách truy vấn cây liên quan của nó
            //tính toán lại các hệ số của cây cho đúng tỷ trọng
            //rồi cập nhập lại toàn bộ hệ số của cây

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ data: req.json_data }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
                , 2
            ));
        } catch (e) {
            console.log('Lỗi thực thi lệnh', e);
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: 'Lỗi thực thi update' }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
                , 2
            ));
        }


    }


    /**
     * Lấy danh sách Chỉ tiêu và KPI đã khai báo của đơn vị cấp Cty
     * Biến vào là Công ty/Trung tâm
     * Lấy ra từ cành cây cho đến lá cây, không lấy gốc
     * Để nối vào bộ Gốc Viễn cảnh đã có trước đó
     * Mục đích để khai báo và thêm cho hợp lý
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getStrategyKpi(req, res, next) {

        db.getRsts(`WITH RECURSIVE under_tree AS (
                    select a.* from strategy_map a
                    where a.bsc_id in (11,12,13,14)
                    and status = 1
                    and a.organization_id = ${(req.paramS.organization_id || req.json_data.organization_id || 0)}
                    UNION ALL
                    SELECT b.*
                        FROM strategy_map b 
                        JOIN under_tree 
                        ON b.parent_id = under_tree.id
                    ORDER BY order_1)
                    select * from under_tree
                    where parent_id is not null
                    `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }
                    , 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    } //end function


    /**
     * Lấy organization_bsc cho strategy_map
     * Tham số vào là công ty
     * Lấy chuẩn là bảng organizations_bsc
     * Bảng organizations_bsc chứa từ điển BSC cho từng doanh nghiệp
     * Chức năng này sẽ định nghĩa và khai báo cố định khi khảo sát Doanh nghiệp đó
     * Tùy vào các điều kiện trọng số các cấp mà khai báo từ điển này
     * Sau này có thể bổ sung chức năng tự khai báo từ điển này cho doanh nghiệp
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getOrganizationBscStrategy(req, res, next) {
        //lấy tổ chức cấp công ty để biết gốc cây đó
        db.getRsts(`select b.id, 
                        b.organization_id, 
                        b.name, 
                        b.weight, 
                        b.weight_percent, 
                        b.parent_weight_percent, 
                        b.root_weight_percent, 
                        a.bsc_id, 
                        a.value as bsc_name, 
                        a.weight as bsc_weight 
                    from organizations_bsc a 
                        LEFT JOIN strategy_map b 
                        on a.bsc_id = b.bsc_id 
                        and b.organization_id = a.organization_id  
                        and b.status  = 1
                        where a.organization_id = ${(req.paramS.organization_id || req.json_data.organization_id || 0)}
                        and a.bsc_id in (11,12,13,14)`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }
                    , 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    } //end function

    /**
     * Tạo gốc cây cho strategy_map
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createOrganizationBscStrategy(req, res, next) {
        //dựa vào organization_id= mã tổ chức cấp công ty
        let organizationId = req.paramS.organization_id || req.json_data.organization_id || 0;

        if (organizationId > 0) {
            db.getRsts(`select 
                        b.id, 
                        b.period_id,
                        b.organization_id, 
                        b.name, 
                        b.weight, 
                        b.weight_percent, 
                        a.bsc_id, 
                        a.value as bsc_name, 
                        a.weight as bsc_weight 
                        from organizations_bsc a 
                        LEFT JOIN strategy_map b 
                        on a.bsc_id = b.bsc_id 
                        and b.organization_id = a.organization_id
                        and b.status=1
                        where a.organization_id = ${organizationId}
                        and a.bsc_id in (11,12,13,14)`)
                .then(async results => {
                    let period = { id: 0, name: `Năm ${(new Date()).getFullYear()}` };
                    // trường hợp tạo mới thì yêu cầu phải tạo giai đoạn đánh giá
                    await db.insert(db.convertSqlFromJson('strategy_period'
                        , {
                            organization_id: organizationId,
                            name: period.name,
                            created_time: Date.now()
                        }))
                    let { maxPeriodId } = await db.getRst(`select max(id) as maxPeriodId from strategy_period where name='${period.name}' and organization_id=${organizationId}`)
                    period.id = maxPeriodId;

                    //lấy mảng gốc cây, thực hiện chèn vào csdl
                    for (let idx = 0; idx < results.length; idx++) {
                        let el = results[idx];
                        //console.log(el);
                        if (!el.id) { //chưa có id được tạo trong cây thì tạo để lấy id
                            try {
                                //tạo dữ liệu json theo cột và giá trị 
                                let jsonData = {
                                    organization_id: req.paramS.organization_id, //mã tổ chức cấp phòng
                                    period_id: period.id, // giai đoạn đánh giá kpi (năm, 2 năm...)
                                    name: el.bsc_name,
                                    weight: el.bsc_weight,
                                    weight_percent: el.bsc_weight / (results.map((o) => { return o['bsc_weight'] }).reduce((a, b) => a + b, 0)),
                                    parent_weight_percent: 1,
                                    root_weight_percent: el.bsc_weight / (results.map((o) => { return o['bsc_weight'] }).reduce((a, b) => a + b, 0)),
                                    bsc_id: el.bsc_id,
                                    created_time: Date.now(),
                                    signature: JSON.stringify({ username: req.user.username, time: Date.now() })
                                }
                                //tạo dữ liệu câu lệnh json để thực thi vào bảng csdl
                                let jsonInsert = arrObj.convertSqlFromJson("strategy_map", jsonData, []);
                                //thực hiện chèn dữ liệu vào
                                await db.insert(jsonInsert);
                                //chèn thành công
                            } catch (e) {
                                //chèn thất bại
                            }
                        }
                    }
                    next();
                })
                .catch(err => {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify([]));
                });
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify([]));
        }
    } //end function


    /**
     * Truy vấn lấy cây kpi để xem gốc KPI từ đâu giao xuống
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getBscTreeFromKpi(req, res, next) {
        db.getRsts(`
        WITH RECURSIVE under_tree AS 
        (
            select a.* from strategy_map a
            where id= ${(req.paramS.map_id ? req.paramS.map_id : 0)}
            UNION ALL
            SELECT b.*	FROM strategy_map b 
            JOIN under_tree
            ON b.id = under_tree.parent_id
        )
        select * from under_tree
        order by depth, is_leaf, order_1
        `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) return undefined
                        if (value !== null && key === 'signature') return JSON.parse(value)
                        return value;
                    }
                    , 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

}

module.exports = new Handler()