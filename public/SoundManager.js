(function() {

Utils.addScript('soundmanager2-nodebug-jsmin.js');

Utils.waitForReady([Utils.createIsNotType(window, 'soundManager', 'undefined')],
function()
{
   soundManager.setup({
      url: '/swf/',
      //flashVersion: 9, // optional: shiny features (default = 8)
      // optional: ignore Flash where possible, use 100% HTML5 mode
      //preferFlash: false,
      onready: function() {
         soundManager.createSound({
            id: 'ReceiveMessage',
            url: 'daphne-in-wonderland__ding.mp3',
            autoLoad: true,
            autoPlay: false,
            volume: 100,
            onload: function() {
               window.soundManagerIsReady = true;
            }
         });
      }
   });
});

})();
