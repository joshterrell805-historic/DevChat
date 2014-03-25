(function()
{

$(document).ready(
   function()
   {
      window.devChatView = new DevChatView();
   }
);

/**
 * Add a new MessageElement to the messages div.
 *
 * @param the MessageElement to add
 */
DevChatView.prototype.displayMessage = displayMessage;

/**
 * Do display stuff necissary for this view to show login success..
 */
DevChatView.prototype.loginSuccess = loginSuccess;

/**
 * Do display stuff necissary for this view to show login failure..
 *
 * @param the reason for failure.
 */
DevChatView.prototype.loginFailure = loginFailure;

/**
 * A user logged in and he only has one logged in connection.
 * @param username the username of the now logged in user.
 */
DevChatView.prototype.userLogin = userLogin;

/**
 * A user logged out and he now has zero logged in connections.
 * @param username the username of the user who logged out.
 */
DevChatView.prototype.userLogout = userLogout;

/**
 * scrollBottom(Pre and Post) ensure that the scrollbar in the messages div
 * remains at the bottom when the content in the messages div changes if
 * the scrollbar was at the bottom before the content changed.
 *
 * Call this method before changing the content height in the messages div
 */
DevChatView.prototype.scrollBottomPre = scrollBottomPre;

/**
 * Call this method after changing the content height in the messages div
 */
DevChatView.prototype.scrollBottomPost = scrollBottomPost;


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function DevChatView()
{
   // used for the holy grails in the messages div (thus far message elements
   // and notification elements)
   // TODO this left column width is used in the CSS too.. find one place for
   // it. Style sheets... classes. booyah
   this.leftColumnWidth = "120px";
   this.rightColumnWidth = "80px";
   // TODO see below at new Menu
   this.usersPanel = new UsersPanel();

   $("#gearImage").hover(function()
   {
      $("#gearImage").addClass("gearImageHover");
   },function()
   {
      $("#gearImage").removeClass("gearImageHover");
   });

   // TODO the new keyword doesn't make sense here.. only one menu can
   // exist since the id is hard coded in. Need to rethink this.. maybe
   // use a getElement function and insert the menu into the document.
   // also, see above at new UsersPanel
   var menu = new Menu();
   menu.addItem("Users", function toggleUsers()
   {
      devChatView.usersPanel.toggleVisible();
   });

   $("#gearImage").click(function(ev)
   {
      menu.show();
      ev.stopPropagation();
   });
   $(document).click(function()
   {
      menu.hide();
   });
}

function displayMessage(message)
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

function loginSuccess()
{
   $("#loginPanel").hide();
   $("#usernameInput").val("");
   $("#chatPanel").show();
   $("#messageInput").val("");
   this.usersPanel.update();
}

function loginFailure(reason)
{
   alert(reason);
}


function userLogin(username)
{
   this.scrollBottomPre();

   $("#messages").append(
      new NotificationElement(username + " logged in.").getElement()
   );

   this.scrollBottomPost();

   this.usersPanel.update();
};

function userLogout(username)
{
   this.scrollBottomPre();

   $("#messages").append(
      new NotificationElement(username + " logged out.").getElement()
   );
   
   this.scrollBottomPost();

   this.usersPanel.update();
};


var scrollDown;

function scrollBottomPre()
{
  
   scrollDown = $("#messages").scrollTop() >=
      $("#messages").prop("scrollHeight") - $("#messages").height() -

      // Consider the scrollbar to be at the bottom if it is scrolled at least
      //  half way down the last message.
      $(".messageTextDiv", $("#messages").children()[
         $("#messages").children().length - 1
      ]).height() / 2;
}

function scrollBottomPost()
{
   if (scrollDown)
   {
      $("#messages").scrollTop(
         $("#messages").prop("scrollHeight") - $("#messages").height()
      );
   }
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
         ev.preventDefault();
      }

      // When the user preses Enter and is currently focused on #usernameInput,
      // login and there is text in the login box.
      if (ev.which == KeyEvent.DOM_VK_RETURN
         && $("#usernameInput").is(":focus")
         && $("#usernameInput").val().length)
      {
         window.devChatController.login($("#usernameInput").val());
         ev.preventDefault();
      }
   }
);

})();
