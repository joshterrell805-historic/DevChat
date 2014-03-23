$(document).ready(
   function()
   {
      window.devChatView = new DevChatView();
   }
);

function DevChatView()
{
}

// Add a new message dom element to the messages div
DevChatView.prototype.displayMessage = function displayMessage(message)
{
   // This variable and it's use below make the scrollbar "stick" to the bottom
   // as new messages are added if the scrollbar is at the bottom already.
   var scrollDown = $("#messages").scrollTop() ==
      $("#messages").prop("scrollHeight") - $("#messages").height();

   // If the last message was posted by the same user and the last message
   // was less than 60 seconds ago, just tack this message on to the last
   // message div instead of creating a new one.
   if (this.lastMessage && this.lastMessage.username === message.username
      && message.timestamp - this.lastMessage.timestamp < 60000)
   {
      this.lastElement.appendMessage(message.message, message.timestamp);
   }

   // Else create a new message div and display it.
   else
   {
      this.lastElement = new MessageElement(
         message.username, message.message, message.timestamp
      );

      $("#messages").append(this.lastElement.getElement());
   }

   // Finally, scroll the scrollbar back to the bottom
   // if the scrollbar was at the bottom before we added the new message.
   if (scrollDown)
   {
      $("#messages").scrollTop(
         $("#messages").prop("scrollHeight") - $("#messages").height()
      );
   }

   this.lastMessage = message;
}

// do display stuff necissary for this view to show login success..
// hide the login panel and show the chat room
DevChatView.prototype.loginSuccess = function loginSuccess()
{
   $("#loginPanel").hide();
   $("#usernameInput").val("");
   $("#messagePanel").show();
   $("#messageInput").val("");
}

// do display stuff necissary for this view to show login failure..
// just alert the failure.
DevChatView.prototype.loginFailure = function loginFailure(reason)
{
   alert(reason);
}

$(document).keypress(
   function(ev)
   {
      // When the user preses Enter and is currently focused on #messageInput,
      // send the message.
      if (ev.which == KeyEvent.DOM_VK_RETURN && !ev.shiftKey
         && $("#messageInput").is(":focus"))
      {
         window.devChatController.sendMessage($("#messageInput").val());
         $("#messageInput").val("");
         return false;
      }

      // When the user preses Enter and is currently focused on #usernameInput,
      // login and there is text in the login box.
      if (ev.which == KeyEvent.DOM_VK_RETURN
         && $("#usernameInput").is(":focus")
         && $("#usernameInput").val().length)
      {
            window.devChatController.login($("#usernameInput").val());
            return false;
      }
   }
);
