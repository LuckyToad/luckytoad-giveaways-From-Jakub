<script type="ts">
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';
	import { ethers } from 'ethers';
	import { copy } from 'svelte-copy';

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
	<div class="flex flex-col justify-center items-center gap-8">
		<div>
			<h1 class="header">You gave away a total of <br class="hidden md:flex" /> <span class="text-brand-green-light">{Number($giveaway.amount) ? ethers.utils.commify($giveaway.amount) : $giveaway.amount} {$giveaway.currency}</span> to <span class="text-brand-green-light">{$giveaway.no_winners} {$giveaway.winners.length > 1 ? 'winners' : 'winner'}</span>!</h1>
			<h2 class="subheader font-medium">Each winner got {ethers.utils.commify(($giveaway.amount / $giveaway.winners.length).toFixed(2))} {$giveaway.currency}</h2>
		</div>

		<div class="flex flex-col gap-4 items-center">
			{#each $giveaway.winners as { wallet, hash }, index}
				<div class="flex flex-col justify-center gap-2">
					<div>
						<h3 class="text-brand-green-dark font-bold text-xl text-center">Lucky Winner #{index + 1}</h3>

						<p class="text-lg font-semibold">
							<span class="hidden md:flex text-brand-green-dark">{wallet}</span>
							<span class="flex md:hidden text-brand-green-dark justify-center">{wallet.slice(0, 4)}…{wallet.slice(wallet.length - 4, wallet.length)}</span>
						</p>
					</div>

					<button class="btn-outline md:hidden" use:copy={wallet}>Copy Address</button>

					<a href={hash} class="text-brand-green-dark text-base font-bold text-center underline underline-offset-4 decoration-brand-green-light decoration-2">Transaction Hash</a>
				</div>
			{/each}

			<button class="btn mt-8" on:click={startOver}>Give Away More!</button>
		</div>
	</div>
</div>
