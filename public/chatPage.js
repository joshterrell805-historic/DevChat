(function()
{

function Chat()
{
   window.socket.on('user message', this.receiveMessage.bind(this));
   window.socket.on('login notification', this.loginNotification.bind(this));
   window.socket.on('logout notification', this.logoutNotification.bind(this));
   window.socket.on('readyForData', this.receiveInitialData.bind(this));
   Utils.addStylesheet('chatPage.css');
   $.get('chatPage.html', function(html){
      $(document.body).append(html);

      Utils.stickToBottom($("#messages"));

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

   // Send the message in the input box on enter.
   $(document).bind('keypress', function(ev)
   {
      // When the user preses Enter and is currently focused on the input box
      //  send the message.
      if (ev.which == KeyEvent.DOM_VK_RETURN && !ev.shiftKey
         && $("textarea.chat").is(":focus"))
      {
         this.sendMessage($("textarea.chat").val());
         $("textarea.chat").val("");
         ev.preventDefault();
      }
   }.bind(this));

   Utils.addScript('date.format.js');
   function waitForScripts()
   {
      if (typeof Date.prototype.format == "function")
      {
         window.socket.emit('readyForData');
      }
      else
      {
         setTimeout(waitForScripts, 100);
      }
   }
   waitForScripts();
}

/************* messages to server *********************/
Chat.prototype.sendMessage = function sendMessage(messageText)
{
   window.socket.emit("user message", messageText);
}

/************** messages from server *******************/

Chat.prototype.receiveMessage = function receiveMessage(message)
{
   var messageText = Utils.htmlEscape(message.message)
         .replace(/ /g, "&nbsp;")
         .replace(/\n$/, "<br>&nbsp;")
         .replace(/\n/g, "<br>");

   var row = $('<tr></tr>');
   row.append('<td class="username">' + message.username + '</td>');
   row.append('<td class="content">' + messageText + '</td>');
   row.append('<td class="timestamp">'
      + (new Date(message.timestamp)).format("h:MMtt ddd m/d") + '</td>'
   );

   $('#messages table').append(row);
   this.messages.push(message);
}

Chat.prototype.loginNotification = function loginNotification(response)
{
   if (response.isOnly)
   {
      this.users.push(response.username);
      this.users = this.users.sort();

      this.refreshUsersPanel();

      this.addNotification(response.username + " logged in.");
   }
}

Chat.prototype.logoutNotification = function logoutNotification(response)
{
   if (response.isOnly)
   {
      var index = this.users.indexOf(response.username);
      if (index == -1)
      {
         throw new Exception("User not in user list logged out.");
      }

      this.users.splice(index, 1);

      this.refreshUsersPanel();

      this.addNotification(response.username + " logged out.");
   }
}

Chat.prototype.addNotification = function addNotification(text)
{
   var row = $('<tr class="notification"><td></td><td>'
      + text + '</td><td class="timestamp">'
      + (new Date()).format("h:MMtt ddd m/d") + '</td></tr>');

   $('#messages table').append(row);
}


Chat.prototype.receiveInitialData = function receiveInitialData(data)
{
   // Remove duplicates and sort.. for now I don't care about storing how
   //  many of each user is logged in (in the view).
   this.users = data.users.filter(function(elem, pos) {
       return data.users.indexOf(elem) == pos;
   }).sort();

   this.refreshUsersPanel();
   this.messages = [];

   data.messages.forEach(this.receiveMessage.bind(this));
}

/********************* support functions ******************/

Chat.prototype.refreshUsersPanel = function refreshUsersPanel()
{
   $("#users").html(this.users.join("<br>"));
}

new Chat();
})();
