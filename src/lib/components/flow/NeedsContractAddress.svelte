<script lang="ts">
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';
	import { validateAddress, attachContract } from '$lib/web3';
	import { contracts } from 'svelte-ethers-store';

	let address = JSON.parse(sessionStorage.giveaway).contract_address;
	let error: boolean;

	const isAddressValid = (): boolean => {
		error = false;
		let valid = true;

		if (!address) error = true;
		if (!validateAddress(address)) error = true;

		return error ? (valid = !valid) : valid;
	};

	const handleBack = () => {
		$giveaway.contract_address = '';
		$giveaway.currency = '';

		state.back();
	};

	const handleNext = async () => {
		if (isAddressValid()) {
			$giveaway.contract_address = address;
			attachContract('PROJECT', address);
			$giveaway.currency = await $contracts.PROJECT.symbol();
			state.next();
		}
	};
</script>

<div class="flex flex-col gap-4 font-Inter">
	<h1 class="header">Enter the contract address</h1>

	<input bind:value={address} on:input={isAddressValid} type="text" placeholder="Ex: 0x46A7262a2198300fD8F75Fcc66040f05a034445D" class:input-field-valid={!error} class:input-field-invalid={error} />
	{#if error}
		<p class="invalid-error">Please enter a valid ethereum address.</p>
	{/if}

	<div class="flex justify-center gap-4">
		<button on:click={handleBack} class="btn-outline">Back</button>
		<button on:click={handleNext} class="btn">Continue</button>
	</div>
</div>
