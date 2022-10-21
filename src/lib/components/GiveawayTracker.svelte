<script>
	import { giveaway } from '$lib/stores/giveaway';
	import { ethers } from 'ethers';

	$: amount = $giveaway.amount ? $giveaway.amount : '__';
	$: currency = $giveaway.currency ? $giveaway.currency : '__';
	$: winners = $giveaway.no_winners ? $giveaway.no_winners : '__';
</script>

<div class="font-Inter text-brand-lemon-dark">
	You are giving away a total of<br />
	<span class:text-brand-green-dark={$giveaway.amount} class:font-bold={$giveaway.amount}>{Number(amount) ? ethers.utils.commify(amount) : amount}</span>
	<span class:text-brand-green-dark={$giveaway.currency} class:font-bold={$giveaway.currency}>{currency}</span>
	to
	<span class:text-brand-green-dark={$giveaway.no_winners} class:font-bold={$giveaway.no_winners}>{winners} {winners == 1 ? 'winner' : 'winners'}</span>.
</div>
