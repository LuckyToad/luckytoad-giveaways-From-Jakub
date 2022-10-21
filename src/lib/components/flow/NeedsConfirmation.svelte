<script lang="ts">
	import state from '$lib/stores/fsm';
	import { giveaway } from '$lib/stores/giveaway';
	import { ethers } from 'ethers';

	const handleBack = () => {
		state.back();
	};

	const handleNext = () => {
		state.next();
	};
</script>

<div class="flex flex-col gap-4 font-Inter">
	<h1 class="header">You are giving away a total of <br class="hidden md:block" /><span class="text-brand-green-light">{ethers.utils.commify($giveaway.amount)} {$giveaway.currency}</span> to <span class="text-brand-green-light">{$giveaway.no_winners} {$giveaway.no_winners == 1 ? 'winner' : 'winners'}</span>.</h1>

	<div class="flex flex-col md:flex-row-reverse justify-center items-center gap-4 w-full">
		<button on:click={handleNext} class="btn">Continue</button>
		<button on:click={handleBack} class="btn-outline">Back</button>
	</div>
</div>
