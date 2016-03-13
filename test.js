import test from 'ava';
import m from './';

// because of https://github.com/chalk/slice-ansi/issues/6
const mootEscapes = '\u001b[31m\u001b[31m\u001b[31m\u001b[31m';

test(t => {
	t.is(m('unicorn', 4), 'uni…');
	t.is(m('unicorn', 1), '…');
	t.is(m('unicorn', 0), '');
	t.is(m('unicorn', -4), '');
	t.is(m('unicorn', 20), 'unicorn');
	t.is(m('unicorn', 7), 'unicorn');
	t.is(m('unicorn', 6), 'unico…');
	t.is(m('\u001b[31municorn\u001b[39m', 7), '\u001b[31municorn\u001b[39m');
	t.is(m('\u001b[31municorn\u001b[39m', 1), '…');
	t.is(m('\u001b[31municorn\u001b[39m', 4), mootEscapes + '\u001b[31muni\u001b[39m…');
	// TODO
	t.skip.is(m('a\ud83c\ude00b\ud83c\ude00c', 5), 'a\ud83c\ude00b…', 'surrogate pairs');
	t.skip.is(m('안녕하세요', 3), '안…', 'wide char');
});
