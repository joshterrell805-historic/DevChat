
/**
 * Merge both objects into one where object2 has priority on properties.
 * Creates a new object--object1 and object2 are not modified.
 *
 * Optionally prototype can be specified as the prototype of the new object.
 */
module.exports = function merge(object1, object2, prototype)
{
   // TODO this is definitely not the most efficient way to merge.

   var retObj = Object.create(prototype ? prototype : Object.prototype);

   var keys = Object.keys(object1).concat(Object.keys(object2));

   for (var i = 0; i < keys.length; ++i)
   {
      var key = keys[i];

      if (typeof retObj[key] === "undefined")
      {

         if (typeof object2[key] !== "undefined")
         {
            retObj[key] = object2[key];
         }
         else
         {
            retObj[key] = object1[key];
         }
      }
   }

   return retObj;
}
