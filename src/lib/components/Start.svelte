<script lang="ts">
	import state from '$lib/stores/fsm';
	import { connected } from 'svelte-ethers-store';
	import { connect } from '$lib/web3';

	$: if ($connected) state.next();
</script>

<button on:click={connect} class="text-white border-2 rounded-md px-2 py-1 w-max hover:bg-neutral-900">Connect Wallet to get started</button>
