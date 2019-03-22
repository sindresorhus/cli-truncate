'use strict';
const sliceAnsi = require('slice-ansi');
const stringWidth = require('string-width');

module.exports = (input, columns, opts) => {
	opts = Object.assign({
		position: 'end',
		preferTruncationOnSpace: false
	}, opts);

	const {position} = opts;
	const {preferTruncationOnSpace} = opts;
	const ellipsis = '…';

	if (typeof input !== 'string') {
		throw new TypeError(`Expected \`input\` to be a string, got ${typeof input}`);
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

	const length = stringWidth(input);

	if (length <= columns) {
		return input;
	}

	if (position === 'start') {
		if (preferTruncationOnSpace) {
			const nearestSpace = getIndexOfNearestSpace(input, length - columns + 1, true);
			return ellipsis + sliceAnsi(input, nearestSpace, length).trim();
		}

		return ellipsis + sliceAnsi(input, length - columns + 1, length);
	}

	if (position === 'middle') {
		const half = Math.floor(columns / 2);

		if (preferTruncationOnSpace) {
			const spaceNearFirstBreakPoint = getIndexOfNearestSpace(input, half);
			const spaceNearSecondBreakPoint = getIndexOfNearestSpace(input, length - (columns - half) + 1, true);
			return sliceAnsi(input, 0, spaceNearFirstBreakPoint) + ellipsis + sliceAnsi(input, spaceNearSecondBreakPoint, length).trim();
		}

		return sliceAnsi(input, 0, half) + ellipsis + sliceAnsi(input, length - (columns - half) + 1, length);
	}

	if (position === 'end') {
		if (preferTruncationOnSpace) {
			const nearestSpace = getIndexOfNearestSpace(input, columns - 1);
			return sliceAnsi(input, 0, nearestSpace) + ellipsis;
		}

		return sliceAnsi(input, 0, columns - 1) + ellipsis;
	}

	throw new Error(`Expected \`options.position\` to be either \`start\`, \`middle\` or \`end\`, got ${position}`);
};

function getIndexOfNearestSpace(str, index, searchRight) {
	if (str.charAt(index) === ' ') {
		return index;
	}

	for (let i = 1; i <= 3; i++) {
		if (searchRight) {
			if (str.charAt(index + i) === ' ') {
				return index + i;
			}
		} else if (str.charAt(index - i) === ' ') {
			return index - i;
		}
	}

	// Return the passed index if no space was encountered
	return index;
}
