<script type="ts">
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';
	import { contracts } from 'svelte-ethers-store';

	let winners = JSON.parse(sessionStorage.giveaway).no_winners == 0 ? '' : JSON.parse(sessionStorage.giveaway).no_winners;
	let error: boolean;

	const isWinnersValid = (): boolean => {
		error = false;
		let valid = true;

		if (!winners) error = true;
		if (winners < 0) error = true;
		if (typeof winners !== 'number') error = true;

		return error ? (valid = !valid) : valid;
	};

	const handleBack = () => {
		$giveaway.no_winners = 0;

		state.back();
	};

	const handleNext = () => {
		if (isWinnersValid()) {
			$giveaway.no_winners = winners;
			state.next();
		}
	};
</script>

<div class="flex flex-col gap-4 font-Inter">
	<h1 class="header">How many winners will there be?</h1>

	<input bind:value={winners} on:input={isWinnersValid} type="number" class:input-field-valid={!error} class:input-field-invalid={error} placeholder="Ex: 1, 2, 3, etc..." />
	{#if error}
		<p class="invalid-error">Please enter a valid number of winners.</p>
	{/if}

	<div class="flex justify-center gap-4">
		<button on:click={handleBack} class="btn-outline">Back</button>
		<button on:click={handleNext} class="btn">Continue</button>
	</div>
</div>

<style>
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
</style>
