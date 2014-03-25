
/**
 * Display a list of logged in users.
 */
function UsersPanel()
{
   this.container = $("#usersPanel");
   this.users = $("<div></div>");
   this.users.css({
      "width": "120px",
      "background-color": "white",
      "padding": "4px",
   });
   this.container.append(this.users);
}

// update the list of users
UsersPanel.prototype.update = function update()
{
   users = window.devChatController.users.filter(function(elem, pos) {
       return window.devChatController.users.indexOf(elem) == pos;
   });

   users.sort();

   this.users.html(users.join("<br />"));
};

UsersPanel.prototype.toggleVisible = function toggleVisible()
{
   this.container.toggle();

   if (this.container.is(":visible"))
   {
      $("#anotherMessagesContainer").addClass("usersVisible");
   }
   else
   {
      $("#anotherMessagesContainer").removeClass("usersVisible");
   }
};
