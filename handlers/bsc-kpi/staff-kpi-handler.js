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

const staffFunc = require('./staff-kpi-functions');

/**
 * Khai báo các hàm tương tác với csdl
 * Lấy các tham số đầu vào từ req.json_data, req.paramS, req.form_data, req.user
 * Thực hiện chuyển đổi dữ liệu sang các câu lệnh sql tương thích với csdl
 * Và gọi đối tượng db. để thực thi với csdl
 */
class Handler {

    /**
     * Tạo kpi và chỉnh sửa kpi cho nhân viên
     * Chức năng này nhận dữ liệu bộ kpi của nhân viên
     * thực hiện chèn và update vào bảng staffs_kpi
     * Tủy vào điều kiện id truyền lên như nào
     * nếu id<0 thì là tạo mới
     * nếu id>0 thì update
     * kết quả cuối cùng là có một parent_id và một staff_id
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createStaffKpi(req, res, next) {

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

        // Trọng số tích hợp được chia cho 100 cho đúng bản chất kéo, nhập %
        if (dataJson.weight !== undefined && dataJson.weight !== null) {
            dataJson.weight = dataJson.weight / 100;
        }

        if (dataJson.id < 0) {
            //cần tạo mới
            //Trước tiên phải xóa id để hệ thống tự tạo id mới
            delete dataJson["id"]; //xóa đi để tạo mới
            dataJson.created_time = Date.now();
            await db.insert(arrObj.convertSqlFromJson("staffs_kpi", dataJson, []));
            //select lấy kết quả vừa chèn bởi chuổi dataJson
            //Thực chất parent_id là lấy id của gốc rồi tính toán lại các con

        } else if (dataJson.id > 0) {
            //cần update
            await db.update(arrObj.convertSqlFromJson("staffs_kpi", dataJson, ["id"]));
            //trả về bảng ghi có id>0

        }

        //console.log('Nhân viên: ',dataJson.staff_id);

        if (dataJson.staff_id > 0) {
            //nếu truyền lên có staff_id thì ta tính toán lại toàn bộ trọng số của cây nhân viên này
            staffFunc.updateWeightPercentStaff(dataJson.staff_id)
        } else if (dataJson.parent_id > 0) {
            //nếu truyền lên là con của một cấp cha thì update toàn bộ nhánh cây con này trọng số mới
            staffFunc.updateWeightPercentParent(dataJson.parent_id)
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

    }


    /**
     * Lấy danh sách kpi riêng mà người dùng đã tạo trước đó
     * nếu không có thì trả về mãng trống
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getPrivateStaffKpi(req, res, next) {

        db.getRsts(`WITH RECURSIVE under_tree AS (
                    select a.* from staffs_kpi a
                    where a.bsc_id in (24,25)
                    and a.staff_id = ${(req.paramS.staff_id ? req.paramS.staff_id : '0')}
                    UNION ALL
                    SELECT b.*
                        FROM staffs_kpi b 
                        JOIN under_tree 
                        ON b.parent_id = under_tree.id
                        and b.status = 1
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
     * Lấy danh sách kpi được phân rã cho nhóm vai trò mà nhân viên đó đảm nhận
     * biến vào là job_list = [danh sách vai trò]
     * job_id của staff
     * Trả về danh sách kpi đã chèn hoặc chưa
     * nếu chưa thì cho phép gọi để tạo? 
     * Không, người dùng sẽ biết kpi đó có trong vai trò
     * và chủ động thêm vào cây để chấm định kỳ hoặc loại bỏ đi
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getSeperatedRolesKpi(req, res, next) {

        //  console.log('list???:',req.paramS.job_list);
        let jobList = [];
        try {
            jobList = req.paramS.job_list ? JSON.parse(req.paramS.job_list) : jobList;
        } catch (e) {
            jobList = [];
        }

        if (req.paramS.job_id) jobList.push(req.paramS.job_id);

        db.getRsts(`select 
                    b.id, 
                    b.parent_id, 
                    IFNULL(b.name,c.name) as name, 
                    a.id as seperated_role_id, 
                    a.organization_id,      -- bổ sung mã đơn vị để truy vấn cây phân rã
                    a.department_kpi_id,    -- bổ sung mã kpi của đơn vị để truy vấn cây phân rã vai trò
                    c.name as kpi_name, 
                    a.job_role_id, 
                    d.name as job_role_name, 
                    a.kpi_role, 
                    c.kpi_role as department_kpi_role, 
                    IFNULL(b.seperated_weight, a.weight) as seperated_weight,                         -- trọng số được giao
                    IFNULL(b.self_weight, 0) as self_weight,                                          -- Trọng số tự xác định
                    IFNULL(b.weight, 0) as weight,                                                    -- Trọng số tích hợp chính = trọng số được giao ban đầu = 0
                    IFNULL(b.weight_percent, c.weight_percent) as weight_percent, 
                    IFNULL(b.parent_weight_percent,c.parent_weight_percent) as parent_weight_percent, 
                    IFNULL(b.root_weight_percent,c.root_weight_percent) as root_weight_percent, 
                    IFNULL(b.unit, c.unit) as unit, 
                    IFNULL(b.calculating_description, c.calculating_description) as calculating_description, 
                    IFNULL(b.operator_method, c.operator_method) as operator_method, 
                    IFNULL(b.target_limit, c.target_limit) as target_limit, 
                    IFNULL(b.target, c.target) as target, 
                    IFNULL(b.result_min_limit, c.result_min_limit) as result_min_limit, 
                    IFNULL(b.result_max_limit, c.result_max_limit) as result_max_limit, 
                    IFNULL(b.frequency_review, c.frequency_review) as frequency_review, 
                    IFNULL(b.frequency_record, c.frequency_record) as frequency_record, 
                    a.status as kpi_status, 
                    c.status as department_status, 
                    IFNULL(b.status,0) as status
                    from seperated_roles_kpi a 
                    LEFT JOIN staffs_kpi b 
                    on a.id = b.seperated_role_id 
                    and b.status = 1
                    and b.staff_id = ${(req.paramS.staff_id || 0)}
                    LEFT JOIN departments_kpi c 
                    on a.department_kpi_id = c.id 
                    and c.status = 1
                    LEFT JOIN  job_roles d
                    on a.job_role_id = d.id
                    where a.job_role_id in (${jobList.toString()})
                    and a.status = 1
                    order by a.kpi_role
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
     * Lấy organization_bsc cho nhân viên gán với nhân staffs_kpi
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getOrganizationBscStaffsKpi(req, res, next) {

        //lấy tổ chức cấp công ty để biết gốc cây đó
        //lấy kpi của nhân viên
        db.getRsts(`select b.id, 
                    b.organization_id, 
                    b.staff_id, 
                    b.name, 
                    b.weight, 
                    b.weight_percent, 
                    b.parent_weight_percent, 
                    b.root_weight_percent, 
                    a.bsc_id, 
                    a.value as bsc_name, 
                    a.weight as bsc_weight 
                    from organizations_bsc a 
                    LEFT JOIN staffs_kpi b 
                    on a.bsc_id = b.bsc_id 
                    and b.status=1
                    and b.staff_id = ${(req.paramS.staff_id || 0)}
                    where a.organization_id = ${(req.paramS.organization_id || 0)}
                    and a.bsc_id in (23,24,25)`)
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
     * Tạo gốc cây cho staffs_kpi
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createOrganizationBscStaffsKpi(req, res, next) {
        //dựa vào staff_id = mã nhân viên trong bảng staffs
        //và organization_id= mã tổ chức cấp công ty
        if (req.paramS.staff_id > 0 && req.paramS.organization_id > 0) {
            db.getRsts(`select
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
                        and b.staff_id = ${req.paramS.staff_id}
                        where a.organization_id = ${req.paramS.organization_id}
                        and a.bsc_id in (23,24,25)`)
                .then(async results => {
                    //lấy mảng gốc cây, thực hiện chèn vào csdl
                    for (let idx = 0; idx < results.length; idx++) {
                        let el = results[idx];
                        if (!el.id) { //chưa có id được tạo trong cây thì tạo để lấy id
                            try {
                                //tạo dữ liệu json theo cột và giá trị 
                                //
                                let jsonData = {
                                    organization_id: req.paramS.department_id, //mã tổ chức cấp phòng
                                    staff_id: req.paramS.staff_id,
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
                                let jsonInsert = arrObj.convertSqlFromJson("staffs_kpi", jsonData, []);
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