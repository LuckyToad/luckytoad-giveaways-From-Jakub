<script lang="ts">
	import { state } from '$lib/stores/stateMachine';
</script>

<button on:click={state.next} class="text-white border-2 rounded-md px-2 py-1 w-max hover:bg-neutral-900">Get Started</button>
