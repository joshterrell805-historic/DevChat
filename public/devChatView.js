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

   //console.log(formatTime(message.timestamp) + "   " + message.username + ": "
   //   + message.message);

   // is the scrollbar at the bottom?
   var scrollDown = $("#messages").scrollTop() ==
      $("#messages").prop("scrollHeight") - $("#messages").height();

   if (this.lastMessage && this.lastMessage.username === message.username
      && message.timestamp - this.lastMessage.timestamp < 60000)
   {
      // TODO REPEATED CODE!!! BADD JOSH!
      element = $(document.createElement("div"));
      element.html(
         htmlEscape(message.message).replace(/\n/g, "<br />")
      );
      element.css({
         "word-wrap": "break-word",
      });
      // using class outside of it.. badddd move this shit inside message element
      this.lastElement.holyGrail.center.append(element);
      element = this.lastElement;
   }
   else
   {
      var element = new MessageElement(
         message.username, message.message, message.timestamp
      );

      $("#messages").append(element.getElement());
   }

   if (scrollDown)
   {
      $("#messages").scrollTop(
         $("#messages").prop("scrollHeight") - $("#messages").height()
      );
   }

   this.lastMessage = message;
   this.lastElement = element;
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

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function MessageElement(username, message, timestamp)
{
   this.holyGrail = new HolyGrail();

   var element = $(document.createElement("div"));
   element.css({
      "margin-right": "10px",
      "text-align": "right",
   });
   element.html(username + ":");
   this.holyGrail.left.append(element);

   element = $(document.createElement("div"));
   element.css({
      "text-align": "right",
      "color": "#999",
   });
   element.html(formatTime(timestamp));
   this.holyGrail.right.append(element);

   element = $(document.createElement("div"));
   element.html(
      htmlEscape(message).replace(/\n/g, "<br />")
   );
   element.css({
      "word-wrap": "break-word",
   });
   this.holyGrail.center.append(element);
}

// the element to display
MessageElement.prototype.getElement = function getElement()
{
   return this.holyGrail.element;
}

function HolyGrail()
{
   // http://alistapart.com/article/holygrail
   var left = "120px";
   var right = "80px";

   this.left = $(document.createElement("div"));
   this.left.css({
      "float": "left",
      "position": "relative",
      "right": left,
      "width": left,
      "margin-left": "-100%"
   });

   this.right = $(document.createElement("div"));
   this.right.css({
      "float": "left",
      "position": "relative",
      "width": right,
      "margin-right": "-" + right 
   });

   this.center = $(document.createElement("div"));
   this.center.css({
      "float": "left",
      "position": "relative",
      "width": "100%"
   });

   this.element = $(document.createElement("div"));
   this.element.css({
      "padding-left": left,
      "padding-right": right
   });

   this.element.append(this.center);
   this.element.append(this.left);
   this.element.append(this.right);
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

/*
   return months[date.getMonth()] + " " + zeroPad(date.getDate()) + " "
      + zeroPad(hours) + ":" + zeroPad(date.getMinutes())
      + " " + (isPM ? "PM" : "AM");
*/
   return zeroPad(hours) + ":" + zeroPad(date.getMinutes())
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
