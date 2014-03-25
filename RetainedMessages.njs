/**
 * Retained messages is a collection of recent messages up to some maximum
 *  limit. When adding a message to this module if the module is at the max
 *  message limit the oldest message will be disgarded to make room.
 *
 * Retained messages is not ment to be a full message history, but rather a
 *  recent message history. It is meant to be a quickly permutatible list
 *  rather than a comprehensive one.
 */

/**
 * @param count maximum count of messages to be retained.
 */
exports.setMaxMessages = setMaxMessages;

/**
 * @return maximum count of messages to be retained.
 */
exports.getMaxMessages = getMaxMessages;

/**
 * Load messages from persistent storage into the internal storage of this
 *  module. If there are no messages in persistent storage, messages is
 *  initialized to an empty array.
 *
 * Note: the internal storage is empty when this module is required. Load
 *  must be called manually to load the messages from persistent storage.
 *
 * Warning: overwrites the current loaded messages.
 */
exports.load = loadMessages;

/**
 * Save messages from the internal storage to persistent storage.
 *
 * @param done callback called when the messages have completed saving to
 *  persistent storage.
 */
exports.save = saveMessages;

/**
 * @return the count of internally stored messages
 */
exports.size = size;

/**
 * Add a message to internal storage. If size() == getMaxMessages() when this
 *  method is called, the oldest (message with lowest index) message is removed
 *  from the array to make room for the new message.
 *
 * @param message the message to add
 */
exports.add = add;

/**
 * @return all the messages stored in internal storage as an array.
 *  Oldest messages have lowest indexes. 
 */
exports.getAll = getAll;


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


var fs = require("fs");

// Note: "savedMessages.json" is hard-coded in the .gitignore and should be
//  removed when this module gets refactored.
var saveFilename = "savedMessages.json";

var messages = [];

var maxMessages = 100;

function setMaxMessages(count)
{
   maxMessages = count ? count : null;
}

function getMaxMessages()
{
   return maxMessages;
}

function loadMessages()
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
}

function saveMessages(done)
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
}


function size()
{
   return messages.length;
}

function add(message)
{
   messages.push(message);
   trim();
}

function getAll()
{
   trim();
   // Yes this returns the actual object (for now)
   // Later implementations might use sql or redis.. call this method every
   // time you need all the messages.
   return messages;
}

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
