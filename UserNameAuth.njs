/**
 * A basic devchat authentification which passes only users with the usernames
 *  specified in the UserNameAuth.usernames.txt file. This file is a newline
 *  separated list of valid usernames.
 */
module.exports = UserNameAuth;


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function UserNameAuth(username, passwordHash, successCallback, failureCallback)
{
   if (validUsernames)
   {
      if (validUsernames.indexOf(username) != -1)
      {
         successCallback();
      }
      else
      {
         failureCallback();
      }
   }
   else
   {
      failureCallback("Auth system initializing; try again in a few seconds.");
   }
}

var validUsernames = null;

require("fs").readFile("UserNameAuth.usernames.txt", {encoding: "utf8"},
   function(err, data)
   {
      if (err)
      {
         throw err;
      }

      validUsernames = data.split("\n");
   }
);
