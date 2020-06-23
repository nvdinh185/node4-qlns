"use strict"
/**
 * Bộ xử lý đọc file trả về
 * 
 */
const fs = require('fs');
const mime = require('mime-types');

class Handler {

    getTemplates(req, res, next) {
        let fileRead = "templates/" + req.params['0'];
        let contentType = 'image/jpeg';
        // console.log(fileRead);
        if (mime.lookup(fileRead)) contentType = mime.lookup(fileRead);

        fs.readFile(fileRead, { flag: 'r' }, function (error, data) {
            if (!error) {
                res.writeHead(200, { 'Content-Type': contentType });
                // console.log(data.length);
                res.end(data);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(JSON.stringify(error));
            }
        });
    }

}

module.exports = new Handler()