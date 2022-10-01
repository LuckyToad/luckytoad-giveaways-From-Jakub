<script type="ts">
	import { state } from '$lib/stores/fsm';
	import Start from '$lib/components/Start.svelte';
	import NeedsConnect from '$lib/components/NeedsConnect.svelte';
	import NeedsGiveawayType from '$lib/components/NeedsGiveawayType.svelte';
	import NeedsContractAddress from '$lib/components/NeedsContractAddress.svelte';
	import NeedsAmount from '$lib/components/NeedsAmount.svelte';
	import NeedsSpreadsheet from '$lib/components/NeedsSpreadsheet.svelte';
</script>

<main class="h-screen bg-[#1B1F20]">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-[calc(100vh-56px)] flex justify-center items-center">
		{#if $state == 'start'}
			<Start />
		{:else if $state == 'needs-connect'}
			<NeedsConnect />
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
