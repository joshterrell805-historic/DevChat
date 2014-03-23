/**
 * User is a wrapper socket.io's socket. It holds user information and
 *  is a collection of callbacks for devChat-specific socket.io messages.
 */

// TODO document.. it's a bit too early for that.. I don't know if I'll keep
// this model.. but this serves as a reminder.
module.exports = function(devChat)
{
   function User(socket)
   {
      this.socket = socket;
      this.loggedIn = false;

      socket.on("user message", this.receiveMessage.bind(this));
      socket.on("login", this.login.bind(this));
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
            this.loggedIn = true;
            this.username = username;
            this.socket.join("loggedIn");
            this.socket.emit("login",
               {success: true, messages: devChat.messages.getAll()}
            );
            break;
         default:
            this.socket.emit("login", {message: "Invalid username."});
      }
   }

   return User;
};

