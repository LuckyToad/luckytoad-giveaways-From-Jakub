<script type="ts">
	import state from '$lib/stores/fsm';
	import Start from '$lib/components/flow/Start.svelte';
	import NeedsGiveawayType from '$lib/components/flow/NeedsGiveawayType.svelte';
	import NeedsContractAddress from '$lib/components/flow/NeedsContractAddress.svelte';
	import NeedsWinners from '$lib/components/flow/NeedsWinners.svelte';
	import NeedsAmount from '$lib/components/flow/NeedsAmount.svelte';
	import NeedsSpreadsheet from '$lib/components/flow/NeedsSpreadsheet.svelte';
	import NeedsConfirmation from '$lib/components/flow/NeedsConfirmation.svelte';
	import FindingWinners from '$lib/components/flow/FindingWinner.svelte';
	import Winners from '$lib/components/flow/Winners.svelte';
	import Summary from '$lib/components/flow/Summary.svelte';
	import { connectionError } from '$lib/stores/connectionError';
	import { defaultEvmStores, contracts, provider, signer } from 'svelte-ethers-store';
	import { giveaway } from '$lib/stores/giveaway';
	import { attachContract } from '$lib/web3';

	// reattach contract on refresh (if doesn't exist in contracts store but does in giveaway store)
	if (!$contracts.PROJECT && $giveaway.contract_address) attachContract('PROJECT', $giveaway.contract_address);
	$: console.log($state);
</script>

{#if $connectionError && $state !== 'start'}
	<p class="text-lg font-Inter font-bold text-red-700 text-center bg-brand-lemon-light">PLEASE RECONNECT YOUR WALLET TO CONTINUE</p>
{/if}

<main class="flex justify-center items-center p-8">
	{#if $state == 'start'}
		<Start />
	{:else if $state == 'needs-giveaway-type'}
		<NeedsGiveawayType />
	{:else if $state == 'needs-contract-address'}
		<NeedsContractAddress />
	{:else if $state == 'needs-winners'}
		<NeedsWinners />
	{:else if $state == 'needs-amount'}
		<NeedsAmount />
	{:else if $state == 'needs-confirmation'}
		<NeedsConfirmation />
	{:else if $state == 'needs-spreadsheet'}
		<NeedsSpreadsheet />
	{:else if $state == 'finding-winners'}
		<FindingWinners />
	{:else if $state == 'winners'}
		<Winners />
	{:else if $state == 'summary'}
		<Summary />
	{/if}
</main>
