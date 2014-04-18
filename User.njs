/**
 * User is a wrapper around socket.io's socket. It holds user information and
 *  is a collection of callbacks for devChat-specific socket.io messages.
 *
 * This module includes all the severside server-user interactions.
 *
 * An instance of User shouldn't be created directly, rather it should be
 *  created in a UserFactory.
 */

/**
 * Create a new user bound to the newly connected socket.io socket.
 *
 * @param socket the socket.io that the user connected with.
 */
module.exports = User;

// Note: All the follwing methods are automatically called when a user interacts
//  with the server. They are documented, but shouldn't be called directly.
//
// Note: the *_signal variable holds the socket.io event name used by
//  on() and emit() on both serverside and client side.

/**
 * Receive a message from a user.
 *
 * @param messageText the string value of the user's message.
 */
User.prototype.receiveMessage = receiveMessage;
User.prototype.receiveMessage_signal = "user message";

/**
 * Receive a login request from a user.
 *
 * calls devChat.options.authenticate(username, passwordHash, successCallback,
 *  failureCallback)
 *
 * @param username the string username entered by the user.
 * TODO passwordHash
 */
User.prototype.login = login;
User.prototype.login_signal = "login";

/**
 * Receive a "ready" signal from the client.
 *
 * After logging in, the client must load a new page. After the client has
 *  loaded this page, it will emit this message to the server so that the
 *  server knows the client is ready to receive notifications and messages
 *  from the server.
 * 
 * At this point, the server responds with the messages and logged in users
 *  using the same signal.
 */
User.prototype.clientReady = clientReady;
User.prototype.clientReady_signal = "readyForData";

/**
 * The connection to the user was lost.
 */
User.prototype.disconnect = disconnect;

/**
 * Log out the user.
 * This should only be called if the user is logged in.
 */
User.prototype.logout = logout;

/**
 * loggedIn is a boolean getter/setter. The setter adds or removes the
 * client to/from the "loggedIn" socket.io room.
 */
Object.defineProperty(User.prototype, "loggedIn", {
   get: function getLoggedIn()
   {
      return this.devChat.sockets.clients("loggedIn").indexOf(this.socket)
         != -1;
   },

   set: function setLoggedIn(loggedIn)
   {
      if (loggedIn)
      {
         this.socket.join("loggedIn");
      }
      else
      {
         this.socket.leave("loggedIn");
      }
   },
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function User(socket)
{
   this.socket = socket;
   this.loggedIn = false;

   socket.on(this.receiveMessage_signal, this.receiveMessage.bind(this));
   socket.on(this.login_signal, this.login.bind(this));
   socket.on(this.clientReady_signal, this.clientReady.bind(this));
   socket.on("disconnect", this.disconnect.bind(this));
}

function receiveMessage(messageText)
{
   // Ignore all messages from users that aren't logged in.
   // Ignore all completely whitespace messages.
   if (this.loggedIn && messageText.trim().length)
   {
      var message =
      {
         username: this.username,
         message: messageText,
         timestamp: Date.now()
      };
      
      this.devChat.messages.add(message);

      // emit message to all logged in sockets
      //
      // TODO this is a one chatroom per devchat instance method of
      // sending messages. Supporting multiple chatrooms is a good idea
      // ..possibly.
      this.devChat.sockets.in("loggedIn").emit("user message", message);
   }
}


function login(credentials)
{
   // This needs to be stored before success unless we require the authSuccess
   //  to pass the username.. but that seems error-prone.
   // It is deleted at authFailure.
   this.username = credentials.username;

   if (this.loggedIn)
   {
      authFailure.call(this, 'Error: You are already logged in.');
   }
   else
   {
      this.devChat.options.authenticate(
         this.username, null, authSuccess.bind(this), authFailure.bind(this)
      );
   }
}

// callback for successful authentication -- bound to user
function authSuccess()
{
   // Tell everyone else that is logged in that this user logged in
   this.devChat.sockets.in("loggedIn").emit("login notification", {
         username: this.username,

         // Is this the user's only connection?
         isOnly: this.devChat.loggedInUsers.indexOf(this.username) == -1,
   });

   this.devChat.loggedInUsers.push(this.username);

   this.loggedIn = true;

   // Tell this user that he logged in successfully.
   this.socket.emit("login", {
         success: true
   });
}

// callback for failed authentication -- bound to user
function authFailure(message)
{
   delete this.username;

   message = message === undefined ?
      this.devChat.options.authenticateDefaultFailMessage : message;

   // Let the user know they failed authenticating.
   this.socket.emit("login", {success: false, message: message});
}

function disconnect()
{
   if (this.loggedIn)
   {
      this.logout();
   }
}

function logout()
{
   this.loggedIn = false;

   var index = this.devChat.loggedInUsers.indexOf(this.username);

   if (index === -1)
   {
      throw new Error(
         "User is logged in but is not in logged in users."
      );
   }
   else
   {
      this.devChat.loggedInUsers.splice(index, 1);

      this.devChat.sockets.in("loggedIn").emit("logout notification", {
         username: this.username,

         // was this the user's only connection?
         isOnly: this.devChat.loggedInUsers.indexOf(this.username) == -1,
      });
   }
}

function clientReady()
{
   if (this.loggedIn)
   {
      this.socket.emit(this.clientReady_signal, {
         messages: this.devChat.messages.getAll(),
         users: this.devChat.loggedInUsers,
      });
   }
}

