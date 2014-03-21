var WS_PORT = 7002;
var sio = require("socket.io").listen(WS_PORT);

sio.on("connection", connect);

function connect(socket)
{
   new Socket(socket);
}

var connectionId = 0;

function Socket(socket)
{
   this.socket = socket;
   this.username = ++connectionId;

   socket.on("user message", this.receiveMessage.bind(this));
}


Socket.prototype.receiveMessage = function receiveMessage(data)
{
   sio.sockets.emit("user message", {username: this.username, message: data});
}

