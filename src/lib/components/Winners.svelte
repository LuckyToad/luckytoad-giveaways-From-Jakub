<script lang="ts">
	import { giveaway } from '$lib/stores/giveaway';
	import state from '$lib/stores/fsm';

	const round = $giveaway.round;

	let index = 0;
	let winner = $giveaway.winners[index];

	const nextWinner = () => {
		if ($giveaway.winners[index] != undefined && index != $giveaway.winners.length - 1) {
			index++;
			winner = $giveaway.winners[index];
		}
	};
</script>

<div class="flex justify-center items-center font-Inter">
	<img src="congrats.svg" alt="giveaway" class="max-w-5xl w-full" />

	<div class="flex flex-col justify-center items-center gap-4 z-50 absolute">
		<h1 class="font-Inter text-3xl md:text-4xl text-brand-green-light font-black text-center">Prize: {winner.amount} {$giveaway.currency}</h1>
		<div>
			<h1 class="header">Lucky Winner #{index + 1} is...</h1>
			<h2 class="subheader">{winner.wallet}</h2>
		</div>

		<div class="flex gap-2">
			<a href={winner.hash} target="_blank" class="btn-outline">Verification</a>
			{#if index != $giveaway.winners.length - 1}
				<button class="btn" on:click={nextWinner}>Next Winner!</button>
			{:else}
				<button class="btn" on:click={state.summary}>Summary!</button>
			{/if}
			<!-- <button class="btn" on:click={state.reroll}>Next Winner!</button> -->
			<!-- <h1 class="text-brand-green-dark text-base font-bold text-center underline underline-offset-4 decoration-brand-green-light decoration-2">Transation Hash</h1> -->
		</div>
	</div>
</div>
