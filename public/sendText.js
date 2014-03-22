// socket.io socket connected to the server
var socket;

// the socket.io namespace that the DevChat server uses.
var namespace = "/DevChat";

$(document).ready(
   function()
   {
      socket = io.connect(namespace);

      socket.on("user message", receiveMessage);
      socket.on("login", loginResponse);
   }
);

$(document).keypress(
   function(ev)
   {
      // When the user preses Enter and is currently focused on #messageInput,
      // send the message.
      if (ev.which == KeyEvent.DOM_VK_RETURN && $("#messageInput").is(":focus"))
      {
         sendMessage();
         return false;
      }

      // When the user preses Enter and is currently focused on #usernameInput,
      // login.
      if (ev.which == KeyEvent.DOM_VK_RETURN
         && $("#usernameInput").is(":focus"))
      {
         login();
         return false;
      }
   }
);

// Send the text that is currently in the input box and clear its text
function sendMessage()
{
   socket.emit("user message", $("#messageInput").val());
   $("#messageInput").val("");
}

// receive a user message from the server
function receiveMessage(data)
{
   displayMessage(data);
}

// display a user message
function displayMessage(message)
{
   // TODO create a new dom element, etc.
   console.log(formatTime(message.timestamp) + "   " + message.username + ": "
      + message.message);
}


// Send a login attempt to the DevChat server.
function login()
{
   // only login if the user has provided a username
   if ($("#usernameInput").val().length)
   {
      socket.emit("login", $("#usernameInput").val());
   }
}

// The server's response of whether or not the login is good.
function loginResponse(data)
{
   // The user passed authentication
   if (data.success)
   {
      $("#loginPanel").hide();
      $("#messagePanel").show();
      $("#messageInput").val("");
      data.messages.forEach(displayMessage);
   }

   // The user failed authentification
   else
   {
      alert(data.message);
   }
}

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
