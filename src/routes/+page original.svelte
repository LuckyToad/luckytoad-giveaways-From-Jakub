<script type="ts">
	import ConnectButton from '$lib/components/ConnectButton.svelte';
	import { connected, signerAddress } from 'svelte-ethers-store';
	import { validateAddress } from '$lib/web3';
	import { Helper } from 'flowbite-svelte';
	import papa from 'papaparse';

	let state = {
		current: 'start',
		giveaway_type: '',
		project_contract_address: '',
		giveaway_amount: 0
	};

	let is_project_contract_valid: boolean;
	let is_giveaway_amount_valid: boolean;

	let transitions = {
		start: {
			next: function () {
				return !$connected ? 'needs-connect' : 'needs-giveaway-type';
			}
		},
		'needs-connect': {
			back: 'start'
		},
		'needs-giveaway-type': {
			back: function () {
				return !$connected ? 'needs-connect' : 'start';
			},
			next: function () {
				return state.giveaway_type === 'native_token' ? 'needs-contract-address' : 'needs-amount';
			}
		},
		'needs-contract-address': {
			back: 'needs-giveaway-type',
			next: function () {
				if (!validateAddress(state.project_contract_address)) {
					is_project_contract_valid = false;
					return 'needs-contract-address';
				} else return 'needs-amount';
			}
		},
		'needs-amount': {
			back: state.project_contract_address ? 'needs-contract-address' : 'needs-giveaway-type',
			next: function () {
				if (state.giveaway_amount <= 0) {
					is_giveaway_amount_valid = false;
					return 'needs-amount';
				} else return 'needs-spreadsheet';
			}
		},
		'needs-spreadsheet': {
			back: 'needs-amount',
			next: () => processFile()
		}
	};

	const transition = (event) => {
		let next_state = transitions[state.current][event];

		if (typeof next_state === 'function') next_state = next_state();
		if (next_state) state.current = next_state;
	};

	// reading uploaded file
	let fileInput;
	const processFile = () => {
		papa.parse(fileInput.files[0], {
			delimiter: '', // auto-detect
			newline: '', // auto-detect
			quoteChar: '"',
			escapeChar: '"',
			header: true,
			transformHeader: undefined,
			dynamicTyping: false,
			preview: 0,
			encoding: '',
			worker: false,
			comments: false,
			step: undefined,
			complete: function (results) {
				const { data } = results;
				console.log(data);
			},
			error: undefined,
			download: false,
			downloadRequestHeaders: undefined,
			downloadRequestBody: undefined,
			skipEmptyLines: false,
			chunk: undefined,
			chunkSize: undefined,
			fastMode: undefined,
			beforeFirstChunk: undefined,
			withCredentials: undefined,
			transform: undefined,
			delimitersToGuess: [',', '\t', '|', ';', papa.RECORD_SEP, papa.UNIT_SEP]
		});
	};
</script>

<main class="h-screen bg-[#1B1F20]">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-[calc(100vh-56px)] flex justify-center items-center">
		{#if state.current === 'start'}
			<button on:click={() => transition('next')} class="text-white border-2 rounded-md px-2 py-1 w-max hover:bg-neutral-900">Get Started</button>
		{:else if state.current === 'needs-connect'}
			<div class="flex flex-col gap-2 text-white">
				<h3>Please connect your wallet to continue...</h3>
				<div class="flex justify-between">
					<button on:click={() => transition('back')}>Back</button>
				</div>
			</div>
		{:else if state.current === 'needs-giveaway-type'}
			<div class="flex flex-col gap-2 text-white">
				<div class="flex flex-col gap-2">
					<label class="block mb-2 text-sm font-medium text-white" for="native_token">Please select your giveaway type.</label>
					<div>
						<button
							on:click={() => {
								state.giveaway_type = 'native_token';
								transition('next');
							}}
							class="text-white border-2 rounded-md px-2 py-1 w-32 hover:bg-neutral-900">Native Token</button>
						<button
							on:click={() => {
								state.giveaway_type = 'ethereum';
								transition('next');
							}}
							class="text-white border-2 rounded-md px-2 py-1 w-32 hover:bg-neutral-900">Ethereum</button>
					</div>
				</div>
				<div class="flex justify-between">
					<button on:click={() => transition('back')}>Back</button>
				</div>
			</div>
		{:else if state.current === 'needs-contract-address'}
			<div class="flex flex-col gap-2">
				<div>
					<label class="block mb-2 text-sm font-medium text-white" for="contract_address">Please enter your project contract address.</label>
					<input bind:value={state.project_contract_address} type="text" name="contract_address" id="contract_address" class="text-white border-2 rounded-md px-2 py-1 bg-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-white w-full" />
					{#if is_project_contract_valid === false}
						<Helper class="mt-2" color="red">Please enter a valid ethereum address.</Helper>
					{/if}
				</div>

				<div class="flex justify-between text-white">
					<button on:click={() => transition('back')}>Back</button>
					<button on:click={() => transition('next')}>Continue</button>
				</div>
			</div>
		{:else if state.current === 'needs-amount'}
			<div class="flex flex-col gap-2">
				<div>
					<label class="block mb-2 text-sm font-medium text-white" for="giveaway_amount">Please enter your giveaway amount in tokens.</label>
					<input bind:value={state.giveaway_amount} type="number" name="giveaway_amount" id="giveaway_amount" class="text-white border-2 rounded-md px-2 py-1 bg-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-white w-full" />
					{#if is_giveaway_amount_valid === false}
						<Helper class="mt-2" color="red">Please enter a valid giveaway amount.</Helper>
					{/if}
				</div>

				<div class="flex justify-between text-white">
					<button on:click={() => transition('back')}>Back</button>
					<button on:click={() => transition('next')}>Continue</button>
				</div>
			</div>
		{:else if state.current === 'needs-spreadsheet'}
			<div class="flex flex-col gap-2">
				<div>
					<label class="block mb-2 text-sm font-medium text-white" for="file_input">Please upload your spreadsheet with a list of participants and entries.</label>
					<input
						bind:this={fileInput}
						class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
						aria-describedby="file_input_help"
						id="file_input"
						type="file"
						accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
					<p class="mt-1 text-sm text-white" id="file_input_help">CSV, .sheet, .excel.</p>
				</div>

				<div class="flex justify-between text-white">
					<button on:click={() => transition('back')}>Back</button>
					<button on:click={() => transition('next')}>Continue</button>
				</div>
			</div>
		{/if}
	</div>
</main>
