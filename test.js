import test from 'ava';
import m from '.';

test(t => {
	t.is(m('unicorn', 4), 'uni…');
	t.is(m('unicorn', 4, {position: 'end'}), 'uni…');
	t.is(m('unicorn', 1), '…');
	t.is(m('unicorn', 0), '');
	t.is(m('unicorn', -4), '');
	t.is(m('unicorn', 20), 'unicorn');
	t.is(m('unicorn', 7), 'unicorn');
	t.is(m('unicorn', 6), 'unico…');
	t.is(m('\u001B[31municorn\u001B[39m', 7), '\u001B[31municorn\u001B[39m');
	t.is(m('\u001B[31municorn\u001B[39m', 1), '…');
	t.is(m('\u001B[31municorn\u001B[39m', 4), '\u001B[31muni\u001B[39m…');
	t.is(m('a\uD83C\uDE00b\uD83C\uDE00c', 5), 'a\uD83C\uDE00b\uD83C\uDE00…', 'surrogate pairs');
	t.is(m('안녕하세요', 3), '안…', 'wide char');
	t.is(m('unicorn', 5, {position: 'start'}), '…corn');
	t.is(m('unicorn', 6, {position: 'start'}), '…icorn');
	t.is(m('unicorn', 5, {position: 'middle'}), 'un…rn');
	t.is(m('unicorns', 6, {position: 'middle'}), 'uni…ns');
});
