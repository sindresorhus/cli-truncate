'use strict';
var sliceAnsi = require('slice-ansi');
var stringWidth = require('string-width');

module.exports = function (input, columns, options) {
	options = options || {};
	options.position = options.position || 'end';

	var ellipsis = '…';

	if (typeof input !== 'string') {
		throw new TypeError('Expected `input` to be a string, got ' + typeof input);
	}

	if (typeof columns !== 'number') {
		throw new TypeError('Expected `columns` to be a number, got ' + typeof columns);
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

	if (options.position === 'end') {
		return sliceAnsi(input, 0, columns - 1) + ellipsis;
	} else if (options.position === 'start') {
		return ellipsis + sliceAnsi(input, length - columns + 1, length);
	} else if (options.position === 'middle') {
		var half = Math.floor(columns / 2);
		return sliceAnsi(input, 0, half) + ellipsis + sliceAnsi(input, length - (columns - half) + 1, length);
	}

	throw new Error('Expected `options.position` to be either "start", "begin" or "end", got ' + options.position);
};
