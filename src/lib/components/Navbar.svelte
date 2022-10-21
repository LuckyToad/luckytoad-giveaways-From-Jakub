<script>
	import ConnectButton from '$lib/components/ConnectButton.svelte';
	import GiveawayTracker from './GiveawayTracker.svelte';
	import state from '$lib/stores/fsm';
</script>

<nav class="bg-brand-lemon-light">
	<div class="mx-auto max-w-7xl pt-4 p-2 sm:p-6 lg:p-8 flex justify-between items-center">
		{#if $state !== 'start' && $state !== 'summary'}
			<div class="w-1/3 hidden md:flex">
				<GiveawayTracker />
			</div>
		{/if}

		<div class="{$state !== 'start' ? 'w-1/3' : 'w-full justify-center'} flex md:justify-center">
			<img src="luckytoad-logo.svg" alt="logo-text" class="h-10 md:h-16" />
		</div>

		{#if $state !== 'start'}
			<div class="w-1/3 flex justify-end">
				<ConnectButton />
			</div>
		{/if}
	</div>
</nav>
