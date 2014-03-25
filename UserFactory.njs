/**
 * A factory for creating Users. This module allows a group of users to share
 *  a devChat instance while allowing other devChat instances to exist within
 *  the same process.
 */

/**
 * Create a new user factory .
 *
 * @param devChat the DevChat server which all users created by this factory
 *  will reference as the server they belong to.
 */
module.exports = UserFactory;

/**
 * Create a new user instance bound to the devChat instance passed to the
 *  factory constructor.
 *
 * @param same parameters to User.
 */
UserFactory.prototype.newInstance = newInstance;


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


var User = require("./User.njs");

function UserFactory(devChat)
{
   this.userConstructor = function UserFactoryConstructor()
   {
      User.apply(this, arguments);
   };

   this.userConstructor.prototype = Object.create(User.prototype);
   this.userConstructor.prototype.devChat = devChat;
}

function newInstance(socket)
{
   // I tested in chrome and node 0.11.9; It looks like new takes precedence
   //  over this in the following statement (with regard to which object is
   //  bound to 'this' inside the constructor functions).
   return new this.userConstructor(socket);
}
