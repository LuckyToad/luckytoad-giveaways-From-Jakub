<script type="ts">
	import Page1 from '$lib/components/Form/Page1.svelte';
	import Page2 from '$lib/components/Form/Page2.svelte';

	const pages = [Page1, Page2];

	// Current page
	let page = 0;

	// State of all of pages
	let pagesState = [];

	// Our handlers
	function onSubmit(values) {
		if (page === pages.length - 1) {
			// On our final page with POST our data somewhere
			console.log('Submitted data: ', pagesState);
		} else {
			// If we're not on the last page, store our data and increase a step
			pagesState[page] = values;
			pagesState = pagesState; // Triggering update
			page += 1;
		}
	}

	function onBack(values) {
		if (page === 0) return;
		pagesState[page] = values;
		pagesState = pagesState; // Triggering update
		page -= 1;
	}
</script>

<main class="h-screen bg-[#1B1F20]">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-[calc(100vh-56px)] flex justify-center items-center">
		<svelte:component this={pages[page]} {onSubmit} {onBack} initialValues={pagesState[page]} />
	</div>
</main>
