<script lang="ts">
	import state from '$lib/stores/fsm';
	import { processFile } from '$lib/util';

	let files: any;
</script>

<div class="flex flex-col gap-2">
	<div>
		<p class="block mb-2 text-sm font-medium text-white">Please upload your spreadsheet with a list of participants and entries.</p>

		<input bind:files class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
		<p class="mt-1 text-sm text-white">CSV, .sheet, .excel.</p>
	</div>

	<div class="flex justify-between text-white">
		<button on:click={state.back}>Back</button>
		<button on:click={async () => await processFile(files)} class="text-white">LOG RESULTS</button>
		<!-- <button on:click={state.next}>Continue</button> -->
	</div>
</div>
