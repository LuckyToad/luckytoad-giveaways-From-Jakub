import papa from 'papaparse';

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
