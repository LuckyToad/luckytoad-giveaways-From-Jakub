<script lang="ts">
	import { state } from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';

	const handleNext = (type: string) => {
		$giveaway.giveaway_type = type;

		state.selectType(type);
	};
</script>

<div class="flex flex-col gap-2 text-white">
	<div class="flex flex-col gap-2">
		<p class="block mb-2 text-sm font-medium text-white">Please select your giveaway type.</p>
		<div>
			<button on:click={() => handleNext('native-token')} class="text-white border-2 rounded-md px-2 py-1 w-32 hover:bg-neutral-900">Native Token</button>
			<button on:click={() => handleNext('ethereum')} class="text-white border-2 rounded-md px-2 py-1 w-32 hover:bg-neutral-900">Ethereum</button>
		</div>
	</div>
	<div>
		<button on:click={state.back}>Back</button>
	</div>
</div>
