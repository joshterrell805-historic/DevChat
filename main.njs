var WS_PORT = 7002;
var sio = require("socket.io").listen(WS_PORT);

sio.on("connection", connect);

function connect(socket)
{
   new Socket(socket);
}

function Socket(socket)
{
   this.socket = socket;
   this.loggedIn = false;

   socket.on("user message", this.receiveMessage.bind(this));
   socket.on("login", this.login.bind(this));
}


Socket.prototype.receiveMessage = function receiveMessage(message)
{
   // only emit messages from sockets that are logged in
   if (this.loggedIn)
   {
      // emit message to all logged in sockets
      sio.sockets.in("loggedIn").emit(
         "user message",
         {username: this.username, message: message}
      );
   }
}

Socket.prototype.login = function login(username)
{
   switch (username)
   {
      case "josh":
      case "test":
         this.loggedIn = true;
         this.username = username;
         this.socket.join("loggedIn");
         this.socket.emit("login", {success: true});
         break;
      default:
         this.socket.emit("login", {message: "Invalid username."});
   }
}
