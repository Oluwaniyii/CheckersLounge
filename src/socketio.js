const { Server: SocketIOServer } = require("socket.io");

function handleSocketConnection(socket) {
  console.log("client socket connected");
}

module.exports = function (httpServer) {
  const io = new SocketIOServer(httpServer);
  io.on("connection", handleSocketConnection);
};
