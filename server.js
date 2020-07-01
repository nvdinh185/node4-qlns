const express = require('express');
const app = express();

function main(isHttp) {

  // Web khai báo tĩnh - test local
  app.use(express.static(__dirname + '/client/www'));
  // đường dẫn chính
  app.use("/bsc-kpi", express.static(__dirname + '/client/www'));

  // xử lý CORS handle
  app.use(require('./handlers/cors-handler').cors);

  // Quản lý các chức năng của máy chủ resource của bsc-kpi
  app.use('/bsc-kpi/db', require('./routes/bsc-kpi/bsc-kpi-route'));

  //ham tra loi cac dia chi khong co
  app.all('*', (req, res) => {
    //gui trang thai bao noi dung tra ve
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Xin lỗi trang bạn muốn tìm không tồn tại!</h1>Địa chỉ ip của bạn là : ' + req.clientIp);
  });

  if (isHttp) {
    const httpServer = require('http').createServer(app);
    const portHttp = isHttp;
    httpServer.listen(portHttp, () => {
      console.log("Server HTTP is started with PORT: "
        + portHttp);
    });
  }

}

const port = process.env.PORT || 9239;

main(port);