<script type="ts">
	import { createForm } from 'felte';

	export let initialValues;
	export let onSubmit;
	export let onBack;

	let initiated = false;
	let native = false;
	let ethereum = false;
	const { form, data } = createForm({ onSubmit });
</script>

<form use:form>
	<input name="firstName" />
	<input name="lastName" />
	<input name="aboutMe" />
	<button type="button" on:click={() => onBack($data)}> Previous page </button>
	<button type="submit">Next page</button>
</form>
