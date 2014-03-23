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
