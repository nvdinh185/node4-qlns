"use strict"
/**
 * Bộ xử lý kpi cho nhan vien
 * 
 * ver 1.0 
 * Created by cuong.dq
 * date: 17/08/2019
 * 
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');
const depFunc = require('./department-kpi-functions');


/**
 * Khai báo các hàm tương tác với csdl
 * Lấy các tham số đầu vào từ req.json_data, req.paramS, req.form_data, req.user
 * Thực hiện chuyển đổi dữ liệu sang các câu lệnh sql tương thích với csdl
 * Và gọi đối tượng db. để thực thi với csdl
 */
class Handler {

    /**
     * Tạo kpi và chỉnh sửa kpi cho bộ phận
     * Chức năng này nhận dữ liệu bộ kpi của bộ phận
     * thực hiện chèn và update vào bảng departments_kpi
     * Tủy vào điều kiện id truyền lên như nào
     * nếu id<0 thì là tạo mới
     * nếu id>0 thì update
     * kết quả cuối cùng là có một parent_id và một organization_id
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createDepartmentKpi(req, res, next) {

        let dataJson = req.json_data;
        // console.log(dataJson);
        dataJson.updated_time = Date.now();
        dataJson.signature = JSON.stringify({ username: req.user.username, time: Date.now() })

        //nếu đơn vị tính là % và giá trị target và giá trị target_limit là có thì phải /cho 100 trước khi update vào csdl
        if (dataJson.unit === '%') {
            if (dataJson.target_limit) dataJson.target_limit = dataJson.target_limit / 100;
            if (dataJson.target) dataJson.target = dataJson.target / 100;
        }

        if (dataJson.result_min_limit !== undefined && dataJson.result_max_limit !== undefined
            && dataJson.result_min_limit !== null && dataJson.result_max_limit !== null) {
            dataJson.result_min_limit = dataJson.result_min_limit / 100;
            dataJson.result_max_limit = dataJson.result_max_limit / 100;
        }


        // Trọng số tích hợp được chia cho 100 cho đúng bản chất kéo, nhập %
        if (dataJson.weight !== undefined && dataJson.weight !== null) {
            dataJson.weight = dataJson.weight / 100;
        }

        //console.log(dataJson);
        try {
            if (dataJson.id < 0) {
                //cần tạo mới
                //Trước tiên phải xóa id để hệ thống tự tạo id mới
                delete dataJson["id"]; //xóa đi để tạo mới
                dataJson.created_time = Date.now();
                await db.insert(arrObj.convertSqlFromJson("departments_kpi", dataJson, []));
                //select lấy kết quả vừa chèn bởi chuổi dataJson
                //Thực chất parent_id là lấy id của gốc rồi tính toán lại các con

            } else if (dataJson.id > 0) {
                //cần update
                await db.update(arrObj.convertSqlFromJson("departments_kpi", dataJson, ["id"]));
                //trả về bảng ghi có id>0

                // Thực hiện update xuống seperatedRoles và staffs_kpi với vai trò C
                // xem bản đồ chiến lược (KPI)
                // Sửa ngày 01/11/2019 Theo yêu cầu lần 2 của duc.tb - MLMT
                // Yêu cầu sửa KPI thì sửa gốc cây của phân rã KPI đến phòng (C)
                // name ,unit,	calculating_description, target_limit, target,
                // đến luôn vai trò --> xuống luôn cá nhân nếu có
                await depFunc.updateRoleCFromDepartment(dataJson.id, dataJson);

            }

            //console.log('Nhân viên: ',dataJson.staff_id);
            //nếu truyền lên có staff_id thì ta tính toán lại toàn bộ trọng số của cây nhân viên này
            let isMLMT = req.paramS.organization_id === '1' ||  req.paramS.organization_id === '2'
                        || req.paramS.organization_id === 1 ||  req.paramS.organization_id === 2 ; // đây là mlmt đẻ tính trọng số kiểu ttmlmt
            
            // console.log('is MLMT', isMLMT, req.paramS);

            // Cập nhập trọng số quy đổi theo kiểu phân cấp hình cây
            if (dataJson.organization_id > 0) {
                depFunc.updateWeightPercentDepartment(dataJson.organization_id, isMLMT);

            } else if (dataJson.parent_id > 0) {
                //nếu truyền lên là con của một cấp cha thì update toàn bộ nhánh cây con này trọng số mới
                depFunc.updateWeightPercentParent(dataJson.parent_id)
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
            ));
        } catch (e) {
            console.log('Lỗi thực thi lệnh', e);
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: 'Lỗi thực thi update' }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
            ));
        }

    }


    /**
     * Lấy danh sách kpi riêng mà người dùng đã tạo trước đó
     * nếu không có thì trả về mãng trống
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getPrivateDepartmentKpi(req, res, next) {

        db.getRsts(`WITH RECURSIVE under_tree AS (
                    select a.* from departments_kpi a
                    where a.bsc_id in (22)
                    and a.organization_id = ${(req.paramS.department_id ? req.paramS.department_id : 0)}
                    UNION ALL
                    SELECT b.*
                        FROM departments_kpi b 
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
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    } //end function


    /**
     * Biến vào là bộ phận department
     * Biến ra là danh sách kpi được phân rã của bộ phận đó 
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getSeperatedMapKpi(req, res, next) {

        db.getRsts(`select
                        b.id,
                        b.parent_id,
                        a.organization_id,
                        a.id as seperated_map_id,
                        a.map_id,
                        a.kpi_role,
                        IFNULL(b.name,a.name) as name,
                        IFNULL(b.seperated_weight, a.weight) as seperated_weight,                         -- trọng số được giao
                        IFNULL(b.self_weight, 0) as self_weight,                                         -- Trọng số tự xác định
                        IFNULL(b.weight, 0) as weight,                                                   -- Trọng số tích hợp chính = trọng số được giao ban đầu = 0
                        IFNULL(b.weight_percent, a.weight_percent) as weight_percent,                     -- trọng số % quy đổi theo nhánh (bỏ trong trường hợp MLMT)
                        IFNULL(b.parent_weight_percent, a.parent_weight_percent) as parent_weight_percent, -- Trọng số cấp trên (bỏ trong trường hợp MLMT)
                        IFNULL(b.root_weight_percent, a.root_weight_percent) as root_weight_percent,       -- trọng số quy đổi % ( * 100 = điểm quy đổi)
                        IFNULL(b.unit, a.unit) as unit,
                        IFNULL(b.calculating_description, a.calculating_description) as calculating_description,
                        IFNULL(b.operator_method, a.operator_method) as operator_method,
                        IFNULL(b.target_limit, a.target_limit) as target_limit,
                        IFNULL(b.target, a.target) as target,
                        IFNULL(b.result_min_limit, a.result_min_limit) as result_min_limit,
                        IFNULL(b.result_max_limit, a.result_max_limit) as result_max_limit,
                        IFNULL(b.frequency_review, a.frequency_review) as frequency_review,
                        IFNULL(b.frequency_record, a.frequency_record) as frequency_record,
                        a.status as kpi_status,
                        IFNULL(b.status,0) as status
                    from seperated_map_kpi a
                    LEFT JOIN departments_kpi b
                    on a.id = b.seperated_map_id
                    where a.status = 1
                    and a.organization_id = ${(req.paramS.department_id || 0)}
                    order by a.kpi_role
                    `)
            .then(results => {

                // console.log('kq --', results);

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    } //end function



    /**
     * Lấy organization_bsc cho departments_kpi
     * Tham số vào là phòng và công ty
     * Tổ chức gốc cây KPI cho đơn vị (KPI của cấp trên giao và KPI mà đơn vị tự xác định)
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getOrganizationBscDepartmentsKpi(req, res, next) {
        //lấy tổ chức cấp công ty để biết gốc cây đó
        //lấy kpi của đơn vị
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
                        LEFT JOIN departments_kpi b
                        on a.bsc_id = b.bsc_id
                        and b.status = 1
                        and b.organization_id = ${(req.paramS.department_id || 0)}
                        where a.organization_id = ${(req.paramS.organization_id || 0)}
                        and a.bsc_id in (21,22)`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    } //end function

    /**
     * Tạo gốc cây cho departments_kpi
     * Chỉ tạo một lần duy nhất cho mỗi đơn vị
     * Các lá cây sẽ tự join và tự bổ sung từ bảng seperated_map_kpi 
     * và tự thêm vào bằng tay
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createOrganizationBscDepartmentsKpi(req, res, next) {
        //dựa vào department_id = mã phòng ban chính là mã cấp 2 của organization_id
        //và organization_id= mã tổ chức cấp công ty
        if (req.paramS.department_id > 0 && req.paramS.organization_id > 0) {
            db.getRsts(`select
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
                            and b.organization_id = ${req.paramS.department_id}
                        where a.organization_id = ${req.paramS.organization_id}
                            and a.bsc_id in (21,22)`)
                .then(async results => {
                    //lấy mảng gốc cây, thực hiện chèn vào csdl
                    for (let i = 0; i < results.length; i++) {
                        let el = results[i];
                        if (!el.id) { //chưa có id được tạo trong cây thì tạo để lấy id
                            try {
                                //tạo dữ liệu json theo cột và giá trị 
                                let jsonData = {
                                    organization_id: req.paramS.department_id, //mã tổ chức cấp phòng
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
                                let jsonInsert = arrObj.convertSqlFromJson("departments_kpi", jsonData, []);
                                //thực hiện chèn dữ liệu vào
                                await db.insert(jsonInsert);
                                //chèn thành công
                            } catch (e) {
                                //chèn thất bại
                            }
                        }
                    };
                    //sau khi chèn thành công thì trả về next để gọi lại lấy cây
                    //sẽ chứa id
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


}

module.exports = new Handler()