import test from 'ava';
import cliTruncate from './index.js';

test('main', t => {
	t.is(cliTruncate('unicorn', 4), 'uni…');
	t.is(cliTruncate('unicorn', 4, {position: 'end'}), 'uni…');
	t.is(cliTruncate('unicorn', 1), '…');
	t.is(cliTruncate('unicorn', 0), '');
	t.is(cliTruncate('unicorn', -4), '');
	t.is(cliTruncate('unicorn', 20), 'unicorn');
	t.is(cliTruncate('unicorn', 7), 'unicorn');
	t.is(cliTruncate('unicorn', 6), 'unico…');
	t.is(cliTruncate('\u001B[31municorn\u001B[39m', 7), '\u001B[31municorn\u001B[39m');
	t.is(cliTruncate('\u001B[31municorn\u001B[39m', 1), '…');
	t.is(cliTruncate('\u001B[31municorn\u001B[39m', 4), '\u001B[31muni…\u001B[39m');
	t.is(cliTruncate('a\uD83C\uDE00b\uD83C\uDE00c', 5), 'a\uD83C\uDE00b…', 'surrogate pairs');
	t.is(cliTruncate('안녕하세요', 3), '안…', 'wide char');
	t.is(cliTruncate('unicorn', 5, {position: 'start'}), '…corn');
	t.is(cliTruncate('unicorn', 6, {position: 'start'}), '…icorn');
	t.is(cliTruncate('unicorn', 5, {position: 'middle'}), 'un…rn');
	t.is(cliTruncate('unicorns', 6, {position: 'middle'}), 'uni…ns');
});

test('space option', t => {
	t.is(cliTruncate('unicorns', 5, {position: 'end', space: true}), 'uni …');
	t.is(cliTruncate('unicorns', 6, {position: 'start', space: true}), '… orns');
	t.is(cliTruncate('unicorns', 7, {position: 'middle', space: true}), 'uni … s');
	t.is(cliTruncate('unicorns', 5, {position: 'end', space: false}), 'unic…');
	t.is(cliTruncate('\u001B[31municorn\u001B[39m', 6, {space: true}), '\u001B[31munic …\u001B[39m');
	t.is(cliTruncate('Plant a tree every day.', 14, {space: true}), 'Plant a tree …');
	t.is(cliTruncate('안녕하세요', 4, {space: true}), '안 …', 'wide char');
	t.is(cliTruncate('\u001B[31municorn\u001B[39m', 6, {position: 'start', space: true}), '\u001B[31m… corn\u001B[39m');
	t.is(cliTruncate('\u001B[31municornsareawesome\u001B[39m', 10, {position: 'middle', space: true}), '\u001B[31munico\u001B[39m … \u001B[31mme\u001B[39m');
	t.is(cliTruncate('Plant a tree every day.', 14, {position: 'middle', space: true}), 'Plant a … day.');
	t.is(cliTruncate('안녕하세요', 4, {position: 'start', space: true}), '… 요', 'wide char');
});

test('preferTruncationOnSpace option', t => {
	t.is(cliTruncate('unicorns are awesome', 15, {position: 'start', preferTruncationOnSpace: true}), '…are awesome');
	t.is(cliTruncate('dragons are awesome', 15, {position: 'end', preferTruncationOnSpace: true}), 'dragons are…');
	t.is(cliTruncate('unicorns rainbow dragons', 6, {position: 'start', preferTruncationOnSpace: true}), '…agons');
	t.is(cliTruncate('unicorns rainbow dragons', 6, {position: 'end', preferTruncationOnSpace: true}), 'unico…');
	t.is(cliTruncate('unicorns rainbow dragons', 6, {position: 'middle', preferTruncationOnSpace: true}), 'uni…ns');
	t.is(cliTruncate('unicorns partying with dragons', 20, {position: 'middle', preferTruncationOnSpace: true}), 'unicorns…dragons');
});

test('truncationCharacter option', t => {
	t.is(cliTruncate('unicorns', 5, {position: 'end', truncationCharacter: '.'}), 'unic.');
	t.is(cliTruncate('unicorns', 5, {position: 'start', truncationCharacter: '.'}), '.orns');
	t.is(cliTruncate('unicorns', 5, {position: 'middle', truncationCharacter: '.'}), 'un.ns');
	t.is(cliTruncate('unicorns', 5, {position: 'end', truncationCharacter: '.', space: true}), 'uni .');
	t.is(cliTruncate('unicorns', 5, {position: 'end', truncationCharacter: ' .'}), 'uni .');
	t.is(cliTruncate('unicorns partying with dragons', 20, {position: 'middle', truncationCharacter: '.', preferTruncationOnSpace: true}), 'unicorns.dragons');
	t.is(cliTruncate('안녕하세요', 4, {position: 'start', space: true, truncationCharacter: '.'}), '. 요', 'wide char');
	t.is(cliTruncate('\u001B[31municornsareawesome\u001B[39m', 10, {position: 'middle', space: true, truncationCharacter: '.'}), '\u001B[31munico\u001B[39m . \u001B[31mme\u001B[39m');
});

test('custom truncation character inherits style (end/start)', t => {
	const red = '\u001B[31m';
	const reset = '\u001B[39m';
	const text = `${red}unicorns${reset}`;
	const endOut = cliTruncate(text, 5, {truncationCharacter: '.'});
	const startOut = cliTruncate(text, 5, {position: 'start', truncationCharacter: '.'});
	t.true(endOut.startsWith(red));
	t.true(endOut.includes('.'));
	t.true(endOut.endsWith(reset));
	t.true(startOut.startsWith(red));
	t.true(startOut.includes('.'));
	t.true(startOut.endsWith(reset));
});

test('styled truncation character inherits for start and end', t => {
	const red = '\u001B[31m';
	const cyan = '\u001B[36m';
	const reset = '\u001B[39m';

	// Test end position
	const endText = `${red}unicorns${reset}`;
	const endOut = cliTruncate(endText, 5);
	t.is(endOut, `${red}unic…${reset}`);

	// Test start position
	const startText = `hello ${cyan}unicorns${reset}`;
	const startOut = cliTruncate(startText, 5, {position: 'start'});
	t.true(startOut.startsWith(cyan));
	t.true(startOut.includes('…'));
	t.true(startOut.endsWith(reset));
});

test('edge cases', t => {
	// Empty string
	t.is(cliTruncate('', 5), '');

	// Whitespace only
	t.is(cliTruncate('     ', 3), '  …');

	// Multiple ANSI codes
	const multiAnsi = '\u001B[31m\u001B[1municorns\u001B[22m\u001B[39m';
	t.is(cliTruncate(multiAnsi, 5), '\u001B[31m\u001B[1munic…\u001B[22m\u001B[39m');

	// Columns = 2
	t.is(cliTruncate('test', 2), 't…');

	// Very long truncation character
	t.is(cliTruncate('unicorns', 5, {truncationCharacter: '...'}), 'un...');
});

test('preserves ANSI escape codes at the end - issue #24', t => {
	const red = '\u001B[31m';
	const reset = '\u001B[39m';

	// Text with ANSI codes at the end
	const text = `Hello ${red}World${reset}`;

	// When not truncated, preserve everything
	t.is(cliTruncate(text, 11), `Hello ${red}World${reset}`);

	// When truncated at the end, ellipsis should inherit the style
	t.is(cliTruncate(text, 8), `Hello ${red}W…${reset}`);

	// When truncated at start
	t.is(cliTruncate(text, 8, {position: 'start'}), `…o ${red}World${reset}`);

	// Text ending with reset only
	const textEndingWithReset = `Hello World${reset}`;
	t.is(cliTruncate(textEndingWithReset, 11), `Hello World${reset}`);
	t.is(cliTruncate(textEndingWithReset, 8), 'Hello W…');
});
