<script lang="ts">
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';
	import { validateAddress, attachContract } from '$lib/web3';

	let address = JSON.parse(sessionStorage.giveaway).project_contract_address;
	let error: boolean;

	const isAddressValid = (): boolean => {
		error = false;
		let valid = true;

		if (!address) error = true;
		if (!validateAddress(address)) error = true;

		// // if contract is valid, update giveaway store and attach contract
		// if (!error) {
		// 	$giveaway.project_contract_address = address;
		// 	attachContract('PROJECT', address);
		// }

		return error ? (valid = !valid) : valid;
	};

	const handleBack = () => {
		$giveaway.project_contract_address = '';

		state.back();
	};

	const handleNext = () => {
		if (isAddressValid()) {
			$giveaway.project_contract_address = address;
			attachContract('PROJECT', address);
			state.next();
		}
	};
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-col">
		<p class="block mb-2 text-sm font-medium text-white">Please enter your project contract address.</p>

		<input bind:value={address} on:input={isAddressValid} type="text" class="text-white border-2 rounded-md px-2 py-1 bg-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-white w-full" />

		{#if error}
			<p class="text-red-500 text-xs mt-1">Please enter a valid ethereum address.</p>
		{/if}
	</div>

	<div class="flex justify-between text-white">
		<button on:click={handleBack}>Back</button>
		<button on:click={handleNext}>Continue</button>
	</div>
</div>
