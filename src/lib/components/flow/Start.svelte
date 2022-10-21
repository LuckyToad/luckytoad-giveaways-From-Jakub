<script lang="ts">
	import state from '$lib/stores/fsm';
	import { connected } from 'svelte-ethers-store';
	import { connect } from '$lib/web3';

	const blocks = [
		{
			icon: '/icons/trustless.svg',
			title: 'Trustless',
			desc: 'Any project, dev, influencer, or community can trustlessly pick and distribute rewards on the blockchain.'
		},
		{
			icon: '/icons/dice.svg',
			title: 'Random',
			desc: 'Utilizing our MevBot RNG, you can simply and legitimately run any type of giveaway.'
		},
		{
			icon: '/icons/finger-snap-easy.svg',
			title: 'Easy',
			desc: 'Choose your giveaway type, upload a spreadsheet with participants of entries, and let LuckyToad do the rest.'
		}
	];

	$: if ($connected) state.next();
</script>

<div class="flex flex-col justify-center items-center font-Inter gap-5 w-full">
	<div class="w-full">
		<h1 class="header">Truly random giveaways, <br /><span class="text-brand-green-light">verified on the blockchain.</span></h1>
	</div>

	<div class="w-full">
		<div class="overflow-x-auto flex md:justify-center gap-6 snap-x snap-mandatory before:shrink-0 before:w-1/3 after:shrink-0 after:w-1/3 md:before:content-none md:after:content-none">
			{#each blocks as { icon, title, desc }, i}
				<div class="rounded-md border border-brand-lemon-dark w-64 h-72 p-4 flex flex-col justify-center gap-4 flex-shrink-0 snap-center">
					<img src={icon} alt="icon" class="h-20" />
					<div>
						<p class="text-brand-green-light text-2xl font-bold text-center">{title}</p>
						<p class="text-brand-green-dark text-center">{desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<button on:click={connect} class="btn">Get Started</button>
</div>
