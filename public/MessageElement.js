/**
 * MessageElement is a collection of dom elements that make the visual
 * representation of a message in the default view of DevChat.
 *
 */
function MessageElement(username, message, timestamp)
{
   this.holyGrail = new HolyGrail(
      window.devChatView.leftColumnWidth,
      window.devChatView.rightColumnWidth
   );

   // Add username div
   var element = $("<div></div>");
   element.css({
      "padding-right": "10px",
      "font-weight": "bold",
      "text-align": "right",
   });
   element.html(username + ":");
   this.holyGrail.left.append(element);
   this.usernameDiv = element;

   // alternate coloring messages;
   if (MessageElement.colorThisMessage)
   {
      this.colored = true;
      element.css("background-color", MessageElement.coloredColor);
   }

   // This is a bit hackish.. but a newline should only be added to the username
   //  div on calls to append message other than the first.
   this.suppressUsernameNewlineAdded = true;

   MessageElement.colorThisMessage = !MessageElement.colorThisMessage;

   // Add message and timestamp divs
   this.appendMessage(message, timestamp);

}

MessageElement.colorThisMessage = false;
MessageElement.coloredColor = "#f5f5f5";

// The element to display
MessageElement.prototype.getElement = function getElement()
{
   return this.holyGrail.container;
}

// Append a message to this message element. Appended messages get their own
// content and time divs.
MessageElement.prototype.appendMessage =
function appendMessage(message, timestamp)
{
   
   if (this.colored)
   {
      var bgColor = MessageElement.coloredColor;
   }

   // Name is already added, and only added once in constructor.

   // Add timestamp to upper right corner
   element = $("<div></div>");
   element.css({
      "text-align": "right",
      "color": "#999",
      "background-color": bgColor,
   });
   element.html(new Date(timestamp).format("hh:MM TT"));
   this.holyGrail.right.append(element);

   // See constructor for what this is.
   if (this.suppressUsernameNewlineAdded)
   {
      this.suppressUsernameNewlineAdded = false;
   }
   else
   {
      // Add a newline so the username div is fully colored.
      this.usernameDiv.html(this.usernameDiv.html() + "<br />&nbsp;");
   }


   // Add blank divs after timestamp for every new line so appended messages'
   // timestamps line up correctly.
   var newlines = message.split("\n").length - 1;
   while (newlines--)
   {
      element = $("<div>&nbsp;</div>");
      element.css({
         "background-color": bgColor,
      });

      this.holyGrail.right.append(element);

      // Also add newlines after username so the username div is fully colored
      this.usernameDiv.html(this.usernameDiv.html() + "<br />&nbsp;");
   }

   // Add the actual message.
   element = $("<div></div>");
   element.html(
      htmlEscape(message)
         .replace(/ /g, "&nbsp;")
         .replace(/\n/g, "<br />")
   );
   element.css({
      "word-wrap": "break-word",
      "background-color": bgColor,
   });
   this.holyGrail.center.append(element);

}
