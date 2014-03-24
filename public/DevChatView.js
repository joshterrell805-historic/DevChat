$(document).ready(
   function()
   {
      window.devChatView = new DevChatView();
   }
);

function DevChatView()
{
   // used for the holy grails in the messages div (thus far message elements
   // and notification elements)
   this.leftColumnWidth = "120px";
   this.rightColumnWidth = "80px";
}

// Add a new message dom element to the messages div
DevChatView.prototype.displayMessage = function displayMessage(message)
{

   this.scrollBottomPre();

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

   this.scrollBottomPost();

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

// A user logged in and he now has one logged in connection.
DevChatView.prototype.userLogin = function userLogin(username)
{
   this.scrollBottomPre();

   $("#messages").append(
      new NotificationElement(username + " logged in.").getElement()
   );

   this.scrollBottomPost();
};

// A user logged out and he now has zero logged in connections.
DevChatView.prototype.userLogout = function userLogout(username)
{
   this.scrollBottomPre();

   $("#messages").append(
      new NotificationElement(username + " logged out.").getElement()
   );
   
   this.scrollBottomPost();
};


(function()
{
   var scrollDown;

   // scrollBottom(Pre and Post) ensure that the scrollbar in the messages div
   // remains at the bottom when the content in the messages div changes if
   // the scrollbar was at the bottom before the content changed.
   //
   // Call this method before changing the content height in the messages div
   DevChatView.prototype.scrollBottomPre = function scrollBottomPre()
   {
      scrollDown = $("#messages").scrollTop() ==
         $("#messages").prop("scrollHeight") - $("#messages").height();
      
   };

   // Call this method after changing the content height in the messages div
   DevChatView.prototype.scrollBottomPost = function scrollBottomPost()
   {
      if (scrollDown)
      {
         $("#messages").scrollTop(
            $("#messages").prop("scrollHeight") - $("#messages").height()
         );
      }
   };
})()
