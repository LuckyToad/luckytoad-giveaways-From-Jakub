<script>
	import ConnectButton from '$lib/components/ConnectButton.svelte';
	import { giveaway } from '$lib/stores/giveaway';

	$: amount = $giveaway.amount ? $giveaway.amount : '__';
	$: currency = $giveaway.currency ? $giveaway.currency : '__';
	$: winners = $giveaway.no_winners ? $giveaway.no_winners : '__';
</script>

<nav class="bg-brand-lemon-light">
	<div class="mx-auto max-w-7xl p-2 sm:p-6 lg:p-8 flex justify-between items-center">
		<div class="w-1/3 font-Inter text-brand-lemon-dark">
			You are giving away a total of<br />
			<span class:text-brand-green-dark={$giveaway.amount} class:font-bold={$giveaway.amount}>{amount}</span>
			<span class:text-brand-green-dark={$giveaway.currency} class:font-bold={$giveaway.currency}>{currency}</span>
			to
			<span class:text-brand-green-dark={$giveaway.no_winners} class:font-bold={$giveaway.no_winners}>{winners} {winners == 1 ? 'winner' : 'winners'}</span>.
		</div>

		<div class="w-1/3 flex justify-center">
			<img src="luckytoad-logo.svg" alt="logo-text" class="h-16" />
		</div>
		<div class="w-1/3 flex justify-end">
			<ConnectButton />
		</div>
	</div>
</nav>
