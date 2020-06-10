"use strict"
/**
 * ver 1.0 ngày 28/09/2019
 * 
 * Sử dụng cho máy chủ proxy không lưu thông tin user tại đây
 * Chỉ sử dụng máy chủ xác thực khác
 * ????
 * 
 */

// đường dẫn máy chủ xác thực
const authServer = 'https://cuongdq.no-ip.info/auth';

// thiet lap tu choi khong xac thuc???
/*
Error: unable to verify the first certificate
    at TLSSocket.onConnectSecure (_tls_wrap.js:1321:34)
    at TLSSocket.emit (events.js:210:5)
    at TLSSocket._finishInit (_tls_wrap.js:794:8)
    at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:608:12) {
  code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
}
 */
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';


// Mã chứng thực của máy chủ này được cấp phép
const proxyId = "Mã chứng thực của máy chủ này được cấp phép";

const url = require('url');
const jwt = require('jsonwebtoken');
const proxy = require('request'); //doi tuong yeu cau proxy truy van POST/GET

var tokenSession = []; //luu lai session lam viec


/**
 * Ghep tham so trong lenh get?/&
 * @param {*} url 
 */
const url_sep = (url) => { return url.match(/\?/) ? '&' : '?'; }

const verifyExpire = (token) => {
    try {
        let userInfo = jwt.decode(token);
        if (userInfo.exp > (new Date().getTime() / 1000)) return true;
    } catch (e) { }
    return false;
}

class ProxyTokenUtil {

    /**
     * Lấy token từ các phương thức truyền lên
     * kết quả trả lại là req.token 
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getToken(req, res, next) {

        //lấy token trên header truyền qua các phương thức kèm header
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        //lấy token theo phương thức kèm url, truyền qua phương thức ?token=
        if (!token) token = url.parse(req.url, true, false).query.token;
        //lấy token theo phương thức post kèm json_data;
        if (!token) token = req.json_data ? req.json_data.token : undefined; //lay them tu json_data post

        //lấy token đã biên dịch các hàm trước next hoặc token ở trên
        req.token = req.token ? req.token : token;

        //cắt bỏ chuỗi Bearer nếu nó có kèm trong token (cái này dùng trong interceptor)
        req.token = req.token && req.token.startsWith('Bearer ') ? req.token.slice(7) : req.token;

        //mã otp gửi lên bằng query
        let otp = url.parse(req.url, true, false).query.otp;
        //mã otp gửi theo lệnh post
        if (!otp) otp = req.json_data ? req.json_data.otp : undefined;
        //gán otp nếu có để xác thực
        req.otp = req.otp ? req.otp : otp;

        //mã proxy gửi lên bằng query
        let proxy = url.parse(req.url, true, false).query.proxy;
        //mã otp gửi theo lệnh post
        if (!proxy) proxy = req.json_data ? req.json_data.proxy : undefined;
        //gán proxy nếu có để xác thực
        req.proxy = req.proxy ? req.proxy : proxy;

        //trả hàm tiếp theo xử lý với kết quả req.token
        next();

    }

    /**
    *
    * @param {*} req
    * @param {*} res
    * @param {*} next
    */
    verifySession(req, res, next) {

        let aliveToken = tokenSession.find(x => x.token === req.token);

        if (aliveToken && verifyExpire(req.token)) {
            req.user = aliveToken.user_info
        }

        next();
    }

    /**
     * Xác thực token thông qua proxy xem có phải được cấp đúng không?
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * Kết quả trả về là authentication đúng hoặc sai
     * 
     */
    verify(req, res, next) {

        if (req.user) {
            next();
        } else {
            //neu chua xac thuc server
            proxy.post(authServer + '/authorize-token', { json: { token: req.token } } //du lieu parse tu postProcess
                , (error, res, body) => {
                    if (error) {
                        console.log("Lỗi", error);
                        req.error = error;
                    } else if (body && body.status === "OK" && body.user_info) {
                        tokenSession.push({
                            create_time: new Date().getTime(),
                            token: req.token,
                            user_info: body.user_info
                        })
                        req.user = body.user_info;
                    } else {
                        req.error = body;
                    }
                    next(); //có lỗi thì không có req.user
                })
        }
    }

    /**
     * Yêu cầu một token được cấp phép từ máy chủ xác thực
     * Đẩy yêu cầu lên là json_data.proxy bằng chuỗi proxyId trên kia
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * Trả về một đối tượng như máy chủ trả về:
     * {
        status: req.next_status //'NEW-USER' | 'LOGIN-USER'
        , token: req.token
        , username: req.username
        , captcha: req.captcha.data //svg ảnh của otp
        , data: req.user //thông tin user đã tồn tại cần reset hoặc thay đổi thông tin
        //, server_key: req.server_key // mã public_key của server để mã hóa mật khẩu
      }
     */
    requestUserName(req, res, next) {

        req.authUrl = authServer + '/request-username';
        req.jsonData = {
            proxy: proxyId,
            username: req.json_data && req.json_data.username ? req.json_data.username : req.username
        };

        next();

    }

    /**
     * Xử lý getToken và post json_data trước 
     * req.token, req.otp, req.json_data
     * 
     * Dữ liệu đầu vào là post cái token cũ lên,
     * cùng thông tin người dùng nhập lên + proxy 
     * kết quả trả về là token mới 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     */
    loginUserName(req, res, next) {

        let jsonData = req.json_data ? req.json_data : req.paramS;
        jsonData.token = req.token;
        jsonData.otp = req.otp;
        jsonData.proxy = req.proxyId;
        jsonData.username = jsonData.username ? jsonData.username : req.username;

        req.authUrl = authServer + "/login-username";
        req.jsonData = jsonData;

        next();

    }

    // tao user
    createUserName(req, res, next) {

        let jsonData = req.json_data ? req.json_data : req.paramS;
        jsonData.token = req.token;
        jsonData.otp = req.otp;
        jsonData.proxy = req.proxyId;
        jsonData.username = jsonData.username ? jsonData.username : req.username;

        req.authUrl = authServer + "/create-username";
        req.jsonData = jsonData;

        next();

    }

    // xác thực
    authorizeToken(req, res, next) {

        let jsonData = req.json_data ? req.json_data : req.paramS;
        jsonData.token = req.token;
        jsonData.otp = req.otp;
        jsonData.proxy = req.proxyId;
        jsonData.username = jsonData.username ? jsonData.username : req.username;

        req.authUrl = authServer + "/authorize-token";
        req.jsonData = jsonData;

        next();

    }

    // sửa user
    editUserName(req, res, next) {

        let jsonData = req.json_data ? req.json_data : req.paramS;
        jsonData.token = req.token;
        jsonData.otp = req.otp;
        jsonData.proxy = req.proxyId;
        jsonData.username = jsonData.username ? jsonData.username : req.username;

        req.authUrl = authServer + "/edit-username";
        req.jsonData = jsonData;

        next();

    }


    // lấy thông tin user
    getUsersInfo(req, res, next) {

        let jsonData = req.json_data ? req.json_data : req.paramS;
        jsonData.token = req.token;
        jsonData.otp = req.otp;
        jsonData.proxy = req.proxyId;
        jsonData.username = jsonData.username ? jsonData.username : req.username;

        req.authUrl = authServer + "/get-users-info";
        req.jsonData = jsonData;

        next();

    }

    // lấy một user
    getUserInfo(req, res, next) {

        let jsonData = req.json_data ? req.json_data : req.paramS;
        jsonData.token = req.token;
        jsonData.otp = req.otp;
        jsonData.proxy = req.proxyId;
        jsonData.username = jsonData.username ? jsonData.username : req.username;

        req.authUrl = authServer + "/get-user-info";
        req.jsonData = jsonData;

        next();

    }

    /**
     * Chuyển dữ liệu qua máy chủ khác
     * @param {*} req // req.authUrl, req.jsonData 
     */
    forward2Server(req, res) {
        //neu chua xac thuc server
        // console.log("new link:", req.method, req.authUrl);

        if (req.method === 'POST') {
            proxy.post(req.authUrl, { json: req.jsonData }
                , (error, resCallback, body) => {
                    if (error) {
                        console.log("Lỗi", error);
                        //trả nguyên kết quả
                        res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(
                            error
                            , (key, value) => {
                                if (value === null) { return undefined; }
                                return value
                            }
                            ,
                            2
                        ));
                    } else {
                        let jsonOut;
                        try{
                            jsonOut = JSON.parse(body);
                        }catch(e){
                            jsonOut = body;
                        }
                        //trả nguyên kết quả
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(
                            jsonOut
                            , (key, value) => {
                                if (value === null) { return undefined; }
                                return value
                            }
                            ,
                            2
                        ));
                    }

                })
        } else if (req.method === 'GET') {
            // chuyen doi req.jsonData sang req.paramS
            let paramS = req.authUrl;
            for (let key in req.jsonData){
                paramS += url_sep(paramS) + key+'='+req.jsonData[key]
            }

            proxy(paramS,
                (error, response, body) => {
                    if (error) {
                        console.log("Lỗi", error);
                        //trả nguyên kết quả
                        res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(
                            error
                            , (key, value) => {
                                if (value === null) { return undefined; }
                                return value
                            }
                            ,
                            2
                        ));
                    } else {
                        let jsonOut;
                        try{
                            jsonOut = JSON.parse(body);
                        }catch(e){
                            jsonOut = body;
                        }
                        //trả nguyên kết quả
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(
                            jsonOut
                            , (key, value) => {
                                if (value === null) { return undefined; }
                                return value
                            }
                            ,
                            2
                        ));
                    }
                });
        }

    }

}

module.exports = new ProxyTokenUtil()