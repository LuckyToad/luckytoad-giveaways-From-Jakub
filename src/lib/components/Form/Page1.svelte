<script type="ts">
	import { createForm } from 'felte';

	export let initialValues;
	export let onSubmit;
	export let onBack;

	let initiated = false;
	let native = false;
	let ethereum = false;
	const { form, data } = createForm({ onSubmit });
	$: console.log($data);
</script>

<form use:form>
	{#if !initiated}
		<button on:click={() => (initiated = !initiated)} class="text-white border-2 rounded-md px-2 py-1 w-max hover:bg-neutral-900">Get Started</button>
	{:else}
		<div class="flex flex-col gap-2">
			<h3 class="text-white">Giveaway Type:</h3>
			<div>
				<label for="native_token">Native Token</label><br />
				<input type="radio" id="native_token" name="fav_language" value="native" />
				<label for="ethereum">Ethereum</label><br />
				<input type="radio" id="ethereum" name="fav_language" value="ethereum" />
			</div>
			<div class="flex justify-between my-2">
				<button type="button" on:click={() => onBack($data)} class="text-white"> Go Back </button>
				<button type="submit" class="text-white">Continue</button>
			</div>
		</div>
	{/if}
</form>
