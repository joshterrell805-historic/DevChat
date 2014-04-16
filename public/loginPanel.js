(function()
{

$(document).ready(function()
{
   $('#login-panel button').bind('click', attemptLogin);

   window.socket = io.connect("/DevChat");
   window.socket.on("login", receiveLoginResponse);
});

$(document).bind('keypress', keypressHandler);

function keypressHandler(ev)
{
   // When the user preses Enter and is currently focused on the username
   // input or the password input, treat it as if they pressed the login button.
   if (ev.which == KeyEvent.DOM_VK_RETURN
      && ($("#username").is(":focus") || $("#password").is(":focus")))
   {
      ev.preventDefault();
      attemptLogin();
   }
}

function attemptLogin()
{
   var username = $("#username").val();
   var password = $("#password").val();

   if (!username.length || !password.length)
   {
      alert('You must specify both a username and password.');
   }
   else
   {
      window.socket.emit("login", {username: username, password:password});
   }
}

function receiveLoginResponse(response)
{
   // The user passed authentication
   if (response.success)
   {
      $('body').html('');
      $(document).unbind('keypress', keypressHandler);
      $.addScript('chatPage.js');
   }

   // The user failed authentification
   else
   {
      alert(response.message);
   }
}

// TODO move this to utils
$.addScript = function addScript(url)
{
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;
   document.body.appendChild(script);
};
})();
