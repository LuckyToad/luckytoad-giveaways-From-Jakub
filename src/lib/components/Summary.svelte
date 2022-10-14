<script type="ts">
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';

	const startOver = () => {
		$giveaway.type = '';
		$giveaway.contract_address = '';
		$giveaway.currency = '';
		$giveaway.amount = 0;
		$giveaway.participants = [];
		$giveaway.round = 0;
		$giveaway.no_winners = 0;
		$giveaway.winners = [];

		state.restart();
	};
</script>

<div class="flex justify-center items-center font-Inter">
	<div class="flex flex-col justify-center items-center gap-4 z-50 absolute">
		<div>
			<h1 class="header">You gave away a total of <span class="text-brand-green-light">{$giveaway.amount} {$giveaway.currency}</span> to <span class="text-brand-green-light">{$giveaway.no_winners} {$giveaway.winners.length > 1 ? 'winners' : 'winner'}</span>.</h1>
			<h2 class="subheader font-medium">Each winner got {($giveaway.amount / $giveaway.winners.length).toFixed(2)} {$giveaway.currency}</h2>
		</div>

		<div class="flex flex-col gap-6 items-center">
			{#each $giveaway.winners as { wallet, hash }, index}
				<div class="flex flex-col">
					<h3 class="text-brand-green-dark font-bold text-xl text-center">Lucky Winner #{index + 1}</h3>
					<p class="text-sm">{wallet}</p>
					<a href={hash} class="text-brand-green-dark text-base font-bold text-center underline underline-offset-4 decoration-brand-green-light decoration-2">Transation Hash</a>
				</div>
			{/each}
			<button class="btn" on:click={startOver}>Give Away More!</button>
		</div>
	</div>
</div>
