"use strict"
/**
 * ver 2.0 - tạo mới theo svg otp, pass ...
 * Lớp này tạo ra các hàm cho phép
 * Tự tạo ra token từ một khóa riêng
 * 
 */

//Thực hiện mã hóa token theo chuẩn jwt
const jwt = require('jsonwebtoken');
//thực hiện lấy token trên url
const url = require('url');

const arrObj = require('../../utils/array-object');
const sendUtil = require('../../utils/sending-util');

//Mật khẩu để ký xác nhận token;
const pass_sign_token = 'qld-sign-20200111';

//lưu tất cả các session đã sign, verify bởi hệ thống kể từ khi hệ thống khởi động
//lưu ds token đã cấp
var aliveSession = [];

/**
* dữ liệu vào
* req.username (chứa thông tin user cần truyền cho client)
* req.keyPair (được lấy từ csdl service_keys)
* pass_admin
* pass_sign_token
* 
* Ký trả về token
* 
* @param {*} req biến yêu cầu vào
* @param {*} expires  thời hạn hết hiệu lực - milisecond hoặc 1d, 1h,
*/
const sign = (req, expires) => {

  //ký thêm thời gian ký vào
  let timeSign = Date.now();

  let token = jwt.sign({
    username: req.username, // có user
    time_sign: timeSign     // lấy thời gian
  }
    ,
    (req.otp || '') + pass_sign_token + timeSign //+ (req.proxy || req.clientDevice)
    ,
    {
      expiresIn: expires ? expires : 60000 // default 1 phút
      //tính bằng mili giây, hoặc '2days' hoặc '10h', hoặc '7d'
    }
  );

  // console.log('sign x', timeSign, expires ? expires : 60000, (req.otp ? req.otp : '') + pass_sign_token + timeSign + (req.proxy ? req.proxy : ( req.clientDevice)));

  return token; //trả về token cho client
}

class TokenUtil {

  /**
   * dữ liệu đầu vào là req.token được lấy ở đoạn getToken
   * Dữ liệu đầu ra là req.user hoặc req.error
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  verify(req, res, next) {

    // console.log('token',req.token);

    let userToken;
    try {
      userToken = jwt.decode(req.token);
    } catch (e) { }

    let timeSign = userToken ? userToken.time_sign : undefined;

    jwt.verify(
      req.token
      ,
      (req.otp || '') + pass_sign_token + timeSign //+ (req.proxy || req.clientDevice)
      ,
      (err, decoded) => {
        if (err) {
          console.log('Lỗi xác thực:', err.message);
          // console.log('ER-KEY---> ', (req.otp ? req.otp : '') + pass_sign_token + timeSign + (req.proxy ? req.proxy : ( req.clientDevice)));
          req.error = err.message;  // lỗi tường minh
        } else {
          // console.log('OK-KEY---> ', (req.otp ? req.otp : '') + pass_sign_token + timeSign + (req.proxy ? req.proxy : ( req.clientDevice)));
          req.user = decoded;       // trả được username
          // lấy thông tin user trong csdl
        };
        if (next) next(); // có lỗi thì không có req.user
      })
  }


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
     * req.username //token cap cho username
     * req.captcha  //yeu cau xac thuc otp 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
  async requestNewToken(req, res, next) {

    // console.log('den day', req.username, req.captcha);

    if (req.username && req.captcha) {

      req.otp = req.captcha.text;      // Gán mã OTP cho chuỗi bí mật trong token

      req.token = sign(req, '300000'); // Token có hiệu lực trong vòng 5 phút

      let isCaptcha = false;

      let email = arrObj.getEmailFromText(req.username)[0];
      let phone = arrObj.getPhoneFromText(req.username)[0];

      try {
        if (email === req.username) {
          // trường hợp, username là email thì gửi email yêu cầu nhận otp để nhập vào đây để xác nhận (không gửi captcha)
          await sendUtil.sendEmail(email, 'Mã OTP kích hoạt', 'Mã OTP kích hoạt của bạn là: ' + req.otp);
        } else if (phone === req.username) {
          // trường hợp, username là số điện thoại thì thử gửi sms nếu thành công thì trả về ô nhập otp và message
          await sendUtil.sendSms(phone, 'Mã OTP kích hoạt của bạn là: ' + req.otp);
        } else { // trường hợp khác user bất kỳ
          isCaptcha = true;
        }
      } catch (e) {
        // trường hợp số điện thoại nhưng ko gửi sms được thì trả captcha và phải yêu cầu xác thực nữa
        // console.log('Lỗi send Util:', e);
        isCaptcha = true;
      }


      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(JSON.stringify({
        status: req.next_status //'NEW-USER' | 'LOGIN-USER'
        , token: req.token
        , username: req.username
        , captcha: isCaptcha ? req.captcha.data : undefined //svg ảnh của otp
        , data: req.user //thông tin user đã tồn tại cần reset hoặc thay đổi thông tin
        , message: !isCaptcha ? 'Mã OTP đã gửi đến ' + (email ? 'email: ' : 'số điện thoại: 0') + req.username : undefined
      }
        , (key, value) => {
          if (value === null) { return undefined; }
          return value
        }
        ,
        2
      ));

    } else {
      res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'NO-USERNAME', message: 'User không có thực' }));
    }
  }


  /**
   * Tạo token của captcha
   * Để xác thực captcha thì: 
   * get/post--->/authorize-token?otp=xxx&token=yyy
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  createTokenCaptcha(req, res, next) {

    if (req.captcha) {

      req.username = "captcha";           // giả lập một user là captcha
      req.otp = req.captcha.text;         // gán mã OTP cho chuỗi bí mật trong token

      //console.log('otp', req.otp);

      // tạo token phù hợp với mã OTP đã mã hóa, 
      req.token = sign(req, 180000);
      //hiệu lực trong 3 phút

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(JSON.stringify({
        token: req.token
        , captcha: req.captcha.data // svg ảnh của otp
      }
        , (key, value) => {
          if (value === null) { return undefined; }
          return value
        }
        ,
        2
      ));

    } else {
      res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'NO-USERNAME', message: 'User không có thực' }));
    }
  }

  /**
   * Từ dữ liệu vào là username 
   * và đã nhập pass, có đủ thông tin trong csdl
   * thì tạo token với thời hạn dài hơn
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  createToken365(req, res, next) {

    if (req.username) {

      req.otp = undefined; //reset otp de khong ma hoa token

      req.token = sign(req, '365d');
      //token có thời hạn 365 ngày
      aliveSession.push(req.token);

      next();

    } else {
      res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'NO-USERNAME', message: 'User không có thực' }));
    }
  }

  /**
   * Kiểm tra token có trong bộ đệm không, kể từ khi reset server?
   * req.token
   * Trước khi verify cần yêu cầu xem token có tồn tại ko? nếu ko thì trả lỗi luôn
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  checkAliveSession(req, res, next) {
    let idx = aliveSession.findIndex(x => x === req.token);
    if (idx >= 0) {
      next()
    } else {
      res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'TOKEN-RESET', message: 'Token đã reset rồi' }));
    }
  }

  /**
   * Ham lay users public
   * req.publicUsers
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  getPublicUser(req, res, next) {
    next()
  }

}

module.exports = new TokenUtil()