<script lang="ts">
	// import { transition } from '$lib/stores/state';
	import { state } from '$lib/stores/stateMachine';
	import { connected } from 'svelte-ethers-store';

	$: if ($connected) state.next();
</script>

<div class="flex flex-col gap-2 text-white">
	<h3>Please connect your wallet to continue...</h3>
	<div class="flex justify-between">
		<button on:click={state.back}>Back</button>
	</div>
</div>
