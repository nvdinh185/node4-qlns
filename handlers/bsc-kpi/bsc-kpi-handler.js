"use strict"
/**
 * Bộ xử lý bsc-kpi
 * 
 * ver 1.0 
 * Created by cuong.dq
 * date: 05/08/2019
 * 
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');

/**
 * Khai báo các hàm tương tác với csdl
 * Lấy các tham số đầu vào từ req.json_data, req.paramS, req.form_data, req.user
 * Thực hiện chuyển đổi dữ liệu sang các câu lệnh sql tương thích với csdl
 * Và gọi đối tượng db. để thực thi với csdl
 */
class Handler {

    /**
     * Lấy tham số hệ thống
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getParameters(req, res, next) {
        db.getRsts(`select *
                    from parameters a
                    where status=1
                    ${(req.paramS.id ? "and a.id = " + req.paramS.id : "")}
                    ${(req.paramS.type ? "and a.type = " + req.paramS.type : "")}
                    ${(req.paramS.parent_id ? "and a.parent_id = " + req.paramS.parent_id : "")}
                    order by a.order_1`
        )
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    // lấy danh sách các bộ phận để tổ chức excel phân rã chiều ngang
    getDepartments(req, res, next) {
        db.getRsts(`select * from organizations
        where status=1
        and parent_id = ${(req.paramS.organization_id || 0)}
        order by order_1, id`)
            .then(results => {

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));

            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }
    /**
     * Lấy cây tổ chức
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getOrganizationsTree(req, res, next) {

        db.getRsts(`WITH RECURSIVE
                    under_tree AS (
                    select a.* from organizations a
                    where ${(req.paramS.id ? "a.id = " + req.paramS.id : "a.id=1")}
                    ${(req.paramS.parent_id ? "and a.parent_id = " + req.paramS.parent_id : "")}
                    UNION ALL
                    SELECT b.*
                        FROM organizations b JOIN under_tree ON b.parent_id = under_tree.id
                    ORDER BY order_1
                    )
                SELECT * FROM under_tree`)
            .then(results => {

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));

            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy cây chức danh của tổ chức cấp Công ty/Trung tâm
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getJobRoles(req, res, next) {
        let organazationId = req.paramS.organization_id || 0;
        db.getRsts(`select 
                    b.name as department_name
                    , a.*
                    from job_roles a
                    LEFT JOIN organizations b
                    on a.organization_id = b.id
                    where a.status = 1
                    and a.organization_id in 
                    (WITH RECURSIVE under_tree AS (
                        select a.* from organizations a
                        where a.id = ${organazationId}
                        UNION ALL
                        SELECT b.*
                            FROM organizations b
                             JOIN under_tree
                              ON b.parent_id = under_tree.id
                        ORDER BY order_1
                        )
                        SELECT id FROM under_tree)
                    `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy danh sách nhân viên của tổ chức
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getStaffs(req, res, next) {

        let organizationList = [];

        try {
            organizationList = req.paramS && req.paramS.organization_list ? JSON.parse(req.paramS.organization_list) : []; //chuyển thành array
        } catch (e) {
            organizationList = [];
        }

        if (req.paramS && req.paramS.organization_id) organizationList.push(req.paramS.organization_id);

        // console.log('organizationList', organizationList);


        db.getRsts(`select 
                    a.name || '  - '  || b.name as view_name,
                    b.name as organization_name,
                    c.name as job_name,
                    a.*
                    from staffs a
                    LEFT JOIN organizations b
                    ON a.organization_id = b.id
                    LEFT JOIN job_roles c
                    ON a.job_id = c.id
                    where a.organization_id in
                    (WITH RECURSIVE under_tree AS
                        (
                        select a.* from organizations a
                        where a.id in (${organizationList.toString()})
                        UNION ALL
                        SELECT b.*
                            FROM organizations b JOIN under_tree
                            ON b.parent_id = under_tree.id
                        )
                        select id from under_tree
                    )
                    order by a.organization_id, a.first_name, a.last_name`)
            .then(results => {
                // sap xep alpha vietnamese
                // console.log('results', results);
                // Trường hợp first_name == null và last_name == null thì chạy vô hạn
                let resultsRtn = arrObj.orderArrayObjects(results, ['organization_id', 'first_name', 'last_name']);

                // console.log('resultsRtn', resultsRtn);

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(resultsRtn));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy từ điển bsc của tổ chức
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getOrganizationsBsc(req, res, next) {
        db.getRsts(`select *
                    from organizations_bsc a
                    where a.organization_id in
                    (WITH RECURSIVE under_tree AS
                         (
                        select a.* from organizations a
                        where a.id=${(req.paramS.organization_id || 0)}
                        UNION ALL
                        SELECT b.*
                            FROM organizations b JOIN under_tree
                             ON b.parent_id = under_tree.id
                        )
                        select id from under_tree
                    )`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy chu kỳ chiến lược
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getStrategyPeriod(req, res, next) {
        db.getRsts(`select *
                    from strategy_period a
                    where a.organization_id in
                    (WITH RECURSIVE under_tree AS
                         (
                        select a.* from organizations a
                        where a.id=${(req.paramS.organization_id || 0)}
                        UNION ALL
                        SELECT b.*
                            FROM organizations b JOIN under_tree
                             ON b.parent_id = under_tree.id
                        )
                        select id from under_tree
                    )`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy chủ đề chiến lược
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getStrategyTopic(req, res, next) {
        db.getRsts(`select *
                    from strategy_topic a
                    where a.organization_id in
                    (WITH RECURSIVE under_tree AS
                         (
                        select a.* from organizations a
                        where a.id=${(req.paramS.organization_id || 0)}
                        UNION ALL
                        SELECT b.*
                            FROM organizations b JOIN under_tree
                             ON b.parent_id = under_tree.id
                        )
                        select id from under_tree
                    )`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy bản đồ chiến lược
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getStrategyMap(req, res, next) {
        db.getRsts(`WITH RECURSIVE
                        under_tree AS (
                        select a.* from strategy_map a
                        where a.bsc_id in (11,12,13,14)
                        and a.status = 1
                        and a.organization_id = ${(req.paramS.organization_id || 0)}
                        UNION ALL
                        SELECT b.*
                            FROM strategy_map b
                             JOIN under_tree
                              ON b.parent_id = under_tree.id
                        ORDER BY order_1
                        )
                        SELECT 
                        b.name as period_name
                        , c.name as organization_name
                        , a.* 
                        FROM under_tree a
                        LEFT JOIN strategy_period b
                        on a.period_id = b.id
                        LEFT JOIN organizations c
                        on a.organization_id = c.id`)
            .then(results => {
                // console.log(results.length);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Bản phân rã map
     * cho đơn vị cấp con của tổ chức
     * Cấp Công ty/Trung tâm = req.paramS.organization_id
     * (phân rã đến tất cả các đơn vị 
     * cấp dưới và chính nó)
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getSeperatedMap(req, res, next) {
        db.getRsts(`select o.name as organization_name, m.*
                    FROM seperated_map_kpi m
                        LEFT JOIN organizations o
                        ON m.organization_id = o.id
                    where m.organization_id in
                    (WITH RECURSIVE under_tree AS (
                        select a.* from organizations a
                        where a.id = ${(req.paramS.organization_id || 0)}
                        UNION ALL
                        SELECT b.*
                            FROM organizations b
                             JOIN under_tree
                              ON b.parent_id = under_tree.id
                        ORDER BY order_1
                        )
                        SELECT id FROM under_tree)
                    ${(req.paramS.map_id ? ' and map_id=' + req.paramS.map_id : '')}
                    and m.status = 1    -- chỉ lấy status hoạt động
                    order by map_id, kpi_role, organization_name
                    `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * department kpi
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getDepartmentsKpi(req, res, next) {
        db.getRsts(`WITH RECURSIVE
                        under_tree AS (
                        select a.* from departments_kpi a
                        where a.bsc_id in (21,22)
                        and a.status = 1
                        and a.organization_id = ${(req.paramS.organization_id || 0)}
                        UNION ALL
                        SELECT b.*
                            FROM departments_kpi b
                             JOIN under_tree
                             ON b.parent_id = under_tree.id
                             and b.status = 1
                        ORDER BY order_1
                        )
                    SELECT d.name as organization_name, c.*
                     FROM under_tree c
                        LEFT JOIN organizations d
                        ON c.organization_id = d.id
                        ${(req.paramS.department_kpi_id ? ' where c.id=' + req.paramS.department_kpi_id : '')}
                        order by kpi_role, order_1`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Phân rã theo vai trò công việc
     * 
     * Lấy bảng kết quả phân rã đơn vị cấp phòng
     * Với biến vào req.paramS.organization_id là đơn vị cấp phòng
     * Đầu ra là: 
     * toàn bộ cây đã được phân rã đến tất cả các vai trò của phòng đó
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getSeperatedRoles(req, res, next) {
        db.getRsts(`WITH RECURSIVE
                    under_tree AS (
                    select a.* from seperated_roles_kpi a
                    where a.parent_id is null
                    and a.status = 1
                    and a.organization_id = ${(req.paramS.organization_id || 0)}
                    UNION ALL
                    SELECT b.*
                        FROM seperated_roles_kpi b
                         JOIN under_tree
                          ON b.parent_id = under_tree.id
                    ORDER BY order_1
                    )
                    SELECT d.name as job_role_name, c.*
                    FROM under_tree c
                       LEFT JOIN job_roles d
                       ON c.job_role_id = d.id
                       ${(req.paramS.department_kpi_id ? ` where c.department_kpi_id= ${req.paramS.department_kpi_id}` : ``)}
                       ${(req.paramS.seperated_role_id && !req.paramS.department_kpi_id ? ` where c.department_kpi_id in (select department_kpi_id from seperated_roles_kpi where id = ${req.paramS.seperated_role_id})` : ``)}
                    ORDER BY kpi_role, order_1`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * staffs kpi
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getStaffsKpi(req, res, next) {
        db.getRsts(`WITH RECURSIVE
                        under_tree AS (
                        select a.* from staffs_kpi a
                        where a.bsc_id in (23,24,25)
                        ${(req.paramS.staff_id ? `and a.staff_id = ` + req.paramS.staff_id : `and a.staff_id=4`)}
                        UNION ALL
                        SELECT b.*
                            FROM staffs_kpi b 
                            JOIN under_tree 
                            ON b.parent_id = under_tree.id
                        ORDER BY order_1
                        )
                    SELECT * FROM under_tree`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy chu kỳ báo cáo hiện tại có hiệu lực trả về cho đơn vị đó
     * Cái này không phải login để lấy mà trả về trang chủ luôn
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getCurrentReport(req, res, next) {
        db.getRst(`select *
                    from reports a
                    where status is null
                    and organization_id=${(userReport.organization_id ? userReport.organization_id : 2)}
                     order by a.updated_time desc
                    `)
            .then(result => {

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(result));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }


    //-----------------------------------------------------//
    //kiểm tra user, lấy danh sách staff + staff của user
    //rồi lấy chu kỳ báo cáo hiện tại trong report
    //để lọc cá nhân, lọc chu kỳ để tạo kế hoạch và tạo đánh giá
    async getUserReport(req, res, next) {
        //lay duoc req.user.username
        // console.log('username: ', req.user);

        let user = await db.getRst(`select c.name as organization_name, a.* 
                                        from users a
                                        LEFT JOIN organizations c
                                        ON a.organization_id = c.id
                                        where username='766777123'
                                        `);

        // console.log('user', user);

        if (user) {
            let userReport = {
                organization_id: user ? user.organization_id : undefined
                , organization_list: user ? user.organization_list : undefined
                , organization_name: user ? user.organization_name : undefined
                , staff_id: user ? user.staff_id : undefined
                , staff_list: user ? user.staff_list : undefined
                , role: user ? user.role : undefined
            };

            let organizationId = userReport.organization_id;

            let staffList = (user && user.staff_list ? JSON.parse(user.staff_list) : []);
            if (user && user.staff_id) staffList.push(user.staff_id);

            let departmentList = (user && user.organization_list ? JSON.parse(user.organization_list) : []);

            //console.log('departmentList',departmentList);

            //Lấy danh sách đơn vị mà user trực thuộc để quản lý trong danh sách này
            let departments = await db.getRsts(`select a.* from organizations a
                                                where a.id in (${departmentList.toString()})`);
            userReport.departments = departments;


            // bổ sung thêm chu kỳ hiện tại của đơn vị
            let { maxId } = await db.getRst(`select max(id) as maxId from strategy_period where organization_id=${organizationId}`)
            let period_id = maxId;

            let period = await db.getRst(`select * from strategy_period where organization_id=${organizationId} and id=${period_id}`)
            userReport.period = period;

            //console.log('departments',departments);
            //lay ds staff_list nua

            let staffs = await db.getRsts(`select 
                                            a.name || '  - '  || b.name as view_name,
                                            b.name as organization_name,
                                            c.name as job_name,
                                            a.* from staffs a
                                            LEFT JOIN organizations b
                                            ON a.organization_id = b.id
                                            LEFT JOIN job_roles c
                                            ON a.job_id = c.id
                                            where a.id in (${staffList.toString()})
                                            order by a.first_name, a.last_name, a.name`);

            // Sắp xếp thứ tự alpha Tiếng Việt
            userReport.staffs = arrObj.orderArrayObjects(staffs, ['organization_id', 'first_name', 'last_name', 'name']);

            //console.log('userReport',userReport);

            db.getRst(`select *
                        from reports a
                        where status is null
                        and organization_id=${organizationId}
                         order by a.updated_time desc
                        `)
                .then(result => {

                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

                    userReport.report = result;

                    res.end(arrObj.getJsonStringify(userReport));
                })
                .catch(err => {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({}));
                });
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({}));
        }

    }

    /**
     * Lấy các chu kỳ báo cáo
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getReports(req, res, next) {
        db.getRsts(`select *
                    from reports a
                    where a.organization_id = ${(req.paramS.organization_id ? req.paramS.organization_id : 0)}
                     order by a.updated_time desc
                    ${(req.paramS.limit ? "LIMIT " + req.paramS.limit : "LIMIT 20")}
                    ${(req.paramS.offset ? "OFFSET " + req.paramS.offset : "")}
                    `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }


    /**
     * Lấy report của map
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getReportMapKpis(req, res, next) {
        db.getRsts(`select *
                    from report_map_kpi a
                    where 1=1
                    ${(req.paramS.report_id ? "and a.report_id = " + req.paramS.report_id : "")}
                    ${(req.paramS.organization_id ? "and a.organization_id = " + req.paramS.organization_id : "")}
                    ${(req.paramS.map_id ? "and a.map_id = " + req.paramS.map_id : "")}
                     order by a.order_1
                    ${(req.paramS.limit ? "LIMIT " + req.paramS.limit : "LIMIT 100")}
                    ${(req.paramS.offset ? "OFFSET " + req.paramS.offset : "")}
                    `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy report của bộ phận
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getReportDepartmentKpis(req, res, next) {
        db.getRsts(`select *
                    from report_departments_kpi a
                    where 1=1
                    ${(req.paramS.report_id ? "and a.report_id = " + req.paramS.report_id : "")}
                    ${(req.paramS.organization_id ? "and a.organization_id = " + req.paramS.organization_id : "")}
                    ${(req.paramS.department_kpi_id ? "and a.department_kpi_id = " + req.paramS.department_kpi_id : "")}
                     order by a.order_1
                    ${(req.paramS.limit ? "LIMIT " + req.paramS.limit : "LIMIT 100")}
                    ${(req.paramS.offset ? "OFFSET " + req.paramS.offset : "")}
                    `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy báo cáo KPI của nhân viên
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getReportStaffKpis(req, res, next) {
        db.getRsts(`select *
                    from report_staffs_kpi a
                    where 1=1
                    ${(req.paramS.report_id ? "and a.report_id = " + req.paramS.report_id : "")}
                    ${(req.paramS.organization_id ? "and a.organization_id = " + req.paramS.organization_id : "")}
                    ${(req.paramS.staff_id ? "and a.staff_id = " + req.paramS.staff_id : "")}
                    ${(req.paramS.staff_kpi_id ? "and a.staff_kpi_id = " + req.paramS.staff_kpi_id : "")}
                     order by a.order_1
                    ${(req.paramS.limit ? "LIMIT " + req.paramS.limit : "LIMIT 100")}
                    ${(req.paramS.offset ? "OFFSET " + req.paramS.offset : "")}
                    `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //--------------------------------------------------//



}

module.exports = new Handler()