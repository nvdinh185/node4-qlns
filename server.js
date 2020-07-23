const express = require('express');
const path = require('path');
const app = express();

function main(isHttp) {

  app.use(express.static(__dirname + '/client/www'));
  
  // xử lý CORS handle
  app.use(require('./handlers/cors-handler').cors);

  // Đường dẫn truy cập server
  app.use('/bsc-kpi/db', require('./routes/bsc-kpi/bsc-kpi-route'));

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/www', 'index.html'));
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