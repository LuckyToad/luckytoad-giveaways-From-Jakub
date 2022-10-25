<script lang="ts">
	import 'iconify-icon';
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';
	import { processFile } from '$lib/util';

	let files, input;
	let error: boolean;

	const isSpreadsheetValid = (): boolean => {
		error = false;
		let valid = true;

		// if (!amount) error = true;
		// if (amount < 0) error = true;
		// if (typeof amount !== 'number') error = true;
		// if ($giveaway.type === 'ethereum' && amount > $ethBalance) error = true;
		// if ($giveaway.type === 'native-token' && amount > $projectBalance) error = true;

		return error ? (valid = !valid) : valid;
	};

	const clearInput = () => {
		input.value = '';
		files = null;
	};

	const handleBack = () => {
		$giveaway.participants = [];

		state.back();
	};

	const handleNext = async () => {
		$giveaway.participants = await processFile(files[0]);
		state.next();
	};
</script>

<div class="flex flex-col gap-4 items-center font-Inter w-full">
	<div>
		<h1 class="header">Upload your spreadsheet</h1>
		<h2 class="subheader">Spreadsheet MUST include a list of participant wallets and number of entries</h2>
	</div>

	<label class:hidden={files} class="btn cursor-pointer">
		<input bind:files bind:this={input} class="hidden" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
		<p class="">Choose File</p>
	</label>

	{#if input && files?.[0]}
		<div class="flex justify-between rounded-md border border-brand-lemon-dark w-full md:w-1/2 overflow-hidden">
			<p class="text-brand-green-dark font-bold text-xl px-4 py-3 truncate">{files[0].name}</p>

			<button class="bg-brand-red flex items-center justify-center" on:click={clearInput}>
				<iconify-icon icon="akar-icons:cross" height={'20px'} class="text-brand-white p-4" />
			</button>
		</div>
	{/if}

	<p class="font-normal text-xs text-brand-green-dark">Accepted file types include: .CSV, .sheet, .excel</p>

	<div class="flex flex-col md:flex-row-reverse justify-center items-center gap-4 w-full">
		{#if input && files?.[0]}
			<button on:click={handleNext} class="btn">Find {$giveaway.no_winners > 1 ? 'winners' : 'winner'}</button>
		{/if}
		<button on:click={handleBack} class="btn-outline">Back</button>
	</div>
</div>
