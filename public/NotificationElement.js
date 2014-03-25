/**
 * A notification element is a collection of dom elements placed in the messages
 * div as if it were a message but it's a message from the system rather than
 * a user. Exampels are login notifications, logout notifications,  connection
 * lost notifications.. etc.
 *
 * @param notificiationText the text to display
 */
function NotificationElement(notificationText)
{
   this.holyGrail = new HolyGrail(
      window.devChatView.leftColumnWidth,
      window.devChatView.rightColumnWidth
   );


   var element = $("<div class=\"notificationElement\">&nbsp;</div>");
   this.holyGrail.left.append(element);

   element = $("<div class=\"notificationElement\"></div>");
   element.html(notificationText);
   this.holyGrail.center.append(element);

   element = $("<div class=\"notificationElement\">&nbsp;</div>");
   this.holyGrail.right.append(element);
}

// The element to display
NotificationElement.prototype.getElement = function getElement()
{
   return this.holyGrail.container;
};
