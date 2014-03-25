var DevChat = require("./DevChat.njs");

var sio = require("socket.io").listen(7002);
var devChat = new DevChat(sio);

process.on("SIGINT", function()
{
   devChat.quit(process.exit);
});
