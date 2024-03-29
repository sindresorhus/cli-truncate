import {expectType} from 'tsd';
import cliTruncate from './index.js';

expectType<string>(cliTruncate('unicorn', 4));
expectType<string>(cliTruncate('unicorn', 4, {position: 'start'}));
expectType<string>(cliTruncate('unicorn', 4, {position: 'middle'}));
expectType<string>(cliTruncate('unicorn', 4, {position: 'end'}));
expectType<string>(cliTruncate('unicorn', 4, {position: 'end', preferTruncationOnSpace: true}));
