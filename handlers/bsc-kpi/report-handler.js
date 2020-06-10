"use strict"
/**
 * Bộ xử lý kpi cho báo cáo, 
 * Lấy danh mục báo cáo
 * Tạo kỳ báo cáo
 * Tổng hợp các số liệu từ các bảng báo cáo vào số liệu báo cáo này
 * 
 * ver 1.0 
 * Created by cuong.dq
 * date: 26/08/2019
 * 
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');

//Hàm tổng hợp ra báo cáo để đưa vào kết quả bảng reports
/**
 * 1. Lấy chu kỳ báo cáo đang mở ra report_id
 * 2. tổng hợp từ bảng report_map_kpi
 * 3. Tổng hợp từ bảng report_department_kpi
 * 4. Tổng hợp từ bảng report_staffs_kpi
 * Ghi kết quả vào bảng reports
 * Trả kết quả bảng report về 
 * @param {*} reportId chu kỳ báo cáo 
 * @param {*} organizationId mã đơn vị cấp công ty/trung tâm     
 */
const sumerizeReport = (reportId, organizationId) => {

    return new Promise(async (resolve, reject) => {

        if (reportId && organizationId) {
            try {
                //tổng hợp báo cáo report_map_kpi
                let result = await db.getRst(`select 
                                count(1) as count_kpi,
                                count(a.result) as count_finish,
                                sum(a.total_effective) as total_effective
                                from report_map_kpi a
                                where a.status = 1
                                and a.is_leaf = 1
                                and a.organization_id = ${organizationId}
                                and a.report_id = ${reportId}
                                `);
                if (result) {
                    await db.update(arrObj.convertSqlFromJson('reports', {
                        id: reportId,
                        organization_id: organizationId,
                        count_map_kpi: result.count_kpi,
                        count_map_kpi_finish: result.count_finish,
                        map_kpi_effective: result.total_effective,
                        updated_time: Date.now()
                    }, ['id', 'organization_id'])
                    );
                }

                //tổng hợp báo cáo report_department_kpi
                //phải lấy toàn bộ bảng ghi, sau đó tự ghép cây tính tổng hợp ra
                result = await db.getRst(`select
                                count(1) as count_kpi,
                                count(distinct a.organization_id) as count_department,
                                count(distinct a.map_id) as count_map_kpi,
                                count(a.result) as count_finish,
                                min(a.result_effective) as min_result_effective,
                                max(a.result_effective) as max_result_effective
                                from report_departments_kpi a
                                where a.status = 1
                                and a.parent_id is not null
                                and a.report_id = ${reportId}
                                and a.organization_id in
                                 (WITH RECURSIVE under_tree AS (
                                    select a.* from organizations a
                                    where a.id = ${organizationId}
                                    UNION ALL
                                    SELECT b.*
                                        FROM organizations b
                                         JOIN under_tree
                                          ON b.parent_id = under_tree.id
                                    ORDER BY order_1
                                    )
                                    SELECT id FROM under_tree)
                                `);

                if (result) {
                    await db.update(arrObj.convertSqlFromJson('reports', {
                        id: reportId,
                        organization_id: organizationId,
                        count_map_kpi: result.count_map_kpi, //số lượng kpi từ bản đồ chiến lược phân rã hết cho bộ phận không?
                        count_department: result.count_department, //số lượng bộ phận có KPI
                        count_department_kpi: result.count_kpi,    //số lượng kpi được giao cho tất cả các bộ phận
                        count_department_kpi_finish: result.count_finish, //kết quả đánh giá của các kpi đã được giao
                        department_kpi_effective_min: result.min_result_effective, //Tỷ lệ hoàn thành đạt được thấp nhất (có thể null hoặc min)
                        department_kpi_effective_max: result.max_result_effective,  //Tỷ lệ hoàn thành đạt được cao nhất (có thể null hoặc min)
                        updated_time: Date.now()
                    },
                        ['id', 'organization_id']));
                }

                //tổng hợp báo cáo của nhân viên
                //phải lấy toàn bộ bảng ghi, sau đó tự ghép cây tính tổng hợp ra
                result = await db.getRst(`select
                                            count(1) as count_kpi,
                                            count(distinct a.map_id) as count_map_kpi,
                                            count(distinct a.organization_id) as count_department,
                                            count(distinct a.staff_id) as count_staff,
                                            count(a.result) as count_finish,
                                            min(a.result_effective) as min_result_effective,
                                            max(a.result_effective) as max_result_effective
                                            from report_staffs_kpi a
                                            where a.status = 1
                                            and a.parent_id is not null
                                            and a.report_id = ${reportId}
                                            and a.organization_id in
                                            (WITH RECURSIVE under_tree AS (
                                                select a.* from organizations a
                                                where a.id = ${organizationId}
                                                UNION ALL
                                                SELECT b.*
                                                    FROM organizations b
                                                    JOIN under_tree
                                                    ON b.parent_id = under_tree.id
                                                ORDER BY order_1
                                                )
                                                SELECT id FROM under_tree)
                                            `);

                if (result) {

                    await db.update(arrObj.convertSqlFromJson('reports', {
                        id: reportId,
                        organization_id: organizationId,
                        count_staff_kpi: result.count_kpi,
                        count_staff_map_kpi: result.count_map_kpi,
                        count_staff_department: result.count_department,
                        count_staff: result.count_staff,
                        count_staff_finish: result.count_finish,
                        staff_kpi_effective_min: result.min_result_effective,
                        staff_kpi_effective_max: result.max_result_effective,
                        updated_time: Date.now()
                    },
                        ['id', 'organization_id']))
                }

            } catch (e) {
                console.log('Lỗi synchronize', e)
            }

        }

        resolve();
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
     * Lấy một bảng ghi báo cáo (kết quả sau khi đồng bộ hoặc xem kết quả)
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getReport(req, res, next) {

        db.getRst(`select *
                    from reports
                    where id = ${(req.paramS.report_id ? req.paramS.report_id : 0)}`)
            .then(result => {

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result ? result : {}
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }
                ));
            })
            .catch(err => {
                res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: err, message: "Lỗi không xác định" }
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }
                ));
            });

    }


    /**
     * Đồng bộ báo cáo
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async synchronizeReport(req, res, next) {
        let report = await db.getRst(`select *
                                    from reports
                                    where id = ${(req.paramS.report_id ? req.paramS.report_id : 0)}`);

        if (report && report.id) {
            //đã truy vấn được bảng ghi báo cáo này
            await sumerizeReport(report.id, report.organization_id);
            //chờ đồng bộ xong mới lấy kết quả
        }
        next();
    }

    /**
     * nếu id<0 thì là tạo mới
     * nếu id>0 thì update
     * 
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createReportDuration(req, res, next) {

        let dataJson = req.json_data;

        //console.log(dataJson);

        dataJson.updated_time = Date.now();
        dataJson.signature = JSON.stringify({ username: req.user.username, time: Date.now() })

        if (dataJson.id < 0) {

            //1. Khóa sổ kỳ báo cáo trước

            //2. Tạo chu kỳ báo cáo reports

            //3. Tạo các bảng báo cáo report_map_kpi, report_department_kpi, report_staffs_kpi

            //4. Tổng hợp các số liệu báo cáo vào

            //cần tạo mới
            //Trước tiên phải xóa id để hệ thống tự tạo id mới
            delete dataJson["id"]; //xóa đi để tạo mới
            dataJson.created_time = Date.now();
            await db.insert(arrObj.convertSqlFromJson("reports", dataJson, []));
            //select lấy kết quả vừa chèn bởi chuổi dataJson
            //Thực chất parent_id là lấy id của gốc rồi tính toán lại các con

        } else if (dataJson.id > 0) {
            //cần update
            await db.update(arrObj.convertSqlFromJson("reports", dataJson, ["id"]));
            //trả về bảng ghi có id>0

            //Trường hợp giá trị =0 thì set về null ở trạng thái để mở chu kỳ
            if (!dataJson.status) {
                await db.runSql(`update reports set status = null where id=${dataJson.id}`);
            }

        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ data: req.json_data }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
        ));

    }

}

module.exports = new Handler()