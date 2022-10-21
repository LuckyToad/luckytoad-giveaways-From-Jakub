<script>
	import state from '$lib/stores/fsm';
	import GiveawayTracker from './GiveawayTracker.svelte';
</script>

<footer class="bg-brand-lemon-light font-Inter">
	<div class="mx-auto max-w-7xl p-2 sm:p-6 lg:p-8 flex flex-col justify-center items-center gap-10">
		{#if $state !== 'start' && $state !== 'summary'}
			<div class="flex md:hidden text-center">
				<GiveawayTracker />
			</div>
		{/if}

		<p class="text-brand-green-dark text-xs">© Lucky Toad Team 2022. All right reserved.</p>
	</div>
</footer>
