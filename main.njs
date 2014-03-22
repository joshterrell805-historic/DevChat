var WS_PORT = 7002;
var MESSAGES_TO_KEEP = 100;

try
{
   var keptMessages
      = JSON.parse(require("fs").readFileSync("savedMessages.json"));
}
catch (ex)
{
   if (ex.code == "ENOENT")
   {
      keptMessages = [];
   }
   else
      throw ex;
}

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
      var message =
      {
         username: this.username,
         message: message,
         timestamp: Date.now()
      };

      // make room if there isn't enough room
      if (keptMessages.length == MESSAGES_TO_KEEP)
      {
         keptMessages.shift();
      }

      // store the message to be replayed upon login
      keptMessages.push(message);

      
      // emit message to all logged in sockets
      sio.sockets.in("loggedIn").emit("user message", message);
   }
}

Socket.prototype.login = function login(username)
{
   switch (username)
   {
      case  "josh":
      case  "test":
      case "test2":
         this.loggedIn = true;
         this.username = username;
         this.socket.join("loggedIn");
         this.socket.emit("login", {success: true, messages: keptMessages});
         break;
      default:
         this.socket.emit("login", {message: "Invalid username."});
   }
}

process.on("SIGINT", function()
{
   require("fs").writeFileSync("savedMessages.json",
      JSON.stringify(keptMessages));
   process.exit();
});
