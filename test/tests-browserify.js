(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"util/":6}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
},{"process/browser.js":2}],4:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],5:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],6:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":5,"_process":2,"inherits":4}],7:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
				value: true
});

var _DOMString = require("./DOMString");

var _DOMString2 = _interopRequireDefault(_DOMString);

var _boolean = require("./boolean");

var _boolean2 = _interopRequireDefault(_boolean);

var _double = require("./double");

var _double2 = _interopRequireDefault(_double);

var _long = require("./long");

var _long2 = _interopRequireDefault(_long);

var _EventTarget2 = require("./EventTarget");

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

var _AccessibleNodeList = require("./../src/AccessibleNodeList.js");

function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
								throw new TypeError("Cannot call a class as a function");
				}
}

function _possibleConstructorReturn(self, call) {
				if (!self) {
								throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
								throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

// all attributes used within AOM
var attributes = ["role", "aria-activedescendant", "aria-atomic", "aria-autocomplete", "aria-busy", "aria-checked", "aria-colcount", "aria-colindex", "aria-colspan", "aria-controls", "aria-current", "aria-describedby", "aria-details", "aria-disabled", "aria-dropeffect", "aria-errormessage", "aria-expanded", "aria-flowto", "aria-grabbed", "aria-haspopup", "aria-hidden", "aria-invalid", "aria-keyshortcuts", "aria-label", "aria-labelledby", "aria-level", "aria-live", "aria-modal", "aria-multiline", "aria-multiselectable", "aria-orientation", "aria-owns", "aria-placeholder", "aria-posinset", "aria-pressed", "aria-readonly", "aria-relevant", "aria-required", "aria-roledescription", "aria-rowcount", "aria-rowindex", "aria-rowspan", "aria-selected", "aria-setsize", "aria-sort", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"];

/**
 * 
 * @param {Mutation} mutations 
 */
function mutationObserverCallback(mutations) {
				var aom = this;

				mutations.forEach(function (mutation) {
								var attrName = mutation.attributeName;
								var newValue = aom._node.attributes[attrName] ? aom._node.attributes[attrName].value : undefined;
								var oldValue = aom._values[attrName];

								aom._defaultValues[attrName] = newValue;
								// store the default values set by an aria-* attribute
								if (newValue != oldValue) {
												aom._defaultValues[attrName] = newValue;
								}

								// overwrite the attribute if AOM has an different defined value
								if (oldValue && newValue != oldValue) {
												aom[attrName] = oldValue;
								}
				});
}

/**
 * Based on the AOM spec
 * @class
 */

var AccessibleNode = function (_EventTarget) {
				_inherits(AccessibleNode, _EventTarget);

				function AccessibleNode(node) {
								_classCallCheck(this, AccessibleNode);

								// store the node where the AccessibleNode is connected with
								var _this = _possibleConstructorReturn(this, (AccessibleNode.__proto__ || Object.getPrototypeOf(AccessibleNode)).call(this, node));

								Object.defineProperty(_this, "_node", { value: node });

								// set an hidden object to store all values in
								Object.defineProperty(_this, "_values", { value: {} });

								// store values of aria-* attributes
								Object.defineProperty(_this, "_defaultValues", { value: {} });

								// start the mutation observer if the AccessibleNode is connected to an node
								if (node) {
												var observer = new MutationObserver(mutationObserverCallback.bind(_this));
												observer.observe(_this._node, { attributes: true, attributeOldValue: true });
								}
								return _this;
				}

				return AccessibleNode;
}(_EventTarget3.default);

Object.defineProperties(AccessibleNode.prototype,
/** @lends AccessibleNode.prototype */
{
				/** 
    * Defines a type it represents, e.g. `tab`
    * 
    * @see https://www.w3.org/TR/wai-aria-1.1/#roles
    * @type  {?String}
    */
				"role": {
								enumerable: true,
								// writable: false,
								configurable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "role", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "role");
								}
				},

				/** 
     * Defines a human-readable, author-localized description for the role
     * 
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription
     * @type {?String}
     */
				"roleDescription": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-roleDescription", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-roleDescription");
								}
				},

				/* ******************* ACCESSIBLE LABEL AND DESCRIPTION ******************* */

				/** 
    * Defines a string value that labels the current element.
    * 
    * @see https://www.w3.org/TR/wai-aria-1.1/#aria-label
    * @type {?String} 
    */
				"label": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-label", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-label");
								}
				},

				/* *************** END OF ACCESSIBLE LABEL AND DESCRIPTION *************** */

				/* ********************* GLOBAL STATES AND PROPERTIES ********************* */

				/** 
     * Indicates the element that represents the current item within a container or set of related elements.
     * 
     * | Value | Description |
     * | --- | --- |
     * | page | used to indicate a link within a set of pagination links, where the link is visually styled to represent the currently-displayed page.
     * | step | used to indicate a link within a step indicator for a step-based process, where the link is visually styled to represent the current step.
     * | location | used to indicate the image that is visually highlighted as the current component of a flow chart.
     * | date | used to indicate the current date within a calendar.
     * | time | used to indicate the current time within a timetable.
     * | true | Represents the current item within a set.
     * | false | Does not represent the current item within a set.
     * 
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-current
     * @type {?String}
     */
				"current": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-current", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-current");
								}
				},

				/* ***************** END OF GLOBAL STATES AND PROPERTIES ***************** */

				/* ************************** WIDGET PROPERTIES ************************** */

				/**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's
     * intended value for an input and specifies how predictions would be presented if they are made.
     * 
     * The behavior during input is depends on the provided value, it follows beneath table.
     * 
     * | Value  | 	Description |
     * | ------ | --- |
     * | inline | Text suggesting may be dynamically inserted after the caret.
     * | list   | A collection of values that could complete the provided input is displayed.
     * | both   | Implements `inline` and `list`
     * | none   | No prediction is shown
     * 
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-autocomplete
     * @type {?String}
     */
				"autocomplete": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-autocomplete", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-autocomplete");
								}
				},

				/**
     * Returns/sets the visibility of the element who is exposed to an accessibility API.
     * @see {@link AccessibleNode#disabled}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-hidden
     * @type {?Boolean}
     */
				"hidden": {
								enumerable: true,
								set: function set(str) {
												return _boolean2.default.set(this, "aria-hidden", str);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-hidden");
								}
				},

				/**
     * Indicates keyboard shortcuts that an author has implemented to activate or
     * give focus to an element.
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-keyshortcuts
     * @type {?String}
     */
				"keyShortcuts": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-keyShortcuts", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-keyShortcuts");
								}
				},

				/** 
     * Indicates whether an element is modal when displayed.
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-modal
     * @type {?Boolean}
     */
				"modal": {
								enumerable: true,
								set: function set(str) {
												return _boolean2.default.set(this, "aria-modal", str);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-modal");
								}
				},

				/** 
     * Indicates whether a text box accepts multiple lines of input or only a single line.
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-multiline
     * @type {?Boolean}
     */
				"multiline": {
								enumerable: true,
								set: function set(str) {
												return _boolean2.default.set(this, "aria-multiline", str);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-multiline");
								}
				},

				/**
     * Indicates that the user may select more than one item from the current selectable descendants.
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable
     * @type {?Boolean}
     */
				"multiselectable": {
								enumerable: true,
								set: function set(str) {
												return _boolean2.default.set(this, "aria-multiselectable", str);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-multiselectable");
								}
				},

				/**
     * Indicates whether the element's orientation is `horizontal`, `vertical`, or `null`.
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-orientation
     * @type {?String}
     */
				"orientation": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-orientation", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-orientation");
								}
				},

				/**
     * Indicates that the user may select more than one item from the current selectable descendants.
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-readonly
     * @type {?Boolean}
     */
				"readOnly": {
								enumerable: true,
								set: function set(str) {
												return _boolean2.default.set(this, "aria-readOnly", str);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-readOnly");
								}
				},

				/**
     * Indicates that user input is required on the element before a form may be submitted.
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-required
     * @type {?Boolean}
     */
				"required": {
								enumerable: true,
								set: function set(str) {
												return _boolean2.default.set(this, "aria-required", str);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-required");
								}
				},

				/**
     * Indicates that user input is required on the element before a form may be submitted.
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-selected
     * @type {?Boolean}
     */
				"selected": {
								enumerable: true,
								set: function set(str) {
												return _boolean2.default.set(this, "aria-selected", str);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-selected");
								}
				},

				/**
     * Indicates if items in a table or grid are sorted in ascending or descending order.  
     * Possible values are `acending`, `descending`, `none`, `other` or `null`.
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-sort
     * @type {?Boolean}
     */
				"sort": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-sort", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-sort");
								}
				},

				/* *********************** END OF WIDGET PROPERTIES *********************** */

				/* ***************************** WIDGET STATES **************************** */

				/**
     * Indicates the current "checked" state of a {@link Widget}, among {@link Radio} and {@link Checkbox}
     * @see {@link AccessibleNode#pressed}
     * @see {@link AccessibleNode#selected}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-pressed
     * @type {?String}
     */
				"checked": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-checked", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-checked");
								}
				},

				/**
     * Indicates whether the element, or another grouping element it controls, 
     * is currently expanded or collapsed.
     * 
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-expanded
     * @type {?Boolean}
     */
				"expanded": {
								enumerable: true,
								set: function set(str) {
												return _boolean2.default.set(this, "aria-expanded", str);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-expanded");
								}
				},

				/**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     * 
     * @see {@link AccessibleNode#hidden}
     * @see {@link AccessibleNode#readonly}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-disabled
     * @type {?Boolean}
     */
				"disabled": {
								enumerable: true,
								set: function set(str) {
												return _boolean2.default.set(this, "aria-disabled", str);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-disabled");
								}
				},

				/**
     * Indicates the entered value does not conform to the format expected by the application.
     * 
     * @see {@link AccessibleNode#errorMessage}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage
     * @type {?String} 
     */
				"invalid": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-invalid", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-invalid");
								}
				},

				/**
     * Indicates the availability and type of interactive popup element, such as menu or dialog,
     * that can be triggered by an element.
     * 
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
     * @type {?String}
     */
				"hasPopUp": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-haspopup", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-haspopup");
								}
				},

				/**
     * Indicates the current "checked" state of a {@link Widget}, among {@link Radio} and {@link Checkbox}
     * 
     * @see {@link AccessibleNode#pressed}
     * @see {@link AccessibleNode#selected}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-pressed
     * @type {?String}
     */
				"pressed": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-pressed", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-pressed");
								}
				},

				/* ************************* END OF WIDGET STATES ************************* */

				/* **************************** CONTROL VALUES **************************** */

				/** 
     * Returns / sets the human readable text alternative of {@link #aria-valuenow} for a {@link Range} widget.
     * 
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext}
     * @type {?String}
     */
				"valueText": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-valueText", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-valueText");
								}
				},

				/**
     * Returns / sets a short hint intended to aid the user with data entry when the control has no value.
     * A hint could be a sample value or a brief description of the expected format.
     * 
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-placeholder}
     * @type {?String}
     */
				"placeholder": {
								enumerable: true,
								set: function set(str) {
												return _DOMString2.default.set(this, "aria-placeholder", str);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-placeholder");
								}
				},

				/** 
     * Returns / sets the current value for a {@link Range} widget.
     * 
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow}
     * @type {?Number}
     */
				"valueNow": {
								enumerable: true,
								set: function set(val) {
												return _double2.default.set(this, "aria-valuenow", val);
								},
								get: function get() {
												return _double2.default.get(this, "aria-valuenow");
								}
				},

				/** 
     * Returns / sets the minimum allowed value for a {@link Range} widget.
     * 
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin}
     * @type {?Number}
     */
				"valueMin": {
								enumerable: true,
								set: function set(val) {
												return _double2.default.set(this, "aria-valuemin", val);
								},
								get: function get() {
												return _double2.default.get(this, "aria-valuemin");
								}
				},

				/** 
     * Returns / sets the maximum allowed value for a {@link Range} widget.
     * 
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax}
     * @type {?Number}
     */
				"valueMax": {
								enumerable: true,
								set: function set(val) {
												return _double2.default.set(this, "aria-valuemax", val);
								},
								get: function get() {
												return _double2.default.get(this, "aria-valuemax");
								}
				},

				/* ************************ END OF CONTROL VALUES ************************ */

				// Live regions.
				"atomic": {
								enumerable: true,
								set: function set(val) {
												return _boolean2.default.set(this, "aria-atomic", val);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-atomic");
								}
				},
				"busy": {
								enumerable: true,
								set: function set(val) {
												return _boolean2.default.set(this, "aria-busy", val);
								},
								get: function get() {
												return _boolean2.default.get(this, "aria-busy");
								}
				},
				"live": {
								enumerable: true,
								set: function set(val) {
												return _DOMString2.default.set(this, "aria-live", val);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-live");
								}
				},
				"relevant": {
								enumerable: true,
								set: function set(val) {
												return _DOMString2.default.set(this, "aria-relevant", val);
								},
								get: function get() {
												return _DOMString2.default.get(this, "aria-relevant");
								}
				},

				/* ************************* OTHER RELATIONSHIPS ************************* */

				/**
     * Returns / sets the AccessibleNode of the currently active element when focus is on current element.
     * 
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant
     * @type {?AcccessibleNode}
     */
				"activeDescendant": {
								enumerable: true,
								set: function set(val) {
												return setAccessibleNode(this, "aria-activedescendant", val);
								},
								get: function get() {
												return getAccessibleNode(this, "aria-activedescendant");
								}
				},

				/**
     * Returns / sets an AccessibleNode that provides a detailed, extended description 
     * for the current element.
     * 
     * @see {@link AccessibleNode#describedBy}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-details
     * @type {?AcccessibleNode}
     */
				"details": {
								enumerable: true,
								set: function set(val) {
												return setAccessibleNode(this, "aria-details", val);
								},
								get: function get() {
												return getAccessibleNode(this, "aria-details");
								}
				},

				/**
     * Returns / sets an AccessibleNode that provides an error message for the current element.
     * 
     * @see {@link AccessibleNode#invalid}
     * @see {@link AccessibleNode#describedBy}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage
     * @type {?AcccessibleNode}
     */
				"errorMessage": {
								enumerable: true,
								set: function set(val) {
												return setAccessibleNode(this, "aria-errormessage", val);
								},
								get: function get() {
												return getAccessibleNode(this, "aria-errormessage");
								}
				},

				/* ********************** END OF OTHER RELATIONSHIPS ********************** */

				/* ***************************** COLLECTIONS ***************************** */

				/**
     * Returns / sets the total number of columns in a {@link Table}, {@link Grid}, or {@link Treegrid}.
     * 
     * @see {@link AccessibleNode#colIndex}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-setsize
     * @type {?Integer}
     */
				"colCount": {
								enumerable: true,
								set: function set(val) {
												return _long2.default.set(this, "aria-colcount", val);
								},
								get: function get() {
												return _long2.default.get(this, "aria-colcount");
								}
				},

				/**
     * Defines an element's column index or position with respect to the total number of columns 
     * within a {@link Table}, {@link Grid}, or {@link Treegrid}.
     * 
     * @see {@link AccessibleNode#colCount}
     * @see {@link AccessibleNode#colSpan}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colindex
     * @type {?Integer}
     */
				"colIndex": {
								enumerable: true,
								set: function set(val) {
												return _long2.default.set(this, "aria-colindex", val);
								},
								get: function get() {
												return _long2.default.get(this, "aria-colindex");
								}
				},

				/**
     * Defines the number of columns spanned by a cell or gridcell
     * within a {@link Table}, {@link Grid}, or {@link Treegrid}.
     * 
     * @see {@link AccessibleNode#colIndex}
     * @see {@link AccessibleNode#rowSpan}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colspan
     * @type {?Integer}
     */
				"colSpan": {
								enumerable: true,
								set: function set(val) {
												return _long2.default.set(this, "aria-colspan", val);
								},
								get: function get() {
												return _long2.default.get(this, "aria-colspan");
								}
				},

				/**
     * Defines an element's number or position in the current set of {@link listitem}s or {@link treeitem}s.
     * Not required if all elements in the set are present in the DOM.
     * 
     * @see {@link AccessibleNode#setSize}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-posinset
     * @type {?Integer}
     */
				"posInSet": {
								enumerable: true,
								set: function set(val) {
												return _long2.default.set(this, "aria-posinset", val);
								},
								get: function get() {
												return _long2.default.get(this, "aria-posinset");
								}
				},

				/**
     * Defines the total number of rows in a {@link Table}, {@link Grid}, or {@link Treegrid}.
     * 
     * @see {@link AccessibleNode#rowIndex}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount
     * @type {?Integer}
     */
				"rowCount": {
								enumerable: true,
								set: function set(val) {
												return _long2.default.set(this, "aria-rowcount", val);
								},
								get: function get() {
												return _long2.default.get(this, "aria-rowcount");
								}
				},

				/**
     * Defines an element's row index or position with respect to the total number of rows 
     * within a  {@link Table}, {@link Grid}, or {@link Treegrid}.
     * 
     * @see {@link AccessibleNode#rowCount}
     * @see {@link AccessibleNode#rowSpan}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex
     * @type {?Integer}
     */
				"rowIndex": {
								enumerable: true,
								set: function set(val) {
												return _long2.default.set(this, "aria-rowindex", val);
								},
								get: function get() {
												return _long2.default.get(this, "aria-rowindex");
								}
				},

				/**
     * Defines the number of rows spanned by a cell or gridcell
     * within a {@link Table}, {@link Grid}, or {@link Treegrid}.
     * 
     * @see {@link AccessibleNode#rowIndex}
     * @see {@link AccessibleNode#colSpan}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan
     * @type {?Integer}
     */
				"rowSpan": {
								enumerable: true,
								set: function set(val) {
												return _long2.default.set(this, "aria-rowspan", val);
								},
								get: function get() {
												return _long2.default.get(this, "aria-rowspan");
								}
				},

				/**
     * Defines the number of items in the current set of listitems or treeitems.
     * Not required if **all** elements in the set are present in the DOM.
     * @see {@link AccessibleNode#posInSet}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-setsize
     * @type {?Integer}
     */
				"setSize": {
								enumerable: true,
								set: function set(val) {
												return _long2.default.set(this, "aria-setsize", val);
								},
								get: function get() {
												return _long2.default.get(this, "aria-setsize");
								}
				},

				/**
     * Defines the hierarchical level of an element within a structure.
     * E.g. `&lt;h1&gt;&lt;h1/&gt;` equals `&lt;div role="heading" aria-level="1"&gt;&lt;/div>`
     * 
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-level
     * @type {?Integer}
     */
				"level": {
								enumerable: true,
								set: function set(val) {
												return _long2.default.set(this, "aria-level", val);
								},
								get: function get() {
												return _long2.default.get(this, "aria-level");
								}
				},

				/* ************************** END OF COLLECTIONS ************************** */

				/* ****************** ACCESSIBLE LABEL AND DESCRIPTION ****************** */

				/**
     * Returns an list with AccessibleNode instances that labels the current element
     * 
     * @see {@link AccessibleNode#describedBy}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby
     * @type {AccessibleNodeList}
     */
				"labeledBy": {
								enumerable: true,
								set: function set(val) {
												if (!(val instanceof _AccessibleNodeList.AccessibleNodeListConstructor)) {
																throw new Error("It must be an instance of AccessibleNodeList");
												}

												this._values.labeledBy = val;
												val.parentAOM = this;
												val.attribute = "aria-labelledby";
								},
								get: function get() {
												return this._values.labeledBy || null;
								}
				},

				/**
     * Returns an list with AccessibleNode instances that describes the current element
     * 
     * @see {@link AccessibleNode#labeledBy}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-describedby
     * @type {AccessibleNodeList}
     */
				"describedBy": {
								enumerable: true,
								set: function set(val) {
												if (!(val instanceof _AccessibleNodeList.AccessibleNodeListConstructor)) {
																throw new Error("It must be an instance of AccessibleNodeList");
												}

												this._values.describedBy = val;
												val.parentAOM = this;
												val.attribute = "aria-describedby";
								},
								get: function get() {
												return this._values.describedBy || null;
								}
				},

				/* ************** END OF ACCESSIBLE LABEL AND DESCRIPTION ************** */

				/* ************************ OTHER RELATIONSHIPS ************************ */

				/**
     * Returns an list with AccessibleNode instances whose contents or presence are controlled by
     * the current element.
     * 
     * @see {@link AccessibleNode#owns}
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-controls
     * @type {AccessibleNodeList}
     */
				"controls": {
								enumerable: true,
								set: function set(val) {
												if (!(val instanceof _AccessibleNodeList.AccessibleNodeListConstructor)) {
																throw new Error("It must be an instance of AccessibleNodeList");
												}

												this._values.controls = val;
												val.parentAOM = this;
												val.attribute = "aria-controls";
								},
								get: function get() {
												return this._values.controls || null;
								}
				},

				/**
     * Contains the next element(s) in an alternate reading order of content which, at the user's 
     * discretion, allows assistive technology to override the general default of reading in
     * document source order.
     * 
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-flowto
     * @type {AccessibleNodeList}
     */
				"flowTo": {
								enumerable: true,
								set: function set(val) {
												if (!(val instanceof _AccessibleNodeList.AccessibleNodeListConstructor)) {
																throw new Error("It must be an instance of AccessibleNodeList");
												}

												this._values.flowTo = val;
												val.parentAOM = this;
												val.attribute = "aria-flowto";
								},
								get: function get() {
												return this._values.flowTo || null;
								}
				},

				/**
     * Contains children who's ID are referenced inside the `aria-owns` attribute
     * @see https://www.w3.org/TR/wai-aria-1.1/#aria-owns
     * @type {AccessibleNodeList}
     */
				"owns": {
								enumerable: true,
								set: function set(val) {
												if (!(val instanceof _AccessibleNodeList.AccessibleNodeListConstructor)) {
																throw new Error("It must be an instance of AccessibleNodeList");
												}
												this._values.owns = val;
												val.parentAOM = this;
												val.attribute = "aria-owns";
								},
								get: function get() {
												return this._values.owns || null;
								}

								/* ********************* END OF OTHER RELATIONSHIPS ********************* */
				} });

function setAccessibleNode(aom, attribute, value) {
				if (value == undefined) {
								// remove ID of connected element if generated
								if (aom._values[attribute] && aom._values[attribute].generated_id) {
												aom._values[attribute]._node.removeAttribute("id");
												aom._values[attribute].generated_id = false;
								}

								aom._values[attribute] = value;
								return aom._node.removeAttribute(attribute);;
				} else if (!(value instanceof AccessibleNode)) {
								throw new TypeError("Failed to set the '#{attribute}' property on 'AccessibleNode': The provided value is not of type 'AccessibleNode'");
				}

				if (value._node) {
								if (!value._node.id) {
												/** @todo remove temp id */
												value._node.id = "id-" + parseInt(Math.random() * 1000000);
												value.generated_id = true;
												console.log(value, value.generated_id);
								}

								aom._node.setAttribute(attribute, value._node.id);
				}

				aom._values[attribute] = value;
				return value;
}
function getAccessibleNode(aom, attribute) {
				var value = aom._values[attribute];
				if (value == undefined) {
								var attr = aom._node.getAttribute(attribute);
								if (attr == undefined) return null;
								return elements.get(document.getElementById(attr));
				}
				return value;
}

exports.default = AccessibleNode;

},{"./../src/AccessibleNodeList.js":8,"./DOMString":9,"./EventTarget":10,"./boolean":11,"./double":12,"./long":14}],8:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AccessibleNodeListConstructor = undefined;

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _AccessibleNode = require("./AccessibleNode");

var _AccessibleNode2 = _interopRequireDefault(_AccessibleNode);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _extendableBuiltin(cls) {
	function ExtendableBuiltin() {
		var instance = Reflect.construct(cls, Array.from(arguments));
		Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
		return instance;
	}

	ExtendableBuiltin.prototype = Object.create(cls.prototype, {
		constructor: {
			value: cls,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(ExtendableBuiltin, cls);
	} else {
		ExtendableBuiltin.__proto__ = cls;
	}

	return ExtendableBuiltin;
}

var AccessibleNodeListConstructor = exports.AccessibleNodeListConstructor = function (_extendableBuiltin2) {
	_inherits(AccessibleNodeList, _extendableBuiltin2);

	function AccessibleNodeList() {
		_classCallCheck(this, AccessibleNodeList);

		return _possibleConstructorReturn(this, (AccessibleNodeList.__proto__ || Object.getPrototypeOf(AccessibleNodeList)).apply(this, arguments));
	}

	_createClass(AccessibleNodeList, [{
		key: "item",
		value: function item(index) {
			if (isNaN(index)) return;
			return this[index];
		}
	}, {
		key: "add",
		value: function add(accessibleNode) {
			var before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (!(accessibleNode instanceof _AccessibleNode2.default)) {
				throw new TypeError("Failed to execute 'add' on 'AccessibleNodeList': parameter 1 is not of type 'AccessibleNode'.");
			}

			if (before !== null) {
				var beforeIndex = this.indexOf(before);
				if (beforeIndex > -1) {
					return this.splice(beforeIndex - 1, 0, accessibleNode);
				}
			}

			return this.push(accessibleNode);
		}
	}, {
		key: "remove",
		value: function remove(index) {
			var _this2 = this;

			// update DOM attribute
			if (this.parentAOM && this[index]._node && this[index]._node.id) {
				var ids = [];

				if (this.parentAOM._node.hasAttribute(this.attribute)) {
					ids = this.parentAOM._node.getAttribute(this.attribute).split(" ");
				} else {
					ids = [];
				}

				var filteredIds = ids.filter(function (e) {
					return e !== _this2[index]._node.id;
				});

				// remove generated ids as long it was previously referenced
				if (this[index].generated_id === true && filteredIds.length < ids.length) {
					this[index]._node.id = "";
				}

				this.parentAOM._node.setAttribute(this.attribute, filteredIds.join(" "));
			}

			return this.pop(index);
		}
	}]);

	return AccessibleNodeList;
}(_extendableBuiltin(Array));

var arrayChangeHandler = {
	set: function set(target, property, value) {
		// adding or changing a value inside the array
		if (!isNaN(property)) {

			// check if its valid type
			if (value instanceof _AccessibleNode2.default) {
				target[property] = value;

				// update DOM attribute
				if (target.parentAOM && value && value._node) {
					if (!value._node.id) {
						value._node.id = "aom-" + Date.now();
						value.generated_id = true;
					}

					var ids = [];
					if (target.parentAOM._node.hasAttribute(target.attribute)) {
						ids = target.parentAOM._node.getAttribute(target.attribute).split(" ");
					} else {
						ids = [];
					}

					ids.push(value._node.id);

					target.parentAOM._node.setAttribute(target.attribute, ids.join(" "));
				}

				target[property] = value;
				return true;
			}

			throw new Error("Only instances of AccessibleNode are allowed");
		}

		target[property] = value;
		// you have to return true to accept the changes
		return true;
	}
};

/**
 * 
 */
function AccessibleNodeListProxy() {
	var accessibleNodeList = new AccessibleNodeListConstructor();
	return new Proxy(accessibleNodeList, arrayChangeHandler);
}

exports.default = AccessibleNodeListProxy;

},{"./AccessibleNode":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.set = set;
/**
 * Returns the value of a given attribute
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @return {String} attribute's value
 */
function get(aom, attributeName) {
  return aom._values[attributeName] || aom._node.getAttribute(attributeName);
}

/**
 * Sync the new value to the DOM
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @param {String | Number } status 
 */
function set(aom, attributeName, status) {
  if (status == undefined) {
    aom._node.removeAttribute(attributeName);
  } else {
    aom._node.setAttribute(attributeName, status);
  }

  aom._values[attributeName] = typeof status != "undefined" ? status.toString() : status;
  return status;
}

exports.default = { get: get, set: set };

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var EventTarget = function () {
    function EventTarget() {
        _classCallCheck(this, EventTarget);

        Object.defineProperty(this, "_listeners", { value: new Map() });
    }

    _createClass(EventTarget, [{
        key: "addEventListener",
        value: function addEventListener(type, listener) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (!this._listeners.has(type)) {
                this._listeners.set(type, []);
            }
            this._listeners.get(type).push({ listener: listener, options: options });
        }
    }, {
        key: "removeEventListener",
        value: function removeEventListener(type, callback, options) {
            if (!this._listeners.has(type)) {
                return;
            }
            var stack = this._listeners.get(type);
            stack.forEach(function (listener, i) {
                if (listener.listener === callback) {
                    stack.splice(i, 1);
                    return;
                }
            });
        }
    }, {
        key: "dispatchEvent",
        value: function dispatchEvent(event) {
            var _this = this;

            if (!this._listeners.has(event.type)) {
                return true;
            }
            var stack = this._listeners.get(event.type);

            stack.forEach(function (listener) {
                listener.call(_this, event);
            });

            return !event.defaultPrevented;
        }
    }]);

    return EventTarget;
}();

exports.default = EventTarget;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.set = set;
/**
 * Returns the value of given attribute as Boolean
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @return {Boolean} attribute's value
 */
function get(aom, attributeName) {
  var value = aom._values[attributeName] || aom._node.getAttribute(attributeName);

  if (value == undefined) return null;
  return value == "true" || false;
}

/**
 * Sync the new value to the property
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @param {String | Boolean} status 
 */
function set(aom, attributeName, status) {
  if (status == undefined) {
    aom._node.removeAttribute(attributeName);
  } else {
    aom._node.setAttribute(attributeName, status);
  }

  aom._values[attributeName] = status != undefined ? status.toString() : status;
  return status;
}

exports.default = { get: get, set: set };

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.set = set;
/**
 * Returns the value of a given attribute as Number
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @return {Number} attribute's value
 */
function get(aom, attributeName) {
  var value = aom._values[attributeName] || aom._node.getAttribute(attributeName);;
  if (value == undefined) return null;
  return Number(value);
}

/**
 * Sync the new value to the DOM
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @param {String | Number } status 
 */
function set(aom, attributeName, str) {
  if (str == null) {
    aom._node.removeAttribute(attributeName);
  } else {
    aom._node.setAttribute(attributeName, str);
  }

  aom._values[attributeName] = status.toString();
  return status;
}

exports.default = { get: get, set: set };

},{}],13:[function(require,module,exports){
'use strict';

var _AccessibleNode = require('./../src/AccessibleNode.js');

var _AccessibleNode2 = _interopRequireDefault(_AccessibleNode);

var _AccessibleNodeList = require('./../src/AccessibleNodeList.js');

var _AccessibleNodeList2 = _interopRequireDefault(_AccessibleNodeList);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

// if (!window.AccessibleNode && !window.AccessibleNodeList) {

/* eslint: source-type: module */

window.AccessibleNode = _AccessibleNode2.default;
window.AccessibleNodeList = _AccessibleNodeList2.default;

var elements = new WeakMap();

Object.defineProperty(window.Element.prototype, 'accessibleNode', {
    get: function get() {
        if (elements.has(this)) {
            return elements.get(this);
        }

        var aom = new _AccessibleNode2.default(this);
        elements.set(this, aom);
        return aom;
    }
});

// (function (getAttribute) {
//     Element.prototype.getAttribute = function (name) {
//         var attribute = getAttribute.call(this, name);

//         if(
//             name.indexOf("aria-") == 0
//             && this.accessibleNode 
//             && typeof this.accessibleNode._defaultValues[name] != "undefined"
//         ) {
//             console.log("get", this.accessibleNode._defaultValues[name])
//             return this.accessibleNode._defaultValues[name];
//         }

//         return attribute;
//     }
// })(Element.prototype.getAttribute);

// }

},{"./../src/AccessibleNode.js":7,"./../src/AccessibleNodeList.js":8}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.set = set;
/**
 * Returns the value of a given attribute as Integer
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @return {Number} attribute's value
 */
function get(aom, attributeName) {
  var value = aom._values[attributeName] || aom._node.getAttribute(attributeName);;
  if (value == undefined) return null;
  return parseInt(value);
}

/**
 * Sync the new value to the DOM
 * @param {AccessibleNode} aom 
 * @param {String} attributeName 
 * @param {String | Number } status 
 */
function set(aom, attributeName, str) {
  if (str == null) {
    aom._node.removeAttribute(attributeName);
  } else {
    aom._node.setAttribute(attributeName, str);
  }

  aom._values[attributeName] = status.toString();
  return status;
}

exports.default = { get: get, set: set };

},{}],15:[function(require,module,exports){
'use strict';

var _AccessibleNodeList = require('./../src/AccessibleNodeList.js');

var _timers = require('timers');

/* eslint-env mocha */

var assert = require('assert');

var attributes = {
    'role': { type: String },
    'roleDescription': { type: String },
    'label': { type: String },
    'labeledBy': { type: _AccessibleNodeList.AccessibleNodeListConstructor },
    'describedBy': { type: _AccessibleNodeList.AccessibleNodeListConstructor },
    'current': { type: String },
    'autocomplete': { type: String },
    'hidden': { type: Boolean },
    'keyShortcuts': { type: String },
    'modal': { type: Boolean },
    'multiline': { type: Boolean },
    'multiselectable': { type: Boolean },
    'orientation': { type: String },
    'readOnly': { type: Boolean },
    'required': { type: Boolean },
    'selected': { type: Boolean },
    'sort': { type: String },
    'checked': { type: String },
    'expanded': { type: Boolean },
    'disabled': { type: Boolean },
    'invalid': { type: String },
    'hasPopUp': { type: String },
    'pressed': { type: String },
    'valueText': { type: String },
    'placeholder': { type: String },
    'valueNow': { type: Number },
    'valueMin': { type: Number },
    'valueMax': { type: Number },
    'atomic': { type: Boolean },
    'busy': { type: Boolean },
    'live': { type: String },
    'relevant': { type: String },
    'activeDescendant': { type: window.AccessibleNode },
    'controls': { type: _AccessibleNodeList.AccessibleNodeListConstructor },
    'details': { type: window.AccessibleNode },
    'errorMessage': { type: window.AccessibleNode },
    'flowTo': { type: _AccessibleNodeList.AccessibleNodeListConstructor },
    'owns': { type: _AccessibleNodeList.AccessibleNodeListConstructor },
    'colCount': { type: Number },
    'colIndex': { type: Number },
    'colSpan': { type: Number },
    'posInSet': { type: Number },
    'rowCount': { type: Number },
    'rowIndex': { type: Number },
    'rowSpan': { type: Number },
    'setSize': { type: Number },
    'level': { type: Number }
};

describe('AccessibleNode', function () {
    var div = document.createElement("div");

    it('constructor exist', function () {
        assert.ok(window.AccessibleNode.prototype && window.AccessibleNode.prototype.constructor && window.AccessibleNode.prototype.constructor.name);
    });

    describe('on HTMLElement', function () {
        it('should have an accessibleNode property', function () {
            assert.ok(div.accessibleNode);
        });
        it('should be of correct type', function () {
            assert.equal(div.accessibleNode.constructor.name, window.AccessibleNode.name);
        });
    });

    describe('instance', function () {
        it('should have all aria-* attributes', function () {
            var missingAttrs = Object.keys(attributes).filter(function (attribute) {
                return typeof div.accessibleNode[attribute] == "undefined";
            });
            assert.deepEqual(missingAttrs, []);
        });
    });

    describe('each attribute', function () {
        it('should have as default value of null', function () {
            for (var attr in attributes) {
                assert.equal(div.accessibleNode[attr], null);
            }
        });
        it('should have the correct type', function () {
            for (var attr in attributes) {
                // set some (fake) data
                switch (attributes[attr].type) {
                    case String:
                        div.accessibleNode[attr] = "30px";
                        break;
                    case Boolean:
                    case Number:
                        div.accessibleNode[attr] = "30";
                        break;
                    case _AccessibleNodeList.AccessibleNodeListConstructor:
                        div.accessibleNode[attr] = new window.AccessibleNodeList();
                        break;
                    default:
                        div.accessibleNode[attr] = new attributes[attr].type();
                }

                if (div.accessibleNode[attr] === null) console.log(attr, div.accessibleNode[attr]);
                var actual = div.accessibleNode[attr].constructor.name;
                var expected = attributes[attr].type.name;

                assert.equal(actual, expected, 'The property \'' + attr + '\' is not correctly defined, it was ' + actual + ', but expected ' + expected);
            }
        });
        describe('of type AccessibleNode', function () {
            var anAttributes = Object.entries(attributes).filter(function (attr) {
                return attr[1].type == window.AccessibleNode;
            });

            it('should only allow an instance of AccessibleNode or null as value', function () {
                anAttributes.forEach(function (obj) {
                    var attr = obj[0];

                    assert.throws(function () {
                        return div.accessibleNode[attr] = new String();
                    });
                    assert.throws(function () {
                        return div.accessibleNode[attr] = "";
                    });
                    assert.doesNotThrow(function () {
                        return div.accessibleNode[attr] = new window.AccessibleNode();
                    });
                });
            });

            describe('Polyfill', function () {
                var attr = "owns";
                var div = document.createElement("div");

                var divWithID = document.createElement("div");
                divWithID.id = "aom-id";

                var divWithoutID = document.createElement("div");

                it('ID of added element should be reflected in the ARIA', function () {
                    div.accessibleNode.activeDescendant = divWithID.accessibleNode;
                    assert.equal(div.getAttribute("aria-activedescendant"), divWithID.id);
                });
                it('ID of removed element should be reflected in the ARIA', function () {
                    div.accessibleNode.activeDescendant = null;
                    assert.equal(div.getAttribute("aria-activedescendant"), null);
                });
                it('an added element without ID should be generated and reflect in the ARIA attribute', function () {
                    div.accessibleNode.activeDescendant = divWithoutID.accessibleNode;
                    assert.equal(div.getAttribute("aria-activedescendant"), divWithoutID.id);
                });
                it('an generated ID should be removed after no connection exist anymore', function () {
                    div.accessibleNode.activeDescendant = null;
                    assert.equal(div.getAttribute("aria-activedescendant"), null);
                    assert.equal(divWithoutID.id, '');
                });
            });
        });
        describe('of type AccessibleNodeList', function () {
            var anlAttributes = Object.entries(attributes).filter(function (attr) {
                return attr[1].type == _AccessibleNodeList.AccessibleNodeListConstructor;
            });

            it('should only allow an instance of AccessibleNodeList as value', function () {
                anlAttributes.forEach(function (obj) {
                    var attr = obj[0];
                    assert.throws(function () {
                        return div.accessibleNode[attr] = new String();
                    });
                    assert.throws(function () {
                        return div.accessibleNode[attr] = "";
                    });
                    assert.doesNotThrow(function () {
                        return div.accessibleNode[attr] = new window.AccessibleNodeList();
                    });
                });
            });
        });
    });

    describe('EventTarget', function () {
        it('should have addEventListener', function () {
            assert.ok(div.accessibleNode.addEventListener);
        });
        it('should have removeEventListener, dispatchEvent', function () {
            assert.ok(div.accessibleNode.removeEventListener);
        });
        it('should have dispatchEvent', function () {
            assert.ok(div.accessibleNode.dispatchEvent);
        });
        it('should be able to add and trigger events', function (done) {
            div.accessibleNode.addEventListener("click", function () {
                return done();
            });
            div.accessibleNode.dispatchEvent(new MouseEvent("click"));
        });
    });

    describe('Polyfill', function () {
        it('AccessibleNode properties should reflect ARIA', function () {
            div.accessibleNode.role = "button";
            assert.equal(div.accessibleNode.role, div.getAttribute("role"));
        });
        it('ARIA should not overwrite AccessibleNode', function (done) {
            div.setAttribute("role", "group");

            // attributes are reset by an mutation observer,
            // as result the changes must be checked in the next check
            (0, _timers.setTimeout)(function () {
                try {
                    assert.equal(div.accessibleNode.role, div.getAttribute("role"));
                    assert.equal("button", div.getAttribute("role"));
                    done();
                } catch (e) {
                    done(e);
                }
            }, 0);
        });
        it('ARIA should be overwritable when no value is set within AccessibleNode', function () {
            div.setAttribute("aria-label", "Foo");
            assert.equal(div.getAttribute("aria-label"), "Foo");
        });
        it('.attributes should return the correct value', function () {
            // console.log(div.attributes, div.accessibleNode);
        });
        it('.getAttribute should return the correct value', function (done) {
            div.setAttribute("aria-label", "fake");

            (0, _timers.setTimeout)(function () {
                div.setAttribute("aria-label", "fake3");
                div.setAttribute("id", "hoi");
                div.id = "hey";
                div.setAttribute("id", "asdf");
                (0, _timers.setTimeout)(function () {
                    // div.accessibleNode.label = "fake2";                    
                    (0, _timers.setTimeout)(function () {
                        console.log("test", div.getAttribute("aria-label"), div.accessibleNode._defaultValues);
                        done(assert.equal(div.getAttribute("aria-label"), "fake"));
                    }, 1000);
                }, 1000);
            }, 1000);
        });
    });
});

},{"./../src/AccessibleNodeList.js":8,"assert":1,"timers":3}],16:[function(require,module,exports){
'use strict';

/* eslint-env mocha */

var assert = require('assert');

describe('AccessibleNodeList', function () {

    it('constructor exist in window object', function () {
        assert.ok(window.AccessibleNodeList.prototype && window.AccessibleNodeList.prototype.constructor.name);
    });

    describe('[Number]', function () {
        var list = new window.AccessibleNodeList();
        var div1 = document.createElement("div");
        var div0 = document.createElement("div");

        it('should be able to add accesibleNode by specific index', function () {
            list[0] = div1.accessibleNode;
            list["1"] = div1.accessibleNode;

            assert.equal(list[0], div1.accessibleNode);
            assert.equal(list["1"], div1.accessibleNode);
        });
        it('should be able to overwrite accesibleNode by specific index', function () {
            list[0] = div0.accessibleNode;

            assert.equal(list[0], div0.accessibleNode);
        });
        it('should return null if index does not exist', function () {
            assert.equal(list[2], null);
            assert.equal(list["2"], null);
        });
    });

    describe('.length', function () {
        var list = new window.AccessibleNodeList();

        it('has a default value of 0', function () {
            assert.equal(list.length, 0);
        });
        it('can be set at an different size', function () {
            list.length = 3;
            assert.equal(Array.from(list).length, 3);
        });
        it('first value is empty slot', function () {
            assert.equal(list[0], null);
        });
    });

    describe('.add()', function () {

        it('can only add instances of AccessibleNode', function () {
            var list = new window.AccessibleNodeList();
            var div = document.createElement("div");

            assert.throws(function () {
                return list.add(true);
            });
            assert.doesNotThrow(function () {
                return list.add(div.accessibleNode);
            });
        });

        it('can add AccessibleNode before an specific AccessibleNode', function () {
            var list = new window.AccessibleNodeList();
            var div = document.createElement("div");
            var div2 = document.createElement("div");

            list.add(div.accessibleNode);

            assert.doesNotThrow(function () {
                return list.add(div2.accessibleNode, div.accessibleNode);
            });
            assert.equal(list.length, 2);
            assert.equal(list[0], div2.accessibleNode);
        });
    });

    describe('.item()', function () {
        var list = new window.AccessibleNodeList();
        var div1 = document.createElement("div");
        var div0 = document.createElement("div");
        list.add(div1.accessibleNode);
        list.add(div0.accessibleNode, div1.accessibleNode);

        it('should return the correct accessibleNode', function () {
            assert.equal(list.item(0), div0.accessibleNode);
            assert.equal(list.item("1"), div1.accessibleNode);
        });
        it('should return null if index does not exist', function () {
            assert.equal(list.item(2), null);
            assert.equal(list.item("2"), null);
        });
        it('should only return values of index numbers', function () {
            assert.notEqual(list.item("length"), list.length);
        });
    });

    describe('.remove()', function () {
        var list = new window.AccessibleNodeList();
        var div = document.createElement("div");
        list.add(div.accessibleNode);

        it('should remove the reference', function () {
            list.remove(0);
            assert.equal(list[0], undefined);
            assert.equal(list.length, 0);
        });
    });

    describe('Polyfill', function () {
        var attr = "owns";
        var div = document.createElement("div");
        div.accessibleNode[attr] = new window.AccessibleNodeList();

        var divWithID = document.createElement("div");
        divWithID.id = "aom-id";

        var divWithoutID = document.createElement("div");

        it('each ID of added elements should be reflected in the ARIA', function () {
            div.accessibleNode[attr].add(divWithID.accessibleNode);
            assert.ok(div.getAttribute("aria-owns").indexOf(divWithID.id) > -1);
        });
        it('each ID of removed elements should be reflected in the ARIA', function () {
            div.accessibleNode[attr].remove(0);
            assert.ok(div.getAttribute("aria-owns").indexOf(divWithID.id) == -1);
        });
        it('an added element without ID should be generated and reflect in the ARIA attribute', function () {
            div.accessibleNode[attr].add(divWithoutID.accessibleNode);
            assert.ok(div.getAttribute("aria-owns").indexOf(divWithoutID.id) > -1);
        });
        it('an generated ID should be removed after no connection exist anymore', function () {
            div.accessibleNode[attr].remove(0);
            assert.ok(div.getAttribute("aria-owns").indexOf(divWithID.id) == -1);
            assert.equal(divWithoutID.id, "");
        });
    });
});

},{"assert":1}],17:[function(require,module,exports){
'use strict';

require('./../src/index.js');

// tests
require('./tests-accessiblenode.js');
require('./tests-accessiblenodelist.js');

},{"./../src/index.js":13,"./tests-accessiblenode.js":15,"./tests-accessiblenodelist.js":16}]},{},[17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwic3JjL0FjY2Vzc2libGVOb2RlLmpzIiwic3JjL0FjY2Vzc2libGVOb2RlTGlzdC5qcyIsInNyYy9ET01TdHJpbmcuanMiLCJzcmMvRXZlbnRUYXJnZXQuanMiLCJzcmMvYm9vbGVhbi5qcyIsInNyYy9kb3VibGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbG9uZy5qcyIsInRlc3QvdGVzdHMtYWNjZXNzaWJsZW5vZGUuanMiLCJ0ZXN0L3Rlc3RzLWFjY2Vzc2libGVub2RlbGlzdC5qcyIsInRlc3QvdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QSxRQUFBLEFBQVE7QUFDUixRQUFBLEFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb21wYXJlIGFuZCBpc0J1ZmZlciB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2Jsb2IvNjgwZTllNWU0ODhmMjJhYWMyNzU5OWE1N2RjODQ0YTYzMTU5MjhkZC9pbmRleC5qc1xuLy8gb3JpZ2luYWwgbm90aWNlOlxuXG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHZhciB4ID0gYS5sZW5ndGg7XG4gIHZhciB5ID0gYi5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV07XG4gICAgICB5ID0gYltpXTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoeSA8IHgpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gMDtcbn1cbmZ1bmN0aW9uIGlzQnVmZmVyKGIpIHtcbiAgaWYgKGdsb2JhbC5CdWZmZXIgJiYgdHlwZW9mIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihiKTtcbiAgfVxuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKTtcbn1cblxuLy8gYmFzZWQgb24gbm9kZSBhc3NlcnQsIG9yaWdpbmFsIG5vdGljZTpcblxuLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbC8nKTtcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBmdW5jdGlvbnNIYXZlTmFtZXMgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9vKCkge30ubmFtZSA9PT0gJ2Zvbyc7XG59KCkpO1xuZnVuY3Rpb24gcFRvU3RyaW5nIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xufVxuZnVuY3Rpb24gaXNWaWV3KGFycmJ1Zikge1xuICBpZiAoaXNCdWZmZXIoYXJyYnVmKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbC5BcnJheUJ1ZmZlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYnVmKTtcbiAgfVxuICBpZiAoIWFycmJ1Zikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoYXJyYnVmIGluc3RhbmNlb2YgRGF0YVZpZXcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoYXJyYnVmLmJ1ZmZlciAmJiBhcnJidWYuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4vLyAxLiBUaGUgYXNzZXJ0IG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgdGhhdCB0aHJvd1xuLy8gQXNzZXJ0aW9uRXJyb3IncyB3aGVuIHBhcnRpY3VsYXIgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4gVGhlXG4vLyBhc3NlcnQgbW9kdWxlIG11c3QgY29uZm9ybSB0byB0aGUgZm9sbG93aW5nIGludGVyZmFjZS5cblxudmFyIGFzc2VydCA9IG1vZHVsZS5leHBvcnRzID0gb2s7XG5cbi8vIDIuIFRoZSBBc3NlcnRpb25FcnJvciBpcyBkZWZpbmVkIGluIGFzc2VydC5cbi8vIG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCB9KVxuXG52YXIgcmVnZXggPSAvXFxzKmZ1bmN0aW9uXFxzKyhbXlxcKFxcc10qKVxccyovO1xuLy8gYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2xqaGFyYi9mdW5jdGlvbi5wcm90b3R5cGUubmFtZS9ibG9iL2FkZWVlZWM4YmZjYzYwNjhiMTg3ZDdkOWZiM2Q1YmIxZDNhMzA4OTkvaW1wbGVtZW50YXRpb24uanNcbmZ1bmN0aW9uIGdldE5hbWUoZnVuYykge1xuICBpZiAoIXV0aWwuaXNGdW5jdGlvbihmdW5jKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzKSB7XG4gICAgcmV0dXJuIGZ1bmMubmFtZTtcbiAgfVxuICB2YXIgc3RyID0gZnVuYy50b1N0cmluZygpO1xuICB2YXIgbWF0Y2ggPSBzdHIubWF0Y2gocmVnZXgpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV07XG59XG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9ICdBc3NlcnRpb25FcnJvcic7XG4gIHRoaXMuYWN0dWFsID0gb3B0aW9ucy5hY3R1YWw7XG4gIHRoaXMuZXhwZWN0ZWQgPSBvcHRpb25zLmV4cGVjdGVkO1xuICB0aGlzLm9wZXJhdG9yID0gb3B0aW9ucy5vcGVyYXRvcjtcbiAgaWYgKG9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBnZXRNZXNzYWdlKHRoaXMpO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IHRydWU7XG4gIH1cbiAgdmFyIHN0YWNrU3RhcnRGdW5jdGlvbiA9IG9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9uIHx8IGZhaWw7XG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICAvLyB0cnkgdG8gc3RyaXAgdXNlbGVzcyBmcmFtZXNcbiAgICAgIHZhciBmbl9uYW1lID0gZ2V0TmFtZShzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gdHJ1bmNhdGUocywgbikge1xuICBpZiAodHlwZW9mIHMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5mdW5jdGlvbiBpbnNwZWN0KHNvbWV0aGluZykge1xuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzIHx8ICF1dGlsLmlzRnVuY3Rpb24oc29tZXRoaW5nKSkge1xuICAgIHJldHVybiB1dGlsLmluc3BlY3Qoc29tZXRoaW5nKTtcbiAgfVxuICB2YXIgcmF3bmFtZSA9IGdldE5hbWUoc29tZXRoaW5nKTtcbiAgdmFyIG5hbWUgPSByYXduYW1lID8gJzogJyArIHJhd25hbWUgOiAnJztcbiAgcmV0dXJuICdbRnVuY3Rpb24nICsgIG5hbWUgKyAnXSc7XG59XG5mdW5jdGlvbiBnZXRNZXNzYWdlKHNlbGYpIHtcbiAgcmV0dXJuIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5hY3R1YWwpLCAxMjgpICsgJyAnICtcbiAgICAgICAgIHNlbGYub3BlcmF0b3IgKyAnICcgK1xuICAgICAgICAgdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmV4cGVjdGVkKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5kZWVwU3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBkZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwU3RyaWN0RXF1YWwnLCBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgJiYgaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUoYWN0dWFsLCBleHBlY3RlZCkgPT09IDA7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNEYXRlKGFjdHVhbCkgJiYgdXRpbC5pc0RhdGUoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMgSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBSZWdFeHAgb2JqZWN0IHdpdGggdGhlIHNhbWUgc291cmNlIGFuZFxuICAvLyBwcm9wZXJ0aWVzIChgZ2xvYmFsYCwgYG11bHRpbGluZWAsIGBsYXN0SW5kZXhgLCBgaWdub3JlQ2FzZWApLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNSZWdFeHAoYWN0dWFsKSAmJiB1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuc291cmNlID09PSBleHBlY3RlZC5zb3VyY2UgJiZcbiAgICAgICAgICAgYWN0dWFsLmdsb2JhbCA9PT0gZXhwZWN0ZWQuZ2xvYmFsICYmXG4gICAgICAgICAgIGFjdHVhbC5tdWx0aWxpbmUgPT09IGV4cGVjdGVkLm11bHRpbGluZSAmJlxuICAgICAgICAgICBhY3R1YWwubGFzdEluZGV4ID09PSBleHBlY3RlZC5sYXN0SW5kZXggJiZcbiAgICAgICAgICAgYWN0dWFsLmlnbm9yZUNhc2UgPT09IGV4cGVjdGVkLmlnbm9yZUNhc2U7XG5cbiAgLy8gNy40LiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKChhY3R1YWwgPT09IG51bGwgfHwgdHlwZW9mIGFjdHVhbCAhPT0gJ29iamVjdCcpICYmXG4gICAgICAgICAgICAgKGV4cGVjdGVkID09PSBudWxsIHx8IHR5cGVvZiBleHBlY3RlZCAhPT0gJ29iamVjdCcpKSB7XG4gICAgcmV0dXJuIHN0cmljdCA/IGFjdHVhbCA9PT0gZXhwZWN0ZWQgOiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gSWYgYm90aCB2YWx1ZXMgYXJlIGluc3RhbmNlcyBvZiB0eXBlZCBhcnJheXMsIHdyYXAgdGhlaXIgdW5kZXJseWluZ1xuICAvLyBBcnJheUJ1ZmZlcnMgaW4gYSBCdWZmZXIgZWFjaCB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZVxuICAvLyBUaGlzIG9wdGltaXphdGlvbiByZXF1aXJlcyB0aGUgYXJyYXlzIHRvIGhhdmUgdGhlIHNhbWUgdHlwZSBhcyBjaGVja2VkIGJ5XG4gIC8vIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgKGFrYSBwVG9TdHJpbmcpLiBOZXZlciBwZXJmb3JtIGJpbmFyeVxuICAvLyBjb21wYXJpc29ucyBmb3IgRmxvYXQqQXJyYXlzLCB0aG91Z2gsIHNpbmNlIGUuZy4gKzAgPT09IC0wIGJ1dCB0aGVpclxuICAvLyBiaXQgcGF0dGVybnMgYXJlIG5vdCBpZGVudGljYWwuXG4gIH0gZWxzZSBpZiAoaXNWaWV3KGFjdHVhbCkgJiYgaXNWaWV3KGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgIHBUb1N0cmluZyhhY3R1YWwpID09PSBwVG9TdHJpbmcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgIShhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgfHxcbiAgICAgICAgICAgICAgIGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSkpIHtcbiAgICByZXR1cm4gY29tcGFyZShuZXcgVWludDhBcnJheShhY3R1YWwuYnVmZmVyKSxcbiAgICAgICAgICAgICAgICAgICBuZXcgVWludDhBcnJheShleHBlY3RlZC5idWZmZXIpKSA9PT0gMDtcblxuICAvLyA3LjUgRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgIT09IGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBtZW1vcyA9IG1lbW9zIHx8IHthY3R1YWw6IFtdLCBleHBlY3RlZDogW119O1xuXG4gICAgdmFyIGFjdHVhbEluZGV4ID0gbWVtb3MuYWN0dWFsLmluZGV4T2YoYWN0dWFsKTtcbiAgICBpZiAoYWN0dWFsSW5kZXggIT09IC0xKSB7XG4gICAgICBpZiAoYWN0dWFsSW5kZXggPT09IG1lbW9zLmV4cGVjdGVkLmluZGV4T2YoZXhwZWN0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9zLmFjdHVhbC5wdXNoKGFjdHVhbCk7XG4gICAgbWVtb3MuZXhwZWN0ZWQucHVzaChleHBlY3RlZCk7XG5cbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYiwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykge1xuICBpZiAoYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBpZiBvbmUgaXMgYSBwcmltaXRpdmUsIHRoZSBvdGhlciBtdXN0IGJlIHNhbWVcbiAgaWYgKHV0aWwuaXNQcmltaXRpdmUoYSkgfHwgdXRpbC5pc1ByaW1pdGl2ZShiKSlcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgaWYgKHN0cmljdCAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYSkgIT09IE9iamVjdC5nZXRQcm90b3R5cGVPZihiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIHZhciBhSXNBcmdzID0gaXNBcmd1bWVudHMoYSk7XG4gIHZhciBiSXNBcmdzID0gaXNBcmd1bWVudHMoYik7XG4gIGlmICgoYUlzQXJncyAmJiAhYklzQXJncykgfHwgKCFhSXNBcmdzICYmIGJJc0FyZ3MpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGFJc0FyZ3MpIHtcbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIsIHN0cmljdCk7XG4gIH1cbiAgdmFyIGthID0gb2JqZWN0S2V5cyhhKTtcbiAgdmFyIGtiID0gb2JqZWN0S2V5cyhiKTtcbiAgdmFyIGtleSwgaTtcbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT09IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQubm90RGVlcFN0cmljdEVxdWFsID0gbm90RGVlcFN0cmljdEVxdWFsO1xuZnVuY3Rpb24gbm90RGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwU3RyaWN0RXF1YWwnLCBub3REZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59XG5cblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIElnbm9yZS4gIFRoZSBpbnN0YW5jZW9mIGNoZWNrIGRvZXNuJ3Qgd29yayBmb3IgYXJyb3cgZnVuY3Rpb25zLlxuICB9XG5cbiAgaWYgKEVycm9yLmlzUHJvdG90eXBlT2YoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWU7XG59XG5cbmZ1bmN0aW9uIF90cnlCbG9jayhibG9jaykge1xuICB2YXIgZXJyb3I7XG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh0eXBlb2YgYmxvY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJsb2NrXCIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAodHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICBhY3R1YWwgPSBfdHJ5QmxvY2soYmxvY2spO1xuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgdmFyIHVzZXJQcm92aWRlZE1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZyc7XG4gIHZhciBpc1Vud2FudGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIHV0aWwuaXNFcnJvcihhY3R1YWwpO1xuICB2YXIgaXNVbmV4cGVjdGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIGFjdHVhbCAmJiAhZXhwZWN0ZWQ7XG5cbiAgaWYgKChpc1Vud2FudGVkRXhjZXB0aW9uICYmXG4gICAgICB1c2VyUHJvdmlkZWRNZXNzYWdlICYmXG4gICAgICBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHxcbiAgICAgIGlzVW5leHBlY3RlZEV4Y2VwdGlvbikge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyh0cnVlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MoZmFsc2UsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB0aHJvdyBlcnI7IH07XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciBuZXh0VGljayA9IHJlcXVpcmUoJ3Byb2Nlc3MvYnJvd3Nlci5qcycpLm5leHRUaWNrO1xudmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGltbWVkaWF0ZUlkcyA9IHt9O1xudmFyIG5leHRJbW1lZGlhdGVJZCA9IDA7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7IHRpbWVvdXQuY2xvc2UoKTsgfTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBUaGF0J3Mgbm90IGhvdyBub2RlLmpzIGltcGxlbWVudHMgaXQgYnV0IHRoZSBleHBvc2VkIGFwaSBpcyB0aGUgc2FtZS5cbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0SW1tZWRpYXRlIDogZnVuY3Rpb24oZm4pIHtcbiAgdmFyIGlkID0gbmV4dEltbWVkaWF0ZUlkKys7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBmYWxzZSA6IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICBpbW1lZGlhdGVJZHNbaWRdID0gdHJ1ZTtcblxuICBuZXh0VGljayhmdW5jdGlvbiBvbk5leHRUaWNrKCkge1xuICAgIGlmIChpbW1lZGlhdGVJZHNbaWRdKSB7XG4gICAgICAvLyBmbi5jYWxsKCkgaXMgZmFzdGVyIHNvIHdlIG9wdGltaXplIGZvciB0aGUgY29tbW9uIHVzZS1jYXNlXG4gICAgICAvLyBAc2VlIGh0dHA6Ly9qc3BlcmYuY29tL2NhbGwtYXBwbHktc2VndVxuICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbi5jYWxsKG51bGwpO1xuICAgICAgfVxuICAgICAgLy8gUHJldmVudCBpZHMgZnJvbSBsZWFraW5nXG4gICAgICBleHBvcnRzLmNsZWFySW1tZWRpYXRlKGlkKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBpZDtcbn07XG5cbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSB0eXBlb2YgY2xlYXJJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIiA/IGNsZWFySW1tZWRpYXRlIDogZnVuY3Rpb24oaWQpIHtcbiAgZGVsZXRlIGltbWVkaWF0ZUlkc1tpZF07XG59OyIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsImltcG9ydCBET01TdHJpbmcgZnJvbSBcIi4vRE9NU3RyaW5nXCI7XHJcbmltcG9ydCBib29sZWFuIGZyb20gXCIuL2Jvb2xlYW5cIjtcclxuaW1wb3J0IGRvdWJsZSBmcm9tIFwiLi9kb3VibGVcIjtcclxuaW1wb3J0IGxvbmcgZnJvbSBcIi4vbG9uZ1wiO1xyXG5pbXBvcnQgRXZlbnRUYXJnZXQgZnJvbSAnLi9FdmVudFRhcmdldCc7XHJcbmltcG9ydCB7IEFjY2Vzc2libGVOb2RlTGlzdENvbnN0cnVjdG9yIH0gZnJvbSAnLi8uLi9zcmMvQWNjZXNzaWJsZU5vZGVMaXN0LmpzJztcclxuXHJcbi8vIGFsbCBhdHRyaWJ1dGVzIHVzZWQgd2l0aGluIEFPTVxyXG52YXIgYXR0cmlidXRlcyA9IFtcclxuXHRcInJvbGVcIiwgXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIiwgXCJhcmlhLWF0b21pY1wiLCBcImFyaWEtYXV0b2NvbXBsZXRlXCIsIFwiYXJpYS1idXN5XCIsIFwiYXJpYS1jaGVja2VkXCIsXHJcblx0XCJhcmlhLWNvbGNvdW50XCIsIFwiYXJpYS1jb2xpbmRleFwiLCBcImFyaWEtY29sc3BhblwiLCBcImFyaWEtY29udHJvbHNcIiwgXCJhcmlhLWN1cnJlbnRcIiwgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXHJcblx0XCJhcmlhLWRldGFpbHNcIiwgXCJhcmlhLWRpc2FibGVkXCIsIFwiYXJpYS1kcm9wZWZmZWN0XCIsIFwiYXJpYS1lcnJvcm1lc3NhZ2VcIiwgXCJhcmlhLWV4cGFuZGVkXCIsXHJcblx0XCJhcmlhLWZsb3d0b1wiLCBcImFyaWEtZ3JhYmJlZFwiLCBcImFyaWEtaGFzcG9wdXBcIiwgXCJhcmlhLWhpZGRlblwiLCBcImFyaWEtaW52YWxpZFwiLCBcImFyaWEta2V5c2hvcnRjdXRzXCIsXHJcblx0XCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCIsIFwiYXJpYS1sZXZlbFwiLCBcImFyaWEtbGl2ZVwiLCBcImFyaWEtbW9kYWxcIiwgXCJhcmlhLW11bHRpbGluZVwiLFxyXG5cdFwiYXJpYS1tdWx0aXNlbGVjdGFibGVcIiwgXCJhcmlhLW9yaWVudGF0aW9uXCIsIFwiYXJpYS1vd25zXCIsIFwiYXJpYS1wbGFjZWhvbGRlclwiLCBcImFyaWEtcG9zaW5zZXRcIixcclxuXHRcImFyaWEtcHJlc3NlZFwiLCBcImFyaWEtcmVhZG9ubHlcIiwgXCJhcmlhLXJlbGV2YW50XCIsIFwiYXJpYS1yZXF1aXJlZFwiLCBcImFyaWEtcm9sZWRlc2NyaXB0aW9uXCIsXHJcblx0XCJhcmlhLXJvd2NvdW50XCIsIFwiYXJpYS1yb3dpbmRleFwiLCBcImFyaWEtcm93c3BhblwiLCBcImFyaWEtc2VsZWN0ZWRcIiwgXCJhcmlhLXNldHNpemVcIiwgXCJhcmlhLXNvcnRcIixcclxuXHRcImFyaWEtdmFsdWVtYXhcIiwgXCJhcmlhLXZhbHVlbWluXCIsIFwiYXJpYS12YWx1ZW5vd1wiLCBcImFyaWEtdmFsdWV0ZXh0XCJcclxuXTtcclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHtNdXRhdGlvbn0gbXV0YXRpb25zIFxyXG4gKi9cclxuZnVuY3Rpb24gbXV0YXRpb25PYnNlcnZlckNhbGxiYWNrKG11dGF0aW9ucykge1xyXG5cdHZhciBhb20gPSB0aGlzO1xyXG5cclxuICAgIG11dGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChtdXRhdGlvbikge1xyXG5cdFx0bGV0IGF0dHJOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcclxuXHRcdGxldCBuZXdWYWx1ZSA9IGFvbS5fbm9kZS5hdHRyaWJ1dGVzW2F0dHJOYW1lXSA/IGFvbS5fbm9kZS5hdHRyaWJ1dGVzW2F0dHJOYW1lXS52YWx1ZSA6IHVuZGVmaW5lZDtcclxuXHRcdGxldCBvbGRWYWx1ZSA9IGFvbS5fdmFsdWVzW2F0dHJOYW1lXTtcclxuXHJcblx0XHRhb20uX2RlZmF1bHRWYWx1ZXNbYXR0ck5hbWVdID0gbmV3VmFsdWU7XHJcblx0XHQvLyBzdG9yZSB0aGUgZGVmYXVsdCB2YWx1ZXMgc2V0IGJ5IGFuIGFyaWEtKiBhdHRyaWJ1dGVcclxuXHRcdGlmIChuZXdWYWx1ZSAhPSBvbGRWYWx1ZSkge1xyXG5cdFx0XHRhb20uX2RlZmF1bHRWYWx1ZXNbYXR0ck5hbWVdID0gbmV3VmFsdWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3ZlcndyaXRlIHRoZSBhdHRyaWJ1dGUgaWYgQU9NIGhhcyBhbiBkaWZmZXJlbnQgZGVmaW5lZCB2YWx1ZVxyXG5cdFx0aWYgKG9sZFZhbHVlICYmIG5ld1ZhbHVlICE9IG9sZFZhbHVlKSB7XHJcblx0XHRcdGFvbVthdHRyTmFtZV0gPSBvbGRWYWx1ZTtcclxuXHRcdH1cclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogQmFzZWQgb24gdGhlIEFPTSBzcGVjXHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuY2xhc3MgQWNjZXNzaWJsZU5vZGUgZXh0ZW5kcyBFdmVudFRhcmdldCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihub2RlKSB7XHJcbiAgICAgICAgc3VwZXIobm9kZSk7XHJcblxyXG4gICAgICAgIC8vIHN0b3JlIHRoZSBub2RlIHdoZXJlIHRoZSBBY2Nlc3NpYmxlTm9kZSBpcyBjb25uZWN0ZWQgd2l0aFxyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiX25vZGVcIiwgeyB2YWx1ZTogbm9kZSB9KTtcclxuXHJcblx0XHQvLyBzZXQgYW4gaGlkZGVuIG9iamVjdCB0byBzdG9yZSBhbGwgdmFsdWVzIGluXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiX3ZhbHVlc1wiLCB7IHZhbHVlOiB7fX0pO1xyXG5cdFx0XHJcblx0XHQvLyBzdG9yZSB2YWx1ZXMgb2YgYXJpYS0qIGF0dHJpYnV0ZXNcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJfZGVmYXVsdFZhbHVlc1wiLCB7IHZhbHVlOiB7fX0pO1xyXG5cclxuXHRcdC8vIHN0YXJ0IHRoZSBtdXRhdGlvbiBvYnNlcnZlciBpZiB0aGUgQWNjZXNzaWJsZU5vZGUgaXMgY29ubmVjdGVkIHRvIGFuIG5vZGVcclxuXHRcdGlmKG5vZGUpIHtcclxuXHRcdFx0dmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobXV0YXRpb25PYnNlcnZlckNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG5cdFx0XHRvYnNlcnZlci5vYnNlcnZlKHRoaXMuX25vZGUsIHsgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUgfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcbn1cclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEFjY2Vzc2libGVOb2RlLnByb3RvdHlwZSxcclxuICAgIC8qKiBAbGVuZHMgQWNjZXNzaWJsZU5vZGUucHJvdG90eXBlICovXHJcbiAgICB7XHJcblx0XHQvKiogXHJcblx0XHQqIERlZmluZXMgYSB0eXBlIGl0IHJlcHJlc2VudHMsIGUuZy4gYHRhYmBcclxuXHRcdCogXHJcblx0XHQqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jcm9sZXNcclxuXHRcdCogQHR5cGUgIHs/U3RyaW5nfVxyXG5cdFx0Ki9cclxuICAgICAgICBcInJvbGVcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcInJvbGVcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcInJvbGVcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKiBcclxuXHRcdCAqIERlZmluZXMgYSBodW1hbi1yZWFkYWJsZSwgYXV0aG9yLWxvY2FsaXplZCBkZXNjcmlwdGlvbiBmb3IgdGhlIHJvbGVcclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXJvbGVkZXNjcmlwdGlvblxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcInJvbGVEZXNjcmlwdGlvblwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLXJvbGVEZXNjcmlwdGlvblwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1yb2xlRGVzY3JpcHRpb25cIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqIEFDQ0VTU0lCTEUgTEFCRUwgQU5EIERFU0NSSVBUSU9OICoqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcblx0XHQvKiogXHJcblx0XHQqIERlZmluZXMgYSBzdHJpbmcgdmFsdWUgdGhhdCBsYWJlbHMgdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuXHRcdCogXHJcblx0XHQqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1sYWJlbFxyXG5cdFx0KiBAdHlwZSB7P1N0cmluZ30gXHJcblx0XHQqL1xyXG4gICAgICAgIFwibGFiZWxcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwiYXJpYS1sYWJlbFwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1sYWJlbFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKiBFTkQgT0YgQUNDRVNTSUJMRSBMQUJFTCBBTkQgREVTQ1JJUFRJT04gKioqKioqKioqKioqKioqICovXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBHTE9CQUwgU1RBVEVTIEFORCBQUk9QRVJUSUVTICoqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuXHRcdC8qKiBcclxuXHRcdCAqIEluZGljYXRlcyB0aGUgZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIGN1cnJlbnQgaXRlbSB3aXRoaW4gYSBjb250YWluZXIgb3Igc2V0IG9mIHJlbGF0ZWQgZWxlbWVudHMuXHJcblx0XHQgKiBcclxuXHRcdCAqIHwgVmFsdWUgfCBEZXNjcmlwdGlvbiB8XHJcblx0XHQgKiB8IC0tLSB8IC0tLSB8XHJcblx0XHQgKiB8IHBhZ2UgfCB1c2VkIHRvIGluZGljYXRlIGEgbGluayB3aXRoaW4gYSBzZXQgb2YgcGFnaW5hdGlvbiBsaW5rcywgd2hlcmUgdGhlIGxpbmsgaXMgdmlzdWFsbHkgc3R5bGVkIHRvIHJlcHJlc2VudCB0aGUgY3VycmVudGx5LWRpc3BsYXllZCBwYWdlLlxyXG5cdFx0ICogfCBzdGVwIHwgdXNlZCB0byBpbmRpY2F0ZSBhIGxpbmsgd2l0aGluIGEgc3RlcCBpbmRpY2F0b3IgZm9yIGEgc3RlcC1iYXNlZCBwcm9jZXNzLCB3aGVyZSB0aGUgbGluayBpcyB2aXN1YWxseSBzdHlsZWQgdG8gcmVwcmVzZW50IHRoZSBjdXJyZW50IHN0ZXAuXHJcblx0XHQgKiB8IGxvY2F0aW9uIHwgdXNlZCB0byBpbmRpY2F0ZSB0aGUgaW1hZ2UgdGhhdCBpcyB2aXN1YWxseSBoaWdobGlnaHRlZCBhcyB0aGUgY3VycmVudCBjb21wb25lbnQgb2YgYSBmbG93IGNoYXJ0LlxyXG5cdFx0ICogfCBkYXRlIHwgdXNlZCB0byBpbmRpY2F0ZSB0aGUgY3VycmVudCBkYXRlIHdpdGhpbiBhIGNhbGVuZGFyLlxyXG5cdFx0ICogfCB0aW1lIHwgdXNlZCB0byBpbmRpY2F0ZSB0aGUgY3VycmVudCB0aW1lIHdpdGhpbiBhIHRpbWV0YWJsZS5cclxuXHRcdCAqIHwgdHJ1ZSB8IFJlcHJlc2VudHMgdGhlIGN1cnJlbnQgaXRlbSB3aXRoaW4gYSBzZXQuXHJcblx0XHQgKiB8IGZhbHNlIHwgRG9lcyBub3QgcmVwcmVzZW50IHRoZSBjdXJyZW50IGl0ZW0gd2l0aGluIGEgc2V0LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtY3VycmVudFxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcImN1cnJlbnRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwiYXJpYS1jdXJyZW50XCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIERPTVN0cmluZy5nZXQodGhpcywgXCJhcmlhLWN1cnJlbnRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKiBFTkQgT0YgR0xPQkFMIFNUQVRFUyBBTkQgUFJPUEVSVElFUyAqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBXSURHRVQgUFJPUEVSVElFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW5kaWNhdGVzIHdoZXRoZXIgaW5wdXR0aW5nIHRleHQgY291bGQgdHJpZ2dlciBkaXNwbGF5IG9mIG9uZSBvciBtb3JlIHByZWRpY3Rpb25zIG9mIHRoZSB1c2VyJ3NcclxuXHRcdCAqIGludGVuZGVkIHZhbHVlIGZvciBhbiBpbnB1dCBhbmQgc3BlY2lmaWVzIGhvdyBwcmVkaWN0aW9ucyB3b3VsZCBiZSBwcmVzZW50ZWQgaWYgdGhleSBhcmUgbWFkZS5cclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIGJlaGF2aW9yIGR1cmluZyBpbnB1dCBpcyBkZXBlbmRzIG9uIHRoZSBwcm92aWRlZCB2YWx1ZSwgaXQgZm9sbG93cyBiZW5lYXRoIHRhYmxlLlxyXG5cdFx0ICogXHJcblx0XHQgKiB8IFZhbHVlICB8IFx0RGVzY3JpcHRpb24gfFxyXG5cdFx0ICogfCAtLS0tLS0gfCAtLS0gfFxyXG5cdFx0ICogfCBpbmxpbmUgfCBUZXh0IHN1Z2dlc3RpbmcgbWF5IGJlIGR5bmFtaWNhbGx5IGluc2VydGVkIGFmdGVyIHRoZSBjYXJldC5cclxuXHRcdCAqIHwgbGlzdCAgIHwgQSBjb2xsZWN0aW9uIG9mIHZhbHVlcyB0aGF0IGNvdWxkIGNvbXBsZXRlIHRoZSBwcm92aWRlZCBpbnB1dCBpcyBkaXNwbGF5ZWQuXHJcblx0XHQgKiB8IGJvdGggICB8IEltcGxlbWVudHMgYGlubGluZWAgYW5kIGBsaXN0YFxyXG5cdFx0ICogfCBub25lICAgfCBObyBwcmVkaWN0aW9uIGlzIHNob3duXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1hdXRvY29tcGxldGVcclxuXHRcdCAqIEB0eXBlIHs/U3RyaW5nfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJhdXRvY29tcGxldGVcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwiYXJpYS1hdXRvY29tcGxldGVcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEtYXV0b2NvbXBsZXRlXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMvc2V0cyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgZWxlbWVudCB3aG8gaXMgZXhwb3NlZCB0byBhbiBhY2Nlc3NpYmlsaXR5IEFQSS5cclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI2Rpc2FibGVkfVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWhpZGRlblxyXG5cdFx0ICogQHR5cGUgez9Cb29sZWFufVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJoaWRkZW5cIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBib29sZWFuLnNldCh0aGlzLCBcImFyaWEtaGlkZGVuXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGJvb2xlYW4uZ2V0KHRoaXMsIFwiYXJpYS1oaWRkZW5cIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW5kaWNhdGVzIGtleWJvYXJkIHNob3J0Y3V0cyB0aGF0IGFuIGF1dGhvciBoYXMgaW1wbGVtZW50ZWQgdG8gYWN0aXZhdGUgb3JcclxuXHRcdCAqIGdpdmUgZm9jdXMgdG8gYW4gZWxlbWVudC5cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1rZXlzaG9ydGN1dHNcclxuXHRcdCAqIEB0eXBlIHs/U3RyaW5nfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJrZXlTaG9ydGN1dHNcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwiYXJpYS1rZXlTaG9ydGN1dHNcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEta2V5U2hvcnRjdXRzXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKiogXHJcblx0XHQgKiBJbmRpY2F0ZXMgd2hldGhlciBhbiBlbGVtZW50IGlzIG1vZGFsIHdoZW4gZGlzcGxheWVkLlxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLW1vZGFsXHJcblx0XHQgKiBAdHlwZSB7P0Jvb2xlYW59XHJcblx0XHQgKi9cclxuICAgICAgICBcIm1vZGFsXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gYm9vbGVhbi5zZXQodGhpcywgXCJhcmlhLW1vZGFsXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGJvb2xlYW4uZ2V0KHRoaXMsIFwiYXJpYS1tb2RhbFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqIFxyXG5cdFx0ICogSW5kaWNhdGVzIHdoZXRoZXIgYSB0ZXh0IGJveCBhY2NlcHRzIG11bHRpcGxlIGxpbmVzIG9mIGlucHV0IG9yIG9ubHkgYSBzaW5nbGUgbGluZS5cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1tdWx0aWxpbmVcclxuXHRcdCAqIEB0eXBlIHs/Qm9vbGVhbn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwibXVsdGlsaW5lXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gYm9vbGVhbi5zZXQodGhpcywgXCJhcmlhLW11bHRpbGluZVwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBib29sZWFuLmdldCh0aGlzLCBcImFyaWEtbXVsdGlsaW5lXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyB0aGF0IHRoZSB1c2VyIG1heSBzZWxlY3QgbW9yZSB0aGFuIG9uZSBpdGVtIGZyb20gdGhlIGN1cnJlbnQgc2VsZWN0YWJsZSBkZXNjZW5kYW50cy5cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1tdWx0aXNlbGVjdGFibGVcclxuXHRcdCAqIEB0eXBlIHs/Qm9vbGVhbn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwibXVsdGlzZWxlY3RhYmxlXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gYm9vbGVhbi5zZXQodGhpcywgXCJhcmlhLW11bHRpc2VsZWN0YWJsZVwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBib29sZWFuLmdldCh0aGlzLCBcImFyaWEtbXVsdGlzZWxlY3RhYmxlXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBlbGVtZW50J3Mgb3JpZW50YXRpb24gaXMgYGhvcml6b250YWxgLCBgdmVydGljYWxgLCBvciBgbnVsbGAuXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtb3JpZW50YXRpb25cclxuXHRcdCAqIEB0eXBlIHs/U3RyaW5nfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJvcmllbnRhdGlvblwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLW9yaWVudGF0aW9uXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIERPTVN0cmluZy5nZXQodGhpcywgXCJhcmlhLW9yaWVudGF0aW9uXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyB0aGF0IHRoZSB1c2VyIG1heSBzZWxlY3QgbW9yZSB0aGFuIG9uZSBpdGVtIGZyb20gdGhlIGN1cnJlbnQgc2VsZWN0YWJsZSBkZXNjZW5kYW50cy5cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1yZWFkb25seVxyXG5cdFx0ICogQHR5cGUgez9Cb29sZWFufVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJyZWFkT25seVwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIGJvb2xlYW4uc2V0KHRoaXMsIFwiYXJpYS1yZWFkT25seVwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBib29sZWFuLmdldCh0aGlzLCBcImFyaWEtcmVhZE9ubHlcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW5kaWNhdGVzIHRoYXQgdXNlciBpbnB1dCBpcyByZXF1aXJlZCBvbiB0aGUgZWxlbWVudCBiZWZvcmUgYSBmb3JtIG1heSBiZSBzdWJtaXR0ZWQuXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtcmVxdWlyZWRcclxuXHRcdCAqIEB0eXBlIHs/Qm9vbGVhbn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwicmVxdWlyZWRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBib29sZWFuLnNldCh0aGlzLCBcImFyaWEtcmVxdWlyZWRcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gYm9vbGVhbi5nZXQodGhpcywgXCJhcmlhLXJlcXVpcmVkXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyB0aGF0IHVzZXIgaW5wdXQgaXMgcmVxdWlyZWQgb24gdGhlIGVsZW1lbnQgYmVmb3JlIGEgZm9ybSBtYXkgYmUgc3VibWl0dGVkLlxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXNlbGVjdGVkXHJcblx0XHQgKiBAdHlwZSB7P0Jvb2xlYW59XHJcblx0XHQgKi9cclxuICAgICAgICBcInNlbGVjdGVkXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gYm9vbGVhbi5zZXQodGhpcywgXCJhcmlhLXNlbGVjdGVkXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGJvb2xlYW4uZ2V0KHRoaXMsIFwiYXJpYS1zZWxlY3RlZFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMgaWYgaXRlbXMgaW4gYSB0YWJsZSBvciBncmlkIGFyZSBzb3J0ZWQgaW4gYXNjZW5kaW5nIG9yIGRlc2NlbmRpbmcgb3JkZXIuICBcclxuXHRcdCAqIFBvc3NpYmxlIHZhbHVlcyBhcmUgYGFjZW5kaW5nYCwgYGRlc2NlbmRpbmdgLCBgbm9uZWAsIGBvdGhlcmAgb3IgYG51bGxgLlxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXNvcnRcclxuXHRcdCAqIEB0eXBlIHs/Qm9vbGVhbn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwic29ydFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLXNvcnRcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEtc29ydFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqIEVORCBPRiBXSURHRVQgUFJPUEVSVElFUyAqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogV0lER0VUIFNUQVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMgdGhlIGN1cnJlbnQgXCJjaGVja2VkXCIgc3RhdGUgb2YgYSB7QGxpbmsgV2lkZ2V0fSwgYW1vbmcge0BsaW5rIFJhZGlvfSBhbmQge0BsaW5rIENoZWNrYm94fVxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjcHJlc3NlZH1cclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI3NlbGVjdGVkfVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXByZXNzZWRcclxuXHRcdCAqIEB0eXBlIHs/U3RyaW5nfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJjaGVja2VkXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtY2hlY2tlZFwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1jaGVja2VkXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBlbGVtZW50LCBvciBhbm90aGVyIGdyb3VwaW5nIGVsZW1lbnQgaXQgY29udHJvbHMsIFxyXG5cdFx0ICogaXMgY3VycmVudGx5IGV4cGFuZGVkIG9yIGNvbGxhcHNlZC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWV4cGFuZGVkXHJcblx0XHQgKiBAdHlwZSB7P0Jvb2xlYW59XHJcblx0XHQgKi9cclxuICAgICAgICBcImV4cGFuZGVkXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gYm9vbGVhbi5zZXQodGhpcywgXCJhcmlhLWV4cGFuZGVkXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGJvb2xlYW4uZ2V0KHRoaXMsIFwiYXJpYS1leHBhbmRlZFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMgdGhhdCB0aGUgZWxlbWVudCBpcyBwZXJjZWl2YWJsZSBidXQgZGlzYWJsZWQsIHNvIGl0IGlzIG5vdCBlZGl0YWJsZSBvciBvdGhlcndpc2Ugb3BlcmFibGUuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI2hpZGRlbn1cclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI3JlYWRvbmx5fVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWRpc2FibGVkXHJcblx0XHQgKiBAdHlwZSB7P0Jvb2xlYW59XHJcblx0XHQgKi9cclxuICAgICAgICBcImRpc2FibGVkXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gYm9vbGVhbi5zZXQodGhpcywgXCJhcmlhLWRpc2FibGVkXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGJvb2xlYW4uZ2V0KHRoaXMsIFwiYXJpYS1kaXNhYmxlZFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMgdGhlIGVudGVyZWQgdmFsdWUgZG9lcyBub3QgY29uZm9ybSB0byB0aGUgZm9ybWF0IGV4cGVjdGVkIGJ5IHRoZSBhcHBsaWNhdGlvbi5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjZXJyb3JNZXNzYWdlfVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWVycm9ybWVzc2FnZVxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9IFxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJpbnZhbGlkXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtaW52YWxpZFwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1pbnZhbGlkXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMgdGhlIGF2YWlsYWJpbGl0eSBhbmQgdHlwZSBvZiBpbnRlcmFjdGl2ZSBwb3B1cCBlbGVtZW50LCBzdWNoIGFzIG1lbnUgb3IgZGlhbG9nLFxyXG5cdFx0ICogdGhhdCBjYW4gYmUgdHJpZ2dlcmVkIGJ5IGFuIGVsZW1lbnQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1oYXNwb3B1cFxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcImhhc1BvcFVwXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtaGFzcG9wdXBcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEtaGFzcG9wdXBcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW5kaWNhdGVzIHRoZSBjdXJyZW50IFwiY2hlY2tlZFwiIHN0YXRlIG9mIGEge0BsaW5rIFdpZGdldH0sIGFtb25nIHtAbGluayBSYWRpb30gYW5kIHtAbGluayBDaGVja2JveH1cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjcHJlc3NlZH1cclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI3NlbGVjdGVkfVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXByZXNzZWRcclxuXHRcdCAqIEB0eXBlIHs/U3RyaW5nfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJwcmVzc2VkXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtcHJlc3NlZFwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1wcmVzc2VkXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBFTkQgT0YgV0lER0VUIFNUQVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5cclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqIENPTlRST0wgVkFMVUVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcblx0XHQvKiogXHJcblx0XHQgKiBSZXR1cm5zIC8gc2V0cyB0aGUgaHVtYW4gcmVhZGFibGUgdGV4dCBhbHRlcm5hdGl2ZSBvZiB7QGxpbmsgI2FyaWEtdmFsdWVub3d9IGZvciBhIHtAbGluayBSYW5nZX0gd2lkZ2V0LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXZhbHVldGV4dH1cclxuXHRcdCAqIEB0eXBlIHs/U3RyaW5nfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJ2YWx1ZVRleHRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwiYXJpYS12YWx1ZVRleHRcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEtdmFsdWVUZXh0XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgLyBzZXRzIGEgc2hvcnQgaGludCBpbnRlbmRlZCB0byBhaWQgdGhlIHVzZXIgd2l0aCBkYXRhIGVudHJ5IHdoZW4gdGhlIGNvbnRyb2wgaGFzIG5vIHZhbHVlLlxyXG5cdFx0ICogQSBoaW50IGNvdWxkIGJlIGEgc2FtcGxlIHZhbHVlIG9yIGEgYnJpZWYgZGVzY3JpcHRpb24gb2YgdGhlIGV4cGVjdGVkIGZvcm1hdC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1wbGFjZWhvbGRlcn1cclxuXHRcdCAqIEB0eXBlIHs/U3RyaW5nfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJwbGFjZWhvbGRlclwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLXBsYWNlaG9sZGVyXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIERPTVN0cmluZy5nZXQodGhpcywgXCJhcmlhLXBsYWNlaG9sZGVyXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKiogXHJcblx0XHQgKiBSZXR1cm5zIC8gc2V0cyB0aGUgY3VycmVudCB2YWx1ZSBmb3IgYSB7QGxpbmsgUmFuZ2V9IHdpZGdldC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS12YWx1ZW5vd31cclxuXHRcdCAqIEB0eXBlIHs/TnVtYmVyfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJ2YWx1ZU5vd1wiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGRvdWJsZS5zZXQodGhpcywgXCJhcmlhLXZhbHVlbm93XCIsIHZhbCk7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGRvdWJsZS5nZXQodGhpcywgXCJhcmlhLXZhbHVlbm93XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKiogXHJcblx0XHQgKiBSZXR1cm5zIC8gc2V0cyB0aGUgbWluaW11bSBhbGxvd2VkIHZhbHVlIGZvciBhIHtAbGluayBSYW5nZX0gd2lkZ2V0LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXZhbHVlbWlufVxyXG5cdFx0ICogQHR5cGUgez9OdW1iZXJ9XHJcblx0XHQgKi9cclxuICAgICAgICBcInZhbHVlTWluXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHZhbCkgeyByZXR1cm4gZG91YmxlLnNldCh0aGlzLCBcImFyaWEtdmFsdWVtaW5cIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gZG91YmxlLmdldCh0aGlzLCBcImFyaWEtdmFsdWVtaW5cIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKiBcclxuXHRcdCAqIFJldHVybnMgLyBzZXRzIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUgZm9yIGEge0BsaW5rIFJhbmdlfSB3aWRnZXQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtdmFsdWVtYXh9XHJcblx0XHQgKiBAdHlwZSB7P051bWJlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwidmFsdWVNYXhcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBkb3VibGUuc2V0KHRoaXMsIFwiYXJpYS12YWx1ZW1heFwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBkb3VibGUuZ2V0KHRoaXMsIFwiYXJpYS12YWx1ZW1heFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKiBFTkQgT0YgQ09OVFJPTCBWQUxVRVMgKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG4gICAgICAgIC8vIExpdmUgcmVnaW9ucy5cclxuICAgICAgICBcImF0b21pY1wiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGJvb2xlYW4uc2V0KHRoaXMsIFwiYXJpYS1hdG9taWNcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gYm9vbGVhbi5nZXQodGhpcywgXCJhcmlhLWF0b21pY1wiKTsgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJidXN5XCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHZhbCkgeyByZXR1cm4gYm9vbGVhbi5zZXQodGhpcywgXCJhcmlhLWJ1c3lcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gYm9vbGVhbi5nZXQodGhpcywgXCJhcmlhLWJ1c3lcIik7IH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFwibGl2ZVwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLWxpdmVcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEtbGl2ZVwiKTsgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJyZWxldmFudFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLXJlbGV2YW50XCIsIHZhbCk7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIERPTVN0cmluZy5nZXQodGhpcywgXCJhcmlhLXJlbGV2YW50XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKiBPVEhFUiBSRUxBVElPTlNISVBTICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgLyBzZXRzIHRoZSBBY2Nlc3NpYmxlTm9kZSBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZSBlbGVtZW50IHdoZW4gZm9jdXMgaXMgb24gY3VycmVudCBlbGVtZW50LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtYWN0aXZlZGVzY2VuZGFudFxyXG5cdFx0ICogQHR5cGUgez9BY2NjZXNzaWJsZU5vZGV9XHJcblx0XHQgKi9cclxuICAgICAgICBcImFjdGl2ZURlc2NlbmRhbnRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBzZXRBY2Nlc3NpYmxlTm9kZSh0aGlzLCBcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBnZXRBY2Nlc3NpYmxlTm9kZSh0aGlzLCBcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIC8gc2V0cyBhbiBBY2Nlc3NpYmxlTm9kZSB0aGF0IHByb3ZpZGVzIGEgZGV0YWlsZWQsIGV4dGVuZGVkIGRlc2NyaXB0aW9uIFxyXG5cdFx0ICogZm9yIHRoZSBjdXJyZW50IGVsZW1lbnQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI2Rlc2NyaWJlZEJ5fVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWRldGFpbHNcclxuXHRcdCAqIEB0eXBlIHs/QWNjY2Vzc2libGVOb2RlfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJkZXRhaWxzXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHZhbCkgeyByZXR1cm4gc2V0QWNjZXNzaWJsZU5vZGUodGhpcywgXCJhcmlhLWRldGFpbHNcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gZ2V0QWNjZXNzaWJsZU5vZGUodGhpcywgXCJhcmlhLWRldGFpbHNcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyAvIHNldHMgYW4gQWNjZXNzaWJsZU5vZGUgdGhhdCBwcm92aWRlcyBhbiBlcnJvciBtZXNzYWdlIGZvciB0aGUgY3VycmVudCBlbGVtZW50LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNpbnZhbGlkfVxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjZGVzY3JpYmVkQnl9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtZXJyb3JtZXNzYWdlXHJcblx0XHQgKiBAdHlwZSB7P0FjY2Nlc3NpYmxlTm9kZX1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHZhbCkgeyByZXR1cm4gc2V0QWNjZXNzaWJsZU5vZGUodGhpcywgXCJhcmlhLWVycm9ybWVzc2FnZVwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBnZXRBY2Nlc3NpYmxlTm9kZSh0aGlzLCBcImFyaWEtZXJyb3JtZXNzYWdlXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKiBFTkQgT0YgT1RIRVIgUkVMQVRJT05TSElQUyAqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIENPTExFQ1RJT05TICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIC8gc2V0cyB0aGUgdG90YWwgbnVtYmVyIG9mIGNvbHVtbnMgaW4gYSB7QGxpbmsgVGFibGV9LCB7QGxpbmsgR3JpZH0sIG9yIHtAbGluayBUcmVlZ3JpZH0uXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI2NvbEluZGV4fVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXNldHNpemVcclxuXHRcdCAqIEB0eXBlIHs/SW50ZWdlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwiY29sQ291bnRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBsb25nLnNldCh0aGlzLCBcImFyaWEtY29sY291bnRcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gbG9uZy5nZXQodGhpcywgXCJhcmlhLWNvbGNvdW50XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlZmluZXMgYW4gZWxlbWVudCdzIGNvbHVtbiBpbmRleCBvciBwb3NpdGlvbiB3aXRoIHJlc3BlY3QgdG8gdGhlIHRvdGFsIG51bWJlciBvZiBjb2x1bW5zIFxyXG5cdFx0ICogd2l0aGluIGEge0BsaW5rIFRhYmxlfSwge0BsaW5rIEdyaWR9LCBvciB7QGxpbmsgVHJlZWdyaWR9LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNjb2xDb3VudH1cclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI2NvbFNwYW59XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtY29saW5kZXhcclxuXHRcdCAqIEB0eXBlIHs/SW50ZWdlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwiY29sSW5kZXhcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBsb25nLnNldCh0aGlzLCBcImFyaWEtY29saW5kZXhcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gbG9uZy5nZXQodGhpcywgXCJhcmlhLWNvbGluZGV4XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlZmluZXMgdGhlIG51bWJlciBvZiBjb2x1bW5zIHNwYW5uZWQgYnkgYSBjZWxsIG9yIGdyaWRjZWxsXHJcblx0XHQgKiB3aXRoaW4gYSB7QGxpbmsgVGFibGV9LCB7QGxpbmsgR3JpZH0sIG9yIHtAbGluayBUcmVlZ3JpZH0uXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI2NvbEluZGV4fVxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjcm93U3Bhbn1cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1jb2xzcGFuXHJcblx0XHQgKiBAdHlwZSB7P0ludGVnZXJ9XHJcblx0XHQgKi9cclxuICAgICAgICBcImNvbFNwYW5cIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBsb25nLnNldCh0aGlzLCBcImFyaWEtY29sc3BhblwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBsb25nLmdldCh0aGlzLCBcImFyaWEtY29sc3BhblwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZWZpbmVzIGFuIGVsZW1lbnQncyBudW1iZXIgb3IgcG9zaXRpb24gaW4gdGhlIGN1cnJlbnQgc2V0IG9mIHtAbGluayBsaXN0aXRlbX1zIG9yIHtAbGluayB0cmVlaXRlbX1zLlxyXG5cdFx0ICogTm90IHJlcXVpcmVkIGlmIGFsbCBlbGVtZW50cyBpbiB0aGUgc2V0IGFyZSBwcmVzZW50IGluIHRoZSBET00uXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI3NldFNpemV9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtcG9zaW5zZXRcclxuXHRcdCAqIEB0eXBlIHs/SW50ZWdlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwicG9zSW5TZXRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBsb25nLnNldCh0aGlzLCBcImFyaWEtcG9zaW5zZXRcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gbG9uZy5nZXQodGhpcywgXCJhcmlhLXBvc2luc2V0XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlZmluZXMgdGhlIHRvdGFsIG51bWJlciBvZiByb3dzIGluIGEge0BsaW5rIFRhYmxlfSwge0BsaW5rIEdyaWR9LCBvciB7QGxpbmsgVHJlZWdyaWR9LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNyb3dJbmRleH1cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1yb3djb3VudFxyXG5cdFx0ICogQHR5cGUgez9JbnRlZ2VyfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJyb3dDb3VudFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGxvbmcuc2V0KHRoaXMsIFwiYXJpYS1yb3djb3VudFwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBsb25nLmdldCh0aGlzLCBcImFyaWEtcm93Y291bnRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGVmaW5lcyBhbiBlbGVtZW50J3Mgcm93IGluZGV4IG9yIHBvc2l0aW9uIHdpdGggcmVzcGVjdCB0byB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3MgXHJcblx0XHQgKiB3aXRoaW4gYSAge0BsaW5rIFRhYmxlfSwge0BsaW5rIEdyaWR9LCBvciB7QGxpbmsgVHJlZWdyaWR9LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNyb3dDb3VudH1cclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI3Jvd1NwYW59XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtcm93aW5kZXhcclxuXHRcdCAqIEB0eXBlIHs/SW50ZWdlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwicm93SW5kZXhcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBsb25nLnNldCh0aGlzLCBcImFyaWEtcm93aW5kZXhcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gbG9uZy5nZXQodGhpcywgXCJhcmlhLXJvd2luZGV4XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlZmluZXMgdGhlIG51bWJlciBvZiByb3dzIHNwYW5uZWQgYnkgYSBjZWxsIG9yIGdyaWRjZWxsXHJcblx0XHQgKiB3aXRoaW4gYSB7QGxpbmsgVGFibGV9LCB7QGxpbmsgR3JpZH0sIG9yIHtAbGluayBUcmVlZ3JpZH0uXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI3Jvd0luZGV4fVxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjY29sU3Bhbn1cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1yb3dzcGFuXHJcblx0XHQgKiBAdHlwZSB7P0ludGVnZXJ9XHJcblx0XHQgKi9cclxuICAgICAgICBcInJvd1NwYW5cIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBsb25nLnNldCh0aGlzLCBcImFyaWEtcm93c3BhblwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBsb25nLmdldCh0aGlzLCBcImFyaWEtcm93c3BhblwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZWZpbmVzIHRoZSBudW1iZXIgb2YgaXRlbXMgaW4gdGhlIGN1cnJlbnQgc2V0IG9mIGxpc3RpdGVtcyBvciB0cmVlaXRlbXMuXHJcblx0XHQgKiBOb3QgcmVxdWlyZWQgaWYgKiphbGwqKiBlbGVtZW50cyBpbiB0aGUgc2V0IGFyZSBwcmVzZW50IGluIHRoZSBET00uXHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNwb3NJblNldH1cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1zZXRzaXplXHJcblx0XHQgKiBAdHlwZSB7P0ludGVnZXJ9XHJcblx0XHQgKi9cclxuICAgICAgICBcInNldFNpemVcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBsb25nLnNldCh0aGlzLCBcImFyaWEtc2V0c2l6ZVwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBsb25nLmdldCh0aGlzLCBcImFyaWEtc2V0c2l6ZVwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZWZpbmVzIHRoZSBoaWVyYXJjaGljYWwgbGV2ZWwgb2YgYW4gZWxlbWVudCB3aXRoaW4gYSBzdHJ1Y3R1cmUuXHJcblx0XHQgKiBFLmcuIGAmbHQ7aDEmZ3Q7Jmx0O2gxLyZndDtgIGVxdWFscyBgJmx0O2RpdiByb2xlPVwiaGVhZGluZ1wiIGFyaWEtbGV2ZWw9XCIxXCImZ3Q7Jmx0Oy9kaXY+YFxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtbGV2ZWxcclxuXHRcdCAqIEB0eXBlIHs/SW50ZWdlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwibGV2ZWxcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBsb25nLnNldCh0aGlzLCBcImFyaWEtbGV2ZWxcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gbG9uZy5nZXQodGhpcywgXCJhcmlhLWxldmVsXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKiBFTkQgT0YgQ09MTEVDVElPTlMgKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcblx0XHQvKiAqKioqKioqKioqKioqKioqKiogQUNDRVNTSUJMRSBMQUJFTCBBTkQgREVTQ1JJUFRJT04gKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIGFuIGxpc3Qgd2l0aCBBY2Nlc3NpYmxlTm9kZSBpbnN0YW5jZXMgdGhhdCBsYWJlbHMgdGhlIGN1cnJlbnQgZWxlbWVudFxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNkZXNjcmliZWRCeX1cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1sYWJlbGxlZGJ5XHJcblx0XHQgKiBAdHlwZSB7QWNjZXNzaWJsZU5vZGVMaXN0fVxyXG5cdFx0ICovXHJcblx0XHRcImxhYmVsZWRCeVwiOiB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdHNldCh2YWwpIHtcclxuXHRcdFx0XHRpZiAoISh2YWwgaW5zdGFuY2VvZiBBY2Nlc3NpYmxlTm9kZUxpc3RDb25zdHJ1Y3RvcikpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkl0IG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgQWNjZXNzaWJsZU5vZGVMaXN0XCIpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5fdmFsdWVzLmxhYmVsZWRCeSA9IHZhbDtcclxuXHRcdFx0XHR2YWwucGFyZW50QU9NID0gdGhpcztcclxuXHRcdFx0XHR2YWwuYXR0cmlidXRlID0gXCJhcmlhLWxhYmVsbGVkYnlcIjtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0KCkgeyByZXR1cm4gdGhpcy5fdmFsdWVzLmxhYmVsZWRCeSB8fCBudWxsOyB9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyBhbiBsaXN0IHdpdGggQWNjZXNzaWJsZU5vZGUgaW5zdGFuY2VzIHRoYXQgZGVzY3JpYmVzIHRoZSBjdXJyZW50IGVsZW1lbnRcclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjbGFiZWxlZEJ5fVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWRlc2NyaWJlZGJ5XHJcblx0XHQgKiBAdHlwZSB7QWNjZXNzaWJsZU5vZGVMaXN0fVxyXG5cdFx0ICovXHJcblx0XHRcImRlc2NyaWJlZEJ5XCI6IHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0c2V0KHZhbCkge1xyXG5cdFx0XHRcdGlmICghKHZhbCBpbnN0YW5jZW9mIEFjY2Vzc2libGVOb2RlTGlzdENvbnN0cnVjdG9yKSkge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSXQgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBBY2Nlc3NpYmxlTm9kZUxpc3RcIik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl92YWx1ZXMuZGVzY3JpYmVkQnkgPSB2YWw7XHJcblx0XHRcdFx0dmFsLnBhcmVudEFPTSA9IHRoaXM7XHJcblx0XHRcdFx0dmFsLmF0dHJpYnV0ZSA9IFwiYXJpYS1kZXNjcmliZWRieVwiO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXQoKSB7IHJldHVybiB0aGlzLl92YWx1ZXMuZGVzY3JpYmVkQnkgfHwgbnVsbDsgfVxyXG5cdFx0fSxcclxuXHJcblx0XHQvKiAqKioqKioqKioqKioqKiBFTkQgT0YgQUNDRVNTSUJMRSBMQUJFTCBBTkQgREVTQ1JJUFRJT04gKioqKioqKioqKioqKiogKi9cclxuXHRcdFxyXG5cdFx0LyogKioqKioqKioqKioqKioqKioqKioqKioqIE9USEVSIFJFTEFUSU9OU0hJUFMgKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIGFuIGxpc3Qgd2l0aCBBY2Nlc3NpYmxlTm9kZSBpbnN0YW5jZXMgd2hvc2UgY29udGVudHMgb3IgcHJlc2VuY2UgYXJlIGNvbnRyb2xsZWQgYnlcclxuXHRcdCAqIHRoZSBjdXJyZW50IGVsZW1lbnQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI293bnN9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtY29udHJvbHNcclxuXHRcdCAqIEB0eXBlIHtBY2Nlc3NpYmxlTm9kZUxpc3R9XHJcblx0XHQgKi9cclxuXHRcdFwiY29udHJvbHNcIjoge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRzZXQodmFsKSB7XHJcblx0XHRcdFx0aWYgKCEodmFsIGluc3RhbmNlb2YgQWNjZXNzaWJsZU5vZGVMaXN0Q29uc3RydWN0b3IpKSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJdCBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIEFjY2Vzc2libGVOb2RlTGlzdFwiKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlcy5jb250cm9scyA9IHZhbDtcclxuXHRcdFx0XHR2YWwucGFyZW50QU9NID0gdGhpcztcclxuXHRcdFx0XHR2YWwuYXR0cmlidXRlID0gXCJhcmlhLWNvbnRyb2xzXCI7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldCgpIHsgcmV0dXJuIHRoaXMuX3ZhbHVlcy5jb250cm9scyB8fCBudWxsOyB9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29udGFpbnMgdGhlIG5leHQgZWxlbWVudChzKSBpbiBhbiBhbHRlcm5hdGUgcmVhZGluZyBvcmRlciBvZiBjb250ZW50IHdoaWNoLCBhdCB0aGUgdXNlcidzIFxyXG5cdFx0ICogZGlzY3JldGlvbiwgYWxsb3dzIGFzc2lzdGl2ZSB0ZWNobm9sb2d5IHRvIG92ZXJyaWRlIHRoZSBnZW5lcmFsIGRlZmF1bHQgb2YgcmVhZGluZyBpblxyXG5cdFx0ICogZG9jdW1lbnQgc291cmNlIG9yZGVyLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtZmxvd3RvXHJcblx0XHQgKiBAdHlwZSB7QWNjZXNzaWJsZU5vZGVMaXN0fVxyXG5cdFx0ICovXHJcblx0XHRcImZsb3dUb1wiOiB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdHNldCh2YWwpIHtcclxuXHRcdFx0XHRpZiAoISh2YWwgaW5zdGFuY2VvZiBBY2Nlc3NpYmxlTm9kZUxpc3RDb25zdHJ1Y3RvcikpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkl0IG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgQWNjZXNzaWJsZU5vZGVMaXN0XCIpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5fdmFsdWVzLmZsb3dUbyA9IHZhbDtcclxuXHRcdFx0XHR2YWwucGFyZW50QU9NID0gdGhpcztcclxuXHRcdFx0XHR2YWwuYXR0cmlidXRlID0gXCJhcmlhLWZsb3d0b1wiO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXQoKSB7IHJldHVybiB0aGlzLl92YWx1ZXMuZmxvd1RvIHx8IG51bGw7IH1cclxuXHRcdH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb250YWlucyBjaGlsZHJlbiB3aG8ncyBJRCBhcmUgcmVmZXJlbmNlZCBpbnNpZGUgdGhlIGBhcmlhLW93bnNgIGF0dHJpYnV0ZVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLW93bnNcclxuXHRcdCAqIEB0eXBlIHtBY2Nlc3NpYmxlTm9kZUxpc3R9XHJcblx0XHQgKi9cclxuXHRcdFwib3duc1wiOiB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdHNldCh2YWwpIHtcclxuXHRcdFx0XHRpZiAoISh2YWwgaW5zdGFuY2VvZiBBY2Nlc3NpYmxlTm9kZUxpc3RDb25zdHJ1Y3RvcikpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkl0IG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgQWNjZXNzaWJsZU5vZGVMaXN0XCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLl92YWx1ZXMub3ducyA9IHZhbDtcclxuXHRcdFx0XHR2YWwucGFyZW50QU9NID0gdGhpcztcclxuXHRcdFx0XHR2YWwuYXR0cmlidXRlID0gXCJhcmlhLW93bnNcIjtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0KCkgeyByZXR1cm4gdGhpcy5fdmFsdWVzLm93bnMgfHwgbnVsbDsgfVxyXG5cdFx0fSxcclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqIEVORCBPRiBPVEhFUiBSRUxBVElPTlNISVBTICoqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4gICAgfVxyXG4pO1xyXG5cclxuZnVuY3Rpb24gc2V0QWNjZXNzaWJsZU5vZGUoYW9tLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XHJcblx0aWYgKHZhbHVlID09IHVuZGVmaW5lZCkge1xyXG5cdFx0Ly8gcmVtb3ZlIElEIG9mIGNvbm5lY3RlZCBlbGVtZW50IGlmIGdlbmVyYXRlZFxyXG5cdFx0aWYoYW9tLl92YWx1ZXNbYXR0cmlidXRlXSAmJiBhb20uX3ZhbHVlc1thdHRyaWJ1dGVdLmdlbmVyYXRlZF9pZCl7XHJcblx0XHRcdGFvbS5fdmFsdWVzW2F0dHJpYnV0ZV0uX25vZGUucmVtb3ZlQXR0cmlidXRlKFwiaWRcIik7XHJcblx0XHRcdGFvbS5fdmFsdWVzW2F0dHJpYnV0ZV0uZ2VuZXJhdGVkX2lkID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0YW9tLl92YWx1ZXNbYXR0cmlidXRlXSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIGFvbS5fbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTs7XHJcblx0fSBlbHNlIGlmICghKHZhbHVlIGluc3RhbmNlb2YgQWNjZXNzaWJsZU5vZGUpKSB7XHJcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBGYWlsZWQgdG8gc2V0IHRoZSAnI3thdHRyaWJ1dGV9JyBwcm9wZXJ0eSBvbiAnQWNjZXNzaWJsZU5vZGUnOiBUaGUgcHJvdmlkZWQgdmFsdWUgaXMgbm90IG9mIHR5cGUgJ0FjY2Vzc2libGVOb2RlJ2ApO1xyXG5cdH1cclxuXHJcbiAgICBpZiAodmFsdWUuX25vZGUpIHtcclxuXHRcdGlmICghdmFsdWUuX25vZGUuaWQpIHtcclxuXHRcdFx0LyoqIEB0b2RvIHJlbW92ZSB0ZW1wIGlkICovXHJcblx0XHRcdHZhbHVlLl9ub2RlLmlkID0gXCJpZC1cIiArIHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcclxuXHRcdFx0dmFsdWUuZ2VuZXJhdGVkX2lkID0gdHJ1ZTtcclxuXHRcdFx0Y29uc29sZS5sb2codmFsdWUsIHZhbHVlLmdlbmVyYXRlZF9pZCk7XHJcblx0XHR9XHJcblxyXG5cdFx0YW9tLl9ub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlLl9ub2RlLmlkKTtcclxuXHR9XHJcblxyXG5cdGFvbS5fdmFsdWVzW2F0dHJpYnV0ZV0gPSB2YWx1ZTtcclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuZnVuY3Rpb24gZ2V0QWNjZXNzaWJsZU5vZGUoYW9tLCBhdHRyaWJ1dGUpIHtcclxuXHR2YXIgdmFsdWUgPSBhb20uX3ZhbHVlc1thdHRyaWJ1dGVdO1xyXG5cdGlmICh2YWx1ZSA9PSB1bmRlZmluZWQpIHtcclxuXHRcdHZhciBhdHRyID0gYW9tLl9ub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xyXG5cdFx0aWYoYXR0ciA9PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRzLmdldChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdHRyKSk7XHJcblx0fVxyXG5cdHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWNjZXNzaWJsZU5vZGU7IiwiaW1wb3J0IEFjY2Vzc2libGVOb2RlIGZyb20gXCIuL0FjY2Vzc2libGVOb2RlXCI7XHJcblxyXG5leHBvcnQgbGV0IEFjY2Vzc2libGVOb2RlTGlzdENvbnN0cnVjdG9yID0gY2xhc3MgQWNjZXNzaWJsZU5vZGVMaXN0IGV4dGVuZHMgQXJyYXkge1xyXG5cdGl0ZW0oaW5kZXgpIHtcclxuXHRcdGlmKGlzTmFOKGluZGV4KSkgcmV0dXJuO1xyXG5cdFx0cmV0dXJuIHRoaXNbaW5kZXhdO1xyXG5cdH1cclxuXHJcblx0YWRkKGFjY2Vzc2libGVOb2RlLCBiZWZvcmUgPSBudWxsKSB7XHJcblx0XHRpZiAoIShhY2Nlc3NpYmxlTm9kZSBpbnN0YW5jZW9mIEFjY2Vzc2libGVOb2RlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGV4ZWN1dGUgJ2FkZCcgb24gJ0FjY2Vzc2libGVOb2RlTGlzdCc6IHBhcmFtZXRlciAxIGlzIG5vdCBvZiB0eXBlICdBY2Nlc3NpYmxlTm9kZScuXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKGJlZm9yZSAhPT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgYmVmb3JlSW5kZXggPSB0aGlzLmluZGV4T2YoYmVmb3JlKTtcclxuXHRcdFx0aWYoYmVmb3JlSW5kZXggPiAtMSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnNwbGljZShiZWZvcmVJbmRleCAtIDEsIDAsIGFjY2Vzc2libGVOb2RlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLnB1c2goYWNjZXNzaWJsZU5vZGUpO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKGluZGV4KSB7XHJcblx0XHQvLyB1cGRhdGUgRE9NIGF0dHJpYnV0ZVxyXG5cdFx0aWYgKHRoaXMucGFyZW50QU9NICYmIHRoaXNbaW5kZXhdLl9ub2RlICYmIHRoaXNbaW5kZXhdLl9ub2RlLmlkKSB7XHJcblx0XHRcdGxldCBpZHMgPSBbXTtcclxuXHJcblx0XHRcdGlmICh0aGlzLnBhcmVudEFPTS5fbm9kZS5oYXNBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUpKSB7XHJcblx0XHRcdFx0aWRzID0gdGhpcy5wYXJlbnRBT00uX25vZGUuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlKS5zcGxpdChcIiBcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWRzID0gW107XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBmaWx0ZXJlZElkcyA9IGlkcy5maWx0ZXIoZSA9PiBlICE9PSB0aGlzW2luZGV4XS5fbm9kZS5pZCk7XHJcblxyXG5cdFx0XHQvLyByZW1vdmUgZ2VuZXJhdGVkIGlkcyBhcyBsb25nIGl0IHdhcyBwcmV2aW91c2x5IHJlZmVyZW5jZWRcclxuXHRcdFx0aWYgKHRoaXNbaW5kZXhdLmdlbmVyYXRlZF9pZCA9PT0gdHJ1ZSAmJiBmaWx0ZXJlZElkcy5sZW5ndGggPCBpZHMubGVuZ3RoKSB7XHJcblx0XHRcdFx0dGhpc1tpbmRleF0uX25vZGUuaWQgPSBcIlwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnBhcmVudEFPTS5fbm9kZS5zZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUsIGZpbHRlcmVkSWRzLmpvaW4oXCIgXCIpKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5wb3AoaW5kZXgpO1xyXG5cdH1cclxufVxyXG5cclxudmFyIGFycmF5Q2hhbmdlSGFuZGxlciA9IHtcclxuXHRzZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xyXG5cdFx0Ly8gYWRkaW5nIG9yIGNoYW5naW5nIGEgdmFsdWUgaW5zaWRlIHRoZSBhcnJheVxyXG5cdFx0aWYgKCFpc05hTihwcm9wZXJ0eSkpIHtcclxuXHJcblx0XHRcdC8vIGNoZWNrIGlmIGl0cyB2YWxpZCB0eXBlXHJcblx0XHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFjY2Vzc2libGVOb2RlKSB7XHJcblx0XHRcdFx0dGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xyXG5cclxuXHRcdFx0XHQvLyB1cGRhdGUgRE9NIGF0dHJpYnV0ZVxyXG5cdFx0XHRcdGlmICh0YXJnZXQucGFyZW50QU9NICYmIHZhbHVlICYmIHZhbHVlLl9ub2RlKSB7XHJcblx0XHRcdFx0XHRpZighdmFsdWUuX25vZGUuaWQpIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUuX25vZGUuaWQgPSBcImFvbS1cIiArIERhdGUubm93KCk7XHJcblx0XHRcdFx0XHRcdHZhbHVlLmdlbmVyYXRlZF9pZCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0bGV0IGlkcyA9IFtdO1xyXG5cdFx0XHRcdFx0aWYgKHRhcmdldC5wYXJlbnRBT00uX25vZGUuaGFzQXR0cmlidXRlKHRhcmdldC5hdHRyaWJ1dGUpKSB7XHJcblx0XHRcdFx0XHRcdGlkcyA9IHRhcmdldC5wYXJlbnRBT00uX25vZGUuZ2V0QXR0cmlidXRlKHRhcmdldC5hdHRyaWJ1dGUpLnNwbGl0KFwiIFwiKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlkcyA9IFtdO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlkcy5wdXNoKHZhbHVlLl9ub2RlLmlkKTtcclxuXHJcblx0XHRcdFx0XHR0YXJnZXQucGFyZW50QU9NLl9ub2RlLnNldEF0dHJpYnV0ZSh0YXJnZXQuYXR0cmlidXRlLCBpZHMuam9pbihcIiBcIikpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IGluc3RhbmNlcyBvZiBBY2Nlc3NpYmxlTm9kZSBhcmUgYWxsb3dlZFwiKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xyXG5cdFx0Ly8geW91IGhhdmUgdG8gcmV0dXJuIHRydWUgdG8gYWNjZXB0IHRoZSBjaGFuZ2VzXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5mdW5jdGlvbiBBY2Nlc3NpYmxlTm9kZUxpc3RQcm94eSgpIHtcclxuXHRsZXQgYWNjZXNzaWJsZU5vZGVMaXN0ID0gbmV3IEFjY2Vzc2libGVOb2RlTGlzdENvbnN0cnVjdG9yKCk7XHRcclxuXHRyZXR1cm4gbmV3IFByb3h5KGFjY2Vzc2libGVOb2RlTGlzdCwgYXJyYXlDaGFuZ2VIYW5kbGVyKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWNjZXNzaWJsZU5vZGVMaXN0UHJveHk7IiwiLyoqXHJcbiAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGEgZ2l2ZW4gYXR0cmlidXRlXHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEByZXR1cm4ge1N0cmluZ30gYXR0cmlidXRlJ3MgdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQoYW9tLCBhdHRyaWJ1dGVOYW1lKSB7XHJcblx0cmV0dXJuIGFvbS5fdmFsdWVzW2F0dHJpYnV0ZU5hbWVdIHx8IGFvbS5fbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTeW5jIHRoZSBuZXcgdmFsdWUgdG8gdGhlIERPTVxyXG4gKiBAcGFyYW0ge0FjY2Vzc2libGVOb2RlfSBhb20gXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVOYW1lIFxyXG4gKiBAcGFyYW0ge1N0cmluZyB8IE51bWJlciB9IHN0YXR1cyBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXQoYW9tLCBhdHRyaWJ1dGVOYW1lLCBzdGF0dXMpIHtcclxuXHRpZiAoc3RhdHVzID09IHVuZGVmaW5lZCkge1xyXG5cdFx0YW9tLl9ub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0YW9tLl9ub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBzdGF0dXMpO1xyXG5cdH1cclxuXHRcclxuXHRhb20uX3ZhbHVlc1thdHRyaWJ1dGVOYW1lXSA9IHR5cGVvZiBzdGF0dXMgIT0gXCJ1bmRlZmluZWRcIiA/IHN0YXR1cy50b1N0cmluZygpIDogc3RhdHVzO1xyXG5cdHJldHVybiBzdGF0dXM7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgZ2V0LCBzZXQgfTsiLCJjbGFzcyBFdmVudFRhcmdldCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJfbGlzdGVuZXJzXCIsIHsgdmFsdWU6IG5ldyBNYXAoKSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2xpc3RlbmVycy5oYXModHlwZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnNldCh0eXBlLCBbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5nZXQodHlwZSkucHVzaCh7bGlzdGVuZXIsIG9wdGlvbnN9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMuaGFzKHR5cGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN0YWNrID0gdGhpcy5fbGlzdGVuZXJzLmdldCh0eXBlKTtcclxuICAgICAgICBzdGFjay5mb3JFYWNoKCAobGlzdGVuZXIsIGkpID0+IHtcclxuICAgICAgICAgICAgaWYobGlzdGVuZXIubGlzdGVuZXIgPT09IGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFjay5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaEV2ZW50KGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMuaGFzKGV2ZW50LnR5cGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RhY2sgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGV2ZW50LnR5cGUpO1xyXG5cclxuICAgICAgICBzdGFjay5mb3JFYWNoKCBsaXN0ZW5lciA9PiB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiAhZXZlbnQuZGVmYXVsdFByZXZlbnRlZDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRUYXJnZXQ7IiwiLyoqXHJcbiAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGdpdmVuIGF0dHJpYnV0ZSBhcyBCb29sZWFuXHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGF0dHJpYnV0ZSdzIHZhbHVlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0KGFvbSwgYXR0cmlidXRlTmFtZSkge1xyXG5cdHZhciB2YWx1ZSA9IGFvbS5fdmFsdWVzW2F0dHJpYnV0ZU5hbWVdIHx8IGFvbS5fbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcblxyXG5cdGlmKHZhbHVlID09IHVuZGVmaW5lZCApIHJldHVybiBudWxsO1xyXG5cdHJldHVybiB2YWx1ZSAgPT0gXCJ0cnVlXCIgfHwgZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTeW5jIHRoZSBuZXcgdmFsdWUgdG8gdGhlIHByb3BlcnR5XHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEBwYXJhbSB7U3RyaW5nIHwgQm9vbGVhbn0gc3RhdHVzIFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldChhb20sIGF0dHJpYnV0ZU5hbWUsIHN0YXR1cykge1xyXG5cdGlmKHN0YXR1cyA9PSB1bmRlZmluZWQpIHtcclxuXHRcdGFvbS5fbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGFvbS5fbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgc3RhdHVzKTtcclxuXHR9XHJcblxyXG5cdGFvbS5fdmFsdWVzW2F0dHJpYnV0ZU5hbWVdID0gc3RhdHVzICE9IHVuZGVmaW5lZCA/IHN0YXR1cy50b1N0cmluZygpIDogc3RhdHVzO1xyXG5cdHJldHVybiBzdGF0dXM7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgZ2V0LCBzZXQgfTsiLCIvKipcclxuICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBnaXZlbiBhdHRyaWJ1dGUgYXMgTnVtYmVyXHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEByZXR1cm4ge051bWJlcn0gYXR0cmlidXRlJ3MgdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQoYW9tLCBhdHRyaWJ1dGVOYW1lKSB7XHJcblx0dmFyIHZhbHVlID0gYW9tLl92YWx1ZXNbYXR0cmlidXRlTmFtZV0gfHwgYW9tLl9ub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTs7XHJcblx0aWYgKHZhbHVlID09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XHJcblx0cmV0dXJuIE51bWJlcih2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTeW5jIHRoZSBuZXcgdmFsdWUgdG8gdGhlIERPTVxyXG4gKiBAcGFyYW0ge0FjY2Vzc2libGVOb2RlfSBhb20gXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVOYW1lIFxyXG4gKiBAcGFyYW0ge1N0cmluZyB8IE51bWJlciB9IHN0YXR1cyBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXQoYW9tLCBhdHRyaWJ1dGVOYW1lLCBzdHIpIHtcclxuXHRpZihzdHIgPT0gbnVsbCkge1xyXG5cdFx0YW9tLl9ub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0YW9tLl9ub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBzdHIpO1xyXG5cdH1cclxuXHJcblx0YW9tLl92YWx1ZXNbYXR0cmlidXRlTmFtZV0gPSBzdGF0dXMudG9TdHJpbmcoKTtcclxuXHRyZXR1cm4gc3RhdHVzO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7IGdldCwgc2V0IH07IiwiLyogZXNsaW50OiBzb3VyY2UtdHlwZTogbW9kdWxlICovXHJcblxyXG5pbXBvcnQgQWNjZXNzaWJsZU5vZGUgZnJvbSAnLi8uLi9zcmMvQWNjZXNzaWJsZU5vZGUuanMnO1xyXG5pbXBvcnQgQWNjZXNzaWJsZU5vZGVMaXN0IGZyb20gJy4vLi4vc3JjL0FjY2Vzc2libGVOb2RlTGlzdC5qcyc7XHJcblxyXG4vLyBpZiAoIXdpbmRvdy5BY2Nlc3NpYmxlTm9kZSAmJiAhd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdCkge1xyXG4gICAgXHJcbiAgICB3aW5kb3cuQWNjZXNzaWJsZU5vZGUgPSBBY2Nlc3NpYmxlTm9kZTtcclxuICAgIHdpbmRvdy5BY2Nlc3NpYmxlTm9kZUxpc3QgPSBBY2Nlc3NpYmxlTm9kZUxpc3Q7XHJcbiAgICBcclxuICAgIHZhciBlbGVtZW50cyA9IG5ldyBXZWFrTWFwKCk7XHJcbiAgICBcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsICdhY2Nlc3NpYmxlTm9kZScsIHtcclxuICAgICAgICBnZXQoKSB7XHJcbiAgICAgICAgICAgIGlmKGVsZW1lbnRzLmhhcyh0aGlzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRzLmdldCh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIHZhciBhb20gPSBuZXcgQWNjZXNzaWJsZU5vZGUodGhpcyk7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzLnNldCh0aGlzLCBhb20pO1xyXG4gICAgICAgICAgICByZXR1cm4gYW9tO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIChmdW5jdGlvbiAoZ2V0QXR0cmlidXRlKSB7XHJcbiAgICAvLyAgICAgRWxlbWVudC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgIC8vICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IGdldEF0dHJpYnV0ZS5jYWxsKHRoaXMsIG5hbWUpO1xyXG5cclxuICAgIC8vICAgICAgICAgaWYoXHJcbiAgICAvLyAgICAgICAgICAgICBuYW1lLmluZGV4T2YoXCJhcmlhLVwiKSA9PSAwXHJcbiAgICAvLyAgICAgICAgICAgICAmJiB0aGlzLmFjY2Vzc2libGVOb2RlIFxyXG4gICAgLy8gICAgICAgICAgICAgJiYgdHlwZW9mIHRoaXMuYWNjZXNzaWJsZU5vZGUuX2RlZmF1bHRWYWx1ZXNbbmFtZV0gIT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgLy8gICAgICAgICApIHtcclxuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0XCIsIHRoaXMuYWNjZXNzaWJsZU5vZGUuX2RlZmF1bHRWYWx1ZXNbbmFtZV0pXHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY2Nlc3NpYmxlTm9kZS5fZGVmYXVsdFZhbHVlc1tuYW1lXTtcclxuICAgIC8vICAgICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9KShFbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGUpO1xyXG5cclxuLy8gfSIsIi8qKlxyXG4gKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIGdpdmVuIGF0dHJpYnV0ZSBhcyBJbnRlZ2VyXHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEByZXR1cm4ge051bWJlcn0gYXR0cmlidXRlJ3MgdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQoYW9tLCBhdHRyaWJ1dGVOYW1lKSB7XHJcblx0dmFyIHZhbHVlID0gYW9tLl92YWx1ZXNbYXR0cmlidXRlTmFtZV0gfHwgYW9tLl9ub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTs7XHJcblx0aWYgKHZhbHVlID09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XHJcblx0cmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFN5bmMgdGhlIG5ldyB2YWx1ZSB0byB0aGUgRE9NXHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEBwYXJhbSB7U3RyaW5nIHwgTnVtYmVyIH0gc3RhdHVzIFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldChhb20sIGF0dHJpYnV0ZU5hbWUsIHN0cikge1xyXG5cdGlmIChzdHIgPT0gbnVsbCkge1xyXG5cdFx0YW9tLl9ub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0YW9tLl9ub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBzdHIpO1xyXG5cdH1cclxuXHJcblx0YW9tLl92YWx1ZXNbYXR0cmlidXRlTmFtZV0gPSBzdGF0dXMudG9TdHJpbmcoKTtcclxuXHRyZXR1cm4gc3RhdHVzO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7IGdldCwgc2V0IH07IiwiLyogZXNsaW50LWVudiBtb2NoYSAqL1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xyXG5cclxuaW1wb3J0IHsgQWNjZXNzaWJsZU5vZGVMaXN0Q29uc3RydWN0b3IgYXMgQWNjZXNzaWJsZU5vZGVMaXN0IH0gZnJvbSAnLi8uLi9zcmMvQWNjZXNzaWJsZU5vZGVMaXN0LmpzJztcclxuaW1wb3J0IHsgc2V0VGltZW91dCB9IGZyb20gJ3RpbWVycyc7XHJcblxyXG52YXIgYXR0cmlidXRlcyA9IHtcclxuICAgICdyb2xlJzogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICdyb2xlRGVzY3JpcHRpb24nOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgJ2xhYmVsJzogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICdsYWJlbGVkQnknOiB7IHR5cGU6IEFjY2Vzc2libGVOb2RlTGlzdCB9LFxyXG4gICAgJ2Rlc2NyaWJlZEJ5JzogeyB0eXBlOiBBY2Nlc3NpYmxlTm9kZUxpc3QgfSxcclxuICAgICdjdXJyZW50JzogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICdhdXRvY29tcGxldGUnOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgJ2hpZGRlbic6IHsgdHlwZTogQm9vbGVhbiB9LFxyXG4gICAgJ2tleVNob3J0Y3V0cyc6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAnbW9kYWwnOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuICAgICdtdWx0aWxpbmUnOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuICAgICdtdWx0aXNlbGVjdGFibGUnOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuICAgICdvcmllbnRhdGlvbic6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAncmVhZE9ubHknOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuICAgICdyZXF1aXJlZCc6IHsgdHlwZTogQm9vbGVhbiB9LFxyXG4gICAgJ3NlbGVjdGVkJzogeyB0eXBlOiBCb29sZWFuIH0sXHJcbiAgICAnc29ydCc6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAnY2hlY2tlZCc6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAnZXhwYW5kZWQnOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuICAgICdkaXNhYmxlZCc6IHsgdHlwZTogQm9vbGVhbiB9LFxyXG4gICAgJ2ludmFsaWQnOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgJ2hhc1BvcFVwJzogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICdwcmVzc2VkJzogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICd2YWx1ZVRleHQnOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgJ3BsYWNlaG9sZGVyJzogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICd2YWx1ZU5vdyc6IHsgdHlwZTogTnVtYmVyIH0sXHJcbiAgICAndmFsdWVNaW4nOiB7IHR5cGU6IE51bWJlciB9LFxyXG4gICAgJ3ZhbHVlTWF4JzogeyB0eXBlOiBOdW1iZXIgfSxcclxuICAgICdhdG9taWMnOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuICAgICdidXN5JzogeyB0eXBlOiBCb29sZWFuIH0sXHJcbiAgICAnbGl2ZSc6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAncmVsZXZhbnQnOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgJ2FjdGl2ZURlc2NlbmRhbnQnOiB7IHR5cGU6IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZSB9LFxyXG4gICAgJ2NvbnRyb2xzJzogeyB0eXBlOiBBY2Nlc3NpYmxlTm9kZUxpc3QgfSxcclxuICAgICdkZXRhaWxzJzogeyB0eXBlOiB3aW5kb3cuQWNjZXNzaWJsZU5vZGUgfSxcclxuICAgICdlcnJvck1lc3NhZ2UnOiB7IHR5cGU6IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZSB9LFxyXG4gICAgJ2Zsb3dUbyc6IHsgdHlwZTogQWNjZXNzaWJsZU5vZGVMaXN0IH0sXHJcbiAgICAnb3ducyc6IHsgdHlwZTogQWNjZXNzaWJsZU5vZGVMaXN0IH0sXHJcbiAgICAnY29sQ291bnQnOiB7IHR5cGU6IE51bWJlciB9LFxyXG4gICAgJ2NvbEluZGV4JzogeyB0eXBlOiBOdW1iZXIgfSxcclxuICAgICdjb2xTcGFuJzogeyB0eXBlOiBOdW1iZXIgfSxcclxuICAgICdwb3NJblNldCc6IHsgdHlwZTogTnVtYmVyIH0sXHJcbiAgICAncm93Q291bnQnOiB7IHR5cGU6IE51bWJlciB9LFxyXG4gICAgJ3Jvd0luZGV4JzogeyB0eXBlOiBOdW1iZXIgfSxcclxuICAgICdyb3dTcGFuJzogeyB0eXBlOiBOdW1iZXIgfSxcclxuICAgICdzZXRTaXplJzogeyB0eXBlOiBOdW1iZXIgfSxcclxuICAgICdsZXZlbCc6IHsgdHlwZTogTnVtYmVyIH1cclxufTtcclxuXHJcbmRlc2NyaWJlKCdBY2Nlc3NpYmxlTm9kZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIGl0KCdjb25zdHJ1Y3RvciBleGlzdCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhc3NlcnQub2soXHJcbiAgICAgICAgICAgIHdpbmRvdy5BY2Nlc3NpYmxlTm9kZS5wcm90b3R5cGVcclxuICAgICAgICAgICAgJiYgd2luZG93LkFjY2Vzc2libGVOb2RlLnByb3RvdHlwZS5jb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAmJiB3aW5kb3cuQWNjZXNzaWJsZU5vZGUucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgICAgICApO1xyXG4gICAgfSlcclxuXHJcbiAgICBkZXNjcmliZSgnb24gSFRNTEVsZW1lbnQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGFuIGFjY2Vzc2libGVOb2RlIHByb3BlcnR5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhc3NlcnQub2soZGl2LmFjY2Vzc2libGVOb2RlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGJlIG9mIGNvcnJlY3QgdHlwZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGRpdi5hY2Nlc3NpYmxlTm9kZS5jb25zdHJ1Y3Rvci5uYW1lLCB3aW5kb3cuQWNjZXNzaWJsZU5vZGUubmFtZSk7XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdpbnN0YW5jZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgYWxsIGFyaWEtKiBhdHRyaWJ1dGVzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbWlzc2luZ0F0dHJzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZmlsdGVyKGF0dHJpYnV0ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyaWJ1dGVdID09IFwidW5kZWZpbmVkXCI7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWlzc2luZ0F0dHJzLCBbXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnZWFjaCBhdHRyaWJ1dGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGFzIGRlZmF1bHQgdmFsdWUgb2YgbnVsbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYXR0ciBpbiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgaGF2ZSB0aGUgY29ycmVjdCB0eXBlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBhdHRyIGluIGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldCBzb21lIChmYWtlKSBkYXRhXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGF0dHJpYnV0ZXNbYXR0cl0udHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgU3RyaW5nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBcIjMwcHhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb29sZWFuOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgTnVtYmVyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBcIjMwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQWNjZXNzaWJsZU5vZGVMaXN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBuZXcgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBuZXcgYXR0cmlidXRlc1thdHRyXS50eXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSA9PT0gbnVsbCkgY29uc29sZS5sb2coYXR0ciwgZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdKTtcclxuICAgICAgICAgICAgICAgIGxldCBhY3R1YWwgPSBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0uY29uc3RydWN0b3IubmFtZTtcclxuICAgICAgICAgICAgICAgIGxldCBleHBlY3RlZCA9IGF0dHJpYnV0ZXNbYXR0cl0udHlwZS5uYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLFxyXG4gICAgICAgICAgICAgICAgICAgIGBUaGUgcHJvcGVydHkgJyR7YXR0cn0nIGlzIG5vdCBjb3JyZWN0bHkgZGVmaW5lZCwgaXQgd2FzICR7YWN0dWFsfSwgYnV0IGV4cGVjdGVkICR7ZXhwZWN0ZWR9YFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRlc2NyaWJlKCdvZiB0eXBlIEFjY2Vzc2libGVOb2RlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgYW5BdHRyaWJ1dGVzID0gT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykuZmlsdGVyKGF0dHIgPT4gYXR0clsxXS50eXBlID09IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIG9ubHkgYWxsb3cgYW4gaW5zdGFuY2Ugb2YgQWNjZXNzaWJsZU5vZGUgb3IgbnVsbCBhcyB2YWx1ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGFuQXR0cmlidXRlcy5mb3JFYWNoKG9iaiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHIgPSBvYmpbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2VydC50aHJvd3MoKCkgPT4gZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdID0gbmV3IFN0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQudGhyb3dzKCgpID0+IGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSA9IFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2VydC5kb2VzTm90VGhyb3coKCkgPT4gZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdID0gbmV3IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZSgpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGRlc2NyaWJlKCdQb2x5ZmlsbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBhdHRyID0gXCJvd25zXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZGl2V2l0aElEID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIGRpdldpdGhJRC5pZCA9IFwiYW9tLWlkXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGRpdldpdGhvdXRJRCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaXQoJ0lEIG9mIGFkZGVkIGVsZW1lbnQgc2hvdWxkIGJlIHJlZmxlY3RlZCBpbiB0aGUgQVJJQScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXYuYWNjZXNzaWJsZU5vZGUuYWN0aXZlRGVzY2VuZGFudCA9IGRpdldpdGhJRC5hY2Nlc3NpYmxlTm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZGl2LmdldEF0dHJpYnV0ZShcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiKSwgZGl2V2l0aElELmlkKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaXQoJ0lEIG9mIHJlbW92ZWQgZWxlbWVudCBzaG91bGQgYmUgcmVmbGVjdGVkIGluIHRoZSBBUklBJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpdi5hY2Nlc3NpYmxlTm9kZS5hY3RpdmVEZXNjZW5kYW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZGl2LmdldEF0dHJpYnV0ZShcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiKSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGl0KCdhbiBhZGRlZCBlbGVtZW50IHdpdGhvdXQgSUQgc2hvdWxkIGJlIGdlbmVyYXRlZCBhbmQgcmVmbGVjdCBpbiB0aGUgQVJJQSBhdHRyaWJ1dGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGl2LmFjY2Vzc2libGVOb2RlLmFjdGl2ZURlc2NlbmRhbnQgPSBkaXZXaXRob3V0SUQuYWNjZXNzaWJsZU5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGRpdi5nZXRBdHRyaWJ1dGUoXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIiksIGRpdldpdGhvdXRJRC5pZCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGl0KCdhbiBnZW5lcmF0ZWQgSUQgc2hvdWxkIGJlIHJlbW92ZWQgYWZ0ZXIgbm8gY29ubmVjdGlvbiBleGlzdCBhbnltb3JlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpdi5hY2Nlc3NpYmxlTm9kZS5hY3RpdmVEZXNjZW5kYW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoZGl2LmdldEF0dHJpYnV0ZShcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiKSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGRpdldpdGhvdXRJRC5pZCwgJycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRlc2NyaWJlKCdvZiB0eXBlIEFjY2Vzc2libGVOb2RlTGlzdCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGFubEF0dHJpYnV0ZXMgPSBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKS5maWx0ZXIoYXR0ciA9PiBhdHRyWzFdLnR5cGUgPT0gQWNjZXNzaWJsZU5vZGVMaXN0KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgb25seSBhbGxvdyBhbiBpbnN0YW5jZSBvZiBBY2Nlc3NpYmxlTm9kZUxpc3QgYXMgdmFsdWUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBhbmxBdHRyaWJ1dGVzLmZvckVhY2gob2JqID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0ciA9IG9ialswXTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQudGhyb3dzKCgpID0+IGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSA9IG5ldyBTdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0LnRocm93cygoKSA9PiBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KCgpID0+IGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSA9IG5ldyB3aW5kb3cuQWNjZXNzaWJsZU5vZGVMaXN0KCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIGRlc2NyaWJlKCdFdmVudFRhcmdldCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgYWRkRXZlbnRMaXN0ZW5lcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXNzZXJ0Lm9rKGRpdi5hY2Nlc3NpYmxlTm9kZS5hZGRFdmVudExpc3RlbmVyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgcmVtb3ZlRXZlbnRMaXN0ZW5lciwgZGlzcGF0Y2hFdmVudCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXNzZXJ0Lm9rKGRpdi5hY2Nlc3NpYmxlTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgZGlzcGF0Y2hFdmVudCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXNzZXJ0Lm9rKGRpdi5hY2Nlc3NpYmxlTm9kZS5kaXNwYXRjaEV2ZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gYWRkIGFuZCB0cmlnZ2VyIGV2ZW50cycsIGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgIGRpdi5hY2Nlc3NpYmxlTm9kZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gZG9uZSgpKTtcclxuICAgICAgICAgICAgZGl2LmFjY2Vzc2libGVOb2RlLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnUG9seWZpbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaXQoJ0FjY2Vzc2libGVOb2RlIHByb3BlcnRpZXMgc2hvdWxkIHJlZmxlY3QgQVJJQScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZGl2LmFjY2Vzc2libGVOb2RlLnJvbGUgPSBcImJ1dHRvblwiO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoZGl2LmFjY2Vzc2libGVOb2RlLnJvbGUsIGRpdi5nZXRBdHRyaWJ1dGUoXCJyb2xlXCIpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnQVJJQSBzaG91bGQgbm90IG92ZXJ3cml0ZSBBY2Nlc3NpYmxlTm9kZScsIGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiZ3JvdXBcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBhdHRyaWJ1dGVzIGFyZSByZXNldCBieSBhbiBtdXRhdGlvbiBvYnNlcnZlcixcclxuICAgICAgICAgICAgLy8gYXMgcmVzdWx0IHRoZSBjaGFuZ2VzIG11c3QgYmUgY2hlY2tlZCBpbiB0aGUgbmV4dCBjaGVja1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGRpdi5hY2Nlc3NpYmxlTm9kZS5yb2xlLCBkaXYuZ2V0QXR0cmlidXRlKFwicm9sZVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKFwiYnV0dG9uXCIsIGRpdi5nZXRBdHRyaWJ1dGUoXCJyb2xlXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZShlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ0FSSUEgc2hvdWxkIGJlIG92ZXJ3cml0YWJsZSB3aGVuIG5vIHZhbHVlIGlzIHNldCB3aXRoaW4gQWNjZXNzaWJsZU5vZGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiRm9vXCIpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoZGl2LmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiksIFwiRm9vXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCcuYXR0cmlidXRlcyBzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IHZhbHVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkaXYuYXR0cmlidXRlcywgZGl2LmFjY2Vzc2libGVOb2RlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnLmdldEF0dHJpYnV0ZSBzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IHZhbHVlJywgKGRvbmUpID0+IHtcclxuICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJmYWtlXCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcImZha2UzXCIpO1xyXG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImlkXCIsIFwiaG9pXCIpO1xyXG4gICAgICAgICAgICAgICAgZGl2LmlkID0gXCJoZXlcIjtcclxuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImFzZGZcIik7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBkaXYuYWNjZXNzaWJsZU5vZGUubGFiZWwgPSBcImZha2UyXCI7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0ZXN0XCIsIGRpdi5nZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIpLCBkaXYuYWNjZXNzaWJsZU5vZGUuX2RlZmF1bHRWYWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKGFzc2VydC5lcXVhbChkaXYuZ2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKSwgXCJmYWtlXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIiwiLyogZXNsaW50LWVudiBtb2NoYSAqL1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xyXG5cclxuZGVzY3JpYmUoJ0FjY2Vzc2libGVOb2RlTGlzdCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBpdCgnY29uc3RydWN0b3IgZXhpc3QgaW4gd2luZG93IG9iamVjdCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhc3NlcnQub2sod2luZG93LkFjY2Vzc2libGVOb2RlTGlzdC5wcm90b3R5cGUgJiYgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdC5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnW051bWJlcl0nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBuZXcgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdCgpO1xyXG4gICAgICAgIGxldCBkaXYxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBsZXQgZGl2MCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byBhZGQgYWNjZXNpYmxlTm9kZSBieSBzcGVjaWZpYyBpbmRleCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGlzdFswXSA9IGRpdjEuYWNjZXNzaWJsZU5vZGU7XHJcbiAgICAgICAgICAgIGxpc3RbXCIxXCJdID0gZGl2MS5hY2Nlc3NpYmxlTm9kZTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChsaXN0WzBdLCBkaXYxLmFjY2Vzc2libGVOb2RlKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGxpc3RbXCIxXCJdLCBkaXYxLmFjY2Vzc2libGVOb2RlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gb3ZlcndyaXRlIGFjY2VzaWJsZU5vZGUgYnkgc3BlY2lmaWMgaW5kZXgnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxpc3RbMF0gPSBkaXYwLmFjY2Vzc2libGVOb2RlO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGxpc3RbMF0sIGRpdjAuYWNjZXNzaWJsZU5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgaWYgaW5kZXggZG9lcyBub3QgZXhpc3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChsaXN0WzJdLCBudWxsKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGxpc3RbXCIyXCJdLCBudWxsKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCcubGVuZ3RoJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBsaXN0ID0gbmV3IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZUxpc3QoKTtcclxuXHJcbiAgICAgICAgaXQoJ2hhcyBhIGRlZmF1bHQgdmFsdWUgb2YgMCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGxpc3QubGVuZ3RoLCAwKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnY2FuIGJlIHNldCBhdCBhbiBkaWZmZXJlbnQgc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGlzdC5sZW5ndGggPSAzO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoQXJyYXkuZnJvbShsaXN0KS5sZW5ndGgsIDMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdmaXJzdCB2YWx1ZSBpcyBlbXB0eSBzbG90JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwobGlzdFswXSwgbnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnLmFkZCgpJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBpdCgnY2FuIG9ubHkgYWRkIGluc3RhbmNlcyBvZiBBY2Nlc3NpYmxlTm9kZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBuZXcgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdCgpO1xyXG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC50aHJvd3MoKCkgPT4gbGlzdC5hZGQodHJ1ZSkpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KCgpID0+IGxpc3QuYWRkKGRpdi5hY2Nlc3NpYmxlTm9kZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdCgnY2FuIGFkZCBBY2Nlc3NpYmxlTm9kZSBiZWZvcmUgYW4gc3BlY2lmaWMgQWNjZXNzaWJsZU5vZGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gbmV3IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZUxpc3QoKTtcclxuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGxldCBkaXYyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxpc3QuYWRkKGRpdi5hY2Nlc3NpYmxlTm9kZSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KCgpID0+IGxpc3QuYWRkKGRpdjIuYWNjZXNzaWJsZU5vZGUsIGRpdi5hY2Nlc3NpYmxlTm9kZSkpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwobGlzdC5sZW5ndGgsIDIpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwobGlzdFswXSwgZGl2Mi5hY2Nlc3NpYmxlTm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnLml0ZW0oKScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgbGlzdCA9IG5ldyB3aW5kb3cuQWNjZXNzaWJsZU5vZGVMaXN0KCk7XHJcbiAgICAgICAgbGV0IGRpdjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGxldCBkaXYwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBsaXN0LmFkZChkaXYxLmFjY2Vzc2libGVOb2RlKTtcclxuICAgICAgICBsaXN0LmFkZChkaXYwLmFjY2Vzc2libGVOb2RlLCBkaXYxLmFjY2Vzc2libGVOb2RlKTtcclxuXHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvcnJlY3QgYWNjZXNzaWJsZU5vZGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChsaXN0Lml0ZW0oMCksIGRpdjAuYWNjZXNzaWJsZU5vZGUpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwobGlzdC5pdGVtKFwiMVwiKSwgZGl2MS5hY2Nlc3NpYmxlTm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gbnVsbCBpZiBpbmRleCBkb2VzIG5vdCBleGlzdCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGxpc3QuaXRlbSgyKSwgbnVsbCk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChsaXN0Lml0ZW0oXCIyXCIpLCBudWxsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG9ubHkgcmV0dXJuIHZhbHVlcyBvZiBpbmRleCBudW1iZXJzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhc3NlcnQubm90RXF1YWwobGlzdC5pdGVtKFwibGVuZ3RoXCIpLCBsaXN0Lmxlbmd0aCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnLnJlbW92ZSgpJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBsaXN0ID0gbmV3IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZUxpc3QoKTtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBsaXN0LmFkZChkaXYuYWNjZXNzaWJsZU5vZGUpO1xyXG5cclxuICAgICAgICBpdCgnc2hvdWxkIHJlbW92ZSB0aGUgcmVmZXJlbmNlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsaXN0LnJlbW92ZSgwKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGxpc3RbMF0sIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChsaXN0Lmxlbmd0aCwgMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnUG9seWZpbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGF0dHIgPSBcIm93bnNcIjtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBuZXcgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdCgpO1xyXG5cclxuICAgICAgICB2YXIgZGl2V2l0aElEID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXZXaXRoSUQuaWQgPSBcImFvbS1pZFwiO1xyXG5cclxuICAgICAgICB2YXIgZGl2V2l0aG91dElEID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgaXQoJ2VhY2ggSUQgb2YgYWRkZWQgZWxlbWVudHMgc2hvdWxkIGJlIHJlZmxlY3RlZCBpbiB0aGUgQVJJQScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdLmFkZChkaXZXaXRoSUQuYWNjZXNzaWJsZU5vZGUpO1xyXG4gICAgICAgICAgICBhc3NlcnQub2soZGl2LmdldEF0dHJpYnV0ZShcImFyaWEtb3duc1wiKS5pbmRleE9mKGRpdldpdGhJRC5pZCkgPiAtMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ2VhY2ggSUQgb2YgcmVtb3ZlZCBlbGVtZW50cyBzaG91bGQgYmUgcmVmbGVjdGVkIGluIHRoZSBBUklBJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0ucmVtb3ZlKDApO1xyXG4gICAgICAgICAgICBhc3NlcnQub2soZGl2LmdldEF0dHJpYnV0ZShcImFyaWEtb3duc1wiKS5pbmRleE9mKGRpdldpdGhJRC5pZCkgPT0gLTEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdhbiBhZGRlZCBlbGVtZW50IHdpdGhvdXQgSUQgc2hvdWxkIGJlIGdlbmVyYXRlZCBhbmQgcmVmbGVjdCBpbiB0aGUgQVJJQSBhdHRyaWJ1dGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXS5hZGQoZGl2V2l0aG91dElELmFjY2Vzc2libGVOb2RlKTtcclxuICAgICAgICAgICAgYXNzZXJ0Lm9rKGRpdi5nZXRBdHRyaWJ1dGUoXCJhcmlhLW93bnNcIikuaW5kZXhPZihkaXZXaXRob3V0SUQuaWQpID4gLTEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdhbiBnZW5lcmF0ZWQgSUQgc2hvdWxkIGJlIHJlbW92ZWQgYWZ0ZXIgbm8gY29ubmVjdGlvbiBleGlzdCBhbnltb3JlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0ucmVtb3ZlKDApO1xyXG4gICAgICAgICAgICBhc3NlcnQub2soZGl2LmdldEF0dHJpYnV0ZShcImFyaWEtb3duc1wiKS5pbmRleE9mKGRpdldpdGhJRC5pZCkgPT0gLTEpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoZGl2V2l0aG91dElELmlkLCBcIlwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJcclxucmVxdWlyZSgnLi8uLi9zcmMvaW5kZXguanMnKTtcclxuXHJcbi8vIHRlc3RzXHJcbnJlcXVpcmUoJy4vdGVzdHMtYWNjZXNzaWJsZW5vZGUuanMnKTtcclxucmVxdWlyZSgnLi90ZXN0cy1hY2Nlc3NpYmxlbm9kZWxpc3QuanMnKTsiXX0=
