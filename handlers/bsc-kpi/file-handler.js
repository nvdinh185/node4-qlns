"use strict"

const fs = require('fs');
const mime = require('mime-types');

class FileHandler {

    getTemplates(req, res, next) {
        let fileRead = "templates/" + req.params['0'];
        let contentType;
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

module.exports = new FileHandler()