<script>
	import ConnectButton from '$lib/components/ConnectButton.svelte';
</script>

<nav class="bg-brand-lemon-light">
	<div class="mx-auto max-w-7xl p-2 sm:p-6 lg:p-8 flex justify-between items-center">
		<div class="w-1/3" />
		<div class="w-1/3 flex justify-center">
			<img src="luckytoad-logo.svg" alt="logo-text" class="h-24" />
		</div>
		<div class="w-1/3 flex justify-end">
			<ConnectButton />
		</div>
	</div>
</nav>
