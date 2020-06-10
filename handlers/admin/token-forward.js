"use strict"

/**
 * 
 * chuyển xác nhận token theo ../admin/token-handler.js
 * 
 */

// token để lấy
const adminToken = require('./token-handler');

// cơ sở dũ liệu kế nối theo pool lấy user data
const db = require('../../db/sqlite3/db-pool-admin');

class ForwardHandler {

    getPublicUser(req, res, next) {
        adminToken.getPublicUser(req, res, next);
        // next();
    }

    getToken(req, res, next) {
        adminToken.getToken(req, res, next);
        // next();
    }

    async verifyProxyToken(req, res, next) {

        adminToken.verify(req, res);

        if (req.error) {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: "NOK", message: "Lỗi xác thực token", error: req.error }));
            return;
        }

        if (!req.error && req.user && req.user.username) {
            try {

                let data = await db.getRst(`select * from admin_users where username='${req.user.username}'`)

                req.user.data = JSON.parse(JSON.stringify(
                    data
                    , (key, value) => {
                        if (
                            key === 'password_sign'
                            || key === 'public_key'
                            || key === 'private_password_key'
                            || key === 'signatures'
                        ) return undefined;
                        return value;
                    })
                );
            }
            catch (err) {
                console.log('Lỗi: ', err);
            };
            // đọc csdl để trả cho res.user.data 
        }
        // console.log('user tra ve', req.user);
        next();
    }
}

module.exports = new ForwardHandler();