import { derived } from 'svelte/store';
import { ethers } from 'ethers';
import { provider, signer, signerAddress, contracts } from 'svelte-ethers-store';

export const ethBalance = derived([signer, provider], ([$signer, $provider], set) => {
	if (!$signer || !$provider) return set(null);

	provider.subscribe(async (provider) => {
		provider.on('block', async () => {
			const balance = await $signer.getBalance();
			const formatted = Number(ethers.utils.formatEther(balance)).toFixed(4);

			set(formatted);
		});
	});
});

export const projectBalance = derived([signer, provider, contracts, signerAddress], ([$signer, $provider, $contracts, $signerAddress], set) => {
	if (!provider || !$signer || !$provider || !$signerAddress || !$contracts.PROJECT) return set(null);

	provider.subscribe(async (provider) => {
		provider.on('block', async () => {
			const balance = await $contracts.PROJECT.balanceOf($signerAddress);
			const decimals = await $contracts.PROJECT.decimals();
			const formatted = ethers.utils.formatUnits(balance, decimals);

			set(formatted);
		});
	});
});
