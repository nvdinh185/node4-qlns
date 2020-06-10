"use strict"
var svgCaptcha = require('svg-captcha');

class CaptchaHandler {

    /**
     * Tao 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createCaptcha(req,res,next){
        req.captcha = svgCaptcha.create({
            size: 4, // size of random string
            ignoreChars: '0o1ilIO', // filter out some characters like 0o1ilIO
            noise: 3, // number of noise lines
            color: true, // characters will have distinct colors instead of grey, true if background option is set
            background: '#ffffff' //'#e0f0f1' // background color of the svg image
        });
        //Trả về text này luu lai:
        //req.captcha.text; 

        //và dữ liệu đường dẫn svg này tra cho web
        //req.captcha.data;

        next(); //chuyen phien tiep
    }

    /**
     * tra ket qua captcha + token mã hóa text của captcha
     * @param {*} req 
     * @param {*} res 
     */
    getCaptcha (req, res) {
        //console.log('req.captcha?',req.captcha);
        res.type('svg');
        res.status(200).send(req.captcha.data);
    }
}

module.exports =  new CaptchaHandler()