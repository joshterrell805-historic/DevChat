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

      $(window).bind('focus', function()
      {
         this.unreadMessages(false);
      }.bind(this));
   }.bind(this));

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
   Utils.addScript('SoundManager.js');

   Utils.waitForReady([
      Utils.createIsType(Date.prototype, 'format', 'function'),
      Utils.createIsType(window, 'soundManagerIsReady', 'boolean')],function()
      {
         delete window.soundManagerIsReady;
         window.socket.emit('readyForData');
      }
   );
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
         .replace(/  /g, " &nbsp;")
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

   if (!document.hasFocus())
   {
      this.unreadMessages(true);
      if(!this.lastPlay || new Date() - this.lastPlay > 60000)
      {
         soundManager.play('ReceiveMessage');
         this.lastPlay = new Date();
      }
   }
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

var flashIntervalId = null;
var unreadMessageCount = 0;
Chat.prototype.unreadMessages = function unreadMessages(trueOrFalse)
{
   if (trueOrFalse)
   {
      ++unreadMessageCount;

      if(flashIntervalId === null)
      {
         var flash = {
            devChatTime: 13,
            newMessagesTime: 13,
            state: 'devChat',
            timeInState: 0
         };
         flashIntervalId = setInterval(function()
         {
            // go to next state
            if (++this.timeInState == this[this.state + 'Time'])
            {
               this.timeInState = 0;
               switch(this.state)
               {
                  case 'devChat':
                     this.state = 'newMessages';
                     document.title = unreadMessageCount + ' New Message' +
                        (unreadMessageCount === 1 ? '' : 's') + 's!';
                     break;
                  case 'newMessages':
                     this.state = 'devChat';
                     document.title = 'DevChat';
                     break;
               }
            }
         }.bind(flash), 100);
      }
   }
   else
   {
      document.title = 'DevChat';
      unreadMessageCount = 0;
      if (flashIntervalId !== null)
      {
         clearInterval(flashIntervalId);
         flashIntervalId = null;
      }
   }
}

new Chat();
})();
