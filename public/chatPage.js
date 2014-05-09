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
   Utils.addScript('highlight.pack.js');
   Utils.addScript('Autolinker.min.js');

   Utils.waitForReady([
      Utils.createIsType(Date.prototype, 'format', 'function'),
      Utils.createIsType(window, 'soundManagerIsReady', 'boolean'),
      Utils.createIsNotType(window, 'hljs', 'undefined'),
      Utils.createIsType(window, 'Autolinker', 'function')
      ], function()
      {
         window.Autolinker = new Autolinker({
            'stripPrefix' : false,
            'twitter'     : false
         });
         delete window.soundManagerIsReady;
         window.socket.emit('readyForData');
      }
   );

   // don't wait for this to load.. code highlighting can occur whenevs.
   Utils.addStylesheet('highlight.css');
}

/************* messages to server *********************/
Chat.prototype.sendMessage = function sendMessage(messageText)
{
   window.socket.emit("user message", messageText);
}

/************** messages from server *******************/

Chat.prototype.receiveMessage = function receiveMessage(message)
{
   var messageText = this.formatInput(message.message);

   var lastMessage = this.messages[this.messages.length - 1];
   var timestamp = (new Date(message.timestamp)).format("h:MMtt ddd m/d");

   //  *display* the message as part of the last message.
   if (lastMessage
      && lastMessage.username == message.username
      && message.timestamp - lastMessage.timestamp < 60000)
   {
      var username = '&nbsp;';
      $('#messages table tr:last-child td.timestamp').html("&nbsp;")
      $('#messages table tr:last-child').addClass("concatee")
   }
   else
   {
      this.lastColored = !this.lastColored;
      var username = message.username;
      var isNewMessage = true;
   }

   var row = $('<tr></tr>');
   row.append('<td class="username">' + username + '</td>');
   row.append('<td class="content">' + messageText + '</td>');
   row.append('<td class="timestamp">' + timestamp + '</td>');

   if (this.lastColored)
   {
      row.addClass('colored');
   }

   $('#messages table').append(row);
   this.messages.push(message);

   if (isNewMessage && !document.hasFocus())
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

// Format raw user input to be inserted into a page.
Chat.prototype.formatInput = function formatInput(input)
{
   var formattedText = '';
   var textToFormat = input;

   do
   {
      var matches = /^([\w\W]*?)(\n|^)```([a-zA-z]*)\s*?\n([\w\W]*?)\n```([\w\W]*?)$/
         .exec(textToFormat);

      if (matches)
      {
         // text before code block
         formattedText += Autolinker.link(
            Utils.htmlEscape(matches[1])
            .replace(/\n$/, "<br>&nbsp;")
            .replace(/\n/g, "<br>")
         );

         var highlighted = hljs.getLanguage(matches[3]) ?
            hljs.highlight(matches[3], matches[4]) :
            hljs.highlightAuto(matches[4]);

         formattedText += '<pre><code>' + highlighted.value + '</code></pre>';

         // text after code block
         textToFormat = Utils.htmlEscape(matches[5]);
      }
      else
      {
         // no code blocks
         formattedText += Autolinker.link(
            Utils.htmlEscape(textToFormat)
            .replace(/\n$/, "<br>&nbsp;")
            .replace(/\n/g, "<br>")
         );

         textToFormat = '';
      }
   } while (textToFormat != '');


   return formattedText;
}

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
                        (unreadMessageCount === 1 ? '' : 's') + '!';
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
