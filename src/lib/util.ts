import papa from 'papaparse';
import { giveaway } from '$lib/stores/giveaway';

export const processFile = (files) => {
	return new Promise((resolve, reject) => {
		papa.parse(files, {
			delimiter: '', // auto-detect
			newline: '', // auto-detect
			quoteChar: '"',
			escapeChar: '"',
			header: true,
			dynamicTyping: false,
			preview: 0,
			encoding: '',
			worker: false,
			comments: false,
			step: undefined,
			skipEmptyLines: true,
			delimitersToGuess: [',', '\t', '|', ';', papa.RECORD_SEP, papa.UNIT_SEP],
			error: (e) => reject(e),
			complete: function (results) {
				resolve(results.data);
			}
		});
	});
};

export const findWinners = async () =>
	giveaway.update(($giveaway) => {
		// logic for determining winners...
		let winners = new Set();
		while (winners.size !== $giveaway.no_winners) {
			const random = Math.floor(Math.random() * $giveaway.participants.length);
			winners.add($giveaway.participants[random]);
		}

		winners.forEach((winner) => {
			winner.hash = '';
			winner.amount = ($giveaway.amount / $giveaway.no_winners).toFixed(2);
		});

		// update the giveaway...
		$giveaway.winners = Array.from(winners);
		$giveaway.round++;
		return $giveaway;
	});
