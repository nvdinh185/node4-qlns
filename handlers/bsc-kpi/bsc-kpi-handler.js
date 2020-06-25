"use strict"

const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');


class Handler {

    async getUserReport(req, res, next) {

        let user = await db.getRst(`select c.name as organization_name, a.* 
                                    from users a
                                    LEFT JOIN organizations c
                                    ON a.organization_id = c.id
                                    where username = '766777123'
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

            // console.log('userReport',userReport);

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
     * Post danh sách tổ chức lưu vào csdl
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async postOrganizations(req, res, next) {
        let dataJson = req.json_data;
        // console.log(dataJson);
        let insertSql = arrObj.convertSqlFromJson("organizations", dataJson);
        try {
            await db.insert(insertSql);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: "OK", message: "cập nhật thành công!" }));
        } catch (err) {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: err, message: "error update db" }));
        }
    }

}

module.exports = new Handler()