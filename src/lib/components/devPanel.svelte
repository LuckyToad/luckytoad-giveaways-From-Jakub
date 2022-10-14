<script>
	import { contracts } from 'svelte-ethers-store';
	import { giveaway } from '$lib/stores/giveaway';
</script>

<div class="text-white">
	<p>GIVEAWAY_TYPE: {$giveaway.type}</p>
	<p>PROJECT_CONTRACT_ADDRESS: {$giveaway.contract_address}</p>
	<p>giveaway_amount: {$giveaway.amount}</p>
	<p>CONTRACT STORE: {Object.keys($contracts).length ? 'SET' : 'EMPTY'}</p>
</div>
