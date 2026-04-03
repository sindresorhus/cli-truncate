import {expectType} from 'tsd';
import cliTruncate from './index.js';

expectType(cliTruncate('unicorn', 4));
expectType(cliTruncate('unicorn', 4, {position: 'start'}));
expectType(cliTruncate('unicorn', 4, {position: 'middle'}));
expectType(cliTruncate('unicorn', 4, {position: 'end'}));
expectType(cliTruncate('unicorn', 4, {position: 'end', preferTruncationOnSpace: true}));
