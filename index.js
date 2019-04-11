'use strict';
const sliceAnsi = require('slice-ansi');
const stringWidth = require('string-width');

module.exports = (text, columns, options) => {
	options = {
		position: 'end',
		...options
	};

	const {position} = options;
	const ellipsis = '…';

	if (typeof text !== 'string') {
		throw new TypeError(`Expected \`input\` to be a string, got ${typeof text}`);
	}

	if (typeof columns !== 'number') {
		throw new TypeError(`Expected \`columns\` to be a number, got ${typeof columns}`);
	}

	if (columns < 1) {
		return '';
	}

	if (columns === 1) {
		return ellipsis;
	}

	const length = stringWidth(text);

	if (length <= columns) {
		return text;
	}

	if (position === 'start') {
		return ellipsis + sliceAnsi(text, length - columns + 1, length);
	}

	if (position === 'middle') {
		const half = Math.floor(columns / 2);
		return sliceAnsi(text, 0, half) + ellipsis + sliceAnsi(text, length - (columns - half) + 1, length);
	}

	if (position === 'end') {
		return sliceAnsi(text, 0, columns - 1) + ellipsis;
	}

	throw new Error(`Expected \`options.position\` to be either \`start\`, \`middle\` or \`end\`, got ${position}`);
};
