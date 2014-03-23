Util = {
   htmlEscape   : htmlEscape,
   htmlUnescape : htmlUnescape,
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
