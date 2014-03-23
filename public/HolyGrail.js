/**
 * http://alistapart.com/article/holygrail
 *
 * The "Holy Grail" is a technique mentioned at the url posted above for making
 * a resizable center div with statically sized left and right divs all within
 * a containing div. Height is variable depending on content.
 *
 * @param leftColumnWidth the width of the left column
 * @param rightColumnWidth the width of the right column
 *
 * Both widths must be constant and static (no inherit or auto). Both widths
 *  must be passable to jQuery's css("width", width); function and be negatable.
 *
 * @return a HolyGrail Element with the following jquery elements for fields:
 *
 *  left       - the statically sized left column to place content in
 *  right      - the statically sized right column to place content in
 *  center     - the dynamically sized center column to place conent in
 *  container  - the container containing left, right, and center
 *
 * example:
 *
 *    var holyGrail = new HolyGrail("100px", "190px");
 *    holyGrail.left.html("left column");
 *    holyGrail.right.html("right column");
 *    holyGrail.center.html("&nbsp;");
 *    $(document).append(holyGrail.container);
 * 
 */
function HolyGrail(leftColumnWidth, rightColumnWidth)
{
   this.left = $("<div></div>");
   this.left.css({
      "float": "left",
      "position": "relative",
      "right": leftColumnWidth,
      "width": leftColumnWidth,
      "margin-left": "-100%",
   });

   this.right = $("<div></div>");
   this.right.css({
      "float": "left",
      "position": "relative",
      "width": rightColumnWidth,
      "margin-right": "-" + rightColumnWidth, 
   });

   this.center = $("<div></div>");
   this.center.css({
      "float": "left",
      "position": "relative",
      "width": "100%",
   });

   this.container = $("<div></div>");
   this.container.css({
      "padding-left": leftColumnWidth,
      "padding-right": rightColumnWidth, 
   });

   this.container.append(this.center);
   this.container.append(this.left);
   this.container.append(this.right);
}
