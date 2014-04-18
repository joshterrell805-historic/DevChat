(function()
{

function Chat()
{
   window.socket.on('user message', this.receiveMessage.bind(this));
   window.socket.on('login notification', this.loginNotification.bind(this));
   window.socket.on('logout notification', this.logoutNotification.bind(this));
   window.socket.on('readyForData', this.receiveInitialData.bind(this));
   $.addStylesheet('chatPage.css');
   $.get('chatPage.html', function(html){
      $(document.body).append(html);

      // Change gear image on hover.
      $("#side-bar .settings-icon.normal").hover(function()
      {
         $("#side-bar .settings-icon.hover").css("display", "block");
      });
      $("#side-bar .settings-icon.hover").hover(null,
      function()
      {
         $("#side-bar .settings-icon.hover").css("display", "none");
      });
   });
   window.socket.emit('readyForData');
}

Chat.prototype.receiveMessage = function receiveMessage(message)
{
   this.messages.push(message);
};

Chat.prototype.loginNotification = function loginNotification(response)
{
   this.users.push(response.username);

   // if (response.isOnly)
   // {
   //    window.devChatView.userLogin(data.username);
   // }
};

Chat.prototype.logoutNotification = function logoutNotification(response)
{
   var index = this.users.indexOf(response.username);
   if (index == -1)
   {
      throw new Exception("User not in user list logged out.");
   }

   this.users.splice(index, 1);

   // if (response.isOnly)
   // {
   //    window.devChatView.userLogout(data.username);
   // }
};

Chat.prototype.receiveInitialData = function receiveInitialData(data)
{
   this.users = data.users;
   this.messages = [];

   data.messages.forEach(this.receiveMessage.bind(this));
};

new Chat();
})();
