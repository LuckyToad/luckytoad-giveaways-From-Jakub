<script type="ts">
	import state from '$lib/stores/fsm';
	import Start from '$lib/components/Start.svelte';
	import NeedsGiveawayType from '$lib/components/NeedsGiveawayType.svelte';
	import NeedsContractAddress from '$lib/components/NeedsContractAddress.svelte';
	import NeedsAmount from '$lib/components/NeedsAmount.svelte';
	import NeedsSpreadsheet from '$lib/components/NeedsSpreadsheet.svelte';
	import FindingWinner from '$lib/components/FindingWinner.svelte';
	import Winner from '$lib/components/Winner.svelte';
	import { connectionError } from '$lib/stores/connectionError';
	import { contracts } from 'svelte-ethers-store';
	import { giveaway } from '$lib/stores/giveaway';
	import { attachContract } from '$lib/web3';

	// reattach contract on refresh (if doesn't exist in contracts store but does in giveaway store)
	if (!$contracts.PROJECT && $giveaway.project_contract_address) attachContract('PROJECT', $giveaway.project_contract_address);
</script>

{#if $connectionError && $state !== 'start'}
	<p class="text-lg font-Inter font-bold text-red-700 text-center bg-brand-lemon-light">PLEASE RECONNECT YOUR WALLET TO CONTINUE</p>
{/if}
<main class="bg-brand-lemon-light flex grow">
	<div class="h-full mx-auto max-w-7xl p-2 sm:p-6 lg:p-8 flex justify-center items-center">
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
		{:else if $state == 'finding-winner'}
			<FindingWinner />
		{:else if $state == 'winner'}
			<Winner />
		{/if}
	</div>
</main>
