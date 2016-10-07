/*
 ***************************************************************
 filename: jsEx/array.js
 description: JavaScript functions and extended methods
 ***************************************************************
 */

// Array Remove – By John Resig (MIT Licensed)
// Usages:
// - Remove the second item: `array.remove(1);`
// - Remove the second-to-last item: `array.remove(-2);`
// - Remove the second and third items: `array.remove(1,2);`
// - Remove the last and second-to-last items: `array.remove(-2,-1);`
// See http://ejohn.org/blog/javascript-array-remove
// For golbal extension, use the one on prototype
Array.remove = function (array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

// Array Remove (global extension) - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// See http://ejohn.org/blog/javascript-array-remove/#postcomment
Array.prototype.removeRange = function(from, to) {
  this.splice(from, (to || from || 1) + (from < 0 ? this.length : 0));
  return this.length;
};
