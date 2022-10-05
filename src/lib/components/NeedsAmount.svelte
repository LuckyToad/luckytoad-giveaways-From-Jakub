<script lang="ts">
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';
	import { ethBalance, projectBalance } from '$lib/stores/balances';
	import { contracts } from 'svelte-ethers-store';

	let amount = JSON.parse(sessionStorage.giveaway).giveaway_amount;
	let error: boolean;

	const isAmountValid = (): boolean => {
		error = false;
		let valid = true;

		if (!amount) error = true;
		if (amount < 0) error = true;
		if (typeof amount !== 'number') error = true;
		if ($giveaway.giveaway_type === 'ethereum' && amount > $ethBalance) error = true;
		if ($giveaway.giveaway_type === 'native-token' && amount > $projectBalance) error = true;

		return error ? (valid = !valid) : valid;
	};

	const handleBack = () => {
		$giveaway.giveaway_amount = 0;

		state.back();
	};

	const handleNext = () => {
		if (isAmountValid()) {
			$giveaway.giveaway_amount = amount;
			state.next();
		}
	};
</script>

<div class="flex flex-col gap-4 font-Inter">
	<h1 class="header">How much are you giving away?</h1>
	<h2 class="subheader">(In Tokens)</h2>

	<input bind:value={amount} on:input={isAmountValid} type="number" class="input-field" placeholder="Ex: 0.2 ETH" />

	<span class="text-brand-green-dark text-sm w-max">
		{#if $giveaway.giveaway_type === 'ethereum' && $ethBalance}
			max: {$ethBalance}
		{:else if $contracts.PROJECT && $projectBalance}
			max: {$projectBalance}
		{/if}
	</span>

	{#if error}
		<p class="invalid-error">Please enter a valid amount.</p>
	{/if}

	<div class="flex justify-center gap-4">
		<button on:click={handleBack} class="btn">Back</button>
		<button on:click={handleNext} class="btn">Continue</button>
	</div>
</div>

<style>
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
