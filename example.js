// Run: node example.js
import cliTruncate from './index.js';

const rainbow = text => {
	const codes = [31, 33, 32, 36, 34, 35];
	return [...text].map((ch, i) => `\u{1B}[${codes[i % codes.length]}m${ch}\u{1B}[39m`).join('');
};

const title = '\u{1B}[35m🦄 Unicorn Gazette\u{1B}[39m';
const desc = '\u{1B}[2m gallops through a meadow of sparkles and rainbows while sipping glitter-latte \u{1B}[22m'.repeat(3);
const fancy = `${title} ${rainbow('magical news:')} ${desc}`;

const width = 30;

console.log('End truncation (styled ellipsis):');
console.log(cliTruncate(fancy, width));
console.log();

console.log('Start truncation (styled ellipsis):');
console.log(cliTruncate(fancy, width, {position: 'start'}));
console.log();

console.log('Middle truncation (classic):');
console.log(cliTruncate(fancy, width, {position: 'middle'}));
