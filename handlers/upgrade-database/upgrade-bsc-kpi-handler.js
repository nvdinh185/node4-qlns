"use strict"
/**
 * Bộ xử lý chạy trực tiếp các lệnh nâng cấp csdl
 * Đưa trực tiếp lệnh sql lên csdl, thực thi và trả kết quả về
 * Chỉ có quyền dev mới thực hiện chức năng này
 * 
 * version 1.0 ngày 04/11/2019
 * 
 */

const db = require('../../db/sqlite3/db-pool');

class Handler {

    /**
     * Chỉ cho phép phương thức post mới thực thi nhé
     * truyền lên câu select hoặc dll
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    upgradeBscKpiDatabase(req, res, next) {

        let sql = req.json_data ? req.json_data.sql : undefined;
        let isSelect = sql ? sql.trimStart().search(/select/i) === 0 : false; //req.json_data ? req.json_data.select : false;

        if (sql) {
            if (isSelect) {
                db.getRsts(sql)
                    .then(results => {
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(results
                            , (key, value) => {
                                // if (value === null) { return undefined; }
                                return value;
                            }
                            , 2
                        ));
                    })
                    .catch(err => {
                        res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ error: err, message: 'Lỗi thực thi sql' }
                            , (key, value) => {
                                if (value === null) { return undefined; }
                                return value;
                            }
                            , 2
                        ));
                    })
            } else {
                db.runSql(sql)
                    .then(excuted => {
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ status: 'OK', message: excuted }
                            , (key, value) => {
                                if (value === null) { return undefined; }
                                return value;
                            }
                            , 2
                        ));
                    })
                    .catch(err => {
                        res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ error: err, message: 'Lỗi thực thi sql' }
                            , (key, value) => {
                                if (value === null) { return undefined; }
                                return value;
                            }
                            , 2
                        ));
                    })
            }

        } else {
            // thực thi nâng cấp csdl
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'No SQL input', message: 'Không có câu lệnh upgrade nào thực thi' }
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value;
                }
                , 2
            ));
        }
    }


    /**
     * Khởi tạo một công ty mới:
     * Bao gồm:
     * 1. Mã và công ty trong tổ chức,
     * 2. Từ điển bsc-kpi của tổ chức đó
     * 3. Đường dẫn dịch vụ resoureServer của họ sẽ trỏ đến là ở đâu
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createNewCompany(req, res, next) {

        // 1. Thực hiện insert vào bảng organizations, organization_bsc, organization_parameters

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: 'OK', message: excuted }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
            , 2
        ));
    }

}

module.exports = new Handler()