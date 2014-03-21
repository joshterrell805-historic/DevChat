var socket;
var input;

$(document).ready(
   function()
   {
      socket = io.connect();
      input = $("#messageInput");
      socket.on("user message", receiveMessage);
   }
);

$(document).keypress(
   function(ev)
   {
      // When the user preses Enter and is currently focused on the input,
      // Send the message.
      if (ev.which == KeyEvent.DOM_VK_RETURN && input.is(":focus"))
      {
         sendMessage();
         return false;
      }
   }
);

// Send the text that is currently in the input box and clear its text
function sendMessage()
{
   socket.emit("user message", input.val());
   input.val("");
}

function receiveMessage(data)
{
   console.log(data);
}
