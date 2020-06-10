"use strict"
/**
 * Bộ tổng hợp số liệu lên trang chủ
 * trả về một json tổng hợp để vẽ biểu đồ
 * vẽ thống kê tổng hợp cho tất cả mọi người theo dõi
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
 * 1. Lấy tổ chức, sẽ trả về số liệu tổng hợp các kpi
 * 
 * @param {*} organizationId mã đơn vị cấp công ty/trung tâm     
 */
const getHomeReportActiveKpis = (organizationId) => {

    return new Promise(async (resolve, reject) => {

        if (organizationId) {
            try {
                let resultReturn = {};
                //tổng hợp báo cáo report_map_kpi
                let result1 = await db.getRst(`select 
                count(1) as count_kpi,
                count(distinct parent_id) count_target,
                round(sum(root_weight_percent) * 100) as weight_percent
                from strategy_map
                where is_leaf = 1
                and status = 1
                and organization_id in (`+ organizationId + `)`);

                resultReturn.strategy_map = result1;

                let result2 = await db.getRst(`select 
                count(1) as count_seperated_kpi,
                count(distinct map_id) as count_map_kpi,
                count(distinct organization_id) as count_department,
                sum(CASE kpi_role
                    WHEN 'C' THEN 1
                    ELSE 0
                END) as count_c,
                sum(CASE kpi_role
                    WHEN 'Tr' THEN 1
                    ELSE 0
                END) as count_tr
                from seperated_map_kpi a
                where map_id in (
                select id 
                from strategy_map
                where is_leaf = 1
                and status = 1
                and organization_id in (`+ organizationId + `)
                )`);
                resultReturn.seperated_map_kpi = result2;

                // thieu departments_kpi
                let result3 = await db.getRst(`select 
                count(1) count_department_kpi,
                count(distinct organization_id) as count_department,
                count(distinct seperated_map_id) as count_seperated_map_id,
                count(distinct map_id) as count_map_id, 
                sum(CASE kpi_role
                     WHEN 'C' THEN 1
                     ELSE 0
                END) as count_c,
                sum(CASE kpi_role
                     WHEN 'Tr' THEN 1
                     ELSE 0
                END) as count_tr,
                sum(CASE kpi_role
                     WHEN 'R' THEN 1
                     ELSE 0
                END) as count_r
                 from departments_kpi
                where organization_id in (
                        WITH RECURSIVE
                        under_tree AS (
                        select a.* from organizations a
                        where id in (`+ organizationId + `)
                        UNION ALL
                        SELECT b.*
                            FROM organizations b 
                            JOIN under_tree 
                            ON b.parent_id = under_tree.id
                        ORDER BY order_1
                        )
                    SELECT id FROM under_tree
                )
                and bsc_id is null
                and parent_id is not null
                and status = 1`);
                resultReturn.departments_kpi = result3;

                let result4 = await db.getRst(`select 
                count(1) count_job_id,
                count(distinct organization_id) count_department
                 from job_roles
                where organization_id in (
                        WITH RECURSIVE
                        under_tree AS (
                        select a.* from organizations a
                        where id in (`+ organizationId + `)
                        UNION ALL
                        SELECT b.*
                            FROM organizations b 
                            JOIN under_tree 
                            ON b.parent_id = under_tree.id
                        ORDER BY order_1
                        )
                    SELECT id FROM under_tree
                )
                and status = 1`);
                resultReturn.job_roles = result4;


                let result5 = await db.getRst(`select 
                count(1) count_staffs,
                count(distinct organization_id) count_department,
                count(distinct job_id) count_job_id
                from staffs
                where organization_id in (
                    WITH RECURSIVE
                    under_tree AS (
                    select a.* from organizations a
                    where id in (`+ organizationId + `)
                    UNION ALL
                    SELECT b.*
                      FROM organizations b 
                      JOIN under_tree 
                      ON b.parent_id = under_tree.id
                    ORDER BY order_1
                    )
                  SELECT id FROM under_tree
                )
                and status = 1`);
                resultReturn.staffs = result5;


                let result6 = await db.getRst(`select 
                count(1) count_seperated_role,
                count(distinct organization_id) as count_department,
                count(distinct department_kpi_id) as count_department_kpi,
                count(distinct job_role_id) as job_role_id, 
                sum(CASE kpi_role
                    WHEN 'C' THEN 1
                    ELSE 0
                END) as count_c,
                sum(CASE kpi_role
                    WHEN 'Tr' THEN 1
                    ELSE 0
                END) as count_tr
                from seperated_roles_kpi
                where organization_id in (
                    WITH RECURSIVE
                    under_tree AS (
                    select a.* from organizations a
                    where id in (`+ organizationId + `)
                    UNION ALL
                    SELECT b.*
                      FROM organizations b 
                      JOIN under_tree 
                      ON b.parent_id = under_tree.id
                    ORDER BY order_1
                    )
                  SELECT id FROM under_tree
                )
                and status = 1`);
                resultReturn.seperated_roles_kpi = result6;


                let result7 = await db.getRst(`select 
                count(1) count_staff_kpi,
                count(distinct organization_id) as count_department,
                count(distinct staff_id) as count_staff,
                count(distinct job_role_id) as count_job_role_id, 
                count(distinct seperated_role_id) as count_seperated_role_id,
                sum(CASE kpi_role
                    WHEN 'C' THEN 1
                    ELSE 0
                END) as count_c,
                sum(CASE kpi_role
                    WHEN 'Tr' THEN 1
                    ELSE 0
                END) as count_tr,
                sum(CASE kpi_role
                    WHEN 'R' THEN 1
                    ELSE 0
                END) as count_r
                from staffs_kpi
                where organization_id in (
                  WITH RECURSIVE
                  under_tree AS (
                  select a.* from organizations a
                  where id in (`+ organizationId + `)
                  UNION ALL
                  SELECT b.*
                    FROM organizations b 
                    JOIN under_tree 
                    ON b.parent_id = under_tree.id
                  ORDER BY order_1
                  )
                SELECT id FROM under_tree
                )
                and bsc_id is null
                and parent_id is not null
                and status = 1`);
                resultReturn.staffs_kpi = result7;


                let result8 = await db.getRst(`select 
                count(1) as count_kpi,
                round(sum(root_weight_percent) * 100) as root_weight_percent,
                round(sum(total_effective) * 100) as total_effective ,
                round(min(result_effective) * 100) as min_result_effective,
                round(max(result_effective) * 100) as max_result_effective
                from report_map_kpi
                where report_id in (select id from reports
                    where organization_id in (`+ organizationId + `)
                    order by end_date desc
                    LIMIT 1)
                and status = 1
                and is_leaf = 1`);
                resultReturn.report_map_kpi = result8;

                let result9 = await db.getRst(`select 
                a.count_department,
                a.count_kpi,
                a.count_map,
                a.count_seperated,
                a.count_c,
                a.count_tr,
                a.count_r,
                a.count_kpi,
                b.min_root_weight_percent,
                b.max_root_weight_percent,
                b.min_total_effective,
                b.max_total_effective,
                b.min_result_effective,
                b.max_result_effective
                from 
                (select 
                count(distinct organization_id) as count_department,
                count(1) as count_kpi,
                count(distinct map_id) as count_map,
                count(distinct seperated_map_id) as count_seperated,
                sum(CASE kpi_role
                    WHEN 'C' THEN 1
                    ELSE 0
                END) as count_c,
                sum(CASE kpi_role
                    WHEN 'Tr' THEN 1
                    ELSE 0
                END) as count_tr,
                sum(CASE kpi_role
                    WHEN 'R' THEN 1
                    ELSE 0
                END) as count_r
                 from report_departments_kpi
                where report_id in (select id from reports
                where organization_id in (`+ organizationId + `)
                order by end_date desc
                LIMIT 1)
                and status = 1
                and parent_id is not null) a
                LEFT JOIN (
                    select 
                    count(distinct organization_id) as count_department,
                    min(round(root_weight_percent * 100)) as min_root_weight_percent,
                    max(round(root_weight_percent * 100)) as max_root_weight_percent,
                    min(round(total_effective * 100)) as min_total_effective,
                    max(round(total_effective * 100)) as max_total_effective,
                    min(round(min_result_effective * 100)) as min_result_effective,
                    max(round(max_result_effective * 100)) as max_result_effective
                    from 
                    (select organization_id,
                    sum(root_weight_percent) as root_weight_percent,
                    sum(total_effective) as total_effective ,
                    min(result_effective) as min_result_effective,
                    max(result_effective) as max_result_effective
                    from report_departments_kpi
                    where report_id in (select id from reports
                    where organization_id in (`+ organizationId + `)
                    order by end_date desc
                    LIMIT 1)
                    and status = 1
                    and parent_id is not null
                    group by organization_id)
                    ) b
                on a.count_department = b.count_department`);
                resultReturn.report_departments_kpi = result9;


                let result10 = await db.getRst(`select 
                a.* ,
                b.min_root_weight_percent,
                b.max_root_weight_percent,
                b.min_total_effective,
                b.max_total_effective,
                b.min_result_effective,
                b.max_result_effective
                from 
                (select 
                count(1) as count_kpi,
                count(distinct staff_id) as count_staff,
                count(distinct organization_id) as count_department,
                count(distinct job_role_id) as count_job_role,
                count(distinct seperated_role_id) as count_seperated,
                count(distinct map_id) as count_map,
                sum(CASE kpi_role
                    WHEN 'C' THEN 1
                    ELSE 0
                END) as count_c,
                sum(CASE kpi_role
                    WHEN 'Tr' THEN 1
                    ELSE 0
                END) as count_tr,
                sum(CASE kpi_role
                    WHEN 'R' THEN 1
                    ELSE 0
                END) as count_r
                from report_staffs_kpi
                where report_id 
                in (select id from reports
                    where organization_id in (`+ organizationId + `)
                    order by end_date desc
                    LIMIT 1)
                and status = 1
                and parent_id is not null) a
                LEFT JOIN (select 
                count(distinct staff_id) as count_staff,
                min(round(root_weight_percent * 100)) as min_root_weight_percent,
                max(round(root_weight_percent * 100)) as max_root_weight_percent,
                min(round(total_effective * 100)) as min_total_effective,
                max(round(total_effective * 100)) as max_total_effective,
                min(round(min_result_effective * 100)) as min_result_effective,
                max(round(max_result_effective * 100)) as max_result_effective
                from 
                (select 
                    staff_id,
                    sum(root_weight_percent) as root_weight_percent,
                    sum(total_effective) as total_effective ,
                    min(result_effective) as min_result_effective,
                    max(result_effective) as max_result_effective
                    from report_staffs_kpi
                    where report_id 
                    in (select id from reports
                        where organization_id in (`+ organizationId + `)
                        order by end_date desc
                        LIMIT 1)
                    and status = 1
                    and parent_id is not null
                    group by staff_id)) b
                on a.count_staff = b.count_staff`);
                resultReturn.report_staffs_kpi = result10;

                resolve(resultReturn);

            } catch (e) {
                console.log('Lỗi sumerize', e)
                reject(e);
            }

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
     * Lấy thống kê kpi đang hoạt động toàn bộ công ty
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getActiveKpis(req, res, next) {

        getHomeReportActiveKpis(req.paramS.organization_id ? req.paramS.organization_id : 2)
            .then(result => {

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result ? result : {}
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }
                    , 2
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

        let report = await db.getRst("select * \
                                        from reports\
                                        where id = " + (req.paramS.report_id ? req.paramS.report_id : 0));

        if (report && report.id) {
            //đã truy vấn được bảng ghi báo cáo này
            await sumerizeReport(report.id, report.organization_id);
            //chờ đồng bộ xong mới lấy kết quả
        }

        console.log('bc', report);

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
                await db.runSql("update reports set status = null where id=" + dataJson.id);
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