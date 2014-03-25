var Menu = (function()
{

/**
 * A menu with menu items.. it does highlighting and stuff.
 */

/**
 * @param text the text of the menuitem to add
 * @param handler function to call when the menu item is selected by user
 */
Menu.prototype.addItem = addItem;

/**
 * Show the menu
 */
Menu.prototype.show = show;

/**
 * Hide the menu
 */
Menu.prototype.hide = hide;


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function Menu()
{
   this.container = $("#menu");
}

function addItem(text, handler)
{
   var inner = $("<div class=\"menuItemInner\"></div>");
   inner.html(text);

   var outer = $("<div class=\"menuItemOuter\"></div>");
   outer.append(inner);

   this.container.append(outer);

   outer.hover(
      highlightItem.bind(outer),
      unhighlightItem.bind(outer)
   );

   outer.click(handler);
}

function show()
{
   this.container.show();
}

function hide()
{
   this.container.hide();
}

// bound to the item
function highlightItem()
{
   this.addClass("menuHover");
}

// bound to the item
function unhighlightItem()
{
   this.removeClass("menuHover");
}

return Menu;

})();
