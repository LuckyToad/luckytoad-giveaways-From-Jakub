<script lang="ts">
	import state from '$lib/stores/fsm';

	const handleBack = () => {
		state.back();
	};

	const handleNext = () => {
		state.next();
	};
</script>

<div class="flex flex-col items-center gap-6 font-Inter w-full">
	<div>
		<h1 class="header">Spreadsheet Formatting</h1>
		<h2 class="subheader">Spreadsheet MUST include 1 column for wallets and 1 column for entries. See example below.</h2>
	</div>

	<table class="table-auto w-max border-collapse border border-brand-green-dark text-brand-green-dark text-sm md:text-base">
		<thead class="bg-brand-lemon-dark text-left">
			<th class="px-4 py-2 border border-brand-green-dark">Wallet</th>
			<th class="px-4 py-2 border border-brand-green-dark">Entries</th>
		</thead>
		<tr>
			<td class="px-4 py-2 border border-brand-green-dark">0×46A7262a2198300fD8F75Fcc66040f05a034445D</td>
			<td class="px-4 py-2 border border-brand-green-dark">2</td>
		</tr>
		<tr>
			<td class="px-4 py-2 border border-brand-green-dark">0x230BF0637628EF356B63D389e2Ec6c77C8853a11</td>
			<td class="px-4 py-2 border border-brand-green-dark">3</td>
		</tr>
		<tr>
			<td class="px-4 py-2 border border-brand-green-dark">0×559bac5783ba05725ba84ca26e4bb35bb8513b3c</td>
			<td class="px-4 py-2 border border-brand-green-dark">1</td>
		</tr>
	</table>

	<div class="flex flex-col gap-2 items-center">
		<a href="https://docs.google.com/spreadsheets/d/1U-O9X4au-EJN2KFmo4QpCBJijiGFBs8Fw20APl_Jygc/edit?usp=sharing" target="_blank" class="text-brand-green-dark border-b-2 border-brand-green-light font-bold">Download Template</a>
		<p class="text-xs text-brand-green-dark">Once the Google Sheet loads, go to File > Make a copy</p>
	</div>

	<div class="flex flex-col md:flex-row-reverse justify-center items-center gap-4 w-full">
		<button on:click={handleNext} class="btn">Continue</button>
		<button on:click={handleBack} class="btn-outline">Back</button>
	</div>
</div>
