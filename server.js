const express = require('express');
const path = require('path');
const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

io.on('connection', socket => {

  socket.on("Client-send-data", () => {
    io.sockets.emit("Server-send-data");
  });

  socket.on("client-job-role-done", () => {
    io.sockets.emit("server-job-role-done");
  });

  socket.on("client-staff-done", () => {
    io.sockets.emit("server-staff-done");
  });

});

function main(isHttp) {

  app.use(express.static(__dirname + '/client/www'));

  // xử lý CORS handle
  app.use(require('./handlers/cors-handler').cors);

  // Đường dẫn truy cập server
  app.use('/qlns/db', require('./routes/route'));

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/www', 'index.html'));
  });

  if (isHttp) {
    const portHttp = isHttp;
    httpServer.listen(portHttp, () => {
      console.log("Server HTTP is started with PORT: "
        + portHttp);
    });
  }

}

const port = process.env.PORT || 9239;

main(port);