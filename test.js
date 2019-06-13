import test from 'ava';
import cliTruncate from '.';

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
	t.is(cliTruncate('\u001B[31municorn\u001B[39m', 4), '\u001B[31muni\u001B[39m…');
	t.is(cliTruncate('a\uD83C\uDE00b\uD83C\uDE00c', 5), 'a\uD83C\uDE00b\uD83C\uDE00…', 'surrogate pairs');
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
	t.is(cliTruncate('\u001B[31municorn\u001B[39m', 6, {space: true}), '\u001B[31munic\u001B[39m …');
	t.is(cliTruncate('Plant a tree every day.', 14, {space: true}), 'Plant a tree …');
	t.is(cliTruncate('안녕하세요', 4, {space: true}), '안 …', 'wide char');
	t.is(cliTruncate('\u001B[31municorn\u001B[39m', 6, {position: 'start', space: true}), '… \u001B[31mcorn\u001B[39m');
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
