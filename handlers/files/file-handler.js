"use strict"
/**
 * Bộ xử lý đọc file trả về
 * 
 */
const fs = require('fs');
const mime = require('mime-types');
const systempath = require('path');

class Handler {

    getTemplates(req,res,next){
        let path = req.pathName
        let params = path.substring(path.lastIndexOf("/")+1);

        let fileRead = "templates/" + params.replace('/', systempath.sep);
        let contentType = 'image/jpeg';

        if (mime.lookup(fileRead)) contentType = mime.lookup(fileRead);

        fs.readFile(fileRead, { flag: 'r' }, function (error, data) {
            if (!error) {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(JSON.stringify(error));
            }
        });
    }

}

module.exports = new Handler()