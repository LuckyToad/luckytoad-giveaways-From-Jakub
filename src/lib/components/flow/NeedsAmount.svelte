<script lang="ts">
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';
	import { ethBalance, projectBalance } from '$lib/stores/balances';
	import { contracts } from 'svelte-ethers-store';

	let amount = JSON.parse(sessionStorage.giveaway).amount == 0 ? '' : JSON.parse(sessionStorage.giveaway).amount;
	let error: boolean;

	const isAmountValid = (): boolean => {
		error = false;
		let valid = true;

		if (!amount) error = true;
		if (amount <= 0) error = true;
		if (typeof amount !== 'number') error = true;
		if ($giveaway.type === 'ethereum' && amount > $ethBalance) error = true;
		if ($giveaway.type === 'native-token' && amount > $projectBalance) error = true;

		return error ? (valid = !valid) : valid;
	};

	const handleBack = () => {
		$giveaway.amount = 0;
		if ($giveaway.type == 'ethereum') $giveaway.currency = '';
		state.back();
	};

	const handleNext = () => {
		if (isAmountValid()) {
			$giveaway.amount = amount;
			state.next();
		}
	};
</script>

<div class="flex flex-col items-center gap-4 font-Inter w-full">
	<h1 class="header">How much are you giving away?</h1>

	<input bind:value={amount} on:input={isAmountValid} type="number" class="input-field" class:input-field-valid={!error} class:input-field-invalid={error} placeholder="Ex: 0.2 {$giveaway.currency}" />
	{#if error}
		<p class="invalid-error">Please enter a valid amount.</p>
	{/if}

	<p class="text-brand-green-dark text-sm text-center">
		{#if $giveaway.type === 'ethereum' && $ethBalance}
			max: {$ethBalance}
		{:else if $contracts.PROJECT && $projectBalance}
			max: {$projectBalance}
		{/if}
	</p>

	<div class="flex flex-col md:flex-row-reverse justify-center items-center gap-4 w-full">
		<button on:click={handleNext} class="btn">Continue</button>
		<button on:click={handleBack} class="btn-outline">Back</button>
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
