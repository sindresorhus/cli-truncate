'use strict';
var sliceAnsi = require('slice-ansi');
var stringWidth = require('string-width');

module.exports = function (input, columns) {
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

	if (stringWidth(input) <= columns) {
		return input;
	}

	return sliceAnsi(input, 0, columns - 1) + ellipsis;
};
