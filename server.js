const express = require('express');
const app = express();
const fs = require('fs');
const os = require('os');

function main(isHttp, isHttps) {

  // Web khai báo tĩnh - test local
  app.use(express.static(__dirname + '/client/www'));
  app.use("/documents", express.static(__dirname + '/documents'));
  // đường dẫn chính
  app.use("/bsc-kpi", express.static(__dirname + '/client/www'));
  app.use("/bsc-kpi/documents", express.static(__dirname + '/documents'));
  //app.use("/bsc-kpi", express.static(__dirname + '/platforms/browser/www'));

  // Chống tấn công tần suất truy cập api lớn
  app.use(require('./ddos/ddos-config').express('ip', 'path'));

  // xử lý CORS handle
  app.use(require('./handlers/cors-handler').cors);

  // Quản lý các chức năng của máy chủ resource của bsc-kpi
  app.use('/bsc-kpi/db', require('./routes/bsc-kpi/bsc-kpi-route'));

  //ham tra loi cac dia chi khong co
  //The 404 Route (ALWAYS Keep this as the last route)
  app.all('*', (req, res) => {
    //gui trang thai bao noi dung tra ve
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Xin lỗi trang bạn muốn tìm không tồn tại!</h1>Địa chỉ ip của bạn là : ' + req.clientIp);
  });

  if (isHttp) {
    // For http
    const httpServer = require('http').createServer(app);
    const portHttp = process.env.PORT || isHttp;
    httpServer.listen(portHttp, () => {
      console.log("Server HTTP (" + os.platform() + "; " + os.arch() + ") is started with PORT: "
        + portHttp
        + "\n tempdir: " + os.tmpdir()
        + "\n " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      );
    });
  }

  if (isHttps) {
    // For https
    const privateKey = fs.readFileSync('cert/bsc-kpi-private-key.pem', 'utf8');
    const certificate = fs.readFileSync('cert/bsc-kpi-certificate.pem', 'utf8');
    const credentials = {
      key: privateKey,
      cert: certificate,
      honorCipherOrder: true,
      ciphers: [
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'DHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-SHA256',
        'DHE-RSA-AES128-SHA256',
        'ECDHE-RSA-AES256-SHA384',
        'DHE-RSA-AES256-SHA384',
        'ECDHE-RSA-AES256-SHA256',
        'DHE-RSA-AES256-SHA256',
        'HIGH',
        '!aNULL',
        '!eNULL',
        '!EXPORT',
        '!DES',
        '!RC4',
        '!MD5',
        '!PSK',
        '!SRP',
        '!CAMELLIA'
      ].join(':')
    };
    const portHttps = process.env.PORT || isHttps;
    const httpsServer = require('https').createServer(credentials, app);

    httpsServer.listen(portHttps, () => {
      console.log("Server HTTPS (" + os.platform() + "; " + os.arch() + ") is started with PORT: "
        + portHttps
        + "\n tempdir: " + os.tmpdir()
        + "\n " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      );
    });

  }

}

//=false or port number >1000
const port = process.env.PORT || 9239;

let type = 'http';
process.argv.slice(2).forEach((arg) => {
  switch (arg) {
    case 'https':
    case '--https':
      type = 'https';
      break;
  }
});

if (type === 'https') {
  main(false, port);
} else {
  main(port, false);
}