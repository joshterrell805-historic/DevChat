$(document).ready(
   function()
   {
      window.devChatController = new DevChatController();
   }
);

function DevChatController()
{
   // the socket.io namespace that the DevChat server uses.
   this.namespace = "/DevChat";

   this.socket = io.connect(this.namespace);

   this.socket.on("user message", this.receiveMessage.bind(this));
   this.socket.on("login", this.receiveLoginResponse.bind(this));
   this.socket.on("login notification", this.loginNotification.bind(this));
   this.socket.on("logout notification", this.logoutNotification.bind(this));
}

/////////////////////// messages to server ////////////////////////////

// Send a login attempt to the DevChat server.
DevChatController.prototype.login = function login(username)
{
   this.socket.emit("login", username);
}

// send a chat message
DevChatController.prototype.sendMessage = function sendMessage(messageText)
{
   this.socket.emit("user message", messageText);
}


/////////////////////// messages from server ///////////////////////////

// receive a chat message
DevChatController.prototype.receiveMessage = function receiveMessage(message)
{
   window.devChatView.displayMessage(message);
};

// receive a response on whether login was successful
DevChatController.prototype.receiveLoginResponse =
function receiveLoginResponse(data)
{
   // The user passed authentication
   if (data.success)
   {
      this.users = data.users;

      window.devChatView.loginSuccess();

      data.messages.forEach(
         window.devChatView.displayMessage.bind(window.devChatView)
      );
   }

   // The user failed authentification
   else
   {
      window.devChatView.loginFailure(data.message);
   }
};

// The server informed us that someone logged in.
DevChatController.prototype.loginNotification =
function loginNotification(data)
{
   this.users.push(data.username);

   if (data.isOnly)
   {
      window.devChatView.userLogin(data.username);
   }
};

// The server informed us that someone logged out.
DevChatController.prototype.logoutNotification =
function logoutNotification(data)
{
   var index = this.users.indexOf(data.username);
   if (index == -1)
   {
      throw new Exception("User not in user list logged out.");
   }

   this.users.splice(index, 1);

   if (data.isOnly)
   {
      window.devChatView.userLogout(data.username);
   }
};
