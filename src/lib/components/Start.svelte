<script lang="ts">
	import state from '$lib/stores/fsm';
	import { connected } from 'svelte-ethers-store';
	import { connect } from '$lib/web3';

	$: if ($connected) state.next();
</script>

<div class="relative flex justify-center items-center font-Inter">
	<img src="giveaway.svg" alt="giveaway" class="max-w-5xl w-full" />
	<button on:click={connect} class="btn z-50 absolute">Connect Wallet</button>
</div>
