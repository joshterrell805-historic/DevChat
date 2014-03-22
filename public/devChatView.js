$(document).ready(
   function()
   {
      window.devChatView = new DevChatView();
   }
);

function DevChatView()
{
}

// display a user message
DevChatView.prototype.displayMessage = function displayMessage(message)
{
   console.log(formatTime(message.timestamp) + "   " + message.username + ": "
      + message.message);
}

// do display stuff necissary for this view to show login success..
// hide the login panel and show the chat room
DevChatView.prototype.loginSuccess = function loginSuccess()
{
      $("#loginPanel").hide();
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
      if (ev.which == KeyEvent.DOM_VK_RETURN && $("#messageInput").is(":focus"))
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
            $("#usernameInput").val("");
            return false;
      }
   }
);






// TODO this should be moved to the display module when I make one.

// Get a formatted string representation of the timestamp.
// ex:
// Mar 21 07:00 PM
// Mar 21 05:00 AM
function formatTime(timestamp)
{
   var date = new Date(timestamp);
   var hours = date.getHours();
   var isPM = hours >= 12;

   // 1pm - 11pm
   if (hours > 12)
      hours -= 12;

   // 12am
   else if (hours == 0)
      hours = 12;

   return months[date.getMonth()] + " " + zeroPad(date.getDate()) + " "
      + zeroPad(hours) + ":" + zeroPad(date.getMinutes())
      + " " + (isPM ? "PM" : "AM");
}

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
   "Oct", "Nov", "Dec"];

// 2  -> 02
// 9  -> 09
// 10 -> 10
function zeroPad(asdf)
{
   return (asdf < 10 ? "0" : "") + asdf;
}
