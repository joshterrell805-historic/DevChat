var merge = require("./merge.njs");

module.exports = DevChat;

var defaultOptions =
{
   namespace: "/DevChat",
   messagesToKeep: 100
};

/**
 * The DevChat server. DevChat does not serve static files, that's for some
 *  other module. DevChat talks asychronously to clients for interactions
 *  including login, logout, sending messages, receiving messages, and chatroom
 *  management.
 */
function DevChat(server, userOptions)
{
   this.options = userOptions ?
      merge(defaultOptions, userOptions) : defaultOptions;

   this.sockets = server.of(this.options.namespace);
   this.sockets.on("connection", this.onConnect.bind(this));

   // for now there is only one retained storage lol
   // (it's funny because it's pointless to have DevChat be capable
   // having multiple instances run simultaneously if there's a shared
   // persistent storage)
   this.messages = require("./RetainedMessages.njs");
   this.messages.setMaxMessages(this.options.messagesToKeep);
   this.messages.load();

   // Create an instance of the User class bound to this DevChat instance. 
   this.User = require("./User.njs")(this);
}

// exit DevChat
// optionally, done is a callback for when devchat has completed quitting
DevChat.prototype.quit = function quit(done)
{
   this.messages.save(done);
}

// New socket.io connection.
DevChat.prototype.onConnect = function onConnect(socket)
{
   new this.User(socket);
}

// Start a new server if this module is being executed directly.
if (require.main === module)
{
   var sio = require("socket.io").listen(7002);
   var devChat = new DevChat(sio);

   process.on("SIGINT", function()
   {
      devChat.quit(process.exit);
   });

   // TODO make sure require from other module works..
}
