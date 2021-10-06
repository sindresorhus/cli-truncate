import sliceAnsi from 'slice-ansi';
import stringWidth from 'string-width';

function getIndexOfNearestSpace(string, wantedIndex, shouldSearchRight) {
	if (string.charAt(wantedIndex) === ' ') {
		return wantedIndex;
	}

	for (let index = 1; index <= 3; index++) {
		if (shouldSearchRight) {
			if (string.charAt(wantedIndex + index) === ' ') {
				return wantedIndex + index;
			}
		} else if (string.charAt(wantedIndex - index) === ' ') {
			return wantedIndex - index;
		}
	}

	return wantedIndex;
}

export default function cliTruncate(text, columns, options) {
	options = {
		position: 'end',
		preferTruncationOnSpace: false,
		ellipsis: '…',
		...options,
	};

	const {position, space, preferTruncationOnSpace} = options;

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
		return options.ellipsis;
	}

	const length = stringWidth(text);

	if (length <= columns) {
		return text;
	}

	if (position === 'start') {
		if (preferTruncationOnSpace) {
			const nearestSpace = getIndexOfNearestSpace(text, length - columns + 1, true);
			return options.ellipsis + sliceAnsi(text, nearestSpace, length).trim();
		}

		if (space === true) {
			options.ellipsis += ' ';
		}

		return options.ellipsis + sliceAnsi(text, length - columns + stringWidth(options.ellipsis), length);
	}

	if (position === 'middle') {
		if (space === true) {
			options.ellipsis = ` ${options.ellipsis} `;
		}

		const half = Math.floor(columns / 2);

		if (preferTruncationOnSpace) {
			const spaceNearFirstBreakPoint = getIndexOfNearestSpace(text, half);
			const spaceNearSecondBreakPoint = getIndexOfNearestSpace(text, length - (columns - half) + 1, true);
			return sliceAnsi(text, 0, spaceNearFirstBreakPoint) + options.ellipsis + sliceAnsi(text, spaceNearSecondBreakPoint, length).trim();
		}

		return (
			sliceAnsi(text, 0, half)
				+ options.ellipsis
				+ sliceAnsi(text, length - (columns - half) + stringWidth(options.ellipsis), length)
		);
	}

	if (position === 'end') {
		if (preferTruncationOnSpace) {
			const nearestSpace = getIndexOfNearestSpace(text, columns - 1);
			return sliceAnsi(text, 0, nearestSpace) + options.ellipsis;
		}

		if (space === true) {
			options.ellipsis = ` ${options.ellipsis}`;
		}

		return sliceAnsi(text, 0, columns - stringWidth(options.ellipsis)) + options.ellipsis;
	}

	throw new Error(`Expected \`options.position\` to be either \`start\`, \`middle\` or \`end\`, got ${position}`);
}
