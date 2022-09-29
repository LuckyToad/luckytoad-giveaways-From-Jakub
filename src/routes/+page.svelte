<script type="ts">
	import fsm from 'svelte-fsm';
	import ConnectButton from '$lib/components/ConnectButton.svelte';
	import { connected, signerAddress } from 'svelte-ethers-store';
	import { validateAddress } from '$lib/web3';

	let file;
</script>

<main class="h-screen bg-[#1B1F20]">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-[calc(100vh-56px)] flex justify-center items-center">
		<div class="flex flex-col gap-2">
			<div>
				<label class="block mb-2 text-sm font-medium text-white" for="file_input">Please upload your spreadsheet with a list of participants and entries.</label>
				<input
					bind:this={file}
					class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					aria-describedby="file_input_help"
					id="file_input"
					type="file"
					accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
				<p class="mt-1 text-sm text-white" id="file_input_help">CSV, .sheet, .excel.</p>
			</div>
		</div>
	</div>
</main>
