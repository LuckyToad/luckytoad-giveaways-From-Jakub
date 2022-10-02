<script type="ts">
	import state from '$lib/stores/fsm';
	import Start from '$lib/components/Start.svelte';
	import NeedsGiveawayType from '$lib/components/NeedsGiveawayType.svelte';
	import NeedsContractAddress from '$lib/components/NeedsContractAddress.svelte';
	import NeedsAmount from '$lib/components/NeedsAmount.svelte';
	import NeedsSpreadsheet from '$lib/components/NeedsSpreadsheet.svelte';
	import { connectionError } from '$lib/stores/connectionError';
	import DevPanel from '$lib/components/devPanel.svelte';
	import { contracts } from 'svelte-ethers-store';
	import { giveaway } from '$lib/stores/giveaway';
	import { attachContract } from '$lib/web3';

	// reattach contract on refresh (if doesn't exist in contracts store but does in giveaway store)
	if (!$contracts.PROJECT && $giveaway.project_contract_address) attachContract('PROJECT', $giveaway.project_contract_address);
</script>

<main class="h-screen bg-[#1B1F20]">
	{#if $connectionError && $state !== 'start'}
		<p class="text-lg font-bold text-red-700 text-center bg-white">PLEASE RECONNECT YOUR WALLET TO CONTINUE</p>
	{/if}
	<!-- <DevPanel /> -->

	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-[calc(100vh-56px)] flex justify-center items-center">
		{#if $state == 'start'}
			<Start />
		{:else if $state == 'needs-giveaway-type'}
			<NeedsGiveawayType />
		{:else if $state == 'needs-contract-address'}
			<NeedsContractAddress />
		{:else if $state == 'needs-amount'}
			<NeedsAmount />
		{:else if $state == 'needs-spreadsheet'}
			<NeedsSpreadsheet />
		{/if}
	</div>
</main>
