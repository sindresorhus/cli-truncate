'use strict';
const sliceAnsi = require('slice-ansi');
const stringWidth = require('string-width');

module.exports = (text, columns, options) => {
	options = {
		position: 'end',
		...options
	};

	const {position, space} = options;
	let ellipsis = '…';

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
		if (space === true) {
			ellipsis += ' ';
		}

		return ellipsis + sliceAnsi(input, length - columns + (space ? 2 : 1), length);
	}

	if (position === 'middle') {
		if (space === true) {
			ellipsis = ' ' + ellipsis + ' ';
		}

		const half = Math.floor(columns / 2);
		return (
			sliceAnsi(input, 0, half) +
			ellipsis +
			sliceAnsi(input, length - (columns - half) + (space ? 3 : 1), length)
		);
	}

	if (position === 'end') {
		if (space === true) {
			ellipsis = ' ' + ellipsis;
		}

		return sliceAnsi(input, 0, columns - (space ? 2 : 1)) + ellipsis;
	}

	throw new Error(`Expected \`options.position\` to be either \`start\`, \`middle\` or \`end\`, got ${position}`);
};
