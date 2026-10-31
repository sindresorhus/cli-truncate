import {stripVTControlCharacters} from 'node:util';
import test from 'node:test';
import assert from 'node:assert/strict';
import stringWidth from 'string-width';
import cliTruncate from './index.js';

/* eslint-disable node-test/no-conditional-assertion -- The loops in this file are table-driven, so every assertion always runs. */

// `assert.throws` only duck-types `name`, so a plain object or a same-named class
// would pass. The predicate keeps the `instanceof TypeError` check AVA had.
const throwsTypeError = message => error => error instanceof TypeError && error.message === message;

test('truncates text to the given number of columns', () => {
	assert.equal(cliTruncate('unicorn', 4), 'uni…');
	assert.equal(cliTruncate('unicorn', 4, {position: 'end'}), 'uni…');
	assert.equal(cliTruncate('unicorn', 1), '…');
	assert.equal(cliTruncate('unicorn', 0), '');
	assert.equal(cliTruncate('unicorn', -4), '');
	assert.equal(cliTruncate('unicorn', 20), 'unicorn');
	assert.equal(cliTruncate('unicorn', 7), 'unicorn');
	assert.equal(cliTruncate('unicorn', 6), 'unico…');
	assert.equal(cliTruncate('\u{1B}[31municorn\u{1B}[39m', 7), '\u{1B}[31municorn\u{1B}[39m');
	assert.equal(cliTruncate('\u{1B}[31municorn\u{1B}[39m', 1), '…');
	assert.equal(cliTruncate('\u{1B}[31municorn\u{1B}[39m', 4), '\u{1B}[31muni…\u{1B}[39m');
	assert.equal(cliTruncate('a\u{1F200}b\u{1F200}c', 5), 'a\u{1F200}b…', 'surrogate pairs');
	assert.equal(cliTruncate('안녕하세요', 3), '안…', 'wide char');
	assert.equal(cliTruncate('unicorn', 5, {position: 'start'}), '…corn');
	assert.equal(cliTruncate('unicorn', 6, {position: 'start'}), '…icorn');
	assert.equal(cliTruncate('unicorn', 5, {position: 'middle'}), 'un…rn');
	assert.equal(cliTruncate('unicorns', 6, {position: 'middle'}), 'uni…ns');
	assert.equal(cliTruncate('u', 1), 'u');
});

test('throws on non-finite columns', () => {
	for (const columns of [NaN, Infinity, -Infinity]) {
		assert.throws(() => {
			cliTruncate('unicorns', columns);
		}, throwsTypeError(`Expected \`columns\` to be a finite number, got ${columns}`));
	}
});

test('validates the position option', () => {
	for (const text of ['u', 'unicorns']) {
		assert.throws(() => {
			cliTruncate(text, 20, {position: 'sideways'});
		}, throwsTypeError('Expected `options.position` to be either `start`, `middle` or `end`, got sideways'));
	}
});

test('space option', () => {
	assert.equal(cliTruncate('unicorns', 5, {position: 'end', space: true}), 'uni …');
	assert.equal(cliTruncate('unicorns', 6, {position: 'start', space: true}), '… orns');
	assert.equal(cliTruncate('unicorns', 7, {position: 'middle', space: true}), 'uni … s');
	assert.equal(cliTruncate('unicorns', 5, {position: 'end', space: false}), 'unic…');
	assert.equal(cliTruncate('\u{1B}[31municorn\u{1B}[39m', 6, {space: true}), '\u{1B}[31munic …\u{1B}[39m');
	assert.equal(cliTruncate('Plant a tree every day.', 14, {space: true}), 'Plant a tree …');
	assert.equal(cliTruncate('안녕하세요', 4, {space: true}), '안 …', 'wide char');
	assert.equal(cliTruncate('\u{1B}[31municorn\u{1B}[39m', 6, {position: 'start', space: true}), '\u{1B}[31m… corn\u{1B}[39m');
	assert.equal(cliTruncate('\u{1B}[31municornsareawesome\u{1B}[39m', 10, {position: 'middle', space: true}), '\u{1B}[31munico\u{1B}[39m … \u{1B}[31mme\u{1B}[39m');
	assert.equal(cliTruncate('Plant a tree every day.', 14, {position: 'middle', space: true}), 'Plant a … day.');
	assert.equal(cliTruncate('안녕하세요', 4, {position: 'start', space: true}), '… 요', 'wide char');

	// `middle` + `space` must stay within the budget for small widths
	assert.equal(cliTruncate('unicorns', 2, {position: 'middle', space: true}), 'u…');
	assert.equal(cliTruncate('unicorns', 3, {position: 'middle', space: true}), 'u…s');
	for (const columns of [2, 3, 4, 5, 6, 7]) {
		assert.ok(stringWidth(cliTruncate('unicorns', columns, {position: 'middle', space: true})) <= columns, `width <= ${columns}`);
	}
});

test('preferTruncationOnSpace respects a multi-column truncation character', () => {
	const text = 'unicorns are awesome dragons here today';

	assert.equal(cliTruncate(text, 6, {position: 'end', preferTruncationOnSpace: true, truncationCharacter: '...'}), 'uni...');
	assert.equal(cliTruncate(text, 6, {position: 'start', preferTruncationOnSpace: true, truncationCharacter: '...'}), '...day');

	for (const position of ['start', 'end']) {
		for (let columns = 4; columns <= 20; columns++) {
			const result = cliTruncate(text, columns, {position, preferTruncationOnSpace: true, truncationCharacter: '...'});
			assert.ok(stringWidth(result) <= columns, `${position}: width ${stringWidth(result)} exceeds ${columns} for "${result}"`);
		}
	}
});

test('preferTruncationOnSpace option', () => {
	assert.equal(cliTruncate('unicorns are awesome', 15, {position: 'start', preferTruncationOnSpace: true}), '…are awesome');
	assert.equal(cliTruncate('dragons are awesome', 15, {position: 'end', preferTruncationOnSpace: true}), 'dragons are…');
	assert.equal(cliTruncate('unicorns rainbow dragons', 6, {position: 'start', preferTruncationOnSpace: true}), '…agons');
	assert.equal(cliTruncate('unicorns rainbow dragons', 6, {position: 'end', preferTruncationOnSpace: true}), 'unico…');
	assert.equal(cliTruncate('unicorns rainbow dragons', 6, {position: 'middle', preferTruncationOnSpace: true}), 'uni…ns');
	assert.equal(cliTruncate('unicorns partying with dragons', 20, {position: 'middle', preferTruncationOnSpace: true}), 'unicorns…dragons');

	// `middle` + `space` + `preferTruncationOnSpace` must stay within the budget
	assert.equal(cliTruncate('unicorns', 4, {position: 'middle', space: true, preferTruncationOnSpace: true}), 'u … ');
	for (const columns of [2, 3, 4, 5, 6, 7]) {
		assert.ok(stringWidth(cliTruncate('unicorns', columns, {position: 'middle', space: true, preferTruncationOnSpace: true})) <= columns, `width <= ${columns}`);
	}
});

test('preferTruncationOnSpace picks the same word boundaries for styled text', () => {
	const red = '\u{1B}[31m';
	const reset = '\u{1B}[39m';
	const bold = '\u{1B}[1m';
	const boldReset = '\u{1B}[22m';
	const link = '\u{1B}]8;;https://sindresorhus.com\u{7}';
	const linkReset = '\u{1B}]8;;\u{7}';
	const text = 'unicorns are  awesome dragons';
	const styledTexts = [
		`${red}unicorns${reset} are  ${red}awesome${reset} dragons`,
		`unicorns${red} are  awesome ${reset}dragons`,
		`${bold}${red}unicorns are${reset}${boldReset}  awesome${red}${reset} dragons`,
		`unicorns ${link}are  awesome${linkReset} dragons`,
	];

	for (const styledText of styledTexts) {
		for (const position of ['start', 'middle', 'end']) {
			for (const extraOptions of [{}, {space: true}, {truncationCharacter: '...'}]) {
				for (let columns = 4; columns < stringWidth(text); columns++) {
					const options = {position, preferTruncationOnSpace: true, ...extraOptions};
					const result = cliTruncate(styledText, columns, options);
					const message = `${JSON.stringify(styledText)} ${JSON.stringify(options)} columns: ${columns}`;
					assert.equal(stripVTControlCharacters(result), cliTruncate(text, columns, options), message);
					assert.ok(stringWidth(result) <= columns, message);
				}
			}
		}
	}
});

test('preferTruncationOnSpace keeps the styling of styled text', () => {
	const red = '\u{1B}[31m';
	const reset = '\u{1B}[39m';
	const text = `${red}unicorns are awesome${reset}`;

	assert.equal(cliTruncate(text, 15, {position: 'start', preferTruncationOnSpace: true}), `${red}…are awesome${reset}`);
	assert.equal(cliTruncate(text, 15, {position: 'middle', preferTruncationOnSpace: true}), `${red}unicorn${reset}…${red}awesome${reset}`);
	assert.equal(cliTruncate(text, 15, {position: 'end', preferTruncationOnSpace: true}), `${red}unicorns are…${reset}`);
});

test('preferTruncationOnSpace picks word boundaries by column for wide characters', () => {
	assert.equal(cliTruncate('你好世界你好 are awesome', 18, {position: 'end', preferTruncationOnSpace: true}), '你好世界你好 are…');
	assert.equal(cliTruncate('你好世界你好 are awesome', 10, {position: 'start', preferTruncationOnSpace: true}), '…awesome');
	assert.equal(cliTruncate('你好世界你好 are awesome', 18, {position: 'middle', preferTruncationOnSpace: true}), '你好世界…awesome');

	// Combining marks use more string indexes than columns, which shifts the indexes the other way.
	const precomposed = 'café crème brûlée unicorns';
	const decomposed = precomposed.normalize('NFD');
	for (const position of ['start', 'middle', 'end']) {
		for (let columns = 4; columns < stringWidth(precomposed); columns++) {
			const options = {position, preferTruncationOnSpace: true};
			assert.equal(cliTruncate(decomposed, columns, options).normalize('NFC'), cliTruncate(precomposed, columns, options), `${position}: ${columns}`);
		}
	}
});

test('preferTruncationOnSpace counts zero-width characters as no columns', () => {
	assert.equal(cliTruncate('ab\tcd ef gh ij kl mn', 6, {position: 'end', preferTruncationOnSpace: true}), 'ab\tcd…');
	assert.equal(cliTruncate('ab\tcd ef gh ij kl mn', 3, {position: 'start', preferTruncationOnSpace: true}), '…mn');
	assert.equal(cliTruncate('ab\u{200B}cd ef gh ij kl', 6, {position: 'end', preferTruncationOnSpace: true}), 'ab\u{200B}cd…');
});

test('preferTruncationOnSpace keeps trailing spaces the same for plain and styled text', () => {
	const red = '\u{1B}[31m';
	const reset = '\u{1B}[39m';
	const text = 'unicorns are awesome  ';

	assert.equal(cliTruncate(text, 14, {position: 'start', preferTruncationOnSpace: true}), '…awesome  ');
	assert.equal(cliTruncate(text, 14, {position: 'middle', preferTruncationOnSpace: true}), 'unicorn…some  ');
	assert.equal(cliTruncate(`${red}${text}${reset}`, 14, {position: 'start', preferTruncationOnSpace: true}), `${red}…awesome  ${reset}`);
	assert.equal(cliTruncate(`${red}${text}${reset}`, 14, {position: 'middle', preferTruncationOnSpace: true}), `${red}unicorn${reset}…${red}some  ${reset}`);
});

test('truncationCharacter option', () => {
	assert.equal(cliTruncate('unicorns', 5, {position: 'end', truncationCharacter: '.'}), 'unic.');
	assert.equal(cliTruncate('unicorns', 5, {position: 'start', truncationCharacter: '.'}), '.orns');
	assert.equal(cliTruncate('unicorns', 5, {position: 'middle', truncationCharacter: '.'}), 'un.ns');
	assert.equal(cliTruncate('unicorns', 5, {position: 'end', truncationCharacter: '.', space: true}), 'uni .');
	assert.equal(cliTruncate('unicorns', 5, {position: 'end', truncationCharacter: ' .'}), 'uni .');
	assert.equal(cliTruncate('unicorns partying with dragons', 20, {position: 'middle', truncationCharacter: '.', preferTruncationOnSpace: true}), 'unicorns.dragons');
	assert.equal(cliTruncate('안녕하세요', 4, {position: 'start', space: true, truncationCharacter: '.'}), '. 요', 'wide char');
	assert.equal(cliTruncate('\u{1B}[31municornsareawesome\u{1B}[39m', 10, {position: 'middle', space: true, truncationCharacter: '.'}), '\u{1B}[31munico\u{1B}[39m . \u{1B}[31mme\u{1B}[39m');
	for (const columns of [0, 1, 20]) {
		assert.throws(() => {
			cliTruncate('unicorns', columns, {truncationCharacter: 1});
		}, throwsTypeError('Expected `options.truncationCharacter` to be a string, got number'));
	}
});

test('custom truncation character inherits style (end/start)', () => {
	const red = '\u{1B}[31m';
	const reset = '\u{1B}[39m';
	const text = `${red}unicorns${reset}`;
	const endOut = cliTruncate(text, 5, {truncationCharacter: '.'});
	const startOut = cliTruncate(text, 5, {position: 'start', truncationCharacter: '.'});
	assert.ok(endOut.startsWith(red));
	assert.ok(endOut.includes('.'));
	assert.ok(endOut.endsWith(reset));
	assert.ok(startOut.startsWith(red));
	assert.ok(startOut.includes('.'));
	assert.ok(startOut.endsWith(reset));
});

test('styled truncation character inherits for start and end', () => {
	const red = '\u{1B}[31m';
	const cyan = '\u{1B}[36m';
	const reset = '\u{1B}[39m';

	// Test end position
	const endText = `${red}unicorns${reset}`;
	const endOut = cliTruncate(endText, 5);
	assert.equal(endOut, `${red}unic…${reset}`);

	// Test start position
	const startText = `hello ${cyan}unicorns${reset}`;
	const startOut = cliTruncate(startText, 5, {position: 'start'});
	assert.ok(startOut.startsWith(cyan));
	assert.ok(startOut.includes('…'));
	assert.ok(startOut.endsWith(reset));
});

test('edge cases', () => {
	// Empty string
	assert.equal(cliTruncate('', 5), '');

	// Whitespace only
	assert.equal(cliTruncate(' '.repeat(5), 3), '  …');

	// Multiple ANSI codes
	const multiAnsi = '\u{1B}[31m\u{1B}[1municorns\u{1B}[22m\u{1B}[39m';
	assert.equal(cliTruncate(multiAnsi, 5), '\u{1B}[31m\u{1B}[1munic…\u{1B}[22m\u{1B}[39m');

	// Columns = 2
	assert.equal(cliTruncate('test', 2), 't…');

	// Very long truncation character
	assert.equal(cliTruncate('unicorns', 5, {truncationCharacter: '...'}), 'un...');
});

test('preserves ANSI escape codes at the end - issue #24', () => {
	const red = '\u{1B}[31m';
	const reset = '\u{1B}[39m';

	// Text with ANSI codes at the end
	const text = `Hello ${red}World${reset}`;

	// When not truncated, preserve everything
	assert.equal(cliTruncate(text, 11), `Hello ${red}World${reset}`);

	// When truncated at the end, ellipsis should inherit the style
	assert.equal(cliTruncate(text, 8), `Hello ${red}W…${reset}`);

	// When truncated at start
	assert.equal(cliTruncate(text, 8, {position: 'start'}), `…o ${red}World${reset}`);

	// Text ending with reset only
	const textEndingWithReset = `Hello World${reset}`;
	assert.equal(cliTruncate(textEndingWithReset, 11), `Hello World${reset}`);
	assert.equal(cliTruncate(textEndingWithReset, 8), 'Hello W…');
});

test('wide characters should not exceed maxWidth - issue #28', () => {
	const cjk = 'あいうえおかきくけこ|end';

	for (let columns = 1; columns <= 25; columns++) {
		const result = cliTruncate(cjk, columns);
		assert.ok(stringWidth(result) <= columns, `end: width ${stringWidth(result)} exceeds maxWidth ${columns} for result "${result}"`);
	}

	for (let columns = 1; columns <= 25; columns++) {
		const result = cliTruncate(cjk, columns, {position: 'start'});
		assert.ok(stringWidth(result) <= columns, `start: width ${stringWidth(result)} exceeds maxWidth ${columns} for result "${result}"`);
	}

	for (let columns = 1; columns <= 25; columns++) {
		const result = cliTruncate(cjk, columns, {position: 'middle'});
		assert.ok(stringWidth(result) <= columns, `middle: width ${stringWidth(result)} exceeds maxWidth ${columns} for result "${result}"`);
	}
});
/* eslint-enable node-test/no-conditional-assertion */
