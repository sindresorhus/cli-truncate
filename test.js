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
