import {stripVTControlCharacters} from 'node:util';
import sliceAnsi from 'slice-ansi';
import stringWidth from 'string-width';

const validPositions = new Set(['start', 'middle', 'end']);

// Get one entry per terminal column of the visible text, so the space search uses the same column indexes as `sliceAnsi`. A wide character fills its extra columns with empty strings.
function getVisibleColumns(text) {
	const visibleColumns = [];

	for (const {segment} of new Intl.Segmenter().segment(stripVTControlCharacters(text))) {
		const width = stringWidth(segment);
		for (let column = 0; column < width; column++) {
			visibleColumns.push(column === 0 ? segment : '');
		}
	}

	return visibleColumns;
}

function getIndexOfNearestSpace(visibleColumns, wantedIndex, shouldSearchRight) {
	if (visibleColumns[wantedIndex] === ' ') {
		return wantedIndex;
	}

	const direction = shouldSearchRight ? 1 : -1;

	for (let index = 0; index <= 3; index++) {
		const finalIndex = wantedIndex + (index * direction);
		if (visibleColumns[finalIndex] === ' ') {
			return finalIndex;
		}
	}

	return wantedIndex;
}

// Skip the spaces at the slice boundary, so the text after the truncation character does not start with a space.
function getIndexAfterSpaces(visibleColumns, index) {
	while (visibleColumns[index] === ' ') {
		index++;
	}

	return index;
}

function validateInput(text, columns, position, truncationCharacter) {
	if (typeof text !== 'string') {
		throw new TypeError(`Expected \`input\` to be a string, got ${typeof text}`);
	}

	if (typeof columns !== 'number') {
		throw new TypeError(`Expected \`columns\` to be a number, got ${typeof columns}`);
	}

	if (!Number.isFinite(columns)) {
		throw new TypeError(`Expected \`columns\` to be a finite number, got ${columns}`);
	}

	if (!validPositions.has(position)) {
		throw new TypeError(`Expected \`options.position\` to be either \`start\`, \`middle\` or \`end\`, got ${position}`);
	}

	if (typeof truncationCharacter !== 'string') {
		throw new TypeError(`Expected \`options.truncationCharacter\` to be a string, got ${typeof truncationCharacter}`);
	}
}

export default function cliTruncate(text, columns, options = {}) {
	const {
		position = 'end',
		space = false,
		preferTruncationOnSpace = false,
	} = options;

	let {truncationCharacter = '…'} = options;

	validateInput(text, columns, position, truncationCharacter);

	if (columns < 1) {
		return '';
	}

	const length = stringWidth(text);

	if (length <= columns) {
		return text;
	}

	if (columns === 1) {
		return truncationCharacter;
	}

	// Look for spaces by column, as ANSI escape codes and wide characters would otherwise shift the indexes.
	const visibleColumns = preferTruncationOnSpace ? getVisibleColumns(text) : undefined;

	// ANSI escape sequence constants
	const ANSI = {
		ESC: 27,
		LEFT_BRACKET: 91,
		LETTER_M: 109,
	};

	const isSgrParameter = code => (code >= 48 && code <= 57) || code === 59; // 0-9 or ;

	function leadingSgrSpanEndIndex(string) {
		let index = 0;
		while (index + 2 < string.length && string.codePointAt(index) === ANSI.ESC && string.codePointAt(index + 1) === ANSI.LEFT_BRACKET) {
			let j = index + 2;
			while (j < string.length && isSgrParameter(string.codePointAt(j))) {
				j++;
			}

			if (j < string.length && string.codePointAt(j) === ANSI.LETTER_M) {
				index = j + 1;
				continue;
			}

			break;
		}

		return index;
	}

	function trailingSgrSpanStartIndex(string) {
		let start = string.length;
		while (start > 1 && string.codePointAt(start - 1) === ANSI.LETTER_M) {
			let j = start - 2;
			while (j >= 0 && isSgrParameter(string.codePointAt(j))) {
				j--;
			}

			if (j >= 1 && string.codePointAt(j - 1) === ANSI.ESC && string.codePointAt(j) === ANSI.LEFT_BRACKET) {
				start = j - 1;
				continue;
			}

			break;
		}

		return start;
	}

	function appendWithInheritedStyleFromEnd(visible, suffix) {
		const start = trailingSgrSpanStartIndex(visible);
		return start === visible.length
			? visible + suffix
			: visible.slice(0, start) + suffix + visible.slice(start);
	}

	function prependWithInheritedStyleFromStart(prefix, visible) {
		const end = leadingSgrSpanEndIndex(visible);
		return end === 0
			? prefix + visible
			: visible.slice(0, end) + prefix + visible.slice(end);
	}

	if (position === 'start') {
		if (preferTruncationOnSpace) {
			const nearestSpace = getIndexOfNearestSpace(visibleColumns, length - columns + stringWidth(truncationCharacter), true);
			const right = sliceAnsi(text, getIndexAfterSpaces(visibleColumns, nearestSpace), length);
			return prependWithInheritedStyleFromStart(truncationCharacter, right);
		}

		if (space) {
			truncationCharacter += ' ';
		}

		const right = sliceAnsi(text, length - columns + stringWidth(truncationCharacter), length);
		return prependWithInheritedStyleFromStart(truncationCharacter, right);
	}

	if (position === 'middle') {
		if (space) {
			truncationCharacter = ` ${truncationCharacter} `;

			// Drop the padding spaces if the padded character does not fit, so the
			// truncation character itself never exceeds the budget.
			if (stringWidth(truncationCharacter) >= columns) {
				truncationCharacter = truncationCharacter.trim();
			}
		}

		const truncationWidth = stringWidth(truncationCharacter);
		// Reserve room for the truncation character before splitting the budget
		// between the two sides, otherwise small budgets overflow (e.g. a width of
		// 4 was returned for `columns: 2`).
		const half = Math.min(Math.floor(columns / 2), Math.max(0, columns - truncationWidth));

		if (preferTruncationOnSpace) {
			const spaceNearFirstBreakPoint = getIndexOfNearestSpace(visibleColumns, half);
			const spaceNearSecondBreakPoint = getIndexOfNearestSpace(visibleColumns, length - (columns - half) + truncationWidth, true);
			return sliceAnsi(text, 0, spaceNearFirstBreakPoint) + truncationCharacter + sliceAnsi(text, getIndexAfterSpaces(visibleColumns, spaceNearSecondBreakPoint), length);
		}

		return (
			sliceAnsi(text, 0, half)
			+ truncationCharacter
			+ sliceAnsi(text, length - (columns - half) + truncationWidth, length)
		);
	}

	// `position === 'end'`, the only remaining valid value.
	if (preferTruncationOnSpace) {
		const nearestSpace = getIndexOfNearestSpace(visibleColumns, columns - stringWidth(truncationCharacter));
		const left = sliceAnsi(text, 0, nearestSpace);
		return appendWithInheritedStyleFromEnd(left, truncationCharacter);
	}

	if (space) {
		truncationCharacter = ` ${truncationCharacter}`;
	}

	const left = sliceAnsi(text, 0, columns - stringWidth(truncationCharacter));
	return appendWithInheritedStyleFromEnd(left, truncationCharacter);
}
