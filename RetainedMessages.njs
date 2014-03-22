/**
 * Retained messages is a temporary solution to the need for a persistent
 * message store. This is elementary and can be improved immensely.
 */

var fs = require("fs");

// Note: "savedMessages.json" is hard-coded in the .gitignore and should be
//  removed when this module gets refactored.
var saveFilename = "savedMessages.json";

var messages;

// null is unlimited
var maxMessages = null;


// falsy (0, null, undefined..) for unlimited.
exports.setMaxMessages = function setMaxMessages(count)
{
   maxMessages = count ? count : null;
};

// null is unlimited.
exports.getMaxMessages = function getMaxMessages(count)
{
   return maxMessages;
};

// Load messages from persistent storage.
// warning--overwrites current values if there are any
exports.load = function loadMessages()
{
   fs.readFile(saveFilename, function (err, data)
   {
      if (err)
      {
         if (err.code == "ENOENT")
         {
            messages = []
         }
         else
         {
            throw err;
         }
      }
      else
      {
         messages = JSON.parse(data);
      }
   });
};

// saves messages to persistent storage.
// done is a callback called when the messages have completed saving to
// persistent storage.
exports.save = function saveMessages(done)
{
   fs.writeFile(saveFilename, JSON.stringify(messages), function (err)
   {
      if (err)
      {
         throw err;
      }

      if (done)
      {
         done();
      }
   });
};


// The following methods work on the messages object and should only be called
// after load()

Object.defineProperty(exports, "length",
{
   get: function() { return messages.length; }
});

exports.add = function add(message)
{
   messages.push(message);
   trim();
};

exports.getAll = function getAll()
{
   trim();
   // Yes this returns the actual object (for now)
   // Later implementations might use sql or redis.. call this method every
   // time you need all the messages.
   return messages;
};

// remove all messages over max.
function trim()
{
   if (maxMessages !== null)
   {
      while(messages.length > maxMessages)
      {
         messages.shift();
      }
   }
}
