/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var sliceAnsi = __webpack_require__(3);
var stringWidth = __webpack_require__(4);

module.exports = function (input, columns, opts) {
  opts = Object.assign({
    position: 'end'
  }, opts);

  var position = opts.position;
  var ellipsis = '…';

  if (typeof input !== 'string') {
    throw new TypeError('Expected `input` to be a string, got ' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)));
  }

  if (typeof columns !== 'number') {
    throw new TypeError('Expected `columns` to be a number, got ' + (typeof columns === 'undefined' ? 'undefined' : _typeof(columns)));
  }

  if (columns < 1) {
    return '';
  }

  if (columns === 1) {
    return ellipsis;
  }

  var length = stringWidth(input);

  if (length <= columns) {
    return input;
  }

  if (position === 'start') {
    return ellipsis + sliceAnsi(input, length - columns + 1, length);
  } else if (position === 'middle') {
    var half = Math.floor(columns / 2);
    return sliceAnsi(input, 0, half) + ellipsis + sliceAnsi(input, length - (columns - half) + 1, length);
  } else if (position === 'end') {
    return sliceAnsi(input, 0, columns - 1) + ellipsis;
  }

  throw new Error('Expected `options.position` to be either `start`, `middle` or `end`, got ' + position);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	return (/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g
	);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable yoda */

module.exports = function (x) {
	if (Number.isNaN(x)) {
		return false;
	}

	// code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (x >= 0x1100 && (x <= 0x115f || // Hangul Jamo
	x === 0x2329 || // LEFT-POINTING ANGLE BRACKET
	x === 0x232a || // RIGHT-POINTING ANGLE BRACKET
	// CJK Radicals Supplement .. Enclosed CJK Letters and Months
	0x2e80 <= x && x <= 0x3247 && x !== 0x303f ||
	// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
	0x3250 <= x && x <= 0x4dbf ||
	// CJK Unified Ideographs .. Yi Radicals
	0x4e00 <= x && x <= 0xa4c6 ||
	// Hangul Jamo Extended-A
	0xa960 <= x && x <= 0xa97c ||
	// Hangul Syllables
	0xac00 <= x && x <= 0xd7a3 ||
	// CJK Compatibility Ideographs
	0xf900 <= x && x <= 0xfaff ||
	// Vertical Forms
	0xfe10 <= x && x <= 0xfe19 ||
	// CJK Compatibility Forms .. Small Form Variants
	0xfe30 <= x && x <= 0xfe6b ||
	// Halfwidth and Fullwidth Forms
	0xff01 <= x && x <= 0xff60 || 0xffe0 <= x && x <= 0xffe6 ||
	// Kana Supplement
	0x1b000 <= x && x <= 0x1b001 ||
	// Enclosed Ideographic Supplement
	0x1f200 <= x && x <= 0x1f251 ||
	// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
	0x20000 <= x && x <= 0x3fffd)) {
		return true;
	}

	return false;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ESCAPES = ['\x1B', '\x9B'];

var END_CODE = 39;

var ESCAPE_CODES = {
	0: 0,
	1: 22,
	2: 22,
	3: 23,
	4: 24,
	7: 27,
	8: 28,
	9: 29,
	30: 39,
	31: 39,
	32: 39,
	33: 39,
	34: 39,
	35: 39,
	36: 39,
	37: 39,
	90: 39,
	40: 49,
	41: 49,
	42: 49,
	43: 49,
	44: 49,
	45: 49,
	46: 49,
	47: 49
};

function wrapAnsi(code) {
	return ESCAPES[0] + '[' + code + 'm';
}

module.exports = function (str, begin, end) {
	end = end || str.length;
	var insideEscape = false;
	var escapeCode;
	var visible = 0;
	var output = '';

	for (var i = 0; i < str.length; i++) {
		var leftEscape = false;
		var x = str[i];

		if (ESCAPES.indexOf(x) !== -1) {
			insideEscape = true;
			var code = /[0-9][^m]*/.exec(str.slice(i, i + 4));
			escapeCode = code === END_CODE ? null : code;
		} else if (insideEscape && x === 'm') {
			insideEscape = false;
			leftEscape = true;
		}

		if (!insideEscape && !leftEscape) {
			++visible;
		}

		if (visible > begin && visible <= end) {
			output += x;
		} else if (visible === begin && escapeCode !== undefined && escapeCode !== END_CODE) {
			output += wrapAnsi(escapeCode);
		} else if (visible >= end) {
			if (escapeCode !== undefined) {
				output += wrapAnsi(ESCAPE_CODES[escapeCode] || END_CODE);
			}
			break;
		}
	}

	return output;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stripAnsi = __webpack_require__(5);
var isFullwidthCodePoint = __webpack_require__(2);

module.exports = function (str) {
	if (typeof str !== 'string' || str.length === 0) {
		return 0;
	}

	var width = 0;

	str = stripAnsi(str);

	for (var i = 0; i < str.length; i++) {
		var code = str.codePointAt(i);

		// ignore control characters
		if (code <= 0x1f || code >= 0x7f && code <= 0x9f) {
			continue;
		}

		// surrogates
		if (code >= 0x10000) {
			i++;
		}

		if (isFullwidthCodePoint(code)) {
			width += 2;
		} else {
			width++;
		}
	}

	return width;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ansiRegex = __webpack_require__(1)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);