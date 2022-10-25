<script lang="ts">
	import state from '$lib/stores/fsm';
	import { connected } from 'svelte-ethers-store';
	import { connect } from '$lib/web3';
	import Carousel from '../Carousel.svelte';

	$: if ($connected) state.next();
</script>

<div class="w-full flex flex-col justify-center items-center gap-5 font-Inter">
	<h1 class="header">Truly random giveaways <br /><span class="text-brand-green-light">Verified on the blockchain</span></h1>

	<Carousel />

	<button on:click={connect} class="btn">Get Started</button>
</div>
