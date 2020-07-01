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
            let userReport = {}
            userReport.organization_id = user ? user.organization_id : undefined;
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(arrObj.getJsonStringify(userReport));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({}));
        }

    }

    /**
     * Lấy danh sách tổ chức
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getOrganizations(req, res, next) {
        db.getRsts(`select * from organizations
                    where status = 1`)
            .then(results => {
                // console.log(results);
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

        db.getRsts(`select 
                    b.name as organization_name
                    , a.*
                    from job_roles a
                    LEFT JOIN organizations b
                    on a.organization_id = b.id
                    where a.status = 1`)
            .then(results => {
                // console.log(results);
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
                    order by a.organization_id, a.first_name, a.last_name`)
            .then(results => {
                // console.log('results', results);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
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
        try {
            dataJson.created_time = Date.now();
            let insertSql = arrObj.convertSqlFromJson("organizations", dataJson);
            await db.insert(insertSql);
        } catch (err) {
            if (err.code == "SQLITE_CONSTRAINT") {
                delete dataJson["created_time"];//Xóa trường này đi
                dataJson.updated_time = Date.now();
                try {
                    let updateSql = arrObj.convertSqlFromJson("organizations", dataJson, ["id"]);
                    await db.update(updateSql);
                } catch (e) {//lỗi trùng tên nên update theo id cũng không được luôn
                    let updateSql = arrObj.convertSqlFromJson("organizations", dataJson, ["name"]);
                    await db.update(updateSql);
                }
            } else {
                res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: err, message: "error update db" }));
            }
        } finally {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: "OK", message: "cập nhật thành công!" }));
        }
    }

}

module.exports = new Handler()