"use strict"

/**
 * bộ xử lý này tương tác trực tiếp cơ sở dữ liệu mà thôi
 * Đọc, ghi vào csdl, lấy kết quả và so sánh và trả kết quả người dùng
 */

const arrObj = require('../../utils/array-object');
const secUtil = require('../../utils/secret-util');
const vietnamese = require('../../utils/vietnamese-handler');

//Chuỗi nhận dạng dịch vụ ứng dụng này -- xem lúc tạo key
const service_key = "admin-qld-v2";

//Mật khẩu để giải mã private_key -- xem lúc tạo key cho server
const pass_admin = 'Cuong3500888';

//cơ sở dũ liệu kế nối theo pool
const db = require('../../db/sqlite3/db-pool-admin');

const rsaServerKey = { id: undefined, key: undefined }

// Tạo cặp key và lưu lại trên máy chủ key này sử dụng để mã hóa, ký, 
setTimeout(async () => {

    try {
        let result = await db.getRst(`select * from server_keys where service_id='${service_key}'`);

        if (result) {
            rsaServerKey.key = secUtil.decryptTextCrypto(result.private_password_key, pass_admin);
            rsaServerKey.id = result.public_key;
            console.log('KEY pair selected');
        } else {
            //tạo mới một cặp key nếu chưa có
            let keyPair = secUtil.generatorKeyPair();

            let jsonServiceKey = {
                service_id: service_key,
                public_key: keyPair.id, //khóa công khai
                private_password_key: secUtil.encryptTextCypto(keyPair.key, pass_admin), //khóa riêng được mã hóa
                service_name: 'Dịch vụ xác thực cho edu',
                status: 1
            };

            let data = await db.insert(arrObj.convertSqlFromJson('server_keys', jsonServiceKey, []));

            if (data) {
                rsaServerKey.key = keyPair.key
                rsaServerKey.id = keyPair.id;
                console.log('KEY pair created');
            }

        }

    } catch (error) {
        console.log('Error get KEY pair', JSON.stringify(error, null, 2))
    }

}, 2000);


class AdminHandler {

    /**
    * Trả về public key của dịch vụ api/admin này
    * 
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    getSystemId(req, res, next) {

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ id: rsaServerKey.id }
            , (key, value) => {
                if (value === null) { return undefined; }
                if (value && key === 'form_data') { return JSON.parse(value); }
                return value;
            }
        ));

    }



    /**
     * 1. gui username len
     * ktra hop le so dthoai, 90... (ktra hop le...mobi--ok, khac-->tra captcha) 
     * 
     * 1. Xac minh so da khai bao chua? 
     * 2. Va hoat dong? --> yc nhap mk + captcha--> ok --> tra token
     * 3. Da khai bao nhung cho cap phep xac minh --> tra ve message
     * 4. Chua khai bao --> xac minh dung so dt mang --> 
     * mobifone --> gui sms; khac --> gui notify captcah + token; ko hop le-->message
     * 5. Nhap OTP, ok 
     * 6. chua co ttca nhan --> tao thong tin ca nhan day du
     * 7. chua co pass --> tao pass tao rsa + pass --> private --> 
     * 8. Xác thực pass đúng + captcha đúng --> cấp token và login thành công
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    requestUsername(req, res, next) {

        if (req.json_data || req.paramS.username) {
            //post isdn len nhe -- req.json_data.phone
            let username = req.json_data && req.json_data.username ? req.json_data.username : req.paramS.username ? req.paramS.username : "";
            db.getRst(`select * from admin_users
                        where username='${username}'`)
                .then(user => {
                    //console.log('user',user);
                    if (user) {
                        if (user.status === 2) {
                            //user chờ xác minh 
                            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify({ status: 'USER-WAITING', message: 'User chờ xác minh và kích hoạt' }));
                        } else if (user.status === 1) {
                            //user đang hoạt động  
                            if (!user.password_sign) {
                                //Nếu chưa có pass thì trả luôn dữ liệu về 
                                //và yêu cầu tạo pass mới cho login
                                //Trường hợp này là user khai báo ban đầu bằng csdl
                                req.user = JSON.parse(JSON.stringify(
                                    user
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
                                //yêu cầu reset mật khẩu và thông tin cá nhân
                                req.next_status = "RESET-USER";
                            } else {
                                //trả về cho phiên xác thực
                                req.password_sign = JSON.parse(user.password_sign);
                                //trả về cho phiên yêu cầu login và xác thực
                                req.next_status = "LOGIN-USER";
                            }
                            req.username = username;
                            next();

                        } else {
                            //user đang bị khóa -- thông báo bị khóa
                            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify({ status: 'USER-LOCK', message: 'User đã bị khóa' }));
                        }
                    } else { //xac thuc username la so dien thoai...
                        //username không tồn tại trong csdl
                        req.username = username;
                        req.next_status = "NEW-USER";
                        next();

                    }
                })
                .catch(err => {
                    //neu khong co du lieu no lai den day nhi
                    res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ status: 'ERROR', message: 'Lỗi kết nối CSDL', error: err }));
                    //client sẽ dừng lại yêu cầu nhập isdn khác
                })

        } else {
            //không có dữ liệu post
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'NO-DATA', message: 'Không có dữ liệu yêu cầu' }));
        }
    }


    /**
     * 2. Tạo một username mới
     * input: req.user = {username}       //user của người dùng
     *        req.json_data = {password:} //mật khẩu của người dùng khởi tạo
     *        req.paramS.password //mật khẩu test
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createUsername(req, res, next) {

        //lấy mật khẩu đẩy lên để tạo user
        let password_hash = req.json_data && req.json_data.password_hash ? req.json_data.password_hash : req.paramS.password_hash;

        //so sánh username với dữ liệu username post lên hoặc req lên 
        if (!req.error
            && req.user
            && req.user.username === req.username
        ) {

            let fullName = req.json_data ? req.json_data.fullname || req.json_data.full_name || '' : req.paramS.fullname || '';
            fullName = fullName ? vietnamese.InitCapString(fullName) : undefined;


            let password_sign; //khai báo mật khẩu mới nếu có

            if (password_hash) {
                //thuật toán mã hóa đồng nhất client và server;
                //chuỗi giống nhau ở client và server - mật khẩu đã mã hóa, chỉ người dùng biết, máy chủ cũng không biết
                //Tạo bộ mã hóa pass bằng mật khẩu người dùng đã hash + với chữ ký của khóa riêng xóa đi
                //do vậy luôn luôn được một mật khẩu không giống ai, và không thể giải mã hoặc đoán được
                //chỉ người dùng có mật khẩu và đúng thuật toán này mới chứng thực được

                //Giải mã chuỗi hash mà client đã mã hóa (đồng nhất thuật toán)
                let hash_data = secUtil.decryptTextCrypto(password_hash, req.username);

                //tạo cặp key để ký
                let keyPair = secUtil.generatorKeyPair();
                //tạo thời gian để ký
                let createdTime = Date.now();
                //thông tin chữ ký của cặp khóa này
                password_sign = {
                    // khóa private để ký và không lưu
                    sign: secUtil.signText(hash_data + createdTime, keyPair.key),
                    // khóa public để chứng thực
                    id: keyPair.id,
                    // thời gian sẽ cộng với hash sẽ được xác thực
                    time: createdTime
                }
            }

            let jsonAdminUser = {
                username: req.username,

                password_sign: password_sign ? JSON.stringify(password_sign) : undefined, //là một chuỗi chứa {id, time, sign} nếu undefined sẽ không update
                public_key: req.json_data && req.json_data.public_key ? req.json_data.public_key : req.paramS.public_key,
                private_password_key: req.json_data && req.json_data.private_password_key ? req.json_data.private_password_key : req.paramS.private_password_key,

                fullname: fullName,
                nickname: req.json_data ? req.json_data.nickname : req.paramS.nickname,
                address: req.json_data ? req.json_data.address : req.paramS.address,
                email: req.json_data ? req.json_data.email : req.paramS.email,
                phone: req.json_data ? req.json_data.phone : req.paramS.phone,

                avatar: req.json_data ? req.json_data.avatar : req.paramS.avatar,
                background: req.json_data ? req.json_data.background : req.paramS.background,

                last_access_ip: req.clientIp,
                last_access_time: Date.now()
            }

            //kiểm tra 
            if (req.next_status === "NEW-USER") {
                jsonAdminUser.start_time = Date.now();
                jsonAdminUser.created_time = Date.now();

                //xem user mặc định thì cho phép luôn không chờ duyệt -- tạo trước trong csdl
                db.insert(arrObj.convertSqlFromJson("admin_users", jsonAdminUser))
                    .then(data => {
                        //tạo mới user thành công
                        next();
                    })
                    .catch(err => {
                        console.log('Lỗi gì insert?', err);
                        res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ status: 'NOK', message: 'Lỗi tạo user insert'}));
                    });
            } else {
                //or LOGIN-USER
                jsonAdminUser.updated_time = Date.now();
                db.update(arrObj.convertSqlFromJson("admin_users", jsonAdminUser, ["username"]))
                    .then(data => {
                        //update user thành công
                        next();
                    })
                    .catch(err => {
                        console.log('Lỗi gì update?', err);
                        res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ status: 'NOK', message: 'Lỗi tạo user Update' }));
                    })
            }

        } else {
            //bị lỗi thì trả về lỗi ngay cho user (ví dụ token ko hợp lệ)
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'NOK', message: req.error ? req.error : 'Không có dữ liệu yêu cầu', error: req.error }));
        }
    }



    /**
     * 3. Kiểm tra xác thực mật khẩu bởi thông tin mật khẩu gửi lên
     * Yêu cầu mật khẩu đã hash cùng thuật toán quy ước trước
     * Và đã sử dụng thuật toán của máy chủ ký nhận
     * 
     * Ở đây chỉ kiểm tra bộ hash và chữ ký có phải do máy chủ ký ko?
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    loginUsername(req, res, next) {
        //lấy password được hash và encrypt gửi lên
        let password_hash = req.json_data && req.json_data.password_hash ? req.json_data.password_hash : req.paramS.password_hash;
        //so sánh username với dữ liệu username post lên hoặc req lên 

        if (!req.error //không bị lỗi
            && password_hash //có pass 
            && req.user //có token đã xác thực user
            && req.user.username === req.username //user của token và post là giống nhau
            && req.password_sign //đã lấy trong csdl ra và đã dịch ra object
            && req.next_status === "LOGIN-USER" //là phiên xác định là login
        ) {

            //chuỗi giống nhau ở client và server - mật khẩu đã mã hóa, chỉ người dùng biết, máy chủ cũng không biết
            //Tạo bộ mã hóa pass bằng mật khẩu người dùng đã hash + với chữ ký của khóa riêng xóa đi
            //do vậy luôn luôn được một mật khẩu không giống ai, và không thể giải mã hoặc đoán được
            //chỉ người dùng có mật khẩu và đúng thuật toán này mới chứng thực được
            let hash_pass = secUtil.decryptTextCrypto(password_hash, req.username);

            if (secUtil.verifyText(
                hash_pass + req.password_sign.time //chuỗi ghép như khi sign
                , req.password_sign.sign         //chữ ký
                , req.password_sign.id           //chuỗi publickey -- private key không lưu lại để tránh làm giả chữ ký
            )
            ) {

                next();

            } else {
                //Nếu xác thực lỗi thì ghi lại log + update count trong db???, nhằm phát hiện tấn công không?
                console.log('verify-pass-fail', new Date().toUTCString(), req.username, req.clientIp);

                res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ status: 'NOK', message: 'Mật khẩu không hợp lệ', error: password_hash }));
            }

        } else {
            //bị lỗi thì trả về lỗi ngay cho user (ví dụ token ko hợp lệ)
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'NOK', message: req.error ? req.error : 'Không có dữ liệu yêu cầu', error: req.error }));
        }
    }



    /**
     * 3. Lấy thông tin của user từ token login vào
     * Trả về req.user.data là thông tin của user trong bảng admin_users
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getUserData(req, res, next) {

        if (req.user) {

            db.getRst(`SELECT *
                        FROM admin_users
                        where username = '${(req.user.username)}'`)
                .then(data => {
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

                    req.user.origin = req.origin;
                    req.user.ip = req.clientIp;
                    req.user.device = req.clientDevice;

                    req.user.system_id = rsaServerKey.id; //trả về cho proxy xác thực
                    req.user.signature = secUtil.signText(JSON.stringify(data), rsaServerKey.key);

                    next();
                })
                .catch(err => {
                    next();
                })
        } else {
            next();
        }
    }


    /**
     * Truy vấn csdl trả về req.keyPair và next
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getServiceKey(req, res, next) {
        db.getRst(`select * from server_keys where service_id='${service_key}'`)
            .then(result => {
                req.keyPair = result;
                next();
            })
            .catch(err => {
                console.log('Error getServiceKey', JSON.stringify(error, null, 2))
                next();
            });
    }

    /**
     * Lấy chuỗi public key trả cho client sử dụng mã hóa dữ liệu truyền lên
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getPublickeyJson(req, res, next) {

        db.getRst(`select service_id
                    ,public_key
                    ,service_name
                    ,is_active
                    from server_keys
                    where service_id='${service_key}'`)
            .then(row => {
                if (row) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(row
                        , (key, value) => {
                            if (value === null) { return undefined; }
                            return value;
                        }
                    ));
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(JSON.stringify({ error: "No public_key init on server!", message: 'Không có dịch vụ này tồn tại' }));
                }
            })
            .catch(err => {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(JSON.stringify({ message: 'Lỗi truy vấn dữ liệu', error: err }));
            })

    }

    /**
     * Giải mã dữ liệu mà client sử dụng khóa public để mã hóa
     * Dữ liệu này chứng tỏ là do ứng dụng của cuongdq viết
     * kết quả là lấy private key của máy chủ, giải mã ra
     * thành dữ liệu req.json_data.decrypted
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async decryptedData(req, res, next) {
        if (req.json_data && req.json_data.encrypted) {
            try {
                let row = await db.getRst(`select private_key
                                                  from server_keys
                                                  where service_id='${service_key}'`);
                if (row && row.private_key) {
                    req.json_data.decrypted = JSON.parse(secUtil.decryptObjectRSA(req.json_data.encrypted, row.private_key));
                }
                //console.log('du lieu da giai ma ', req.json_data.decrypted);
            } catch (e) {
                //console.log('loi giai ma ', e);
            }
        }
        next();
    }

    /**
     * Luu thong tin avatar, ...
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async saveUserInfo(req, res, next) {

        let jsonUpdate = {
            ...req.json_data,
            username: req.user.username,
            updated_time: Date.now()
        };

        jsonUpdate.fullname = vietnamese.InitCapString(jsonUpdate.fullname || jsonUpdate.full_name);

        try {
            await db.update(db.convertSqlFromJson('admin_users', jsonUpdate, ['username']))
        } catch (err) {
            console.log('Lỗi  saveUserInfo', err);
        }
        next();
    }

    /**
     * Lấy thông tin của user từ token login vào
     * thông tin này được hiển thị trên thanh login
     * gồm: res.user_info.username and res.user_info
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getUserInfo(req, res, next) {

        if (req.user) {

            db.getRst(`SELECT *
                        FROM admin_users
                        where username = '${(req.user.username)}'`)
                .then(data => {

                    let userInfo = JSON.parse(JSON.stringify(
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
                    // thông tin trả về user của máy chủ xác thực
                    req.user = {
                        ...userInfo
                        , origin: req.origin
                        , ip: req.clientIp
                        , device: req.clientDevice
                        , system_id: rsaServerKey.id //trả về cho proxy xác thực
                        , signature: secUtil.signText(JSON.stringify(data), rsaServerKey.key)
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({
                        status: "OK",
                        message: 'User đã được xác thực!', //thông tin 
                        //cung cấp token mới nếu có
                        token: req.token,
                        //thông tin user trả về để hiển thị login
                        data: req.user
                    }
                        , (key, value) => {
                            if (value === null) { return undefined; }
                            if (value && key === "password_sign") { return JSON.parse(value); }
                            return value
                        } //chuyển đổi giá trị null không truyền lên, hoặc chuyển đổi các hàm json trước khi đẩy lên
                        ,
                        2 //chèn 2 khoảng trắng ở từng thuộc tính
                    ));
                })
                .catch(err => {
                    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ status: "NOK", message: "Lỗi truy vấn user ", error: err }));
                })
        } else {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: "INVALID", message: "Lỗi chứng thực user" + (req.error ? ": " + req.error : ""), error: req.error ? req.error : 'no data' }));
        }
    }

    /**
     * Lấy danh sách user có thông tin từ tập follow, hay tập friends của mình
     * Sử dụng cho user tìm bạn, 
     * khi họ gõ số điện thoại trên ô tìm kiếm thông tin sẽ tự trả về
     * để người dùng yêu cầu kết bạn hoặc xem thông tin cá nhân của họ 
     * (trường hợp họ public)
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getUsersInfo(req, res, next) {
        if (req.paramS.users
            && req.paramS.users.indexOf(")") < 0
            && req.paramS.users.indexOf("=") < 0
            && req.paramS.users.toUpperCase().indexOf("OR") < 0
            && req.paramS.users.toUpperCase().indexOf("AND") < 0
        ) {
            db.getRsts(`SELECT *
                            FROM admin_users
                            where username in (${req.paramS.users})`)
                .then(data => {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({
                        status: 1,
                        message: 'Data OK',
                        users: data
                    }
                        , (key, value) => {
                            if (value === null) return undefined;
                            if (key === 'password_sign') return JSON.parse(value)
                            return value
                        }, 2
                    ));
                })
                .catch(err => {
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(err));
                })
        }
        else {
            /* res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Don't SQLInjection please!" })); */
            //lay public user
            db.getRsts(`SELECT *
                            FROM admin_users
                            where broadcast_status =1`)
                .then(data => {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({
                        status: 1,
                        message: 'Data OK',
                        users: data
                    }
                        , (key, value) => {
                            if (value === null) return undefined
                            if (key === 'password_sign') return JSON.parse(value)
                            return value
                        }
                        , 2
                    ));
                })
                .catch(err => {
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(err));
                })

        }
    }

}

module.exports = new AdminHandler();