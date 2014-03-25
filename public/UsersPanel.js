/**
 * A displayed list of logged in users.
 */

// update the list of users to a fresh representation.
UsersPanel.prototype.update = update;

UsersPanel.prototype.toggleVisible = toggleVisible;


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function UsersPanel()
{
   this.container = $("#usersPanel");
   this.users = $("<div class=\"usersDiv\"></div>");
   this.container.append(this.users);
}

function update()
{
   users = window.devChatController.users.filter(function(elem, pos) {
       return window.devChatController.users.indexOf(elem) == pos;
   });

   users.sort();

   this.users.html(users.join("<br />"));
}

function toggleVisible()
{
   this.container.toggle();
   $("#outerMessagesContainer").toggleClass("usersVisible");
}
