import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import { ethers } from 'ethers';
import { defaultEvmStores, connected, provider, chainId, chainData, signer, signerAddress, contracts } from 'svelte-ethers-store';
import { giveaway } from '$lib/stores/giveaway';
import abi from '$lib/abi.json';
import giveawayabi from '$lib/giveawayabi.json';
import { get } from 'svelte/store';

const INFURA_HTTPS_URL = import.meta.env.VITE_INFURA_HTTPS_URL;

const injected = injectedModule();
const walletConnect = walletConnectModule();

let onboard = Onboard({
	wallets: [injected, walletConnect],
	chains: [
		{
			id: '0x1',
			token: 'ETH',
			label: 'Ethereum Mainnet',
			rpcUrl: INFURA_HTTPS_URL
		}
	],
	appMetadata: {
		name: 'Lucky Toad',
		icon: 'logo-toad-no-text-transparent-bg.png',
		logo: 'logo-text-transparent-bg.png',
		description: 'temp-description',
		recommendedInjectedWallets: [
			{ name: 'MetaMask', url: 'https://metamask.io' },
			{ name: 'WalletConnect', url: 'https://walletconnect.com/' }
		]
	},
	accountCenter: {
		desktop: {
			enabled: false,
			position: 'topRight'
		},
		mobile: {
			enabled: false,
			position: 'topRight'
		}
	},
	connect: {
		// showSidebar: false
	},

	i18n: {
		en: {
			connect: {
				selectingWallet: {
					header: 'Select a Wallet',
					sidebar: {
						heading: '',
						subheading: '',
						paragraph: ''
					}
				}
			}
		}
	}
});

const walletsSubscription = onboard.state.select('wallets');
const { unsubscribe } = walletsSubscription.subscribe(async (wallets) => {
	const walletProvider = wallets[0]?.provider;

	if (walletProvider) {
		const provider = new ethers.providers.Web3Provider(walletProvider, 'any');
		await defaultEvmStores.setProvider(provider);
	}
	updateAlreadyConnectedWallets();
});

export const connect = async () => {
	const wallets = await onboard.connectWallet();
};

export const disconnect = async () => {
	const connectedWallet = onboard.state.get().wallets[0];
	await onboard.disconnectWallet({ label: connectedWallet.label });
	await defaultEvmStores.disconnect();
};

// connect back on reload
if (typeof window !== 'undefined') {
	const alreadyConnectedWallets = JSON.parse(window.sessionStorage.getItem('ConnectedWallets'));
	if (alreadyConnectedWallets && alreadyConnectedWallets.length > 0) {
		onboard
			.connectWallet({
				autoSelect: { label: alreadyConnectedWallets[0], disableModals: true }
			})
			.catch(console.error);
	}
}

const updateAlreadyConnectedWallets = async () => {
	const connectedWalletsLabels = onboard.state.get().wallets.map(({ label }) => label);
	window.sessionStorage.setItem('ConnectedWallets', JSON.stringify(connectedWalletsLabels));
};

export const attachContract = async (contractName: string, contractAddress: string) => {
	await defaultEvmStores.attachContract(contractName, contractAddress, abi);
};

export const validateAddress = (contractAddress: string) => {
	return ethers.utils.isAddress(contractAddress);
};

export const findWinners = async () =>
	giveaway.update(async ($giveaway) => {
		// logic for determining winners...
		// Send the processed data to the contract
		// Get a wallet in an Ethers format
		const weiAmt = ethers.utils.parseUnits($giveaway.amount);
		const sign = get(signer);
		const giveawayContract = new ethers.Contract('0x43444B1Ce07cE1bFAf6DA7E8Ebc667769530FbD1', giveawayabi, sign);

		// Convert the $giveaway participants array into two lists: wallets and entries
		const walletList = [];
		const entryList = [];
		for (const participant of $giveaway.participants) {
			walletList.push(participant.wallet);
			entryList.push(participant.entries);
		}

		const tokenDistribution: number[] = [];
		tokenDistribution.length = $giveaway.no_winners;
		tokenDistribution.fill(weiAmt.div($giveaway.no_winners));

		// The resulting tx
		let output;

		// The filter to use for the output
		let filter;
		if ($giveaway.type == 'native-token') {
			output = await giveawayContract.lodgeGiveawayTokens(walletList, entryList, tokenDistribution, $giveaway.contract_address, {});
			// output = await giveawayContract.lodgeGiveawayTokens(walletList, entryList, tokenDistribution, $giveaway.contract_address, { value: 10000000000000000n });

			filter = giveawayContract.filters.TokenGiveawayFinalised(output.from);
		} else {
			output = await giveawayContract.lodgeGiveawayETH(walletList, entryList, tokenDistribution, {value: weiAmt});
			// output = await giveawayContract.lodgeGiveawayETH(walletList, entryList, tokenDistribution, { value: $giveaway.amount + 10000000000000000n });

			filter = giveawayContract.filters.ETHGiveawayFinalised(output.from);
		}
		const txFinalised = await output.wait();

		// Sign up to wait for the first event sent
		const winners = new Set();
		giveawayContract.once(filter, (sender, amount, win, event) => {
			for (let i = 0; i < win.length; i++) {
				const winnerSet = { wallet: win[i], hash: event.transactionHash, amount: amount[i] };
				winners.add(winnerSet);
			}

			// update the giveaway...
			$giveaway.winners = Array.from(winners);
			$giveaway.round++;
			return $giveaway;
		});
	});
