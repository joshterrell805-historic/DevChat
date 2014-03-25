/**
 * The DevChat server. DevChat does not serve static files, that's for some
 *  other service. DevChat talks asychronously to clients for interactions
 *  including login, logout, sending messages, receiving messages, and chatroom
 *  management using socket.io.
 *
 *  @param server the socket.io server instance
 *  @param userOptions (optional) the user options to merge with defaultOptions
 *   as the configuration to use for this server. See defaultOptions.
 */
module.exports = DevChat;

/**
 * Quit the sever performing any cleanup necessary.
 *
 * @param done callback called when devchat has finished cleaning up.
 */
DevChat.prototype.quit = quit;

/**
 * The default options for DevChat.
 */
var defaultOptions =
{
   // the socket.io namespace to be used for this application
   namespace: "/DevChat",

   // the number of recent messages to be retained and played back to clients
   //  upon login
   messagesToKeep: 100,

   // the authentication method to use. This method is called when a user
   //  attempts to login and determines whether or not the provided credentials
   //  are valid.
   //
   // @param username string username provided by user
   // @param passwordHash string passwordHash TODO
   // @param successCallback the callback to call if the provided
   //  credentials are valid
   // @param failCallback the callback to call if the provided credentials are
   //  invalid. An optional message may be passed as the first argument as
   //  the reason for failure, otherwise a default failure message is used.
   authenticate: require("./UserNameAuth.njs"),

   // The fail message used for when a user fails authentication and the
   //  authentication function doesn't pass a message to the fail callback.
   authenticateDefaultFailMessage: "Invalid credentials"
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


var merge = require("./merge.njs");

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

   this.userFactory = new (require("./UserFactory.njs"))(this);

   // An array of all the currently logged in users. Can be multiple entries
   // per user if user is logged in multiple places. It is up to the view
   // to decide how to display multiple logins.
   this.loggedInUsers = [];
}

// New socket.io connection.
DevChat.prototype.onConnect = onConnect;

function quit(done)
{
   this.messages.save(done);
}

function onConnect(socket)
{
   this.userFactory.newInstance(socket);
}
