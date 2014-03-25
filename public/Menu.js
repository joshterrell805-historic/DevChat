
/**
 * A menu with menu items.. it does highlighting and stuff.
 */
function Menu(container)
{
   this.container = container;
}

/**
 * @param menuItem a jquery element to display as an item in the menu.
 */
Menu.prototype.addItem = function addItem(text, handler)
{
   var inner = $("<div class=\"menuItemInner\"></div>");
   inner.html(text);

   var outer = $("<div class=\"menuItemOuter\"></div>");
   outer.append(inner);

   this.container.append(outer);

   outer.hover(
      this.highlightItem.bind(outer),
      this.unhighlightItem.bind(outer)
   );

   outer.click(handler);
};

Menu.prototype.show = function show()
{
   this.container.show();
};

Menu.prototype.hide = function hide()
{
   this.container.hide();
};

// bound to the item
Menu.prototype.highlightItem = function highlightItem()
{
   this.addClass("menuHover");
};

// bound to the item
Menu.prototype.unhighlightItem = function unhighlightItem()
{
   this.removeClass("menuHover");
};
