<script lang="ts">
	import { state } from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';

	import { validateAddress } from '$lib/web3';

	let projectContractAddress = JSON.parse(sessionStorage.giveaway).project_contract_address;
	let error: boolean;

	const isAddressValid = (): boolean => {
		error = false;
		let valid = true;

		if (!projectContractAddress) error = true;
		if (!validateAddress(projectContractAddress)) error = true;

		// if contract is valid, update giveaway store
		if (!error) $giveaway.project_contract_address = projectContractAddress;

		return error ? (valid = !valid) : valid;
	};
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-col">
		<p class="block mb-2 text-sm font-medium text-white">Please enter your project contract address.</p>

		<input bind:value={projectContractAddress} on:change={isAddressValid} type="text" class="text-white border-2 rounded-md px-2 py-1 bg-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-white w-full" />

		{#if error}
			<p class="text-red-500 text-xs mt-1">Please enter a valid ethereum address.</p>
		{/if}
	</div>

	<div class="flex justify-between text-white">
		<button on:click={state.back}>Back</button>
		<button on:click={() => state.next(isAddressValid)}>Continue</button>
	</div>
</div>
