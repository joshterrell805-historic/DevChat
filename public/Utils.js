(function() {

window.Utils = {
   htmlEscape      : htmlEscape,
   htmlUnescape    : htmlUnescape,
   addScript       : addScript,
   addStylesheet   : addStylesheet,
   stickToBottom   : stickToBottom,
   waitForReady    : waitForReady,
   createIsType    : createIsType,
   createIsNotType : createIsNotType,

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

/**
 * Call all the functions in the toWaitFor array until all return true.
 *  when all of them do, call the onReady function.
 *
 * Note: the toWaitFor array is modified by this function.
 */
function waitForReady(toWaitFor, onReady)
{
   var id = setInterval(function()
   {
      for (var i = 0; i < toWaitFor.length; ++i)
      {
         if(toWaitFor[i]())
         {
            toWaitFor.splice(i--, 1);
         }
      }

      if (toWaitFor.length === 0)
      {
         clearInterval(id);
         onReady();
      }
   }, 20);
}

/**
 * Useful function for waitForReady to wait until an object's property is
 * a specified type.
 * eg:
 *    createIsType(window, myVar, 'function')
 *
 * creates a function that returns true if (typeof window.myVar === 'function'),
 *  otherwise false. This can be used to wait until window.myVar is defined.
 */
function createIsType(object, property, type)
{
   return function()
   {
      if (typeof object[property] === type)
      {
         return true;
      }

      return false;
   }
}

/**
 * Useful function for waitForReady to wait until an object's property is
 * not a specified type.
 * eg:
 *    createIsType(window, myVar, 'undefined')
 *
 * creates a function that returns true if (typeof window.myVar !== 'undefined'),
 *  otherwise false. This can be used to wait until window.myVar is defined.
 */
function createIsNotType(object, property, type)
{
   return function()
   {
      if (typeof object[property] !== type)
      {
         return true;
      }

      return false;
   }
}

})();
