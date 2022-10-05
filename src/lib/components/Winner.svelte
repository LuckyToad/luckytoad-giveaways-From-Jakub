<script lang="ts">
	import { giveaway } from '$lib/stores/giveaway';
	import state from '$lib/stores/fsm';

	let round = $giveaway.round;
	let wallet = $giveaway.winner.wallet;
	let hash: string;
</script>

<div class="flex justify-center items-center font-Inter">
	<img src="congrats.svg" alt="giveaway" class="max-w-5xl w-full" />

	<div class="flex flex-col justify-center items-center gap-4 z-50 absolute">
		<h1 class="header">Lucky Winner #{round} is...</h1>
		<h2 class="subheader">{wallet}</h2>

		<button class="btn">Verification</button>
		<h1 class="text-brand-green-dark text-base font-bold underline underline-offset-4 decoration-brand-green-light decoration-2">Transation Hash</h1>

		<button class="btn-outline" on:click={state.reroll}>ReRoll</button>
	</div>
</div>
