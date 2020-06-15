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
                    `+ (req.user && req.user.data && req.user.data.role === 99 ? `` : `
                    and id in (
                                WITH RECURSIVE under_tree AS(
                                    select a.* from organizations a
                            where status = 1
                            and a.id in (1,
                                    (select organization_id from users where username = '`+ (req.user ? req.user.username : '') + `')
                            )
                            UNION ALL
                            SELECT b.*
                                FROM organizations b JOIN under_tree
                            ON b.parent_id = under_tree.id and b.status = 1
                            ORDER BY order_1)
                            select id from under_tree  
                    )
                        `) + `
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