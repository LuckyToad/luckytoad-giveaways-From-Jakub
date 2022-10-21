<script lang="ts">
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';

	const handleNext = (type: string) => {
		$giveaway.type = type;
		if (type == 'ethereum') $giveaway.currency = 'ETH';

		state.selectType(type);
	};
</script>

<div class="font-Inter flex flex-col gap-4 items-center">
	<h1 class="header">What are you using for your giveaway?</h1>

	<button on:click={() => handleNext('native-token')} class="btn">Native Token</button>
	<button on:click={() => handleNext('ethereum')} class="btn">Ethereum</button>
</div>
