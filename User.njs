/**
 * User is a wrapper socket.io's socket. It holds user information and
 *  is a collection of callbacks for devChat-specific socket.io messages.
 */

module.exports = function(devChat)
{
   // An array of all the currently logged in users. Can be multiple entries
   // per user if user is logged in multiple places. It is up to the client
   // to decide how to display multiple logins.
   var loggedInUsers = [];

   function User(socket)
   {
      this.socket = socket;
      this.loggedIn = false;

      socket.on("user message", this.receiveMessage.bind(this));
      socket.on("login", this.login.bind(this));
      socket.on("disconnect", this.disconnect.bind(this));
   }

   // Receive a message from a user
   User.prototype.receiveMessage = function receiveMessage(messageText)
   {
      messageText = messageText.trim();

      // Ignore all messages from users that aren't logged in.
      // Ignore all completely whitespace messages
      if (this.loggedIn && messageText.length)
      {
         var message =
         {
            username: this.username,
            message: messageText,
            timestamp: Date.now()
         };
         
         devChat.messages.add(message);

         // emit message to all logged in sockets
         devChat.sockets.in("loggedIn").emit("user message", message);
      }
   }

   // Receive a login request from a user
   User.prototype.login = function login(username)
   {
      switch (username)
      {
         case   "test":
         case   "josh":
         case   "joel":
         case "carson":
         case   "mike":
         case "andrew":
         case  "kevin":
         {
            devChat.sockets.in("loggedIn").emit("login notification", 
               {
                  username: username,
                  isOnly: loggedInUsers.indexOf(username) == -1,
               }
            );

            loggedInUsers.push(username);

            this.loggedIn = true;
            this.username = username;
            this.socket.join("loggedIn");

            this.socket.emit("login",
               {
                  success: true,
                  messages: devChat.messages.getAll(),
                  users: loggedInUsers,
               }
            );


            break;
         }
         default:
            this.socket.emit("login", {message: "Invalid username."});
      }
   }

   // Connection to user lost
   User.prototype.disconnect = function disconnect()
   {
      if (this.loggedIn)
      {
         this.logout();
      }
   }

   // Log out the user.
   // This should only be called on logged in users.
   User.prototype.logout = function logout()
   {
      // TODO I feel gross about having both a room and a variable for logged in
      //  this could be a source of future bugs.
      this.loggedIn = false;
      this.socket.leave("loggedIn");

      var index = loggedInUsers.indexOf(this.username);

      if (index === -1)
      {
         throw new Exception(
            "User is logged in but is not in logged in users."
         );
      }
      else
      {
         loggedInUsers.splice(index, 1);

         devChat.sockets.in("loggedIn").emit("logout notification", 
            {
               username: this.username,
               isOnly: loggedInUsers.indexOf(this.username) == -1,
            }
         );
      }
   }

   return User;
};

