<script lang="ts">
	import { giveaway } from '$lib/stores/giveaway';
	import state from '$lib/stores/fsm';
	import { ethers } from 'ethers';
	import { copy } from 'svelte-copy';

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
	<img src="congrats.svg" alt="giveaway" class="max-w-5xl w-full hidden md:block" />

	<div class="flex flex-col justify-center items-center gap-4 z-50 absolute">
		<div>
			<h1 class="font-Inter md:text-2xl text-brand-green-light font-black text-center">Prize: {ethers.utils.commify(winner.amount)} {$giveaway.currency}</h1>

			<div class="w-full">
				<h1 class="header">Lucky Winner #{index + 1}</h1>
				<h2 class="hidden md:block subheader text-2xl">{winner.wallet}</h2>
				<h2 class="md:hidden subheader text-2xl text-brand-green-dark">{winner.wallet.slice(0, 4)}…{winner.wallet.slice(winner.wallet.length - 4, winner.wallet.length)}</h2>
			</div>
		</div>

		<button class="btn-outline md:hidden" use:copy={winner.wallet}>Copy Address</button>

		<div class="flex flex-col md:flex-row gap-2 w-full mt-16 md:mt-0 items-center justify-center">
			{#if index != $giveaway.winners.length - 1}
				<button class="btn" on:click={nextWinner}>Next Winner!</button>
			{:else}
				<button class="btn" on:click={state.summary}>Summary!</button>
			{/if}
			<a href={winner.hash} target="_blank" class="btn-outline">Verification</a>
		</div>
	</div>
</div>
