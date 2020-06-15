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

    setFunctionFromPath(req, res, next) {
        req.functionCode = req.pathName.substring(req.pathName.lastIndexOf("/") + 1);
        next();
    }

    async checkFunctionRole(req, res, next) {
        // dữ liệu data này nằm ở bảng admin_users
        console.log(req.functionCode);

        if (req.functionCode) { //can kiem tra quyen cua user co khong
            if (req.user && req.user.data) {
                if (req.user.data.role === 99) {
                    next() //quyen root
                } else {
                    try {
                        let row = await db.getRst(`select b.roles from users a, admin_roles b
                                                    where a.id = b.user_id
                                                    and a.status = 1
                                                    and a.username='${req.user.username}'`);

                        // console.log('row:', row);


                        let row2 = await db.getRst(`select id
                                                    from admin_functions
                                                    where function_code ='${req.functionCode}'`);

                        // console.log('row2:', row2, req.functionCode);       

                        let roles = row && row.roles ? JSON.parse(row.roles) : undefined; //tra ve object
                        let functionId = row2 ? row2.id : undefined; //tra ve id
                        //console.log('rolesFunction', functionId, roles);
                        let index = roles && functionId && roles.functions ? roles.functions.findIndex(x => x === functionId) : -1;

                        if (index >= 0) {
                            next()
                        } else {
                            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify({ message: 'Bạn KHÔNG ĐƯỢC PHÂN QUYỀN thực hiện chức năng này' }));
                        }

                    } catch (e) {
                        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ message: 'Lỗi trong lúc kiểm tra quyền', error: e }));
                    }
                }
            } else {
                res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'Bạn không có quyền thực hiện chức năng này' }));
            }
        } else {
            next(); //xem nhu khong can kiem tra quyen
        }

    }

}

module.exports = new Handler();