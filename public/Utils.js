(function() {

window.Utils = {
   htmlEscape    : htmlEscape,
   htmlUnescape  : htmlUnescape,
   addScript     : addScript,
   addStylesheet : addStylesheet,
   stickToBottom : stickToBottom,
};

// https://gist.github.com/BMintern/1795519#file-html-escape-js
// Use the browser's built-in functionality to quickly and safely escape the
// string
function htmlEscape(str)
{
   var div = document.createElement('div');
   div.appendChild(document.createTextNode(str));

   return div.innerHTML;
}
 
// https://gist.github.com/BMintern/1795519#file-html-escape-js
// UNSAFE with unsafe strings; only use on previously-escaped ones!
function htmlUnescape(escapedStr)
{
   var div = document.createElement('div');
   div.innerHTML = escapedStr;
   var child = div.childNodes[0];

   return child ? child.nodeValue : '';
}

function addScript(url)
{
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;
   document.body.appendChild(script);
}

function addStylesheet(url)
{
   var stylesheet = document.createElement('link');
   stylesheet.type = 'text/css';
   stylesheet.rel = 'stylesheet';
   stylesheet.href = url;
   $('head').append(stylesheet);
}

/**
 * Keep an element scrolled to the bottom if it already is scrolled to the
 *  bottom.
 *
 * TODO: doesn't work for window resize, only for added elements.
 */
function stickToBottom(element)
{
   element = $(element);
   var scrollDown = false;
   var neededScrollTop = -1;

   element.bind('DOMSubtreeModified', function()
   {
      // -3: because sometimes my scroll bar doesn't hit the bottom...
      neededScrollTop = element.prop("scrollHeight")
         - element.outerHeight() - 3;

      if (scrollDown)
      {
         element.scrollTop(
            element.prop("scrollHeight") - element.outerHeight()
         );
      }
   });

   element.bind('scroll', function()
   {
      if (element.scrollTop() >= neededScrollTop)
      {
         scrollDown = true;
      }
      else
      {
         scrollDown = false;
      }
   });

   element.trigger('scroll');
}

})();
