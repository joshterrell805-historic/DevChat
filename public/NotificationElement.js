/**
 * A notification element is a collection of dom elements placed in the messages
 * div as if it were a message but it's a message from the system rather than
 * a user. Exampels are login notifications, logout notifications,  connection
 * lost notifications.. etc.
 */
function NotificationElement(notificationText)
{
   this.holyGrail = new HolyGrail(
      window.devChatView.leftColumnWidth,
      window.devChatView.rightColumnWidth
   );


   var element = $("<div>&nbsp;</div>");
   element.css({
      "background-color": NotificationElement.color,
   });
   this.holyGrail.left.append(element);

   element = $("<div></div>");
   element.css({
      "background-color": NotificationElement.color,
   });
   element.html(notificationText);
   this.holyGrail.center.append(element);

   element = $("<div>&nbsp;</div>");
   element.css({
      "background-color": NotificationElement.color,
   });
   this.holyGrail.right.append(element);
}

NotificationElement.color = "#ffff99";

// The element to display
NotificationElement.prototype.getElement = function getElement()
{
   return this.holyGrail.container;
};
