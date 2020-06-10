"use strict"

/**
 * version 4.0
 * Ngày 23/09/2019
 * Sử dụng mã hóa SHA256 cùng client
 * let CryptoJS  = require("crypto-js"); 
 * 
 * 
 * version 2.0
 * Ngày 10/09/2019
 * 
 * + Thêm hàm băm sha256
 * Dùng để băm mật khẩu lưu vào csdl hoặc bộ nhớ
 * Dùng để kiểm tra mật khẩu đúng không
 * 
 * + Thêm hàm mã hóa dữ liệu bằng mật khẩu riêng
 * Nhập đúng mật khẩu sẽ giải mã được dữ liệu
 * Nếu không đúng mật khẩu thì dữ liệu không được giải mã
 * 
 * 
 * version 1.0
 * cuongdq
 * create 01/05/2019
 * 
 * Các thuật toán mã hóa, giải mã, ký và chứng thực
 * 
 */


//import CryptoJS from "crypto-js"; //cho web ES6
let CryptoJS = require("crypto-js");

//import SimpleCrypto from "simple-crypto-js"; //cho web ES6
const SimpleCrypto = require("simple-crypto-js").default; //cho nodejs ES5

//import NodeRSA from 'node-rsa';   //cho web ES6 Đang bị lỗi ở ionic4
const NodeRSA = require('node-rsa');                      //cho nodejs ES5


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

class RsaHandler {
    /**
     * RSA
     * Tạo cặp id và key sử dụng cho server hoặc client
     * Trả về đối tượng là {id, key}
     */
    generatorKeyPair() {
        let key = new NodeRSA({ b: 512 }, { signingScheme: 'pkcs1-sha256' });
        let publicKey = key.exportKey("public").replace('-----BEGIN PUBLIC KEY-----\n', '').replace('-----END PUBLIC KEY-----', '').replace(/[\n\r]/g, '');
        let privateKey = key.exportKey("private").replace('-----BEGIN RSA PRIVATE KEY-----\n', '').replace('-----END RSA PRIVATE KEY-----', '').replace(/[\n\r]/g, '');
        return { id: publicKey, key: privateKey }
    }


    /**
     * Import đối tượng key được tạo ở hàm generatorKeyPair() 
     * Vào đối tượng RSA để sử dụng cho các mục đích mã khóa, giải mã, 
     * chứng thực và xác thực dữ liệu
     * @param {*} keySave 
     * @param {*} keyType 
     */
    importKey(keySave, keyType) {
        let rsaKey = new NodeRSA(null, { signingScheme: 'pkcs1-sha256' });
        try {
            if (keyType === 'private') {
                rsaKey.importKey('-----BEGIN RSA PRIVATE KEY-----\n' + keySave.key + '\n-----END RSA PRIVATE KEY-----');
            } else {
                rsaKey.importKey('-----BEGIN PUBLIC KEY-----\n' + keySave.id + '\n-----END PUBLIC KEY-----');
            }
            return rsaKey;
        } catch (e) { }
        return null;
    }

    /**
     * Chứng thực dữ liệu bằng khóa riêng,
     * Khi dữ liệu cần phải ký, 
     * hàm này sẽ trả về chữ ký được chứng thực bằng khóa riêng
     * @param {*} textData 
     * @param {*} privateKey 
     */
    signText(textData, privateKey) {
        try {
            let rsaKey = this.importKey({ key: privateKey }, 'private')
            if (rsaKey) {
                return rsaKey.sign(textData, 'base64', 'utf8');
            }
        } catch (e) { }
        return null;
    }

    /**
     * Khi truyền dữ liệu đi đến người nhận thì dữ liệu sẽ được truyền đi đầy đủ
     * Nhưng để chứng thực dữ liệu này có bị sửa đổi không (nguyên gốc từ người gửi)
     * Thì lấy khóa công khai của người gửi giải chứng thực (hoặc xác thực lại)
     * đưa dữ liệu nhận được, chữ ký đã chứng thực ở hàm sign và khóa công khai của người gửi
     * Sẽ biết được dữ liệu của người gửi ko bị thay đổi
     * 
     * Sử dụng hàm này để verify, hoặc sử dụng để ghi vào blockchain
     * @param {*} textData 
     * @param {*} signature 
     * @param {*} publicKey 
     */
    verifyText(textData, signature, publicKey) {
        try {
            let rsaKey = this.importKey({ id: publicKey }, 'public')
            if (rsaKey) {
                return rsaKey.verify(textData, signature, 'utf8', 'base64');
            }
        } catch (e) { }
        return false;
    }

    /**
     * Mã hóa dữ liệu,
     * 
     * Có một dữ liệu, muốn mã hóa bằng khóa công khai hoặc khóa riêng
     * Ta cứ việc gọi hàm này sẽ mã hóa được dữ liệu gửi đến người sở hữu cặp khóa đó
     * 
     * Thông thường dữ liệu mã hóa bằng khóa công khai được sử dụng để truyền lên máy chủ mật khẩu
     * 
     * Người nhận phải có khóa riêng mới giải mã được, nếu không thì thôi
     * 
     * @param {*} obj 
     * @param {*} privateKey 
     * @param {*} publicKey 
     */
    encryptObjectRSA(obj, privateKey, publicKey) {
        try {
            let rsaKey = this.importKey({ id: publicKey, key: privateKey }, (privateKey ? 'private' : 'public'))
            if (rsaKey) {
                if (privateKey) {
                    return rsaKey.encryptPrivate(JSON.stringify(obj), 'base64', 'utf8');
                } else {
                    return rsaKey.encrypt(JSON.stringify(obj), 'base64', 'utf8');
                }
            }
        } catch (e) { }
        return null;
    }

    /**
     * Giải mã dữ liệu
     * Thông thường sử dụng nó để giải mã mật khẩu mà người dùng gửi lên máy chủ
     * 
     * @param {*} text64 
     * @param {*} privateKey 
     * @param {*} publicKey 
     */
    decryptObjectRSA(text64, privateKey, publicKey) {
        try {
            let rsaKey = this.importKey({ id: publicKey, key: privateKey }, (privateKey ? 'private' : 'public'))
            if (rsaKey) {
                if (privateKey) {
                    return JSON.parse(rsaKey.decrypt(text64, 'utf8'));
                } else {
                    return JSON.parse(rsaKey.decryptPublic(text64, 'utf8'));
                }
            }
        } catch (e) { }
        return null;
    }

    /**
     *  
     * Mã hóa dữ liệu bằng thuật toán cryto
     * Với mật khẩu mã hóa người dùng tự đặt,
     * 
     * 
     * @param {*} textData 
     * @param {*} password 
     */
    encryptTextCypto(textData, password) {
        let simpleCrypto = new SimpleCrypto(password);
        return simpleCrypto.encrypt(textData);
    }

    /**
     * 
     * giải mã dữ liệu bằng crypto
     * 
     * @param {*} strEncrypted 
     * @param {*} password 
     */
    decryptTextCrypto(strEncrypted, password) {
        try {
            let simpleCrypto = new SimpleCrypto(password);
            return simpleCrypto.decrypt(strEncrypted);
        } catch (e) { }
        //trường hợp giải mã bị lỗi thì trả về một số random nhé
        return "KX2TTPuf/WHdxeDeGSyFzpNQLRmnrkdWaF55XRfkYSUokJDR/PxHxIYswsjNYiD454rHScaEmBXszrYnou/eeQ=="; //số ngẫu nhiên
    }

    /**
     * Mã hóa một chiều sha256
     * Cho chuỗi bất kỳ, kể cả unicode
     * 
     * Sử dụng để băm chuỗi mật khẩu lưu vào cơ sở dữ liệu
     * 
     * @param {*} unicodeData 
     */
    sha256(unicodeData) {
        var words = CryptoJS.SHA256(unicodeData);
        var base64 = CryptoJS.enc.Base64.stringify(words);
        return base64;
    }


    /**
     * Hàm chuyển đổi utf8 --> Hex
     * @param str 
     */
    Utf8toHex(utf8) {
        var words = CryptoJS.enc.Utf8.parse(utf8);
        var hex = CryptoJS.enc.Hex.stringify(words);
        return hex;
    }


    /**
     * Chuyển đổi hex --> utf8
     * @param hex 
     */
    HextoUtf8(hex) {
        var words = CryptoJS.enc.Hex.parse(hex);
        var utf8 = CryptoJS.enc.Utf8.stringify(words);
        return utf8;
    }


    /**
     * Hàm chuyển đổi utf8 --> base64
     * @param str 
     */
    Utf8toBase64(utf8) {
        var words = CryptoJS.enc.Utf8.parse(utf8);
        var base64 = CryptoJS.enc.Base64.stringify(words);
        return base64;
    }

    /**
     * Chuyển đổi base64 --> utf8
     * @param base64 
     */
    Base64toUtf8(base64) {
        var words = CryptoJS.enc.Base64.parse(base64);
        var utf8 = CryptoJS.enc.Utf8.stringify(words);
        return utf8;
    }

}

module.exports = new RsaHandler()



