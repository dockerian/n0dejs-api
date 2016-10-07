/**
 * es5: some examples and notes of using es5
 */
this.description = "this is at most outer scope " + this;

console.log('........................................');
// understand what is "this" ...
console.log(">>step: at most outer scope, 'this' is the container object -");
console.log("  this == " + this.description);

var testThis = function testThisFunc() {
  funcInsideFunc();

  function funcInsideFunc() {
    console.log("  this == " + this.description);
  }
}

console.log(">>step: inside nested function scopes, 'this' is undefined -");
testThis();

console.log('........................................');
console.log(">>step: function hoisting over var -");
// remember 'function' definition is also hoisted (over hoisted variables).
// caution: since assignment is not hoisted with either `var` or `function`
//          definition, later assignment could change the definition, which
//          means variable assignment override function declaration.
var a; // var `a` will be override by function `a` unless var a = 'a is a variable';
function a() { return 'a is a function, even if `var a;` is before `function a(){}`;'; }
console.log('a is typeof ' + (typeof a) + ': ' + a);
a = "var a = 'a now becomes a variable after assinment!';";
console.log('a is typeof ' + (typeof a) + ': ' + a);
a = function a() { return 'i changed to a function by assigment `a = function () { ... };`'; }
console.log('a is typeof ' + (typeof a) + ': ' + a);
var aVariable = "var aVariable = 'by both definition and assignment, aVariable is not override by `function aVariable() {}`';";
function aVariable() { return 'can aVariable be hoisted to a function? '; }
console.log('aVariable is typeof ' + (typeof aVariable) + ': ' + aVariable);

console.log('........................................');
// variable defined by 'var' is hoisted but undefined yet [just no error thrown]
console.log(">>step: var hoistedVariable = ...");
console.log("  hoistedVariable (before var defined, hoisted, no error) == " + hoistedVariable);
var hoistedVariable = "variable defined by 'var' is hoisted.";
console.log("  hoistedVariable (after: var defined) == " + JSON.stringify(hoistedVariable));

// variable defined without 'var' is a global variable
try {
  console.log(">>step: global variable (without 'var') is not hoisted (throwing error) - ")
  console.log("someVariable == " + JSON.stringify(someVariable));
}
catch (ex) {
  console.log("  " + ex);
}
console.log(">>step: someVariable = ...");
someVariable = "some global variable";
console.log("  someVariable (after defined) == " + JSON.stringify(someVariable));

console.log('........................................');
for(var i = 0; i < 3; i++) console.log(i)
console.log(`>>step: i = ${i} (after used in for loop: for(var i = 0; i < 3; i++))`)

console.log('........................................');
console.log(">>step: Function vs Object");
console.log("Function.constructor === null ? (result) == " + (Function.constructor === null));
console.log("Function.prototype.constructor === null ? (result) == " + (Function.prototype.constructor === null));
console.log("Function.prototype.constructor === Function ? (result) == " + (Function.prototype.constructor === Function));
console.log("Function.prototype.__proto__ === Object.prototype ? (result) == " + (Function.prototype.__proto__ === Object.prototype));
console.log("Function.prototype === Function.__proto__ ? (result) == " + (Function.prototype === Function.__proto__));
console.log("Function.prototype === Object.prototype ? (result) == " + (Function.prototype === Object.prototype) + " ***");
console.log("Function.prototype === Object.__proto__ ? (result) == " + (Function.prototype === Object.__proto__));
console.log()
console.log("Object === Fuction ? (result) == " + (Object === Function));
console.log("Object.prototype.__proto__ === Object.__proto__ ? (result) == " + (Object.prototype.__proto__ === Object.__proto__));
console.log("Object.prototype.constructor === Object ? (result) == " + (Object.prototype.constructor === Object));
console.log("Object.prototype.__proto__ === Object.__proto__ ? (result) == " + (Object.prototype.__proto__ === Object.__proto__) + " ***");
console.log("Object.prototype.__proto__ === null ? (result) == " + (Object.prototype.__proto__ === null));

/*
******************************************************************************
About javascript class -
- A `function Class() {}` is an object, and a class constructor;
- Class.constructor points to Function;
- Class.__proto__ points to Function.prototype;
- Only class constructor has `prototype`, which is a (non-Function) object;
- Class.prototype.constructor points to Class itself;
- Class.prototype.__proto__ points to Object.prototype (by default)
- Class instance.__proto__ points to Class, the constructor
- Do NOT use __proto__ directly
******************************************************************************
*/
Function.prototype.functionName = function() {
  // usage: arguments.callee.functionName();
  var name=/\W*function\W+(\w+)/.exec(this);
  return name ? name[1] : 'Anonymous';
}

console.log('........................................');
console.log(">>step: define derives(Child, Parent) on Object.prototype");
Object.prototype.derives = function derives(ChildClass, ParentClass) {
  if (ChildClass instanceof Function) {
    ChildClass.inherits(ParentClass);
  } else {
    throw new TypeError("ChildClass must be a Function.");
  }
}

console.log(">>step: define inherits(Parent) on Object.prototype");
Object.prototype.inherits = function inheritsFromClass(Parent) {
  if (this instanceof Function) {
    if (Parent instanceof Function) {
      function F() {}
      F.prototype = Parent.prototype;
      this.prototype = new F();
      this.prototype.constructor = this;
      this.prototype.parentClass = Parent.prototype;
      this.parent = Parent.prototype;
    }
    else {
      throw new TypeError("Cannot inherit from a non-class (Function) object.");
    }
  } else {
    throw new TypeError("Only a class (Function object) can inherits.");
  }
}

console.log(">>step: define getMembers() on Object.prototype");
Object.prototype.getMembers = function getInstanceMembers(byClass, byInstance, excludeFunction) {
  var members = [];
  for(var member in this) {
    var all = !byClass && !byInstance;
    var filtering = byClass || byInstance;
    var byInstanceOnly = this.hasOwnProperty(member);
    var byClassOnly = this.constructor.prototype.hasOwnProperty(member);

    if (filtering && !byClass && !byInstanceOnly) continue;
    if (filtering && !byInstance && !byClassOnly) continue;
    if (filtering && !byClassOnly && !byInstanceOnly) continue;

    if (!excludeFunction || typeof this[member] != 'function')
    {
      members.push(member);
    }
  }
  return members;
}

console.log(">>step: define hasProperty() on Object.prototype");
Object.prototype.hasProperty = function hasProperty(prop, excludeFunction) {
  // this function can be simplified by just one line -
  // return (prop in this) && (!excludeFunction || typeof this[prop] != 'function')
  // the following is for demonstration only
  var result = false;
  if (!prop) return false;
  if (this.hasOwnProperty(prop)) {
    result = true;
  } else {
    var constructor = this.constructor;
    do {
      if (constructor.hasOwnProperty(prop)) {
        result = true;
        break;
      }
    } while(constructor != Function.constructor);
  }
  return result && (!excludeFunction || typeof this[prop] != 'function');
}

console.log(">>step: define toClassType() on Object.prototype");
Object.prototype.toClassType = function toClassType() {
  var matches = this.constructor.toString().match(/function (.+)\(/);
  return matches.length > 1 ? matches[1] : 'unknown';
}
console.log(">>step: define toType() on Object.prototype");
Object.prototype.toType = function toType() {
  return ({}).toString.call(this).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

function toType(variable) {
  return ({}).toString.call(variable).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

console.log(">>step: define traverse() on Object.prototype");
Object.prototype.traverse = function traverse(func) {
  if (toType(func) == 'function') {
    if (this.toType() == "object") {
      for(var key in this) {
        func.apply(this, [key, this[key]]);
        if (this[key] !== null && this[key].toType() == "object") {
          this[key].traverse(func);
        }
      }
    }
  }
}

console.log(">>step: define updateBy() on Object.prototype");
Object.prototype.updateBy = function updateBy(data) {
  if (data != null && this !== data) {
    var sourceType = this.toType();
    var targetType = data.toType();

    if (sourceType != targetType) {
      var message = "Cannot update '" + sourceType + "' with different type " + targetType;
      throw new Error(message);
    }
    else if (sourceType == 'object') {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          if (this.hasOwnProperty(key) && data[key] != null) {
            var thisType = toType(this[key]);
            var thatType = toType(data[key]);
            if (thisType == 'object' && thisType == thatType && this[key] != null) {
              console.log("updating this[" + key + "] object ... ");
              this[key].updateBy(data[key]);
            }
            else {
              console.log("updating this[" + key + "] = " + JSON.stringify(data[key]));
              this[key] = data[key];
            }
          }
          else if (!this.hasOwnProperty(key)) {
            this[key] = data[key];
          }
          else {
            delete this[key];
          }
        }
      }
      for (var key in this) {
        if (this.hasOwnProperty(key)) {
          if (!data.hasOwnProperty(key) || data[key] == null) {
            delete this[key];
          }
        }
      }
    }
    else {
      throw new Error("Does not support updating type of " + thisType);
    }
  }
}

console.log('========================================');

/*
******************************************************************************
  javascript OOP has 2 design patterns in use of function
  1. class pattern:
     - use function as a constructor object
     - use function definition with a Carmel-case-style `ClassName`
     - any object has a built-in object `prototype`, same as constructor
     - the constructor should never be used as a function to call
     - use on instances with need of sharing methods and properties
     - use `new` with `ClassName` to init `this` as a blank object `{}`
     - use `this` as instance to create public properties (inside constructor)
     - use `ClassName.prototype` to add any public method
     - use `ClassName.prototype.constructor` as the constructor itself
     - do NOT return anything inside the constructor
     - do NOT (need to) assign class constructor to a variable [to prevent hoisting]
     - do NOT use `this` inside constructor to create any public method
     - do NOT assign/overwrite `ClassName.prototype`
  2. module pattern:
    - use function as a function object
    - use function name, e.g. `myFunc` starting with lower case
    - use closure and return constructed object in definition body
    - use on instances WITHOUT need of sharing methods and properties
    - do NOT use `myFunc.prototype`
    - do NOT use `this` in function definition body
    - do NOT use `new` with function object
******************************************************************************
*/
console.log(">>step: class pattern: using function to define a (hoisted) class constructor - ");
console.log("  ShapeClass == " + ShapeClass);
console.log("  ShapeClass instanceof Function ? (result) == " + (ShapeClass instanceof Function));
console.log("  ShapeClass.prototype == " + JSON.stringify(ShapeClass.prototype));
console.log("  ShapeClass.prototype.constructor === ShapeClass ? (result) == " + (ShapeClass === ShapeClass.prototype.constructor));
console.log("  ShapeClass.constructor === Function ? (result) == " + (ShapeClass.constructor === Function));
console.log("  ShapeClass.constructor instanceof Function ? (result) == " + (ShapeClass.constructor instanceof Function));
console.log("  ShapeClass.constructor.prototype === Function.prototype ? (result ) == " + (ShapeClass.constructor.prototype === Function.prototype));
console.log("  ShapeClass.constructor.prototype === ShapeClass.__proto__ ? (result ) == " + (ShapeClass.constructor.prototype === ShapeClass.__proto__));
console.log("  ShapeClass.__proto__ == " + ShapeClass.__proto__);

// class pattern: using function to define a class constructor
function ShapeClass(size) {
  var info = "This is in shape constructor.";
  this.info = info;
  this.size = size;
  // defining public method in constructor is not recommended
  // since this will create a function object in each instance
  this.getShapeInfo = function getInfoClosure() {
    return info + ".. by size: " + size;
  };
}
var test = new ShapeClass(1);

console.log('........................................');
// class pattern: using prototype to define a public function shared by all class instances
console.log(">>step: using prototype to define public functions ...");
ShapeClass.prototype.getInfo = function getThisShapeInfo() {
  return this.info + ".. by size: " + this.size;
};
ShapeClass.prototype.getSize = function getShapeSize() {
  return this.size;
};

console.log(">>step: define a SquareClass");
function SquareClass(size) {
  var info = "This is a square.";
  ShapeClass.apply(this, arguments);
  this.info = info;
}

console.log(">>step: extend SquareClass from ShapeClass");
// derives(SquareClass, ShapeClass);
// SquareClass.prototype = inherits(ShapeClass);
SquareClass.inherits(ShapeClass);
console.log(">>step: adding getArea() to prototype ...");
SquareClass.prototype.getArea = function getSquareArea() {
  return this.size * this.size;
}

console.log("  SquareClass.prototype.constructor == " + SquareClass.prototype.constructor);

console.log('........................................');
var shape1 = new ShapeClass(10);
var shape2 = new ShapeClass(20);
var square = new SquareClass(9);

console.log(">>step: asserting objects ...");
console.log("  ShapeClass.getInfo == " + ShapeClass.getInfo);
console.log("  ShapeClass.getSize == " + ShapeClass.getSize);
console.log("  ShapeClass.prototype.getInfo == " + ShapeClass.prototype.getInfo);
console.log("  ShapeClass.prototype.getSize == " + ShapeClass.prototype.getSize);

console.log("  shape1.getInfo == " + shape1.getInfo);
console.log("  shape1.getSize == " + shape1.getSize);

console.log("  shape1 instanceof Function ? (result) == " + (shape1 instanceof Function));
console.log("  shape1.constructor === ShapeClass ? (result) == " + (shape1.constructor === ShapeClass));
console.log("  shape1.constructor.prototype === shape1.__proto__ ? (result) == " + (shape1.constructor.prototype === shape1.__proto__));
console.log(">>step: asserting object properties and methods ...");
console.log("  shape1.getMembers() == " + shape1.getMembers());
console.log("  shape1.getMembers(byClass=true) == " + shape1.getMembers(true));
console.log("  shape1.getMembers(byInstnace=true) == " + shape1.getMembers(false, true));
console.log("  shape1.getMembers(byClass=true, byInstance=true) == " + shape1.getMembers(true, true));
console.log(">>step: comparison -")
console.log("  shape1.getInfo === shape2.getInfo ? (result) == " + (shape1.getInfo === shape2.getInfo));
console.log("  shape1.getSize === shape2.getSize ? (result) == " + (shape1.getSize === shape2.getSize));
console.log(">>step: before shape1 info and size (1) changing -")
console.log("  shape1.getInfo() == " + shape1.getInfo());
shape1.info = "This is in a shape instance."
shape1.size = 100;
console.log(">>step: after: shape1 info and size (1) changed to 100 -")
console.log("  shape1.getInfo() == " + shape1.getInfo());
console.log("  shape1.getShapeInfo() == " + shape1.getShapeInfo());

console.log(">>step: asserting square object ...");
console.log("  SquareClass.prototype.constructor == " + SquareClass.prototype.constructor);
console.log("  square instanceof ShapeClass ? (result) == " + (square instanceof ShapeClass))
console.log("  square instanceof SquareClass ? (result) == " + (square instanceof SquareClass))
console.log("  square.info == " + square.info);
console.log("  square.size == " + square.size);
console.log("  square.getInfo() == " + square.getInfo());
console.log("  square.getArea() == " + square.getArea());

console.log('========================================');
console.log(">>step: module pattern: using function to define a procedure - ");

function someModule(arg1, arg2) {
  console.log('>>step: in module "someModule", this = ');
  console.log(this);
}

console.log(">>step: calling someModule()");
someModule();

console.log('........................................');
console.log(">>step: testing Object.update");

var a1 = { 'a': 1, b: 'b', c: 'c', d: new Date('2015-01-01') };
var a2 = { 'a': 2, b: 'bb', c: {'c1': 'cc'}, d: new Date() };
var a3 = { 'a': 3, b: 222, d: 'ddd', e: { 'e1': { 'e2': 'eee' } } };
var a4 = { 'a': { 'aaaa': 4 }, b: [2222, 2222], d: shape1, e: { 'e1': { 'e2': 5555 } } };
var a5 = { 'a': { 'aaaaa': 5 }, b: 55555, c: 'ccccc', e: { 'e1': { 'e2': 'e2', 'e2a': 55555 } } };

var a0 = a1;
console.log(JSON.stringify(a0));
a1.updateBy(a1);
a1.updateBy(a2);
console.log(JSON.stringify(a1));
a1.updateBy(a3);
console.log(JSON.stringify(a1));
a1.updateBy(a4);
console.log(JSON.stringify(a1));
a1.updateBy(a5);
console.log(JSON.stringify(a1));
console.log("a0 === a1 ? " + (a0 === a1));
console.log("a0.a === a1.a ? " + (a0['a'] === a1['a']));
console.log("a0.d === a1.d ? " + (a0['d'] === a1['d']));

console.log('........................................');
console.log(">>step: testing associative arry - bad idea ?");
var aa = new Array();
console.log("type of (new Array()) == " + toType(aa) + " " + JSON.stringify(aa));
aa['a'] = 'a';
aa['b'] = 'b';
console.log("type of (new Array()) == " + toType(aa) + " " + JSON.stringify(aa));
console.log(Object.keys(aa));

var id = "`Thi$ c0uld be @ very l0ng env!ronment name #%&)`";
console.log("id.raw = " + id);
console.log("id.css = " + getCssSelectorValue(id));


function getCssSelectorValue(nameValue) {
  if (typeof nameValue == "string") {
    return nameValue.replace(/([!"#$%&'\(\)*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1");
  }
  return "";
}
