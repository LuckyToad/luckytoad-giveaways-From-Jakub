<script lang="ts">
	import { state } from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';
	import { ethBalance, projectBalance } from '$lib/stores/balances';
	import { contracts } from 'svelte-ethers-store';
	import { attachContract } from '$lib/web3';

	let amount = JSON.parse(sessionStorage.giveaway).giveaway_amount;
	let error: boolean;

	// reattach contract on refresh (if doesn't exist in contracts store but does in giveaway store)
	if (!$contracts.PROJECT && $giveaway.project_contract_address) attachContract('PROJECT', $giveaway.project_contract_address);

	const isAmountValid = (): boolean => {
		error = false;
		let valid = true;

		if (!amount) error = true;
		if (amount < 0) error = true;
		if (typeof amount !== 'number') error = true;
		if ($giveaway.giveaway_type === 'ethereum' && amount > $ethBalance) error = true;
		if ($giveaway.giveaway_type === 'native-token' && amount > $projectBalance) error = true;

		// if amount is valid, update giveaway store
		if (!error) $giveaway.giveaway_amount = amount;

		return error ? (valid = !valid) : valid;
	};

	const handleBack = () => {
		$giveaway.giveaway_amount = 0;

		state.back();
	};
</script>

<div class="flex flex-col gap-2">
	<div>
		<p class="block mb-2 text-sm font-medium text-white">Please enter your giveaway amount in tokens.</p>

		<input bind:value={amount} on:change={isAmountValid} type="number" class="text-white border-2 rounded-md px-2 py-1 bg-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-white w-full" />
		<span class="text-gray-200 text-xs w-min">
			{#if $giveaway.giveaway_type === 'ethereum' && $ethBalance}
				max: {$ethBalance}
			{:else if $contracts.PROJECT && $projectBalance}
				max: {$projectBalance}
			{/if}
		</span>

		{#if error}
			<p class="text-red-500 text-xs mt-1">Please enter a valid amount.</p>
		{/if}
	</div>

	<div class="flex justify-between text-white">
		<button on:click={() => handleBack()}>Back</button>
		<button on:click={() => isAmountValid() && state.next()}>Continue</button>
	</div>
</div>
