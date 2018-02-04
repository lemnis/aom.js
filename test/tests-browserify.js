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

},{"util/":5}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],5:[function(require,module,exports){
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

},{"./support/isBuffer":4,"_process":2,"inherits":3}],6:[function(require,module,exports){
"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
								var newValue = aom._node.getAttribute(attrName);
								var oldValue = aom._values[attrName];

								// overwrite the attribute if AOM has an different defined value
								if (oldValue && newValue !== oldValue) {
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

								// start the mutation observer if the AccessibleNode is connected to an node
								if (node) {
												var observer = new MutationObserver(mutationObserverCallback.bind(_this));
												observer.observe(_this._node, { attributes: true, attributeFilter: attributes });
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
												console.log(this, this._values);
												this._values.owns = val;
												val.parentAOM = this;
												val.attribute = "aria-owns";
								},
								get: function get() {
												return this._values.owns || null;
								}
				}

				/* ********************* END OF OTHER RELATIONSHIPS ********************* */
});

function setAccessibleNode(aom, attribute, value) {
				if (!(value instanceof AccessibleNode)) {
								throw new Error("It must be an instance of AccessibleNode");
				}

				if (value == undefined) {
								return aom._node.removeAttribute(value._node.id);
				}

				if (value._node) {
								if (!value._node.id) {
												/** @todo remove temp id */
												value._node.id = "id-" + Date.now();
								}

								aom._node.setAttribute(attribute, value._node.id);
				}

				aom._values[attribute] = value;
				return value;
}
function getAccessibleNode(aom, attribute) {
				var value = aom._values[attribute];
				if (value == undefined) return null;
				return value;
}

exports.default = AccessibleNode;

},{"./../src/AccessibleNodeList.js":7,"./DOMString":8,"./EventTarget":9,"./boolean":10,"./double":11,"./long":13}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AccessibleNodeListConstructor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AccessibleNode = require("./AccessibleNode");

var _AccessibleNode2 = _interopRequireDefault(_AccessibleNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

},{"./AccessibleNode":6}],8:[function(require,module,exports){
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
  return aom._values[attributeName] || null;
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

  aom._values[attributeName] = status;
  return status;
}

exports.default = { get: get, set: set };

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventTarget = function () {
    function EventTarget() {
        _classCallCheck(this, EventTarget);

        Object.defineProperty(this, "_listeners", { value: new Map() });
    }

    _createClass(EventTarget, [{
        key: "addEventListener",
        value: function addEventListener(type, callback) {
            if (!this._listeners.has(type)) {
                this._listeners.set(type, []);
            }
            this._listeners.get(type).push(callback);
        }
    }, {
        key: "removeEventListener",
        value: function removeEventListener(type, callback) {
            if (!this._listeners.has(type)) {
                return;
            }
            var stack = this._listeners.get(type);
            stack.forEach(function (listener, i) {
                if (listener === callback) {
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

},{}],10:[function(require,module,exports){
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
  var value = aom._values[attributeName];
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

  aom._values[attributeName] = status;
  return status;
}

exports.default = { get: get, set: set };

},{}],11:[function(require,module,exports){
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
  var value = aom._values[attributeName];
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

  aom._values[attributeName] = status;
  return status;
}

exports.default = { get: get, set: set };

},{}],12:[function(require,module,exports){
'use strict';

var _AccessibleNode = require('./../src/AccessibleNode.js');

var _AccessibleNode2 = _interopRequireDefault(_AccessibleNode);

var _AccessibleNodeList = require('./../src/AccessibleNodeList.js');

var _AccessibleNodeList2 = _interopRequireDefault(_AccessibleNodeList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// }

},{"./../src/AccessibleNode.js":6,"./../src/AccessibleNodeList.js":7}],13:[function(require,module,exports){
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
  var value = aom._values[attributeName];
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

  aom._values[attributeName] = status;
  return status;
}

exports.default = { get: get, set: set };

},{}],14:[function(require,module,exports){
'use strict';

var _AccessibleNodeList = require('./../src/AccessibleNodeList.js');

/* eslint-env mocha */

require('./../src/index.js');


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

			it('should only allow an instance of AccessibleNode as value', function () {
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
			setTimeout(function () {
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
		it('.attributes should return the correct value', function () {});
		it('.getAttribute should return the correct value', function () {});
	});
});

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
			console.log(div, div.accessibleNode[attr], div.getAttribute("aria-owns"));
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

},{"./../src/AccessibleNodeList.js":7,"./../src/index.js":12,"assert":1}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNyYy9BY2Nlc3NpYmxlTm9kZS5qcyIsInNyYy9BY2Nlc3NpYmxlTm9kZUxpc3QuanMiLCJzcmMvRE9NU3RyaW5nLmpzIiwic3JjL0V2ZW50VGFyZ2V0LmpzIiwic3JjL2Jvb2xlYW4uanMiLCJzcmMvZG91YmxlLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2xvbmcuanMiLCJ0ZXN0L3Rlc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QzdFLE9BQUksY0FBSixDQUFtQixJQUFuQixFQUF5QixNQUF6QixDQUFnQyxDQUFoQztBQUNBLFVBQU8sRUFBUCxDQUFVLElBQUksWUFBSixDQUFpQixXQUFqQixFQUE4QixPQUE5QixDQUFzQyxVQUFVLEVBQWhELEtBQXVELENBQUMsQ0FBbEU7QUFDQSxHQUhEO0FBSUEsS0FBRyxtRkFBSCxFQUF3RixZQUFZO0FBQ25HLE9BQUksY0FBSixDQUFtQixJQUFuQixFQUF5QixHQUF6QixDQUE2QixhQUFhLGNBQTFDO0FBQ0EsVUFBTyxFQUFQLENBQVUsSUFBSSxZQUFKLENBQWlCLFdBQWpCLEVBQThCLE9BQTlCLENBQXNDLGFBQWEsRUFBbkQsSUFBeUQsQ0FBQyxDQUFwRTtBQUNBLEdBSEQ7QUFJQSxLQUFHLHFFQUFILEVBQTBFLFlBQVk7QUFDckYsT0FBSSxjQUFKLENBQW1CLElBQW5CLEVBQXlCLE1BQXpCLENBQWdDLENBQWhDO0FBQ0EsVUFBTyxFQUFQLENBQVUsSUFBSSxZQUFKLENBQWlCLFdBQWpCLEVBQThCLE9BQTlCLENBQXNDLFVBQVUsRUFBaEQsS0FBdUQsQ0FBQyxDQUFsRTtBQUNBLFVBQU8sS0FBUCxDQUFhLGFBQWEsRUFBMUIsRUFBOEIsRUFBOUI7QUFDQSxHQUpEO0FBS0EsRUE1QkQ7QUE2QkEsQ0FoSUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb21wYXJlIGFuZCBpc0J1ZmZlciB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2Jsb2IvNjgwZTllNWU0ODhmMjJhYWMyNzU5OWE1N2RjODQ0YTYzMTU5MjhkZC9pbmRleC5qc1xuLy8gb3JpZ2luYWwgbm90aWNlOlxuXG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHZhciB4ID0gYS5sZW5ndGg7XG4gIHZhciB5ID0gYi5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV07XG4gICAgICB5ID0gYltpXTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoeSA8IHgpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gMDtcbn1cbmZ1bmN0aW9uIGlzQnVmZmVyKGIpIHtcbiAgaWYgKGdsb2JhbC5CdWZmZXIgJiYgdHlwZW9mIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihiKTtcbiAgfVxuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKTtcbn1cblxuLy8gYmFzZWQgb24gbm9kZSBhc3NlcnQsIG9yaWdpbmFsIG5vdGljZTpcblxuLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbC8nKTtcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBmdW5jdGlvbnNIYXZlTmFtZXMgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9vKCkge30ubmFtZSA9PT0gJ2Zvbyc7XG59KCkpO1xuZnVuY3Rpb24gcFRvU3RyaW5nIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xufVxuZnVuY3Rpb24gaXNWaWV3KGFycmJ1Zikge1xuICBpZiAoaXNCdWZmZXIoYXJyYnVmKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbC5BcnJheUJ1ZmZlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYnVmKTtcbiAgfVxuICBpZiAoIWFycmJ1Zikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoYXJyYnVmIGluc3RhbmNlb2YgRGF0YVZpZXcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoYXJyYnVmLmJ1ZmZlciAmJiBhcnJidWYuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4vLyAxLiBUaGUgYXNzZXJ0IG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgdGhhdCB0aHJvd1xuLy8gQXNzZXJ0aW9uRXJyb3IncyB3aGVuIHBhcnRpY3VsYXIgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4gVGhlXG4vLyBhc3NlcnQgbW9kdWxlIG11c3QgY29uZm9ybSB0byB0aGUgZm9sbG93aW5nIGludGVyZmFjZS5cblxudmFyIGFzc2VydCA9IG1vZHVsZS5leHBvcnRzID0gb2s7XG5cbi8vIDIuIFRoZSBBc3NlcnRpb25FcnJvciBpcyBkZWZpbmVkIGluIGFzc2VydC5cbi8vIG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCB9KVxuXG52YXIgcmVnZXggPSAvXFxzKmZ1bmN0aW9uXFxzKyhbXlxcKFxcc10qKVxccyovO1xuLy8gYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2xqaGFyYi9mdW5jdGlvbi5wcm90b3R5cGUubmFtZS9ibG9iL2FkZWVlZWM4YmZjYzYwNjhiMTg3ZDdkOWZiM2Q1YmIxZDNhMzA4OTkvaW1wbGVtZW50YXRpb24uanNcbmZ1bmN0aW9uIGdldE5hbWUoZnVuYykge1xuICBpZiAoIXV0aWwuaXNGdW5jdGlvbihmdW5jKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzKSB7XG4gICAgcmV0dXJuIGZ1bmMubmFtZTtcbiAgfVxuICB2YXIgc3RyID0gZnVuYy50b1N0cmluZygpO1xuICB2YXIgbWF0Y2ggPSBzdHIubWF0Y2gocmVnZXgpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV07XG59XG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9ICdBc3NlcnRpb25FcnJvcic7XG4gIHRoaXMuYWN0dWFsID0gb3B0aW9ucy5hY3R1YWw7XG4gIHRoaXMuZXhwZWN0ZWQgPSBvcHRpb25zLmV4cGVjdGVkO1xuICB0aGlzLm9wZXJhdG9yID0gb3B0aW9ucy5vcGVyYXRvcjtcbiAgaWYgKG9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBnZXRNZXNzYWdlKHRoaXMpO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IHRydWU7XG4gIH1cbiAgdmFyIHN0YWNrU3RhcnRGdW5jdGlvbiA9IG9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9uIHx8IGZhaWw7XG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICAvLyB0cnkgdG8gc3RyaXAgdXNlbGVzcyBmcmFtZXNcbiAgICAgIHZhciBmbl9uYW1lID0gZ2V0TmFtZShzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gdHJ1bmNhdGUocywgbikge1xuICBpZiAodHlwZW9mIHMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5mdW5jdGlvbiBpbnNwZWN0KHNvbWV0aGluZykge1xuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzIHx8ICF1dGlsLmlzRnVuY3Rpb24oc29tZXRoaW5nKSkge1xuICAgIHJldHVybiB1dGlsLmluc3BlY3Qoc29tZXRoaW5nKTtcbiAgfVxuICB2YXIgcmF3bmFtZSA9IGdldE5hbWUoc29tZXRoaW5nKTtcbiAgdmFyIG5hbWUgPSByYXduYW1lID8gJzogJyArIHJhd25hbWUgOiAnJztcbiAgcmV0dXJuICdbRnVuY3Rpb24nICsgIG5hbWUgKyAnXSc7XG59XG5mdW5jdGlvbiBnZXRNZXNzYWdlKHNlbGYpIHtcbiAgcmV0dXJuIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5hY3R1YWwpLCAxMjgpICsgJyAnICtcbiAgICAgICAgIHNlbGYub3BlcmF0b3IgKyAnICcgK1xuICAgICAgICAgdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmV4cGVjdGVkKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5kZWVwU3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBkZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwU3RyaWN0RXF1YWwnLCBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgJiYgaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUoYWN0dWFsLCBleHBlY3RlZCkgPT09IDA7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNEYXRlKGFjdHVhbCkgJiYgdXRpbC5pc0RhdGUoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMgSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBSZWdFeHAgb2JqZWN0IHdpdGggdGhlIHNhbWUgc291cmNlIGFuZFxuICAvLyBwcm9wZXJ0aWVzIChgZ2xvYmFsYCwgYG11bHRpbGluZWAsIGBsYXN0SW5kZXhgLCBgaWdub3JlQ2FzZWApLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNSZWdFeHAoYWN0dWFsKSAmJiB1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuc291cmNlID09PSBleHBlY3RlZC5zb3VyY2UgJiZcbiAgICAgICAgICAgYWN0dWFsLmdsb2JhbCA9PT0gZXhwZWN0ZWQuZ2xvYmFsICYmXG4gICAgICAgICAgIGFjdHVhbC5tdWx0aWxpbmUgPT09IGV4cGVjdGVkLm11bHRpbGluZSAmJlxuICAgICAgICAgICBhY3R1YWwubGFzdEluZGV4ID09PSBleHBlY3RlZC5sYXN0SW5kZXggJiZcbiAgICAgICAgICAgYWN0dWFsLmlnbm9yZUNhc2UgPT09IGV4cGVjdGVkLmlnbm9yZUNhc2U7XG5cbiAgLy8gNy40LiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKChhY3R1YWwgPT09IG51bGwgfHwgdHlwZW9mIGFjdHVhbCAhPT0gJ29iamVjdCcpICYmXG4gICAgICAgICAgICAgKGV4cGVjdGVkID09PSBudWxsIHx8IHR5cGVvZiBleHBlY3RlZCAhPT0gJ29iamVjdCcpKSB7XG4gICAgcmV0dXJuIHN0cmljdCA/IGFjdHVhbCA9PT0gZXhwZWN0ZWQgOiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gSWYgYm90aCB2YWx1ZXMgYXJlIGluc3RhbmNlcyBvZiB0eXBlZCBhcnJheXMsIHdyYXAgdGhlaXIgdW5kZXJseWluZ1xuICAvLyBBcnJheUJ1ZmZlcnMgaW4gYSBCdWZmZXIgZWFjaCB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZVxuICAvLyBUaGlzIG9wdGltaXphdGlvbiByZXF1aXJlcyB0aGUgYXJyYXlzIHRvIGhhdmUgdGhlIHNhbWUgdHlwZSBhcyBjaGVja2VkIGJ5XG4gIC8vIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgKGFrYSBwVG9TdHJpbmcpLiBOZXZlciBwZXJmb3JtIGJpbmFyeVxuICAvLyBjb21wYXJpc29ucyBmb3IgRmxvYXQqQXJyYXlzLCB0aG91Z2gsIHNpbmNlIGUuZy4gKzAgPT09IC0wIGJ1dCB0aGVpclxuICAvLyBiaXQgcGF0dGVybnMgYXJlIG5vdCBpZGVudGljYWwuXG4gIH0gZWxzZSBpZiAoaXNWaWV3KGFjdHVhbCkgJiYgaXNWaWV3KGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgIHBUb1N0cmluZyhhY3R1YWwpID09PSBwVG9TdHJpbmcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgIShhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgfHxcbiAgICAgICAgICAgICAgIGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSkpIHtcbiAgICByZXR1cm4gY29tcGFyZShuZXcgVWludDhBcnJheShhY3R1YWwuYnVmZmVyKSxcbiAgICAgICAgICAgICAgICAgICBuZXcgVWludDhBcnJheShleHBlY3RlZC5idWZmZXIpKSA9PT0gMDtcblxuICAvLyA3LjUgRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgIT09IGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBtZW1vcyA9IG1lbW9zIHx8IHthY3R1YWw6IFtdLCBleHBlY3RlZDogW119O1xuXG4gICAgdmFyIGFjdHVhbEluZGV4ID0gbWVtb3MuYWN0dWFsLmluZGV4T2YoYWN0dWFsKTtcbiAgICBpZiAoYWN0dWFsSW5kZXggIT09IC0xKSB7XG4gICAgICBpZiAoYWN0dWFsSW5kZXggPT09IG1lbW9zLmV4cGVjdGVkLmluZGV4T2YoZXhwZWN0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9zLmFjdHVhbC5wdXNoKGFjdHVhbCk7XG4gICAgbWVtb3MuZXhwZWN0ZWQucHVzaChleHBlY3RlZCk7XG5cbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYiwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykge1xuICBpZiAoYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBpZiBvbmUgaXMgYSBwcmltaXRpdmUsIHRoZSBvdGhlciBtdXN0IGJlIHNhbWVcbiAgaWYgKHV0aWwuaXNQcmltaXRpdmUoYSkgfHwgdXRpbC5pc1ByaW1pdGl2ZShiKSlcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgaWYgKHN0cmljdCAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYSkgIT09IE9iamVjdC5nZXRQcm90b3R5cGVPZihiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIHZhciBhSXNBcmdzID0gaXNBcmd1bWVudHMoYSk7XG4gIHZhciBiSXNBcmdzID0gaXNBcmd1bWVudHMoYik7XG4gIGlmICgoYUlzQXJncyAmJiAhYklzQXJncykgfHwgKCFhSXNBcmdzICYmIGJJc0FyZ3MpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGFJc0FyZ3MpIHtcbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIsIHN0cmljdCk7XG4gIH1cbiAgdmFyIGthID0gb2JqZWN0S2V5cyhhKTtcbiAgdmFyIGtiID0gb2JqZWN0S2V5cyhiKTtcbiAgdmFyIGtleSwgaTtcbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT09IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQubm90RGVlcFN0cmljdEVxdWFsID0gbm90RGVlcFN0cmljdEVxdWFsO1xuZnVuY3Rpb24gbm90RGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwU3RyaWN0RXF1YWwnLCBub3REZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59XG5cblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIElnbm9yZS4gIFRoZSBpbnN0YW5jZW9mIGNoZWNrIGRvZXNuJ3Qgd29yayBmb3IgYXJyb3cgZnVuY3Rpb25zLlxuICB9XG5cbiAgaWYgKEVycm9yLmlzUHJvdG90eXBlT2YoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWU7XG59XG5cbmZ1bmN0aW9uIF90cnlCbG9jayhibG9jaykge1xuICB2YXIgZXJyb3I7XG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh0eXBlb2YgYmxvY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJsb2NrXCIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAodHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICBhY3R1YWwgPSBfdHJ5QmxvY2soYmxvY2spO1xuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgdmFyIHVzZXJQcm92aWRlZE1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZyc7XG4gIHZhciBpc1Vud2FudGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIHV0aWwuaXNFcnJvcihhY3R1YWwpO1xuICB2YXIgaXNVbmV4cGVjdGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIGFjdHVhbCAmJiAhZXhwZWN0ZWQ7XG5cbiAgaWYgKChpc1Vud2FudGVkRXhjZXB0aW9uICYmXG4gICAgICB1c2VyUHJvdmlkZWRNZXNzYWdlICYmXG4gICAgICBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHxcbiAgICAgIGlzVW5leHBlY3RlZEV4Y2VwdGlvbikge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyh0cnVlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MoZmFsc2UsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB0aHJvdyBlcnI7IH07XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsImltcG9ydCBET01TdHJpbmcgZnJvbSBcIi4vRE9NU3RyaW5nXCI7XHJcbmltcG9ydCBib29sZWFuIGZyb20gXCIuL2Jvb2xlYW5cIjtcclxuaW1wb3J0IGRvdWJsZSBmcm9tIFwiLi9kb3VibGVcIjtcclxuaW1wb3J0IGxvbmcgZnJvbSBcIi4vbG9uZ1wiO1xyXG5pbXBvcnQgRXZlbnRUYXJnZXQgZnJvbSAnLi9FdmVudFRhcmdldCc7XHJcbmltcG9ydCB7IEFjY2Vzc2libGVOb2RlTGlzdENvbnN0cnVjdG9yIH0gZnJvbSAnLi8uLi9zcmMvQWNjZXNzaWJsZU5vZGVMaXN0LmpzJztcclxuXHJcbi8vIGFsbCBhdHRyaWJ1dGVzIHVzZWQgd2l0aGluIEFPTVxyXG52YXIgYXR0cmlidXRlcyA9IFtcclxuXHRcInJvbGVcIiwgXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIiwgXCJhcmlhLWF0b21pY1wiLCBcImFyaWEtYXV0b2NvbXBsZXRlXCIsIFwiYXJpYS1idXN5XCIsIFwiYXJpYS1jaGVja2VkXCIsXHJcblx0XCJhcmlhLWNvbGNvdW50XCIsIFwiYXJpYS1jb2xpbmRleFwiLCBcImFyaWEtY29sc3BhblwiLCBcImFyaWEtY29udHJvbHNcIiwgXCJhcmlhLWN1cnJlbnRcIiwgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXHJcblx0XCJhcmlhLWRldGFpbHNcIiwgXCJhcmlhLWRpc2FibGVkXCIsIFwiYXJpYS1kcm9wZWZmZWN0XCIsIFwiYXJpYS1lcnJvcm1lc3NhZ2VcIiwgXCJhcmlhLWV4cGFuZGVkXCIsXHJcblx0XCJhcmlhLWZsb3d0b1wiLCBcImFyaWEtZ3JhYmJlZFwiLCBcImFyaWEtaGFzcG9wdXBcIiwgXCJhcmlhLWhpZGRlblwiLCBcImFyaWEtaW52YWxpZFwiLCBcImFyaWEta2V5c2hvcnRjdXRzXCIsXHJcblx0XCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCIsIFwiYXJpYS1sZXZlbFwiLCBcImFyaWEtbGl2ZVwiLCBcImFyaWEtbW9kYWxcIiwgXCJhcmlhLW11bHRpbGluZVwiLFxyXG5cdFwiYXJpYS1tdWx0aXNlbGVjdGFibGVcIiwgXCJhcmlhLW9yaWVudGF0aW9uXCIsIFwiYXJpYS1vd25zXCIsIFwiYXJpYS1wbGFjZWhvbGRlclwiLCBcImFyaWEtcG9zaW5zZXRcIixcclxuXHRcImFyaWEtcHJlc3NlZFwiLCBcImFyaWEtcmVhZG9ubHlcIiwgXCJhcmlhLXJlbGV2YW50XCIsIFwiYXJpYS1yZXF1aXJlZFwiLCBcImFyaWEtcm9sZWRlc2NyaXB0aW9uXCIsXHJcblx0XCJhcmlhLXJvd2NvdW50XCIsIFwiYXJpYS1yb3dpbmRleFwiLCBcImFyaWEtcm93c3BhblwiLCBcImFyaWEtc2VsZWN0ZWRcIiwgXCJhcmlhLXNldHNpemVcIiwgXCJhcmlhLXNvcnRcIixcclxuXHRcImFyaWEtdmFsdWVtYXhcIiwgXCJhcmlhLXZhbHVlbWluXCIsIFwiYXJpYS12YWx1ZW5vd1wiLCBcImFyaWEtdmFsdWV0ZXh0XCJcclxuXTtcclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHtNdXRhdGlvbn0gbXV0YXRpb25zIFxyXG4gKi9cclxuZnVuY3Rpb24gbXV0YXRpb25PYnNlcnZlckNhbGxiYWNrKG11dGF0aW9ucykge1xyXG5cdHZhciBhb20gPSB0aGlzO1xyXG5cclxuICAgIG11dGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChtdXRhdGlvbikge1xyXG5cdFx0bGV0IGF0dHJOYW1lID0gbXV0YXRpb24uYXR0cmlidXRlTmFtZTtcclxuXHRcdGxldCBuZXdWYWx1ZSA9IGFvbS5fbm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xyXG5cdFx0bGV0IG9sZFZhbHVlID0gYW9tLl92YWx1ZXNbYXR0ck5hbWVdO1xyXG5cclxuXHRcdC8vIG92ZXJ3cml0ZSB0aGUgYXR0cmlidXRlIGlmIEFPTSBoYXMgYW4gZGlmZmVyZW50IGRlZmluZWQgdmFsdWVcclxuXHRcdGlmIChvbGRWYWx1ZSAmJiBuZXdWYWx1ZSAhPT0gb2xkVmFsdWUpIHtcclxuXHRcdFx0YW9tW2F0dHJOYW1lXSA9IG9sZFZhbHVlO1xyXG5cdFx0fVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCYXNlZCBvbiB0aGUgQU9NIHNwZWNcclxuICogQGNsYXNzXHJcbiAqL1xyXG5jbGFzcyBBY2Nlc3NpYmxlTm9kZSBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcclxuICAgIGNvbnN0cnVjdG9yKG5vZGUpIHtcclxuICAgICAgICBzdXBlcihub2RlKTtcclxuXHJcbiAgICAgICAgLy8gc3RvcmUgdGhlIG5vZGUgd2hlcmUgdGhlIEFjY2Vzc2libGVOb2RlIGlzIGNvbm5lY3RlZCB3aXRoXHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJfbm9kZVwiLCB7IHZhbHVlOiBub2RlIH0pO1xyXG5cdFx0Ly8gc2V0IGFuIGhpZGRlbiBvYmplY3QgdG8gc3RvcmUgYWxsIHZhbHVlcyBpblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIl92YWx1ZXNcIiwgeyB2YWx1ZToge319KTtcclxuXHJcblx0XHQvLyBzdGFydCB0aGUgbXV0YXRpb24gb2JzZXJ2ZXIgaWYgdGhlIEFjY2Vzc2libGVOb2RlIGlzIGNvbm5lY3RlZCB0byBhbiBub2RlXHJcblx0XHRpZihub2RlKSB7XHJcblx0XHRcdHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG11dGF0aW9uT2JzZXJ2ZXJDYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuXHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9ub2RlLCB7IGF0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZUZpbHRlcjogYXR0cmlidXRlcyB9KTtcclxuXHRcdH1cclxuICAgIH1cclxufVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQWNjZXNzaWJsZU5vZGUucHJvdG90eXBlLFxyXG4gICAgLyoqIEBsZW5kcyBBY2Nlc3NpYmxlTm9kZS5wcm90b3R5cGUgKi9cclxuICAgIHtcclxuXHRcdC8qKiBcclxuXHRcdCogRGVmaW5lcyBhIHR5cGUgaXQgcmVwcmVzZW50cywgZS5nLiBgdGFiYFxyXG5cdFx0KiBcclxuXHRcdCogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNyb2xlc1xyXG5cdFx0KiBAdHlwZSAgez9TdHJpbmd9XHJcblx0XHQqL1xyXG4gICAgICAgIFwicm9sZVwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwicm9sZVwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwicm9sZVwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqIFxyXG5cdFx0ICogRGVmaW5lcyBhIGh1bWFuLXJlYWRhYmxlLCBhdXRob3ItbG9jYWxpemVkIGRlc2NyaXB0aW9uIGZvciB0aGUgcm9sZVxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtcm9sZWRlc2NyaXB0aW9uXHJcblx0XHQgKiBAdHlwZSB7P1N0cmluZ31cclxuXHRcdCAqL1xyXG4gICAgICAgIFwicm9sZURlc2NyaXB0aW9uXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtcm9sZURlc2NyaXB0aW9uXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIERPTVN0cmluZy5nZXQodGhpcywgXCJhcmlhLXJvbGVEZXNjcmlwdGlvblwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKiogQUNDRVNTSUJMRSBMQUJFTCBBTkQgREVTQ1JJUFRJT04gKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuXHRcdC8qKiBcclxuXHRcdCogRGVmaW5lcyBhIHN0cmluZyB2YWx1ZSB0aGF0IGxhYmVscyB0aGUgY3VycmVudCBlbGVtZW50LlxyXG5cdFx0KiBcclxuXHRcdCogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWxhYmVsXHJcblx0XHQqIEB0eXBlIHs/U3RyaW5nfSBcclxuXHRcdCovXHJcbiAgICAgICAgXCJsYWJlbFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLWxhYmVsXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIERPTVN0cmluZy5nZXQodGhpcywgXCJhcmlhLWxhYmVsXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqIEVORCBPRiBBQ0NFU1NJQkxFIExBQkVMIEFORCBERVNDUklQVElPTiAqKioqKioqKioqKioqKiogKi9cclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqIEdMT0JBTCBTVEFURVMgQU5EIFBST1BFUlRJRVMgKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5cdFx0LyoqIFxyXG5cdFx0ICogSW5kaWNhdGVzIHRoZSBlbGVtZW50IHRoYXQgcmVwcmVzZW50cyB0aGUgY3VycmVudCBpdGVtIHdpdGhpbiBhIGNvbnRhaW5lciBvciBzZXQgb2YgcmVsYXRlZCBlbGVtZW50cy5cclxuXHRcdCAqIFxyXG5cdFx0ICogfCBWYWx1ZSB8IERlc2NyaXB0aW9uIHxcclxuXHRcdCAqIHwgLS0tIHwgLS0tIHxcclxuXHRcdCAqIHwgcGFnZSB8IHVzZWQgdG8gaW5kaWNhdGUgYSBsaW5rIHdpdGhpbiBhIHNldCBvZiBwYWdpbmF0aW9uIGxpbmtzLCB3aGVyZSB0aGUgbGluayBpcyB2aXN1YWxseSBzdHlsZWQgdG8gcmVwcmVzZW50IHRoZSBjdXJyZW50bHktZGlzcGxheWVkIHBhZ2UuXHJcblx0XHQgKiB8IHN0ZXAgfCB1c2VkIHRvIGluZGljYXRlIGEgbGluayB3aXRoaW4gYSBzdGVwIGluZGljYXRvciBmb3IgYSBzdGVwLWJhc2VkIHByb2Nlc3MsIHdoZXJlIHRoZSBsaW5rIGlzIHZpc3VhbGx5IHN0eWxlZCB0byByZXByZXNlbnQgdGhlIGN1cnJlbnQgc3RlcC5cclxuXHRcdCAqIHwgbG9jYXRpb24gfCB1c2VkIHRvIGluZGljYXRlIHRoZSBpbWFnZSB0aGF0IGlzIHZpc3VhbGx5IGhpZ2hsaWdodGVkIGFzIHRoZSBjdXJyZW50IGNvbXBvbmVudCBvZiBhIGZsb3cgY2hhcnQuXHJcblx0XHQgKiB8IGRhdGUgfCB1c2VkIHRvIGluZGljYXRlIHRoZSBjdXJyZW50IGRhdGUgd2l0aGluIGEgY2FsZW5kYXIuXHJcblx0XHQgKiB8IHRpbWUgfCB1c2VkIHRvIGluZGljYXRlIHRoZSBjdXJyZW50IHRpbWUgd2l0aGluIGEgdGltZXRhYmxlLlxyXG5cdFx0ICogfCB0cnVlIHwgUmVwcmVzZW50cyB0aGUgY3VycmVudCBpdGVtIHdpdGhpbiBhIHNldC5cclxuXHRcdCAqIHwgZmFsc2UgfCBEb2VzIG5vdCByZXByZXNlbnQgdGhlIGN1cnJlbnQgaXRlbSB3aXRoaW4gYSBzZXQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1jdXJyZW50XHJcblx0XHQgKiBAdHlwZSB7P1N0cmluZ31cclxuXHRcdCAqL1xyXG4gICAgICAgIFwiY3VycmVudFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLWN1cnJlbnRcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEtY3VycmVudFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqIEVORCBPRiBHTE9CQUwgU1RBVEVTIEFORCBQUk9QRVJUSUVTICoqKioqKioqKioqKioqKioqICovXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIFdJREdFVCBQUk9QRVJUSUVTICoqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMgd2hldGhlciBpbnB1dHRpbmcgdGV4dCBjb3VsZCB0cmlnZ2VyIGRpc3BsYXkgb2Ygb25lIG9yIG1vcmUgcHJlZGljdGlvbnMgb2YgdGhlIHVzZXInc1xyXG5cdFx0ICogaW50ZW5kZWQgdmFsdWUgZm9yIGFuIGlucHV0IGFuZCBzcGVjaWZpZXMgaG93IHByZWRpY3Rpb25zIHdvdWxkIGJlIHByZXNlbnRlZCBpZiB0aGV5IGFyZSBtYWRlLlxyXG5cdFx0ICogXHJcblx0XHQgKiBUaGUgYmVoYXZpb3IgZHVyaW5nIGlucHV0IGlzIGRlcGVuZHMgb24gdGhlIHByb3ZpZGVkIHZhbHVlLCBpdCBmb2xsb3dzIGJlbmVhdGggdGFibGUuXHJcblx0XHQgKiBcclxuXHRcdCAqIHwgVmFsdWUgIHwgXHREZXNjcmlwdGlvbiB8XHJcblx0XHQgKiB8IC0tLS0tLSB8IC0tLSB8XHJcblx0XHQgKiB8IGlubGluZSB8IFRleHQgc3VnZ2VzdGluZyBtYXkgYmUgZHluYW1pY2FsbHkgaW5zZXJ0ZWQgYWZ0ZXIgdGhlIGNhcmV0LlxyXG5cdFx0ICogfCBsaXN0ICAgfCBBIGNvbGxlY3Rpb24gb2YgdmFsdWVzIHRoYXQgY291bGQgY29tcGxldGUgdGhlIHByb3ZpZGVkIGlucHV0IGlzIGRpc3BsYXllZC5cclxuXHRcdCAqIHwgYm90aCAgIHwgSW1wbGVtZW50cyBgaW5saW5lYCBhbmQgYGxpc3RgXHJcblx0XHQgKiB8IG5vbmUgICB8IE5vIHByZWRpY3Rpb24gaXMgc2hvd25cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWF1dG9jb21wbGV0ZVxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcImF1dG9jb21wbGV0ZVwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLWF1dG9jb21wbGV0ZVwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1hdXRvY29tcGxldGVcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucy9zZXRzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBlbGVtZW50IHdobyBpcyBleHBvc2VkIHRvIGFuIGFjY2Vzc2liaWxpdHkgQVBJLlxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjZGlzYWJsZWR9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtaGlkZGVuXHJcblx0XHQgKiBAdHlwZSB7P0Jvb2xlYW59XHJcblx0XHQgKi9cclxuICAgICAgICBcImhpZGRlblwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIGJvb2xlYW4uc2V0KHRoaXMsIFwiYXJpYS1oaWRkZW5cIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gYm9vbGVhbi5nZXQodGhpcywgXCJhcmlhLWhpZGRlblwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMga2V5Ym9hcmQgc2hvcnRjdXRzIHRoYXQgYW4gYXV0aG9yIGhhcyBpbXBsZW1lbnRlZCB0byBhY3RpdmF0ZSBvclxyXG5cdFx0ICogZ2l2ZSBmb2N1cyB0byBhbiBlbGVtZW50LlxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWtleXNob3J0Y3V0c1xyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcImtleVNob3J0Y3V0c1wiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLWtleVNob3J0Y3V0c1wiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1rZXlTaG9ydGN1dHNcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKiBcclxuXHRcdCAqIEluZGljYXRlcyB3aGV0aGVyIGFuIGVsZW1lbnQgaXMgbW9kYWwgd2hlbiBkaXNwbGF5ZWQuXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtbW9kYWxcclxuXHRcdCAqIEB0eXBlIHs/Qm9vbGVhbn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwibW9kYWxcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBib29sZWFuLnNldCh0aGlzLCBcImFyaWEtbW9kYWxcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gYm9vbGVhbi5nZXQodGhpcywgXCJhcmlhLW1vZGFsXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKiogXHJcblx0XHQgKiBJbmRpY2F0ZXMgd2hldGhlciBhIHRleHQgYm94IGFjY2VwdHMgbXVsdGlwbGUgbGluZXMgb2YgaW5wdXQgb3Igb25seSBhIHNpbmdsZSBsaW5lLlxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLW11bHRpbGluZVxyXG5cdFx0ICogQHR5cGUgez9Cb29sZWFufVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJtdWx0aWxpbmVcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBib29sZWFuLnNldCh0aGlzLCBcImFyaWEtbXVsdGlsaW5lXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGJvb2xlYW4uZ2V0KHRoaXMsIFwiYXJpYS1tdWx0aWxpbmVcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW5kaWNhdGVzIHRoYXQgdGhlIHVzZXIgbWF5IHNlbGVjdCBtb3JlIHRoYW4gb25lIGl0ZW0gZnJvbSB0aGUgY3VycmVudCBzZWxlY3RhYmxlIGRlc2NlbmRhbnRzLlxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLW11bHRpc2VsZWN0YWJsZVxyXG5cdFx0ICogQHR5cGUgez9Cb29sZWFufVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJtdWx0aXNlbGVjdGFibGVcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBib29sZWFuLnNldCh0aGlzLCBcImFyaWEtbXVsdGlzZWxlY3RhYmxlXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGJvb2xlYW4uZ2V0KHRoaXMsIFwiYXJpYS1tdWx0aXNlbGVjdGFibGVcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGVsZW1lbnQncyBvcmllbnRhdGlvbiBpcyBgaG9yaXpvbnRhbGAsIGB2ZXJ0aWNhbGAsIG9yIGBudWxsYC5cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1vcmllbnRhdGlvblxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcIm9yaWVudGF0aW9uXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtb3JpZW50YXRpb25cIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEtb3JpZW50YXRpb25cIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW5kaWNhdGVzIHRoYXQgdGhlIHVzZXIgbWF5IHNlbGVjdCBtb3JlIHRoYW4gb25lIGl0ZW0gZnJvbSB0aGUgY3VycmVudCBzZWxlY3RhYmxlIGRlc2NlbmRhbnRzLlxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXJlYWRvbmx5XHJcblx0XHQgKiBAdHlwZSB7P0Jvb2xlYW59XHJcblx0XHQgKi9cclxuICAgICAgICBcInJlYWRPbmx5XCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gYm9vbGVhbi5zZXQodGhpcywgXCJhcmlhLXJlYWRPbmx5XCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGJvb2xlYW4uZ2V0KHRoaXMsIFwiYXJpYS1yZWFkT25seVwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMgdGhhdCB1c2VyIGlucHV0IGlzIHJlcXVpcmVkIG9uIHRoZSBlbGVtZW50IGJlZm9yZSBhIGZvcm0gbWF5IGJlIHN1Ym1pdHRlZC5cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1yZXF1aXJlZFxyXG5cdFx0ICogQHR5cGUgez9Cb29sZWFufVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJyZXF1aXJlZFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIGJvb2xlYW4uc2V0KHRoaXMsIFwiYXJpYS1yZXF1aXJlZFwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBib29sZWFuLmdldCh0aGlzLCBcImFyaWEtcmVxdWlyZWRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW5kaWNhdGVzIHRoYXQgdXNlciBpbnB1dCBpcyByZXF1aXJlZCBvbiB0aGUgZWxlbWVudCBiZWZvcmUgYSBmb3JtIG1heSBiZSBzdWJtaXR0ZWQuXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtc2VsZWN0ZWRcclxuXHRcdCAqIEB0eXBlIHs/Qm9vbGVhbn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwic2VsZWN0ZWRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBib29sZWFuLnNldCh0aGlzLCBcImFyaWEtc2VsZWN0ZWRcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gYm9vbGVhbi5nZXQodGhpcywgXCJhcmlhLXNlbGVjdGVkXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyBpZiBpdGVtcyBpbiBhIHRhYmxlIG9yIGdyaWQgYXJlIHNvcnRlZCBpbiBhc2NlbmRpbmcgb3IgZGVzY2VuZGluZyBvcmRlci4gIFxyXG5cdFx0ICogUG9zc2libGUgdmFsdWVzIGFyZSBgYWNlbmRpbmdgLCBgZGVzY2VuZGluZ2AsIGBub25lYCwgYG90aGVyYCBvciBgbnVsbGAuXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtc29ydFxyXG5cdFx0ICogQHR5cGUgez9Cb29sZWFufVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJzb3J0XCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtc29ydFwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1zb3J0XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKiogRU5EIE9GIFdJREdFVCBQUk9QRVJUSUVTICoqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5cclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBXSURHRVQgU1RBVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyB0aGUgY3VycmVudCBcImNoZWNrZWRcIiBzdGF0ZSBvZiBhIHtAbGluayBXaWRnZXR9LCBhbW9uZyB7QGxpbmsgUmFkaW99IGFuZCB7QGxpbmsgQ2hlY2tib3h9XHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNwcmVzc2VkfVxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjc2VsZWN0ZWR9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtcHJlc3NlZFxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcImNoZWNrZWRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwiYXJpYS1jaGVja2VkXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIERPTVN0cmluZy5nZXQodGhpcywgXCJhcmlhLWNoZWNrZWRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGVsZW1lbnQsIG9yIGFub3RoZXIgZ3JvdXBpbmcgZWxlbWVudCBpdCBjb250cm9scywgXHJcblx0XHQgKiBpcyBjdXJyZW50bHkgZXhwYW5kZWQgb3IgY29sbGFwc2VkLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtZXhwYW5kZWRcclxuXHRcdCAqIEB0eXBlIHs/Qm9vbGVhbn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwiZXhwYW5kZWRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBib29sZWFuLnNldCh0aGlzLCBcImFyaWEtZXhwYW5kZWRcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gYm9vbGVhbi5nZXQodGhpcywgXCJhcmlhLWV4cGFuZGVkXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyB0aGF0IHRoZSBlbGVtZW50IGlzIHBlcmNlaXZhYmxlIGJ1dCBkaXNhYmxlZCwgc28gaXQgaXMgbm90IGVkaXRhYmxlIG9yIG90aGVyd2lzZSBvcGVyYWJsZS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjaGlkZGVufVxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjcmVhZG9ubHl9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtZGlzYWJsZWRcclxuXHRcdCAqIEB0eXBlIHs/Qm9vbGVhbn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwiZGlzYWJsZWRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBib29sZWFuLnNldCh0aGlzLCBcImFyaWEtZGlzYWJsZWRcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gYm9vbGVhbi5nZXQodGhpcywgXCJhcmlhLWRpc2FibGVkXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyB0aGUgZW50ZXJlZCB2YWx1ZSBkb2VzIG5vdCBjb25mb3JtIHRvIHRoZSBmb3JtYXQgZXhwZWN0ZWQgYnkgdGhlIGFwcGxpY2F0aW9uLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNlcnJvck1lc3NhZ2V9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtZXJyb3JtZXNzYWdlXHJcblx0XHQgKiBAdHlwZSB7P1N0cmluZ30gXHJcblx0XHQgKi9cclxuICAgICAgICBcImludmFsaWRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwiYXJpYS1pbnZhbGlkXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIERPTVN0cmluZy5nZXQodGhpcywgXCJhcmlhLWludmFsaWRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEluZGljYXRlcyB0aGUgYXZhaWxhYmlsaXR5IGFuZCB0eXBlIG9mIGludGVyYWN0aXZlIHBvcHVwIGVsZW1lbnQsIHN1Y2ggYXMgbWVudSBvciBkaWFsb2csXHJcblx0XHQgKiB0aGF0IGNhbiBiZSB0cmlnZ2VyZWQgYnkgYW4gZWxlbWVudC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWhhc3BvcHVwXHJcblx0XHQgKiBAdHlwZSB7P1N0cmluZ31cclxuXHRcdCAqL1xyXG4gICAgICAgIFwiaGFzUG9wVXBcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwiYXJpYS1oYXNwb3B1cFwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1oYXNwb3B1cFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMgdGhlIGN1cnJlbnQgXCJjaGVja2VkXCIgc3RhdGUgb2YgYSB7QGxpbmsgV2lkZ2V0fSwgYW1vbmcge0BsaW5rIFJhZGlvfSBhbmQge0BsaW5rIENoZWNrYm94fVxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNwcmVzc2VkfVxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjc2VsZWN0ZWR9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtcHJlc3NlZFxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcInByZXNzZWRcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQoc3RyKSB7IHJldHVybiBET01TdHJpbmcuc2V0KHRoaXMsIFwiYXJpYS1wcmVzc2VkXCIsIHN0cik7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIERPTVN0cmluZy5nZXQodGhpcywgXCJhcmlhLXByZXNzZWRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIEVORCBPRiBXSURHRVQgU1RBVEVTICoqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogQ09OVFJPTCBWQUxVRVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuXHRcdC8qKiBcclxuXHRcdCAqIFJldHVybnMgLyBzZXRzIHRoZSBodW1hbiByZWFkYWJsZSB0ZXh0IGFsdGVybmF0aXZlIG9mIHtAbGluayAjYXJpYS12YWx1ZW5vd30gZm9yIGEge0BsaW5rIFJhbmdlfSB3aWRnZXQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtdmFsdWV0ZXh0fVxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcInZhbHVlVGV4dFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldChzdHIpIHsgcmV0dXJuIERPTVN0cmluZy5zZXQodGhpcywgXCJhcmlhLXZhbHVlVGV4dFwiLCBzdHIpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS12YWx1ZVRleHRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyAvIHNldHMgYSBzaG9ydCBoaW50IGludGVuZGVkIHRvIGFpZCB0aGUgdXNlciB3aXRoIGRhdGEgZW50cnkgd2hlbiB0aGUgY29udHJvbCBoYXMgbm8gdmFsdWUuXHJcblx0XHQgKiBBIGhpbnQgY291bGQgYmUgYSBzYW1wbGUgdmFsdWUgb3IgYSBicmllZiBkZXNjcmlwdGlvbiBvZiB0aGUgZXhwZWN0ZWQgZm9ybWF0LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXBsYWNlaG9sZGVyfVxyXG5cdFx0ICogQHR5cGUgez9TdHJpbmd9XHJcblx0XHQgKi9cclxuICAgICAgICBcInBsYWNlaG9sZGVyXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHN0cikgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtcGxhY2Vob2xkZXJcIiwgc3RyKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEtcGxhY2Vob2xkZXJcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKiBcclxuXHRcdCAqIFJldHVybnMgLyBzZXRzIHRoZSBjdXJyZW50IHZhbHVlIGZvciBhIHtAbGluayBSYW5nZX0gd2lkZ2V0LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXZhbHVlbm93fVxyXG5cdFx0ICogQHR5cGUgez9OdW1iZXJ9XHJcblx0XHQgKi9cclxuICAgICAgICBcInZhbHVlTm93XCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHZhbCkgeyByZXR1cm4gZG91YmxlLnNldCh0aGlzLCBcImFyaWEtdmFsdWVub3dcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gZG91YmxlLmdldCh0aGlzLCBcImFyaWEtdmFsdWVub3dcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKiBcclxuXHRcdCAqIFJldHVybnMgLyBzZXRzIHRoZSBtaW5pbXVtIGFsbG93ZWQgdmFsdWUgZm9yIGEge0BsaW5rIFJhbmdlfSB3aWRnZXQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtdmFsdWVtaW59XHJcblx0XHQgKiBAdHlwZSB7P051bWJlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwidmFsdWVNaW5cIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBkb3VibGUuc2V0KHRoaXMsIFwiYXJpYS12YWx1ZW1pblwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBkb3VibGUuZ2V0KHRoaXMsIFwiYXJpYS12YWx1ZW1pblwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqIFxyXG5cdFx0ICogUmV0dXJucyAvIHNldHMgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZSBmb3IgYSB7QGxpbmsgUmFuZ2V9IHdpZGdldC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS12YWx1ZW1heH1cclxuXHRcdCAqIEB0eXBlIHs/TnVtYmVyfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJ2YWx1ZU1heFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGRvdWJsZS5zZXQodGhpcywgXCJhcmlhLXZhbHVlbWF4XCIsIHZhbCk7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGRvdWJsZS5nZXQodGhpcywgXCJhcmlhLXZhbHVlbWF4XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqIEVORCBPRiBDT05UUk9MIFZBTFVFUyAqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcbiAgICAgICAgLy8gTGl2ZSByZWdpb25zLlxyXG4gICAgICAgIFwiYXRvbWljXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHZhbCkgeyByZXR1cm4gYm9vbGVhbi5zZXQodGhpcywgXCJhcmlhLWF0b21pY1wiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBib29sZWFuLmdldCh0aGlzLCBcImFyaWEtYXRvbWljXCIpOyB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImJ1c3lcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBib29sZWFuLnNldCh0aGlzLCBcImFyaWEtYnVzeVwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBib29sZWFuLmdldCh0aGlzLCBcImFyaWEtYnVzeVwiKTsgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJsaXZlXCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHZhbCkgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtbGl2ZVwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBET01TdHJpbmcuZ2V0KHRoaXMsIFwiYXJpYS1saXZlXCIpOyB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInJlbGV2YW50XCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHZhbCkgeyByZXR1cm4gRE9NU3RyaW5nLnNldCh0aGlzLCBcImFyaWEtcmVsZXZhbnRcIiwgdmFsKTsgfSxcclxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gRE9NU3RyaW5nLmdldCh0aGlzLCBcImFyaWEtcmVsZXZhbnRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqIE9USEVSIFJFTEFUSU9OU0hJUFMgKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyAvIHNldHMgdGhlIEFjY2Vzc2libGVOb2RlIG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIGVsZW1lbnQgd2hlbiBmb2N1cyBpcyBvbiBjdXJyZW50IGVsZW1lbnQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1hY3RpdmVkZXNjZW5kYW50XHJcblx0XHQgKiBAdHlwZSB7P0FjY2Nlc3NpYmxlTm9kZX1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwiYWN0aXZlRGVzY2VuZGFudFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIHNldEFjY2Vzc2libGVOb2RlKHRoaXMsIFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCIsIHZhbCk7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGdldEFjY2Vzc2libGVOb2RlKHRoaXMsIFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgLyBzZXRzIGFuIEFjY2Vzc2libGVOb2RlIHRoYXQgcHJvdmlkZXMgYSBkZXRhaWxlZCwgZXh0ZW5kZWQgZGVzY3JpcHRpb24gXHJcblx0XHQgKiBmb3IgdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjZGVzY3JpYmVkQnl9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtZGV0YWlsc1xyXG5cdFx0ICogQHR5cGUgez9BY2NjZXNzaWJsZU5vZGV9XHJcblx0XHQgKi9cclxuICAgICAgICBcImRldGFpbHNcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBzZXRBY2Nlc3NpYmxlTm9kZSh0aGlzLCBcImFyaWEtZGV0YWlsc1wiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBnZXRBY2Nlc3NpYmxlTm9kZSh0aGlzLCBcImFyaWEtZGV0YWlsc1wiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIC8gc2V0cyBhbiBBY2Nlc3NpYmxlTm9kZSB0aGF0IHByb3ZpZGVzIGFuIGVycm9yIG1lc3NhZ2UgZm9yIHRoZSBjdXJyZW50IGVsZW1lbnQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI2ludmFsaWR9XHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNkZXNjcmliZWRCeX1cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1lcnJvcm1lc3NhZ2VcclxuXHRcdCAqIEB0eXBlIHs/QWNjY2Vzc2libGVOb2RlfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjoge1xyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzZXQodmFsKSB7IHJldHVybiBzZXRBY2Nlc3NpYmxlTm9kZSh0aGlzLCBcImFyaWEtZXJyb3JtZXNzYWdlXCIsIHZhbCk7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGdldEFjY2Vzc2libGVOb2RlKHRoaXMsIFwiYXJpYS1lcnJvcm1lc3NhZ2VcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqIEVORCBPRiBPVEhFUiBSRUxBVElPTlNISVBTICoqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogQ09MTEVDVElPTlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgLyBzZXRzIHRoZSB0b3RhbCBudW1iZXIgb2YgY29sdW1ucyBpbiBhIHtAbGluayBUYWJsZX0sIHtAbGluayBHcmlkfSwgb3Ige0BsaW5rIFRyZWVncmlkfS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjY29sSW5kZXh9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtc2V0c2l6ZVxyXG5cdFx0ICogQHR5cGUgez9JbnRlZ2VyfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJjb2xDb3VudFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGxvbmcuc2V0KHRoaXMsIFwiYXJpYS1jb2xjb3VudFwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBsb25nLmdldCh0aGlzLCBcImFyaWEtY29sY291bnRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGVmaW5lcyBhbiBlbGVtZW50J3MgY29sdW1uIGluZGV4IG9yIHBvc2l0aW9uIHdpdGggcmVzcGVjdCB0byB0aGUgdG90YWwgbnVtYmVyIG9mIGNvbHVtbnMgXHJcblx0XHQgKiB3aXRoaW4gYSB7QGxpbmsgVGFibGV9LCB7QGxpbmsgR3JpZH0sIG9yIHtAbGluayBUcmVlZ3JpZH0uXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI2NvbENvdW50fVxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjY29sU3Bhbn1cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1jb2xpbmRleFxyXG5cdFx0ICogQHR5cGUgez9JbnRlZ2VyfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJjb2xJbmRleFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGxvbmcuc2V0KHRoaXMsIFwiYXJpYS1jb2xpbmRleFwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBsb25nLmdldCh0aGlzLCBcImFyaWEtY29saW5kZXhcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGVmaW5lcyB0aGUgbnVtYmVyIG9mIGNvbHVtbnMgc3Bhbm5lZCBieSBhIGNlbGwgb3IgZ3JpZGNlbGxcclxuXHRcdCAqIHdpdGhpbiBhIHtAbGluayBUYWJsZX0sIHtAbGluayBHcmlkfSwgb3Ige0BsaW5rIFRyZWVncmlkfS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjY29sSW5kZXh9XHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNyb3dTcGFufVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWNvbHNwYW5cclxuXHRcdCAqIEB0eXBlIHs/SW50ZWdlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwiY29sU3BhblwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGxvbmcuc2V0KHRoaXMsIFwiYXJpYS1jb2xzcGFuXCIsIHZhbCk7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGxvbmcuZ2V0KHRoaXMsIFwiYXJpYS1jb2xzcGFuXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlZmluZXMgYW4gZWxlbWVudCdzIG51bWJlciBvciBwb3NpdGlvbiBpbiB0aGUgY3VycmVudCBzZXQgb2Yge0BsaW5rIGxpc3RpdGVtfXMgb3Ige0BsaW5rIHRyZWVpdGVtfXMuXHJcblx0XHQgKiBOb3QgcmVxdWlyZWQgaWYgYWxsIGVsZW1lbnRzIGluIHRoZSBzZXQgYXJlIHByZXNlbnQgaW4gdGhlIERPTS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjc2V0U2l6ZX1cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1wb3NpbnNldFxyXG5cdFx0ICogQHR5cGUgez9JbnRlZ2VyfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJwb3NJblNldFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGxvbmcuc2V0KHRoaXMsIFwiYXJpYS1wb3NpbnNldFwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBsb25nLmdldCh0aGlzLCBcImFyaWEtcG9zaW5zZXRcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGVmaW5lcyB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3MgaW4gYSB7QGxpbmsgVGFibGV9LCB7QGxpbmsgR3JpZH0sIG9yIHtAbGluayBUcmVlZ3JpZH0uXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI3Jvd0luZGV4fVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXJvd2NvdW50XHJcblx0XHQgKiBAdHlwZSB7P0ludGVnZXJ9XHJcblx0XHQgKi9cclxuICAgICAgICBcInJvd0NvdW50XCI6IHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2V0KHZhbCkgeyByZXR1cm4gbG9uZy5zZXQodGhpcywgXCJhcmlhLXJvd2NvdW50XCIsIHZhbCk7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGxvbmcuZ2V0KHRoaXMsIFwiYXJpYS1yb3djb3VudFwiKTsgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZWZpbmVzIGFuIGVsZW1lbnQncyByb3cgaW5kZXggb3IgcG9zaXRpb24gd2l0aCByZXNwZWN0IHRvIHRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cyBcclxuXHRcdCAqIHdpdGhpbiBhICB7QGxpbmsgVGFibGV9LCB7QGxpbmsgR3JpZH0sIG9yIHtAbGluayBUcmVlZ3JpZH0uXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI3Jvd0NvdW50fVxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjcm93U3Bhbn1cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1yb3dpbmRleFxyXG5cdFx0ICogQHR5cGUgez9JbnRlZ2VyfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJyb3dJbmRleFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGxvbmcuc2V0KHRoaXMsIFwiYXJpYS1yb3dpbmRleFwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBsb25nLmdldCh0aGlzLCBcImFyaWEtcm93aW5kZXhcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGVmaW5lcyB0aGUgbnVtYmVyIG9mIHJvd3Mgc3Bhbm5lZCBieSBhIGNlbGwgb3IgZ3JpZGNlbGxcclxuXHRcdCAqIHdpdGhpbiBhIHtAbGluayBUYWJsZX0sIHtAbGluayBHcmlkfSwgb3Ige0BsaW5rIFRyZWVncmlkfS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjcm93SW5kZXh9XHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNjb2xTcGFufVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXJvd3NwYW5cclxuXHRcdCAqIEB0eXBlIHs/SW50ZWdlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwicm93U3BhblwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGxvbmcuc2V0KHRoaXMsIFwiYXJpYS1yb3dzcGFuXCIsIHZhbCk7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGxvbmcuZ2V0KHRoaXMsIFwiYXJpYS1yb3dzcGFuXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlZmluZXMgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGUgY3VycmVudCBzZXQgb2YgbGlzdGl0ZW1zIG9yIHRyZWVpdGVtcy5cclxuXHRcdCAqIE5vdCByZXF1aXJlZCBpZiAqKmFsbCoqIGVsZW1lbnRzIGluIHRoZSBzZXQgYXJlIHByZXNlbnQgaW4gdGhlIERPTS5cclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI3Bvc0luU2V0fVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLXNldHNpemVcclxuXHRcdCAqIEB0eXBlIHs/SW50ZWdlcn1cclxuXHRcdCAqL1xyXG4gICAgICAgIFwic2V0U2l6ZVwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGxvbmcuc2V0KHRoaXMsIFwiYXJpYS1zZXRzaXplXCIsIHZhbCk7IH0sXHJcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGxvbmcuZ2V0KHRoaXMsIFwiYXJpYS1zZXRzaXplXCIpOyB9XHJcbiAgICAgICAgfSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERlZmluZXMgdGhlIGhpZXJhcmNoaWNhbCBsZXZlbCBvZiBhbiBlbGVtZW50IHdpdGhpbiBhIHN0cnVjdHVyZS5cclxuXHRcdCAqIEUuZy4gYCZsdDtoMSZndDsmbHQ7aDEvJmd0O2AgZXF1YWxzIGAmbHQ7ZGl2IHJvbGU9XCJoZWFkaW5nXCIgYXJpYS1sZXZlbD1cIjFcIiZndDsmbHQ7L2Rpdj5gXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1sZXZlbFxyXG5cdFx0ICogQHR5cGUgez9JbnRlZ2VyfVxyXG5cdFx0ICovXHJcbiAgICAgICAgXCJsZXZlbFwiOiB7XHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNldCh2YWwpIHsgcmV0dXJuIGxvbmcuc2V0KHRoaXMsIFwiYXJpYS1sZXZlbFwiLCB2YWwpOyB9LFxyXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiBsb25nLmdldCh0aGlzLCBcImFyaWEtbGV2ZWxcIik7IH1cclxuICAgICAgICB9LFxyXG5cclxuXHRcdC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqIEVORCBPRiBDT0xMRUNUSU9OUyAqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxuXHRcdC8qICoqKioqKioqKioqKioqKioqKiBBQ0NFU1NJQkxFIExBQkVMIEFORCBERVNDUklQVElPTiAqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgYW4gbGlzdCB3aXRoIEFjY2Vzc2libGVOb2RlIGluc3RhbmNlcyB0aGF0IGxhYmVscyB0aGUgY3VycmVudCBlbGVtZW50XHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUge0BsaW5rIEFjY2Vzc2libGVOb2RlI2Rlc2NyaWJlZEJ5fVxyXG5cdFx0ICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtMS4xLyNhcmlhLWxhYmVsbGVkYnlcclxuXHRcdCAqIEB0eXBlIHtBY2Nlc3NpYmxlTm9kZUxpc3R9XHJcblx0XHQgKi9cclxuXHRcdFwibGFiZWxlZEJ5XCI6IHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0c2V0KHZhbCkge1xyXG5cdFx0XHRcdGlmICghKHZhbCBpbnN0YW5jZW9mIEFjY2Vzc2libGVOb2RlTGlzdENvbnN0cnVjdG9yKSkge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSXQgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBBY2Nlc3NpYmxlTm9kZUxpc3RcIik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl92YWx1ZXMubGFiZWxlZEJ5ID0gdmFsO1xyXG5cdFx0XHRcdHZhbC5wYXJlbnRBT00gPSB0aGlzO1xyXG5cdFx0XHRcdHZhbC5hdHRyaWJ1dGUgPSBcImFyaWEtbGFiZWxsZWRieVwiO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXQoKSB7IHJldHVybiB0aGlzLl92YWx1ZXMubGFiZWxlZEJ5IHx8IG51bGw7IH1cclxuXHRcdH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIGFuIGxpc3Qgd2l0aCBBY2Nlc3NpYmxlTm9kZSBpbnN0YW5jZXMgdGhhdCBkZXNjcmliZXMgdGhlIGN1cnJlbnQgZWxlbWVudFxyXG5cdFx0ICogXHJcblx0XHQgKiBAc2VlIHtAbGluayBBY2Nlc3NpYmxlTm9kZSNsYWJlbGVkQnl9XHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtZGVzY3JpYmVkYnlcclxuXHRcdCAqIEB0eXBlIHtBY2Nlc3NpYmxlTm9kZUxpc3R9XHJcblx0XHQgKi9cclxuXHRcdFwiZGVzY3JpYmVkQnlcIjoge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRzZXQodmFsKSB7XHJcblx0XHRcdFx0aWYgKCEodmFsIGluc3RhbmNlb2YgQWNjZXNzaWJsZU5vZGVMaXN0Q29uc3RydWN0b3IpKSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJdCBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIEFjY2Vzc2libGVOb2RlTGlzdFwiKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlcy5kZXNjcmliZWRCeSA9IHZhbDtcclxuXHRcdFx0XHR2YWwucGFyZW50QU9NID0gdGhpcztcclxuXHRcdFx0XHR2YWwuYXR0cmlidXRlID0gXCJhcmlhLWRlc2NyaWJlZGJ5XCI7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldCgpIHsgcmV0dXJuIHRoaXMuX3ZhbHVlcy5kZXNjcmliZWRCeSB8fCBudWxsOyB9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8qICoqKioqKioqKioqKioqIEVORCBPRiBBQ0NFU1NJQkxFIExBQkVMIEFORCBERVNDUklQVElPTiAqKioqKioqKioqKioqKiAqL1xyXG5cdFx0XHJcblx0XHQvKiAqKioqKioqKioqKioqKioqKioqKioqKiogT1RIRVIgUkVMQVRJT05TSElQUyAqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgYW4gbGlzdCB3aXRoIEFjY2Vzc2libGVOb2RlIGluc3RhbmNlcyB3aG9zZSBjb250ZW50cyBvciBwcmVzZW5jZSBhcmUgY29udHJvbGxlZCBieVxyXG5cdFx0ICogdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHNlZSB7QGxpbmsgQWNjZXNzaWJsZU5vZGUjb3duc31cclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1jb250cm9sc1xyXG5cdFx0ICogQHR5cGUge0FjY2Vzc2libGVOb2RlTGlzdH1cclxuXHRcdCAqL1xyXG5cdFx0XCJjb250cm9sc1wiOiB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdHNldCh2YWwpIHtcclxuXHRcdFx0XHRpZiAoISh2YWwgaW5zdGFuY2VvZiBBY2Nlc3NpYmxlTm9kZUxpc3RDb25zdHJ1Y3RvcikpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkl0IG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgQWNjZXNzaWJsZU5vZGVMaXN0XCIpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5fdmFsdWVzLmNvbnRyb2xzID0gdmFsO1xyXG5cdFx0XHRcdHZhbC5wYXJlbnRBT00gPSB0aGlzO1xyXG5cdFx0XHRcdHZhbC5hdHRyaWJ1dGUgPSBcImFyaWEtY29udHJvbHNcIjtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0KCkgeyByZXR1cm4gdGhpcy5fdmFsdWVzLmNvbnRyb2xzIHx8IG51bGw7IH1cclxuXHRcdH0sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb250YWlucyB0aGUgbmV4dCBlbGVtZW50KHMpIGluIGFuIGFsdGVybmF0ZSByZWFkaW5nIG9yZGVyIG9mIGNvbnRlbnQgd2hpY2gsIGF0IHRoZSB1c2VyJ3MgXHJcblx0XHQgKiBkaXNjcmV0aW9uLCBhbGxvd3MgYXNzaXN0aXZlIHRlY2hub2xvZ3kgdG8gb3ZlcnJpZGUgdGhlIGdlbmVyYWwgZGVmYXVsdCBvZiByZWFkaW5nIGluXHJcblx0XHQgKiBkb2N1bWVudCBzb3VyY2Ugb3JkZXIuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLTEuMS8jYXJpYS1mbG93dG9cclxuXHRcdCAqIEB0eXBlIHtBY2Nlc3NpYmxlTm9kZUxpc3R9XHJcblx0XHQgKi9cclxuXHRcdFwiZmxvd1RvXCI6IHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0c2V0KHZhbCkge1xyXG5cdFx0XHRcdGlmICghKHZhbCBpbnN0YW5jZW9mIEFjY2Vzc2libGVOb2RlTGlzdENvbnN0cnVjdG9yKSkge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSXQgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBBY2Nlc3NpYmxlTm9kZUxpc3RcIik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl92YWx1ZXMuZmxvd1RvID0gdmFsO1xyXG5cdFx0XHRcdHZhbC5wYXJlbnRBT00gPSB0aGlzO1xyXG5cdFx0XHRcdHZhbC5hdHRyaWJ1dGUgPSBcImFyaWEtZmxvd3RvXCI7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldCgpIHsgcmV0dXJuIHRoaXMuX3ZhbHVlcy5mbG93VG8gfHwgbnVsbDsgfVxyXG5cdFx0fSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENvbnRhaW5zIGNoaWxkcmVuIHdobydzIElEIGFyZSByZWZlcmVuY2VkIGluc2lkZSB0aGUgYGFyaWEtb3duc2AgYXR0cmlidXRlXHJcblx0XHQgKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS0xLjEvI2FyaWEtb3duc1xyXG5cdFx0ICogQHR5cGUge0FjY2Vzc2libGVOb2RlTGlzdH1cclxuXHRcdCAqL1xyXG5cdFx0XCJvd25zXCI6IHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0c2V0KHZhbCkge1xyXG5cdFx0XHRcdGlmICghKHZhbCBpbnN0YW5jZW9mIEFjY2Vzc2libGVOb2RlTGlzdENvbnN0cnVjdG9yKSkge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSXQgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBBY2Nlc3NpYmxlTm9kZUxpc3RcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMsIHRoaXMuX3ZhbHVlcyk7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWVzLm93bnMgPSB2YWw7XHJcblx0XHRcdFx0dmFsLnBhcmVudEFPTSA9IHRoaXM7XHJcblx0XHRcdFx0dmFsLmF0dHJpYnV0ZSA9IFwiYXJpYS1vd25zXCI7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldCgpIHsgcmV0dXJuIHRoaXMuX3ZhbHVlcy5vd25zIHx8IG51bGw7IH1cclxuXHRcdH0sXHJcblxyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKiBFTkQgT0YgT1RIRVIgUkVMQVRJT05TSElQUyAqKioqKioqKioqKioqKioqKioqKiogKi9cclxuICAgIH1cclxuKTtcclxuXHJcbmZ1bmN0aW9uIHNldEFjY2Vzc2libGVOb2RlKGFvbSwgYXR0cmlidXRlLCB2YWx1ZSkge1xyXG4gICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBBY2Nlc3NpYmxlTm9kZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJdCBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIEFjY2Vzc2libGVOb2RlXCIpO1xyXG5cdH1cclxuXHJcblx0aWYgKHZhbHVlID09IHVuZGVmaW5lZCkge1xyXG5cdFx0cmV0dXJuIGFvbS5fbm9kZS5yZW1vdmVBdHRyaWJ1dGUodmFsdWUuX25vZGUuaWQpO1xyXG5cdH0gXHJcblxyXG4gICAgaWYgKHZhbHVlLl9ub2RlKSB7XHJcblx0XHRpZiAoIXZhbHVlLl9ub2RlLmlkKSB7IFxyXG5cdFx0XHQvKiogQHRvZG8gcmVtb3ZlIHRlbXAgaWQgKi9cclxuXHRcdFx0dmFsdWUuX25vZGUuaWQgPSBcImlkLVwiICsgRGF0ZS5ub3coKTtcclxuXHRcdH1cclxuXHJcblx0XHRhb20uX25vZGUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUuX25vZGUuaWQpO1xyXG5cdH1cclxuXHJcblx0YW9tLl92YWx1ZXNbYXR0cmlidXRlXSA9IHZhbHVlO1xyXG5cdHJldHVybiB2YWx1ZTtcclxufVxyXG5mdW5jdGlvbiBnZXRBY2Nlc3NpYmxlTm9kZShhb20sIGF0dHJpYnV0ZSkge1xyXG5cdHZhciB2YWx1ZSA9IGFvbS5fdmFsdWVzW2F0dHJpYnV0ZV07XHJcblx0aWYgKHZhbHVlID09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XHJcblx0cmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBY2Nlc3NpYmxlTm9kZTsiLCJpbXBvcnQgQWNjZXNzaWJsZU5vZGUgZnJvbSBcIi4vQWNjZXNzaWJsZU5vZGVcIjtcclxuXHJcbmV4cG9ydCBsZXQgQWNjZXNzaWJsZU5vZGVMaXN0Q29uc3RydWN0b3IgPSBjbGFzcyBBY2Nlc3NpYmxlTm9kZUxpc3QgZXh0ZW5kcyBBcnJheSB7XHJcblx0aXRlbShpbmRleCkge1xyXG5cdFx0aWYoaXNOYU4oaW5kZXgpKSByZXR1cm47XHJcblx0XHRyZXR1cm4gdGhpc1tpbmRleF07XHJcblx0fVxyXG5cclxuXHRhZGQoYWNjZXNzaWJsZU5vZGUsIGJlZm9yZSA9IG51bGwpIHtcclxuXHRcdGlmICghKGFjY2Vzc2libGVOb2RlIGluc3RhbmNlb2YgQWNjZXNzaWJsZU5vZGUpKSB7XHJcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gZXhlY3V0ZSAnYWRkJyBvbiAnQWNjZXNzaWJsZU5vZGVMaXN0JzogcGFyYW1ldGVyIDEgaXMgbm90IG9mIHR5cGUgJ0FjY2Vzc2libGVOb2RlJy5cIik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoYmVmb3JlICE9PSBudWxsKSB7XHJcblx0XHRcdHZhciBiZWZvcmVJbmRleCA9IHRoaXMuaW5kZXhPZihiZWZvcmUpO1xyXG5cdFx0XHRpZihiZWZvcmVJbmRleCA+IC0xKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuc3BsaWNlKGJlZm9yZUluZGV4IC0gMSwgMCwgYWNjZXNzaWJsZU5vZGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMucHVzaChhY2Nlc3NpYmxlTm9kZSk7XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoaW5kZXgpIHtcclxuXHRcdC8vIHVwZGF0ZSBET00gYXR0cmlidXRlXHJcblx0XHRpZiAodGhpcy5wYXJlbnRBT00gJiYgdGhpc1tpbmRleF0uX25vZGUgJiYgdGhpc1tpbmRleF0uX25vZGUuaWQpIHtcclxuXHRcdFx0bGV0IGlkcyA9IFtdO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMucGFyZW50QU9NLl9ub2RlLmhhc0F0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZSkpIHtcclxuXHRcdFx0XHRpZHMgPSB0aGlzLnBhcmVudEFPTS5fbm9kZS5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUpLnNwbGl0KFwiIFwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZHMgPSBbXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGZpbHRlcmVkSWRzID0gaWRzLmZpbHRlcihlID0+IGUgIT09IHRoaXNbaW5kZXhdLl9ub2RlLmlkKTtcclxuXHJcblx0XHRcdC8vIHJlbW92ZSBnZW5lcmF0ZWQgaWRzIGFzIGxvbmcgaXQgd2FzIHByZXZpb3VzbHkgcmVmZXJlbmNlZFxyXG5cdFx0XHRpZiAodGhpc1tpbmRleF0uZ2VuZXJhdGVkX2lkID09PSB0cnVlICYmIGZpbHRlcmVkSWRzLmxlbmd0aCA8IGlkcy5sZW5ndGgpIHtcclxuXHRcdFx0XHR0aGlzW2luZGV4XS5fbm9kZS5pZCA9IFwiXCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMucGFyZW50QU9NLl9ub2RlLnNldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZSwgZmlsdGVyZWRJZHMuam9pbihcIiBcIikpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLnBvcChpbmRleCk7XHJcblx0fVxyXG59XHJcblxyXG52YXIgYXJyYXlDaGFuZ2VIYW5kbGVyID0ge1xyXG5cdHNldDogZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XHJcblx0XHQvLyBhZGRpbmcgb3IgY2hhbmdpbmcgYSB2YWx1ZSBpbnNpZGUgdGhlIGFycmF5XHJcblx0XHRpZiAoIWlzTmFOKHByb3BlcnR5KSkge1xyXG5cclxuXHRcdFx0Ly8gY2hlY2sgaWYgaXRzIHZhbGlkIHR5cGVcclxuXHRcdFx0aWYgKHZhbHVlIGluc3RhbmNlb2YgQWNjZXNzaWJsZU5vZGUpIHtcclxuXHRcdFx0XHR0YXJnZXRbcHJvcGVydHldID0gdmFsdWU7XHJcblxyXG5cdFx0XHRcdC8vIHVwZGF0ZSBET00gYXR0cmlidXRlXHJcblx0XHRcdFx0aWYgKHRhcmdldC5wYXJlbnRBT00gJiYgdmFsdWUgJiYgdmFsdWUuX25vZGUpIHtcclxuXHRcdFx0XHRcdGlmKCF2YWx1ZS5fbm9kZS5pZCkge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZS5fbm9kZS5pZCA9IFwiYW9tLVwiICsgRGF0ZS5ub3coKTtcclxuXHRcdFx0XHRcdFx0dmFsdWUuZ2VuZXJhdGVkX2lkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRsZXQgaWRzID0gW107XHJcblx0XHRcdFx0XHRpZiAodGFyZ2V0LnBhcmVudEFPTS5fbm9kZS5oYXNBdHRyaWJ1dGUodGFyZ2V0LmF0dHJpYnV0ZSkpIHtcclxuXHRcdFx0XHRcdFx0aWRzID0gdGFyZ2V0LnBhcmVudEFPTS5fbm9kZS5nZXRBdHRyaWJ1dGUodGFyZ2V0LmF0dHJpYnV0ZSkuc3BsaXQoXCIgXCIpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWRzID0gW107XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWRzLnB1c2godmFsdWUuX25vZGUuaWQpO1xyXG5cclxuXHRcdFx0XHRcdHRhcmdldC5wYXJlbnRBT00uX25vZGUuc2V0QXR0cmlidXRlKHRhcmdldC5hdHRyaWJ1dGUsIGlkcy5qb2luKFwiIFwiKSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0YXJnZXRbcHJvcGVydHldID0gdmFsdWU7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIk9ubHkgaW5zdGFuY2VzIG9mIEFjY2Vzc2libGVOb2RlIGFyZSBhbGxvd2VkXCIpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0YXJnZXRbcHJvcGVydHldID0gdmFsdWU7XHJcblx0XHQvLyB5b3UgaGF2ZSB0byByZXR1cm4gdHJ1ZSB0byBhY2NlcHQgdGhlIGNoYW5nZXNcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcbmZ1bmN0aW9uIEFjY2Vzc2libGVOb2RlTGlzdFByb3h5KCkge1xyXG5cdGxldCBhY2Nlc3NpYmxlTm9kZUxpc3QgPSBuZXcgQWNjZXNzaWJsZU5vZGVMaXN0Q29uc3RydWN0b3IoKTtcdFxyXG5cdHJldHVybiBuZXcgUHJveHkoYWNjZXNzaWJsZU5vZGVMaXN0LCBhcnJheUNoYW5nZUhhbmRsZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBY2Nlc3NpYmxlTm9kZUxpc3RQcm94eTsiLCIvKipcclxuICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBnaXZlbiBhdHRyaWJ1dGVcclxuICogQHBhcmFtIHtBY2Nlc3NpYmxlTm9kZX0gYW9tIFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gYXR0cmlidXRlTmFtZSBcclxuICogQHJldHVybiB7U3RyaW5nfSBhdHRyaWJ1dGUncyB2YWx1ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldChhb20sIGF0dHJpYnV0ZU5hbWUpIHtcclxuXHRyZXR1cm4gYW9tLl92YWx1ZXNbYXR0cmlidXRlTmFtZV0gfHwgbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFN5bmMgdGhlIG5ldyB2YWx1ZSB0byB0aGUgRE9NXHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEBwYXJhbSB7U3RyaW5nIHwgTnVtYmVyIH0gc3RhdHVzIFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldChhb20sIGF0dHJpYnV0ZU5hbWUsIHN0YXR1cykge1xyXG5cdGlmIChzdGF0dXMgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRhb20uX25vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhb20uX25vZGUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIHN0YXR1cyk7XHJcblx0fVxyXG5cdFxyXG5cdGFvbS5fdmFsdWVzW2F0dHJpYnV0ZU5hbWVdID0gc3RhdHVzO1xyXG5cdHJldHVybiBzdGF0dXM7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgZ2V0LCBzZXQgfTsiLCJjbGFzcyBFdmVudFRhcmdldCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJfbGlzdGVuZXJzXCIsIHsgdmFsdWU6IG5ldyBNYXAoKSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9saXN0ZW5lcnMuaGFzKHR5cGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5zZXQodHlwZSwgW10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9saXN0ZW5lcnMuZ2V0KHR5cGUpLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2xpc3RlbmVycy5oYXModHlwZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RhY2sgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KHR5cGUpO1xyXG4gICAgICAgIHN0YWNrLmZvckVhY2goIChsaXN0ZW5lciwgaSkgPT4ge1xyXG4gICAgICAgICAgICBpZihsaXN0ZW5lciA9PT0gY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHN0YWNrLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoRXZlbnQoZXZlbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2xpc3RlbmVycy5oYXMoZXZlbnQudHlwZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdGFjayA9IHRoaXMuX2xpc3RlbmVycy5nZXQoZXZlbnQudHlwZSk7XHJcblxyXG4gICAgICAgIHN0YWNrLmZvckVhY2goIGxpc3RlbmVyID0+IHtcclxuICAgICAgICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBldmVudCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAhZXZlbnQuZGVmYXVsdFByZXZlbnRlZDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRUYXJnZXQ7IiwiLyoqXHJcbiAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGdpdmVuIGF0dHJpYnV0ZSBhcyBCb29sZWFuXHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGF0dHJpYnV0ZSdzIHZhbHVlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0KGFvbSwgYXR0cmlidXRlTmFtZSkge1xyXG5cdHZhciB2YWx1ZSA9IGFvbS5fdmFsdWVzW2F0dHJpYnV0ZU5hbWVdO1xyXG5cdGlmKHZhbHVlID09IHVuZGVmaW5lZCApIHJldHVybiBudWxsO1xyXG5cdHJldHVybiB2YWx1ZSAgPT0gXCJ0cnVlXCIgfHwgZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTeW5jIHRoZSBuZXcgdmFsdWUgdG8gdGhlIHByb3BlcnR5XHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEBwYXJhbSB7U3RyaW5nIHwgQm9vbGVhbn0gc3RhdHVzIFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldChhb20sIGF0dHJpYnV0ZU5hbWUsIHN0YXR1cykge1xyXG5cdGlmKHN0YXR1cyA9PSB1bmRlZmluZWQpIHtcclxuXHRcdGFvbS5fbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGFvbS5fbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgc3RhdHVzKTtcclxuXHR9XHJcblxyXG5cdGFvbS5fdmFsdWVzW2F0dHJpYnV0ZU5hbWVdID0gc3RhdHVzO1xyXG5cdHJldHVybiBzdGF0dXM7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgZ2V0LCBzZXQgfTsiLCIvKipcclxuICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBnaXZlbiBhdHRyaWJ1dGUgYXMgTnVtYmVyXHJcbiAqIEBwYXJhbSB7QWNjZXNzaWJsZU5vZGV9IGFvbSBcclxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgXHJcbiAqIEByZXR1cm4ge051bWJlcn0gYXR0cmlidXRlJ3MgdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQoYW9tLCBhdHRyaWJ1dGVOYW1lKSB7XHJcblx0dmFyIHZhbHVlID0gYW9tLl92YWx1ZXNbYXR0cmlidXRlTmFtZV07XHJcblx0aWYgKHZhbHVlID09IHVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XHJcblx0cmV0dXJuIE51bWJlcih2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTeW5jIHRoZSBuZXcgdmFsdWUgdG8gdGhlIERPTVxyXG4gKiBAcGFyYW0ge0FjY2Vzc2libGVOb2RlfSBhb20gXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVOYW1lIFxyXG4gKiBAcGFyYW0ge1N0cmluZyB8IE51bWJlciB9IHN0YXR1cyBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXQoYW9tLCBhdHRyaWJ1dGVOYW1lLCBzdHIpIHtcclxuXHRpZihzdHIgPT0gbnVsbCkge1xyXG5cdFx0YW9tLl9ub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0YW9tLl9ub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBzdHIpO1xyXG5cdH1cclxuXHJcblx0YW9tLl92YWx1ZXNbYXR0cmlidXRlTmFtZV0gPSBzdGF0dXM7XHJcblx0cmV0dXJuIHN0YXR1cztcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgeyBnZXQsIHNldCB9OyIsIi8qIGVzbGludDogc291cmNlLXR5cGU6IG1vZHVsZSAqL1xyXG5cclxuaW1wb3J0IEFjY2Vzc2libGVOb2RlIGZyb20gJy4vLi4vc3JjL0FjY2Vzc2libGVOb2RlLmpzJztcclxuaW1wb3J0IEFjY2Vzc2libGVOb2RlTGlzdCBmcm9tICcuLy4uL3NyYy9BY2Nlc3NpYmxlTm9kZUxpc3QuanMnO1xyXG5cclxuLy8gaWYgKCF3aW5kb3cuQWNjZXNzaWJsZU5vZGUgJiYgIXdpbmRvdy5BY2Nlc3NpYmxlTm9kZUxpc3QpIHtcclxuICAgIFxyXG4gICAgd2luZG93LkFjY2Vzc2libGVOb2RlID0gQWNjZXNzaWJsZU5vZGU7XHJcbiAgICB3aW5kb3cuQWNjZXNzaWJsZU5vZGVMaXN0ID0gQWNjZXNzaWJsZU5vZGVMaXN0O1xyXG4gICAgXHJcbiAgICB2YXIgZWxlbWVudHMgPSBuZXcgV2Vha01hcCgpO1xyXG4gICAgXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LkVsZW1lbnQucHJvdG90eXBlLCAnYWNjZXNzaWJsZU5vZGUnLCB7XHJcbiAgICAgICAgZ2V0KCkge1xyXG4gICAgICAgICAgICBpZihlbGVtZW50cy5oYXModGhpcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50cy5nZXQodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICB2YXIgYW9tID0gbmV3IEFjY2Vzc2libGVOb2RlKHRoaXMpO1xyXG4gICAgICAgICAgICBlbGVtZW50cy5zZXQodGhpcywgYW9tKTtcclxuICAgICAgICAgICAgcmV0dXJuIGFvbTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbi8vIH0iLCIvKipcclxuICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBnaXZlbiBhdHRyaWJ1dGUgYXMgSW50ZWdlclxyXG4gKiBAcGFyYW0ge0FjY2Vzc2libGVOb2RlfSBhb20gXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVOYW1lIFxyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGF0dHJpYnV0ZSdzIHZhbHVlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0KGFvbSwgYXR0cmlidXRlTmFtZSkge1xyXG5cdHZhciB2YWx1ZSA9IGFvbS5fdmFsdWVzW2F0dHJpYnV0ZU5hbWVdO1xyXG5cdGlmICh2YWx1ZSA9PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xyXG5cdHJldHVybiBwYXJzZUludCh2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTeW5jIHRoZSBuZXcgdmFsdWUgdG8gdGhlIERPTVxyXG4gKiBAcGFyYW0ge0FjY2Vzc2libGVOb2RlfSBhb20gXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyaWJ1dGVOYW1lIFxyXG4gKiBAcGFyYW0ge1N0cmluZyB8IE51bWJlciB9IHN0YXR1cyBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXQoYW9tLCBhdHRyaWJ1dGVOYW1lLCBzdHIpIHtcclxuXHRpZiAoc3RyID09IG51bGwpIHtcclxuXHRcdGFvbS5fbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGFvbS5fbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgc3RyKTtcclxuXHR9XHJcblxyXG5cdGFvbS5fdmFsdWVzW2F0dHJpYnV0ZU5hbWVdID0gc3RhdHVzO1xyXG5cdHJldHVybiBzdGF0dXM7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHsgZ2V0LCBzZXQgfTsiLCIvKiBlc2xpbnQtZW52IG1vY2hhICovXHJcblxyXG5yZXF1aXJlKCcuLy4uL3NyYy9pbmRleC5qcycpO1xyXG5pbXBvcnQgeyBBY2Nlc3NpYmxlTm9kZUxpc3RDb25zdHJ1Y3RvciBhcyBBY2Nlc3NpYmxlTm9kZUxpc3QgfSBmcm9tICcuLy4uL3NyYy9BY2Nlc3NpYmxlTm9kZUxpc3QuanMnO1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xyXG5cclxudmFyIGF0dHJpYnV0ZXMgPSB7XHJcblx0J3JvbGUnOiB7IHR5cGU6IFN0cmluZyB9LFxyXG5cdCdyb2xlRGVzY3JpcHRpb24nOiB7IHR5cGU6IFN0cmluZyB9LFxyXG5cdCdsYWJlbCc6IHsgdHlwZTogU3RyaW5nIH0sXHJcblx0J2xhYmVsZWRCeSc6IHsgdHlwZTogQWNjZXNzaWJsZU5vZGVMaXN0IH0sXHJcblx0J2Rlc2NyaWJlZEJ5JzogeyB0eXBlOiBBY2Nlc3NpYmxlTm9kZUxpc3QgfSxcclxuXHQnY3VycmVudCc6IHsgdHlwZTogU3RyaW5nIH0sXHJcblx0J2F1dG9jb21wbGV0ZSc6IHsgdHlwZTogU3RyaW5nIH0sXHJcblx0J2hpZGRlbic6IHsgdHlwZTogQm9vbGVhbiB9LFxyXG5cdCdrZXlTaG9ydGN1dHMnOiB7IHR5cGU6IFN0cmluZyB9LFxyXG5cdCdtb2RhbCc6IHsgdHlwZTogQm9vbGVhbiB9LFxyXG5cdCdtdWx0aWxpbmUnOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuXHQnbXVsdGlzZWxlY3RhYmxlJzogeyB0eXBlOiBCb29sZWFuIH0sXHJcblx0J29yaWVudGF0aW9uJzogeyB0eXBlOiBTdHJpbmcgfSxcclxuXHQncmVhZE9ubHknOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuXHQncmVxdWlyZWQnOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuXHQnc2VsZWN0ZWQnOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuXHQnc29ydCc6IHsgdHlwZTogU3RyaW5nIH0sXHJcblx0J2NoZWNrZWQnOiB7IHR5cGU6IFN0cmluZyB9LFxyXG5cdCdleHBhbmRlZCc6IHsgdHlwZTogQm9vbGVhbiB9LFxyXG5cdCdkaXNhYmxlZCc6IHsgdHlwZTogQm9vbGVhbiB9LFxyXG5cdCdpbnZhbGlkJzogeyB0eXBlOiBTdHJpbmcgfSxcclxuXHQnaGFzUG9wVXAnOiB7IHR5cGU6IFN0cmluZyB9LFxyXG5cdCdwcmVzc2VkJzogeyB0eXBlOiBTdHJpbmcgfSxcclxuXHQndmFsdWVUZXh0JzogeyB0eXBlOiBTdHJpbmcgfSxcclxuXHQncGxhY2Vob2xkZXInOiB7IHR5cGU6IFN0cmluZyB9LFxyXG5cdCd2YWx1ZU5vdyc6IHsgdHlwZTogTnVtYmVyIH0sXHJcblx0J3ZhbHVlTWluJzogeyB0eXBlOiBOdW1iZXIgfSxcclxuXHQndmFsdWVNYXgnOiB7IHR5cGU6IE51bWJlciB9LFxyXG5cdCdhdG9taWMnOiB7IHR5cGU6IEJvb2xlYW4gfSxcclxuXHQnYnVzeSc6IHsgdHlwZTogQm9vbGVhbiB9LFxyXG5cdCdsaXZlJzogeyB0eXBlOiBTdHJpbmcgfSxcclxuXHQncmVsZXZhbnQnOiB7IHR5cGU6IFN0cmluZyB9LFxyXG5cdCdhY3RpdmVEZXNjZW5kYW50JzogeyB0eXBlOiB3aW5kb3cuQWNjZXNzaWJsZU5vZGUgfSxcclxuXHQnY29udHJvbHMnOiB7IHR5cGU6IEFjY2Vzc2libGVOb2RlTGlzdCB9LFxyXG5cdCdkZXRhaWxzJzogeyB0eXBlOiB3aW5kb3cuQWNjZXNzaWJsZU5vZGUgfSxcclxuXHQnZXJyb3JNZXNzYWdlJzogeyB0eXBlOiB3aW5kb3cuQWNjZXNzaWJsZU5vZGUgfSxcclxuXHQnZmxvd1RvJzogeyB0eXBlOiBBY2Nlc3NpYmxlTm9kZUxpc3QgfSxcclxuXHQnb3ducyc6IHsgdHlwZTogQWNjZXNzaWJsZU5vZGVMaXN0IH0sXHJcblx0J2NvbENvdW50JzogeyB0eXBlOiBOdW1iZXIgfSxcclxuXHQnY29sSW5kZXgnOiB7IHR5cGU6IE51bWJlciB9LFxyXG5cdCdjb2xTcGFuJzogeyB0eXBlOiBOdW1iZXIgfSxcclxuXHQncG9zSW5TZXQnOiB7IHR5cGU6IE51bWJlciB9LFxyXG5cdCdyb3dDb3VudCc6IHsgdHlwZTogTnVtYmVyIH0sXHJcblx0J3Jvd0luZGV4JzogeyB0eXBlOiBOdW1iZXIgfSxcclxuXHQncm93U3Bhbic6IHsgdHlwZTogTnVtYmVyIH0sXHJcblx0J3NldFNpemUnOiB7IHR5cGU6IE51bWJlciB9LFxyXG5cdCdsZXZlbCc6IHsgdHlwZTogTnVtYmVyIH1cclxufTtcclxuXHJcbmRlc2NyaWJlKCdBY2Nlc3NpYmxlTm9kZScsIGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcblx0aXQoJ2NvbnN0cnVjdG9yIGV4aXN0JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0YXNzZXJ0Lm9rKFxyXG5cdFx0XHR3aW5kb3cuQWNjZXNzaWJsZU5vZGUucHJvdG90eXBlXHJcblx0XHRcdCYmIHdpbmRvdy5BY2Nlc3NpYmxlTm9kZS5wcm90b3R5cGUuY29uc3RydWN0b3JcclxuXHRcdFx0JiYgd2luZG93LkFjY2Vzc2libGVOb2RlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lXHJcblx0XHQpO1xyXG5cdH0pXHJcblxyXG5cdGRlc2NyaWJlKCdvbiBIVE1MRWxlbWVudCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdGl0KCdzaG91bGQgaGF2ZSBhbiBhY2Nlc3NpYmxlTm9kZSBwcm9wZXJ0eScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0YXNzZXJ0Lm9rKGRpdi5hY2Nlc3NpYmxlTm9kZSk7XHJcblx0XHR9KTtcclxuXHRcdGl0KCdzaG91bGQgYmUgb2YgY29ycmVjdCB0eXBlJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGFzc2VydC5lcXVhbChkaXYuYWNjZXNzaWJsZU5vZGUuY29uc3RydWN0b3IubmFtZSwgd2luZG93LkFjY2Vzc2libGVOb2RlLm5hbWUpO1xyXG5cdFx0fSlcclxuXHR9KTtcclxuXHJcblx0ZGVzY3JpYmUoJ2luc3RhbmNlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0aXQoJ3Nob3VsZCBoYXZlIGFsbCBhcmlhLSogYXR0cmlidXRlcycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIG1pc3NpbmdBdHRycyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZpbHRlcihhdHRyaWJ1dGUgPT4ge1xyXG5cdFx0XHRcdHJldHVybiB0eXBlb2YgZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJpYnV0ZV0gPT0gXCJ1bmRlZmluZWRcIjtcclxuXHRcdFx0fSlcclxuXHRcdFx0YXNzZXJ0LmRlZXBFcXVhbChtaXNzaW5nQXR0cnMsIFtdKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRkZXNjcmliZSgnZWFjaCBhdHRyaWJ1dGUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRpdCgnc2hvdWxkIGhhdmUgYXMgZGVmYXVsdCB2YWx1ZSBvZiBudWxsJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRmb3IgKGxldCBhdHRyIGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRhc3NlcnQuZXF1YWwoZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdLCBudWxsKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRpdCgnc2hvdWxkIGhhdmUgdGhlIGNvcnJlY3QgdHlwZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Zm9yIChsZXQgYXR0ciBpbiBhdHRyaWJ1dGVzKSB7XHJcblx0XHRcdFx0Ly8gc2V0IHNvbWUgKGZha2UpIGRhdGFcclxuXHRcdFx0XHRzd2l0Y2ggKGF0dHJpYnV0ZXNbYXR0cl0udHlwZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSBTdHJpbmc6XHJcblx0XHRcdFx0XHRcdGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSA9IFwiMzBweFwiO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgQm9vbGVhbjpcclxuXHRcdFx0XHRcdGNhc2UgTnVtYmVyOlxyXG5cdFx0XHRcdFx0XHRkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBcIjMwXCI7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSBBY2Nlc3NpYmxlTm9kZUxpc3Q6XHJcblx0XHRcdFx0XHRcdGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSA9IG5ldyB3aW5kb3cuQWNjZXNzaWJsZU5vZGVMaXN0KCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0ZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdID0gbmV3IGF0dHJpYnV0ZXNbYXR0cl0udHlwZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSA9PT0gbnVsbCkgY29uc29sZS5sb2coYXR0ciwgZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdKTtcclxuXHRcdFx0XHRsZXQgYWN0dWFsID0gZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdLmNvbnN0cnVjdG9yLm5hbWU7XHJcblx0XHRcdFx0bGV0IGV4cGVjdGVkID0gYXR0cmlidXRlc1thdHRyXS50eXBlLm5hbWU7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0YXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsXHJcblx0XHRcdFx0XHRgVGhlIHByb3BlcnR5ICcke2F0dHJ9JyBpcyBub3QgY29ycmVjdGx5IGRlZmluZWQsIGl0IHdhcyAke2FjdHVhbH0sIGJ1dCBleHBlY3RlZCAke2V4cGVjdGVkfWBcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdGRlc2NyaWJlKCdvZiB0eXBlIEFjY2Vzc2libGVOb2RlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRsZXQgYW5BdHRyaWJ1dGVzID0gT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykuZmlsdGVyKGF0dHIgPT4gYXR0clsxXS50eXBlID09IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRpdCgnc2hvdWxkIG9ubHkgYWxsb3cgYW4gaW5zdGFuY2Ugb2YgQWNjZXNzaWJsZU5vZGUgYXMgdmFsdWUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0YW5BdHRyaWJ1dGVzLmZvckVhY2gob2JqID0+IHtcclxuXHRcdFx0XHRcdGxldCBhdHRyID0gb2JqWzBdO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRhc3NlcnQudGhyb3dzKCgpID0+IGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSA9IG5ldyBTdHJpbmcoKSk7XHJcblx0XHRcdFx0XHRhc3NlcnQudGhyb3dzKCgpID0+IGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSA9IFwiXCIpO1xyXG5cdFx0XHRcdFx0YXNzZXJ0LmRvZXNOb3RUaHJvdygoKSA9PiBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBuZXcgd2luZG93LkFjY2Vzc2libGVOb2RlKCkpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdFx0ZGVzY3JpYmUoJ29mIHR5cGUgQWNjZXNzaWJsZU5vZGVMaXN0JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRsZXQgYW5sQXR0cmlidXRlcyA9IE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpLmZpbHRlcihhdHRyID0+IGF0dHJbMV0udHlwZSA9PSBBY2Nlc3NpYmxlTm9kZUxpc3QpO1xyXG5cdFx0XHRcclxuXHRcdFx0aXQoJ3Nob3VsZCBvbmx5IGFsbG93IGFuIGluc3RhbmNlIG9mIEFjY2Vzc2libGVOb2RlTGlzdCBhcyB2YWx1ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRhbmxBdHRyaWJ1dGVzLmZvckVhY2gob2JqID0+IHtcclxuXHRcdFx0XHRcdGxldCBhdHRyID0gb2JqWzBdO1xyXG5cdFx0XHRcdFx0YXNzZXJ0LnRocm93cygoKSA9PiBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBuZXcgU3RyaW5nKCkpO1xyXG5cdFx0XHRcdFx0YXNzZXJ0LnRocm93cygoKSA9PiBkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0gPSBcIlwiKTtcclxuXHRcdFx0XHRcdGFzc2VydC5kb2VzTm90VGhyb3coKCkgPT4gZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdID0gbmV3IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZUxpc3QoKSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0ZGVzY3JpYmUoJ0V2ZW50VGFyZ2V0JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0aXQoJ3Nob3VsZCBoYXZlIGFkZEV2ZW50TGlzdGVuZXInLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGFzc2VydC5vayhkaXYuYWNjZXNzaWJsZU5vZGUuYWRkRXZlbnRMaXN0ZW5lcik7XHJcblx0XHR9KTtcclxuXHRcdGl0KCdzaG91bGQgaGF2ZSByZW1vdmVFdmVudExpc3RlbmVyLCBkaXNwYXRjaEV2ZW50JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRhc3NlcnQub2soZGl2LmFjY2Vzc2libGVOb2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdCgnc2hvdWxkIGhhdmUgZGlzcGF0Y2hFdmVudCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0YXNzZXJ0Lm9rKGRpdi5hY2Nlc3NpYmxlTm9kZS5kaXNwYXRjaEV2ZW50KTtcclxuXHRcdH0pO1x0XHRcclxuXHRcdGl0KCdzaG91bGQgYmUgYWJsZSB0byBhZGQgYW5kIHRyaWdnZXIgZXZlbnRzJywgZnVuY3Rpb24gKGRvbmUpIHtcclxuXHRcdFx0ZGl2LmFjY2Vzc2libGVOb2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBkb25lKCkpO1xyXG5cdFx0XHRkaXYuYWNjZXNzaWJsZU5vZGUuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudChcImNsaWNrXCIpKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdGRlc2NyaWJlKCdQb2x5ZmlsbCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdGl0KCdBY2Nlc3NpYmxlTm9kZSBwcm9wZXJ0aWVzIHNob3VsZCByZWZsZWN0IEFSSUEnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGRpdi5hY2Nlc3NpYmxlTm9kZS5yb2xlID0gXCJidXR0b25cIjtcclxuXHRcdFx0YXNzZXJ0LmVxdWFsKGRpdi5hY2Nlc3NpYmxlTm9kZS5yb2xlLCBkaXYuZ2V0QXR0cmlidXRlKFwicm9sZVwiKSk7XHJcblx0XHR9KTtcclxuXHRcdGl0KCdBUklBIHNob3VsZCBub3Qgb3ZlcndyaXRlIEFjY2Vzc2libGVOb2RlJywgZnVuY3Rpb24gKGRvbmUpIHtcclxuXHRcdFx0ZGl2LnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJncm91cFwiKTtcclxuXHJcblx0XHRcdC8vIGF0dHJpYnV0ZXMgYXJlIHJlc2V0IGJ5IGFuIG11dGF0aW9uIG9ic2VydmVyLFxyXG5cdFx0XHQvLyBhcyByZXN1bHQgdGhlIGNoYW5nZXMgbXVzdCBiZSBjaGVja2VkIGluIHRoZSBuZXh0IGNoZWNrXHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRhc3NlcnQuZXF1YWwoZGl2LmFjY2Vzc2libGVOb2RlLnJvbGUsIGRpdi5nZXRBdHRyaWJ1dGUoXCJyb2xlXCIpKTtcclxuXHRcdFx0XHRcdGFzc2VydC5lcXVhbChcImJ1dHRvblwiLCBkaXYuZ2V0QXR0cmlidXRlKFwicm9sZVwiKSk7XHJcblx0XHRcdFx0XHRkb25lKCk7XHJcblx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHRkb25lKGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgMCk7XHJcblx0XHR9KTtcclxuXHRcdGl0KCdBUklBIHNob3VsZCBiZSBvdmVyd3JpdGFibGUgd2hlbiBubyB2YWx1ZSBpcyBzZXQgd2l0aGluIEFjY2Vzc2libGVOb2RlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRkaXYuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIkZvb1wiKTtcclxuXHRcdFx0YXNzZXJ0LmVxdWFsKGRpdi5nZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIpLCBcIkZvb1wiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoJy5hdHRyaWJ1dGVzIHNob3VsZCByZXR1cm4gdGhlIGNvcnJlY3QgdmFsdWUnLCAoKSA9PiB7fSk7XHJcblx0XHRpdCgnLmdldEF0dHJpYnV0ZSBzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IHZhbHVlJywgKCkgPT4ge30pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmRlc2NyaWJlKCdBY2Nlc3NpYmxlTm9kZUxpc3QnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHJcblx0aXQoJ2NvbnN0cnVjdG9yIGV4aXN0IGluIHdpbmRvdyBvYmplY3QnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRhc3NlcnQub2sod2luZG93LkFjY2Vzc2libGVOb2RlTGlzdC5wcm90b3R5cGUgJiYgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdC5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZSk7XHJcblx0fSk7XHJcblxyXG5cdGRlc2NyaWJlKCdbTnVtYmVyXScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0bGV0IGxpc3QgPSBuZXcgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdCgpO1xyXG5cdFx0bGV0IGRpdjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cdFx0bGV0IGRpdjAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cdFx0XHJcblx0XHRpdCgnc2hvdWxkIGJlIGFibGUgdG8gYWRkIGFjY2VzaWJsZU5vZGUgYnkgc3BlY2lmaWMgaW5kZXgnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGxpc3RbMF0gPSBkaXYxLmFjY2Vzc2libGVOb2RlO1xyXG5cdFx0XHRsaXN0W1wiMVwiXSA9IGRpdjEuYWNjZXNzaWJsZU5vZGU7XHJcblxyXG5cdFx0XHRhc3NlcnQuZXF1YWwobGlzdFswXSwgZGl2MS5hY2Nlc3NpYmxlTm9kZSk7XHJcblx0XHRcdGFzc2VydC5lcXVhbChsaXN0W1wiMVwiXSwgZGl2MS5hY2Nlc3NpYmxlTm9kZSk7XHJcblx0XHR9KTtcclxuXHRcdGl0KCdzaG91bGQgYmUgYWJsZSB0byBvdmVyd3JpdGUgYWNjZXNpYmxlTm9kZSBieSBzcGVjaWZpYyBpbmRleCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0bGlzdFswXSA9IGRpdjAuYWNjZXNzaWJsZU5vZGU7XHJcblxyXG5cdFx0XHRhc3NlcnQuZXF1YWwobGlzdFswXSwgZGl2MC5hY2Nlc3NpYmxlTm9kZSk7XHJcblx0XHR9KTtcclxuXHRcdGl0KCdzaG91bGQgcmV0dXJuIG51bGwgaWYgaW5kZXggZG9lcyBub3QgZXhpc3QnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGFzc2VydC5lcXVhbChsaXN0WzJdLCBudWxsKTtcclxuXHRcdFx0YXNzZXJ0LmVxdWFsKGxpc3RbXCIyXCJdLCBudWxsKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdFxyXG5cdGRlc2NyaWJlKCcubGVuZ3RoJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGxpc3QgPSBuZXcgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdCgpO1xyXG5cdFx0XHJcblx0XHRpdCgnaGFzIGEgZGVmYXVsdCB2YWx1ZSBvZiAwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRhc3NlcnQuZXF1YWwobGlzdC5sZW5ndGgsIDApO1xyXG5cdFx0fSk7XHRcclxuXHRcdGl0KCdjYW4gYmUgc2V0IGF0IGFuIGRpZmZlcmVudCBzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRsaXN0Lmxlbmd0aCA9IDM7XHJcblx0XHRcdGFzc2VydC5lcXVhbChBcnJheS5mcm9tKGxpc3QpLmxlbmd0aCwgMyk7XHJcblx0XHR9KTtcclxuXHRcdGl0KCdmaXJzdCB2YWx1ZSBpcyBlbXB0eSBzbG90JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRhc3NlcnQuZXF1YWwobGlzdFswXSwgbnVsbCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0ZGVzY3JpYmUoJy5hZGQoKScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFxyXG5cdFx0aXQoJ2NhbiBvbmx5IGFkZCBpbnN0YW5jZXMgb2YgQWNjZXNzaWJsZU5vZGUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGxldCBsaXN0ID0gbmV3IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZUxpc3QoKTtcclxuXHRcdFx0bGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG5cdFx0XHRhc3NlcnQudGhyb3dzKCgpID0+IGxpc3QuYWRkKHRydWUpKTtcclxuXHRcdFx0YXNzZXJ0LmRvZXNOb3RUaHJvdygoKSA9PiBsaXN0LmFkZChkaXYuYWNjZXNzaWJsZU5vZGUpKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGl0KCdjYW4gYWRkIEFjY2Vzc2libGVOb2RlIGJlZm9yZSBhbiBzcGVjaWZpYyBBY2Nlc3NpYmxlTm9kZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0bGV0IGxpc3QgPSBuZXcgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdCgpO1xyXG5cdFx0XHRsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHRcdFx0bGV0IGRpdjIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuXHRcdFx0bGlzdC5hZGQoZGl2LmFjY2Vzc2libGVOb2RlKTtcclxuXHJcblx0XHRcdGFzc2VydC5kb2VzTm90VGhyb3coKCkgPT4gbGlzdC5hZGQoZGl2Mi5hY2Nlc3NpYmxlTm9kZSwgZGl2LmFjY2Vzc2libGVOb2RlKSk7XHJcblx0XHRcdGFzc2VydC5lcXVhbChsaXN0Lmxlbmd0aCwgMik7XHJcblx0XHRcdGFzc2VydC5lcXVhbChsaXN0WzBdLCBkaXYyLmFjY2Vzc2libGVOb2RlKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRkZXNjcmliZSgnLml0ZW0oKScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBsaXN0ID0gbmV3IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZUxpc3QoKTtcclxuXHRcdGxldCBkaXYxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHRcdGxldCBkaXYwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHRcdGxpc3QuYWRkKGRpdjEuYWNjZXNzaWJsZU5vZGUpO1xyXG5cdFx0bGlzdC5hZGQoZGl2MC5hY2Nlc3NpYmxlTm9kZSwgZGl2MS5hY2Nlc3NpYmxlTm9kZSk7XHJcblxyXG5cdFx0aXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvcnJlY3QgYWNjZXNzaWJsZU5vZGUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGFzc2VydC5lcXVhbChsaXN0Lml0ZW0oMCksIGRpdjAuYWNjZXNzaWJsZU5vZGUpO1xyXG5cdFx0XHRhc3NlcnQuZXF1YWwobGlzdC5pdGVtKFwiMVwiKSwgZGl2MS5hY2Nlc3NpYmxlTm9kZSk7XHJcblx0XHR9KTtcclxuXHRcdGl0KCdzaG91bGQgcmV0dXJuIG51bGwgaWYgaW5kZXggZG9lcyBub3QgZXhpc3QnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGFzc2VydC5lcXVhbChsaXN0Lml0ZW0oMiksIG51bGwpO1xyXG5cdFx0XHRhc3NlcnQuZXF1YWwobGlzdC5pdGVtKFwiMlwiKSwgbnVsbCk7XHJcblx0XHR9KTtcclxuXHRcdGl0KCdzaG91bGQgb25seSByZXR1cm4gdmFsdWVzIG9mIGluZGV4IG51bWJlcnMnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGFzc2VydC5ub3RFcXVhbChsaXN0Lml0ZW0oXCJsZW5ndGhcIiksIGxpc3QubGVuZ3RoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRkZXNjcmliZSgnLnJlbW92ZSgpJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGxpc3QgPSBuZXcgd2luZG93LkFjY2Vzc2libGVOb2RlTGlzdCgpO1xyXG5cdFx0bGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblx0XHRsaXN0LmFkZChkaXYuYWNjZXNzaWJsZU5vZGUpO1xyXG5cdFx0XHJcblx0XHRpdCgnc2hvdWxkIHJlbW92ZSB0aGUgcmVmZXJlbmNlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRsaXN0LnJlbW92ZSgwKTtcclxuXHRcdFx0YXNzZXJ0LmVxdWFsKGxpc3RbMF0sIHVuZGVmaW5lZCk7XHJcblx0XHRcdGFzc2VydC5lcXVhbChsaXN0Lmxlbmd0aCwgMCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0ZGVzY3JpYmUoJ1BvbHlmaWxsJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGF0dHIgPSBcIm93bnNcIjtcclxuXHRcdGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cdFx0ZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdID0gbmV3IHdpbmRvdy5BY2Nlc3NpYmxlTm9kZUxpc3QoKTtcclxuXHJcblx0XHR2YXIgZGl2V2l0aElEID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHRcdGRpdldpdGhJRC5pZCA9IFwiYW9tLWlkXCI7XHJcblxyXG5cdFx0dmFyIGRpdldpdGhvdXRJRCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG5cdFx0aXQoJ2VhY2ggSUQgb2YgYWRkZWQgZWxlbWVudHMgc2hvdWxkIGJlIHJlZmxlY3RlZCBpbiB0aGUgQVJJQScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ZGl2LmFjY2Vzc2libGVOb2RlW2F0dHJdLmFkZChkaXZXaXRoSUQuYWNjZXNzaWJsZU5vZGUpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhkaXYsIGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXSwgZGl2LmdldEF0dHJpYnV0ZShcImFyaWEtb3duc1wiKSk7XHJcblx0XHRcdGFzc2VydC5vayhkaXYuZ2V0QXR0cmlidXRlKFwiYXJpYS1vd25zXCIpLmluZGV4T2YoZGl2V2l0aElELmlkKSA+IC0xKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoJ2VhY2ggSUQgb2YgcmVtb3ZlZCBlbGVtZW50cyBzaG91bGQgYmUgcmVmbGVjdGVkIGluIHRoZSBBUklBJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0ucmVtb3ZlKDApO1xyXG5cdFx0XHRhc3NlcnQub2soZGl2LmdldEF0dHJpYnV0ZShcImFyaWEtb3duc1wiKS5pbmRleE9mKGRpdldpdGhJRC5pZCkgPT0gLTEpO1xyXG5cdFx0fSk7XHJcblx0XHRpdCgnYW4gYWRkZWQgZWxlbWVudCB3aXRob3V0IElEIHNob3VsZCBiZSBnZW5lcmF0ZWQgYW5kIHJlZmxlY3QgaW4gdGhlIEFSSUEgYXR0cmlidXRlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRkaXYuYWNjZXNzaWJsZU5vZGVbYXR0cl0uYWRkKGRpdldpdGhvdXRJRC5hY2Nlc3NpYmxlTm9kZSk7XHJcblx0XHRcdGFzc2VydC5vayhkaXYuZ2V0QXR0cmlidXRlKFwiYXJpYS1vd25zXCIpLmluZGV4T2YoZGl2V2l0aG91dElELmlkKSA+IC0xKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoJ2FuIGdlbmVyYXRlZCBJRCBzaG91bGQgYmUgcmVtb3ZlZCBhZnRlciBubyBjb25uZWN0aW9uIGV4aXN0IGFueW1vcmUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGRpdi5hY2Nlc3NpYmxlTm9kZVthdHRyXS5yZW1vdmUoMCk7XHJcblx0XHRcdGFzc2VydC5vayhkaXYuZ2V0QXR0cmlidXRlKFwiYXJpYS1vd25zXCIpLmluZGV4T2YoZGl2V2l0aElELmlkKSA9PSAtMSk7XHJcblx0XHRcdGFzc2VydC5lcXVhbChkaXZXaXRob3V0SUQuaWQsIFwiXCIpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn0pOyJdfQ==
