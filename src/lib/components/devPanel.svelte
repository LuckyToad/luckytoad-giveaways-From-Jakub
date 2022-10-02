<script>
	import { contracts } from 'svelte-ethers-store';
	import { giveaway } from '$lib/stores/giveaway';
</script>

<div class="text-white">
	<p>GIVEAWAY_TYPE: {$giveaway.giveaway_type}</p>
	<p>PROJECT_CONTRACT_ADDRESS: {$giveaway.project_contract_address}</p>
	<p>GIVEAWAY_AMOUNT: {$giveaway.giveaway_amount}</p>
	<p>CONTRACT STORE: {Object.keys($contracts).length ? 'SET' : 'EMPTY'}</p>
</div>
