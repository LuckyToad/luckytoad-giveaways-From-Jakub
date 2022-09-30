<script lang="ts">
	import { state } from '$lib/stores/stateMachine';
	import { giveaway } from '$lib/stores/giveaway';

	let giveawayAmount = JSON.parse(sessionStorage.giveaway).giveaway_amount;
	let error: boolean;

	const isAmountValid = (): boolean => {
		error = false;
		let valid = true;

		if (!giveawayAmount) error = true;
		if (giveawayAmount < 0) error = true;
		if (typeof giveawayAmount !== 'number') error = true;

		// if amount is valid, update giveaway store
		if (!error) $giveaway.giveaway_amount = giveawayAmount;

		return error ? (valid = !valid) : valid;
	};
</script>

<div class="flex flex-col gap-2">
	<div>
		<p class="block mb-2 text-sm font-medium text-white">Please enter your giveaway amount in tokens.</p>

		<input bind:value={giveawayAmount} on:change={isAmountValid} type="number" class="text-white border-2 rounded-md px-2 py-1 bg-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-white w-full" />

		{#if error}
			<p class="text-red-500 text-xs mt-1">Please enter a valid amount.</p>
		{/if}
	</div>

	<div class="flex justify-between text-white">
		<button on:click={state.back}>Back</button>
		<button on:click={() => state.next(isAmountValid)}>Continue</button>
	</div>
</div>
