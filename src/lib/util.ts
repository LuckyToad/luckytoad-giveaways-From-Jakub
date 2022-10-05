import papa from 'papaparse';
import { giveaway } from '$lib/stores/giveaway';
import { get } from 'svelte/store';

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

export const findWinner = async () => {
	const giveawayStore = get(giveaway);
	const participants = giveawayStore.participants;
	const random = Math.floor(Math.random() * giveawayStore.participants.length);
	const winner = participants[random];

	giveaway.update((giveaway) => ({
		...giveaway,
		winner,
		round: giveaway.round + 1
	}));

	console.log(get(giveaway));

	return winner;
};
