"use strict"

const db = require('../../db/sqlite3/db-pool');

class Handler {

    /**
     * Lấy danh mục tổ chức cây tổ chức đã khai báo cho hệ thống này
     * Chỉ trả về tổ chức mà user đó đang sở hữu, cùng với tổ chức demo thôi
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getOrganizations(req, res, next) {
        db.getRsts(`select * from organizations
                    where status = 1
                    order by order_1`)
            .then(results => {
                // console.log(results);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }, 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

}

module.exports = new Handler();