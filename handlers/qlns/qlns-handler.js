"use strict"

const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');
const vnUtils = require('../../utils/vietnamese-handler');

class QLNSHandler {

    async getUserReport(req, res, next) {

        let user = await db.getRst(`select a.organization_id
                                    from users a
                                    JOIN organizations c
                                    ON a.organization_id = c.id
                                    where a.username = '0766777123'
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
        db.getRsts(`select * from organizations`)
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
                    `)
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
    async getStaffs(req, res, next) {
        try {
            let listStaffs = await db.getRsts(`select
                    b.name as organization_name,
                    c.name as job_name,
                    a.*
                    from staffs a
                    JOIN organizations b
                    ON a.organization_id = b.id
                    JOIN job_roles c
                    ON a.job_id = c.id
                    order by a.organization_id, a.first_name, a.last_name`)

            if (listStaffs.length > 0) {
                for (const el of listStaffs) {
                    if (el.job_list) {
                        let job_list = el.job_list.replace("[", "(").replace("]", ")")
                        el.job_list_name = await db.getRsts(`SELECT name FROM job_roles WHERE id IN ${job_list}`)
                    }
                }
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(arrObj.getJsonStringify(listStaffs));
        } catch (err) {
            console.log(err);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify([]));
        }
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
            if (dataJson.id) {//Nếu có id thì update theo id
                dataJson.updated_time = Date.now();
                let updateSql = arrObj.convertSqlFromJson("organizations", dataJson, ["id"]);
                await db.update(updateSql);
            } else {//không có id
                let name = await db.getRsts(`select * from organizations where name = '${dataJson.name}'`);
                if (name.length > 0) {//Nếu có name thì update theo name
                    dataJson.updated_time = Date.now();
                    let updateSql = arrObj.convertSqlFromJson("organizations", dataJson, ["name"]);
                    await db.update(updateSql);
                } else {//Nếu không có name thì chèn mới
                    dataJson.created_time = Date.now();
                    let insertSql = arrObj.convertSqlFromJson("organizations", dataJson);
                    await db.insert(insertSql);
                }
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: "OK", message: "cập nhật thành công!" }));
        } catch (e) {
            console.log(e);
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: "error update db" }));
        }
    }

    /**
     * Post danh sách chức danh lưu vào csdl
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async postJobRoles(req, res, next) {
        let dataJson = req.json_data;
        // console.log(dataJson);

        try {
            if (dataJson.id) {//Nếu có id (upload file vừa download)
                dataJson.updated_time = Date.now();
                let updateSql = arrObj.convertSqlFromJson("job_roles", dataJson, ["id"]);
                await db.update(updateSql);
            } else {//không có id (file sample)
                let data = await db.getRsts(`select * from job_roles where name = '${dataJson.name}'`);
                if (data.length > 0) {//Nếu có name thì update theo name
                    dataJson.updated_time = Date.now();
                    let updateSql = arrObj.convertSqlFromJson("job_roles", dataJson, ["name"]);
                    await db.update(updateSql);
                } else {//Nếu không có name thì chèn mới
                    dataJson.created_time = Date.now();
                    let insertSql = arrObj.convertSqlFromJson("job_roles", dataJson);
                    await db.insert(insertSql);
                }
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: "OK", message: "cập nhật thành công!" }));
        } catch (e) {
            console.log(e);
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: "error update db" }));
        }
    }

    /**
     * Post danh sách nhân sự lưu vào csdl
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async postStaffs(req, res, next) {
        let dataJson = req.json_data;
        // console.log(dataJson);
        let splitName = vnUtils.splitFullName(dataJson['name']);
        dataJson.last_name = splitName.last_name;
        dataJson.first_name = splitName.first_name;

        try {
            if (dataJson.id) {//Nếu có id (upload file vừa download)
                dataJson.updated_time = Date.now();
                let updateSql = arrObj.convertSqlFromJson("staffs", dataJson, ["id"]);
                await db.update(updateSql);
            } else {//không có id (file sample)
                let data = await db.getRsts(`select * from staffs where name = '${dataJson.name}'`);
                if (data.length > 0) {//Nếu có name thì update theo name
                    dataJson.updated_time = Date.now();
                    let updateSql = arrObj.convertSqlFromJson("staffs", dataJson, ["name"]);
                    await db.update(updateSql);
                } else {//Nếu không có name thì chèn mới
                    dataJson.created_time = Date.now();
                    let insertSql = arrObj.convertSqlFromJson("staffs", dataJson);
                    await db.insert(insertSql);
                }
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: "OK", message: "cập nhật thành công!" }));
        } catch (e) {
            console.log(e);
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: e, message: "error update db" }));
        }
    }

}

module.exports = new QLNSHandler()