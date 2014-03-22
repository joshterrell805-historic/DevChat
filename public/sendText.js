var socket;
var messageInput;
var usernameInput;

$(document).ready(
   function()
   {
      socket = io.connect();
      messageInput = $("#messageInput");
      usernameInput = $("#usernameInput");
      socket.on("user message", receiveMessage);
      socket.on("login", loginResponse);
   }
);

$(document).keypress(
   function(ev)
   {
      // When the user preses Enter and is currently focused on #messageInput,
      // send the message.
      if (ev.which == KeyEvent.DOM_VK_RETURN && messageInput.is(":focus"))
      {
         sendMessage();
         return false;
      }

      // When the user preses Enter and is currently focused on #usernameInput,
      // login.
      if (ev.which == KeyEvent.DOM_VK_RETURN && usernameInput.is(":focus"))
      {
         login();
         return false;
      }
   }
);

// Send the text that is currently in the input box and clear its text
function sendMessage()
{
   socket.emit("user message", messageInput.val());
   messageInput.val("");
}

function receiveMessage(data)
{
   console.log(data.username + ": " + data.message);
}


// Attempt to login.
function login()
{
   // only login if the user has provided a username
   if (usernameInput.val().length)
   {
      socket.emit("login", usernameInput.val());
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
      messageInput.val("");
   }
   // The user failed authentification
   else
   {
      alert(data.message);
   }
}
