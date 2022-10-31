import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import { BigNumber, ethers } from 'ethers';
import { defaultEvmStores, connected, provider, chainId, chainData, signer, signerAddress, contracts } from 'svelte-ethers-store';
import { giveaway } from '$lib/stores/giveaway';
import abi from '$lib/abi.json';
import giveawayabi from '$lib/giveawayabi.json';
import { get } from 'svelte/store';

const INFURA_HTTPS_URL = import.meta.env.VITE_INFURA_HTTPS_URL;
const INFURA_GOERLI_URL = import.meta.env.VITE_INFURA_GOERLI;
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
		},
		{
			id: '0x5',
			token: 'goETH',
			label: 'Ethereum Goerli',
			rpcUrl: INFURA_GOERLI_URL
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

interface Winner {
	wallet: string, 
	hash: string, 
	amount: BigNumber
}

export const findWinners = async () => {
	await onboard.setChain({chainId: 0x5});
	const giveawayObj = get(giveaway);

	// logic for determining winners...
	const sign = get(signer);
	const giveawayContract = new ethers.Contract('0xb10a83FEe3D6D8147B6748c6051540054ec01bA1', giveawayabi, sign);
	console.log(sign);
	// Convert the $giveaway participants array into two lists: wallets and entries
	const walletList: string[] = [];
	const entryList: number[] = [];
	for (const participant of giveawayObj.participants) {
		walletList.push(participant.wallet);
		entryList.push(participant.entries);
	}

	const weiAmt = ethers.utils.parseUnits(giveawayObj.amount.toString());

	const tokenDistribution: BigNumber[] = [];
	tokenDistribution.length = giveawayObj.no_winners;
	tokenDistribution.fill(weiAmt.div(giveawayObj.no_winners));

	// The resulting tx
	let output;

	// The filter to use for the output
	let filter;
	if (giveawayObj.type == 'native-token') {
		output = await giveawayContract.lodgeGiveawayTokens(walletList, entryList, tokenDistribution, giveawayObj.contract_address, {});
		// output = await giveawayContract.lodgeGiveawayTokens(walletList, entryList, tokenDistribution, $giveaway.contract_address, { value: 10000000000000000n });

		filter = giveawayContract.filters.TokenGiveawayFinalised(get(signerAddress));
	} else {
		output = await giveawayContract.lodgeGiveawayETH(walletList, entryList, tokenDistribution, { value: weiAmt });
		console.log('awaiting output...');
		// output = await giveawayContract.lodgeGiveawayETH(walletList, entryList, tokenDistribution, { value: $giveaway.amount + 10000000000000000n });

		filter = giveawayContract.filters.ETHGiveawayFinalised(get(signerAddress));
		console.log('signer address', get(signerAddress));
	}
	console.log('OUTPUT', output);

	const txFinalised = await output.wait();
	console.log('TX FINALISED', txFinalised);
	console.log("Waiting for winners...");
	// Sign up to wait for the first event sent
	const winners = await waitForWinners(filter, giveawayContract);
	console.log("Winners await finished.");
	console.log('winners', winners);

	if (winners.size === giveawayObj.no_winners) {
		giveaway.update(($giveaway) => {
			// update the giveaway...
			$giveaway.winners = Array.from(winners);
			console.log('$giveaway.winners:', $giveaway.winners);

			$giveaway.round++;
			return $giveaway;
		});
	}

	return winners;
};

const waitForWinners = (filter: ethers.EventFilter, contract: ethers.Contract): Promise<Set<Winner>> => {
	return new Promise((resolve, reject) => {
		const winners = new Set<Winner>();
		console.log('initial winners', winners);

		contract.once(filter, (sender, amount: BigNumber[], win, event) => {
			console.log('triggeredOnce');
			console.log(event);

			for (let i = 0; i < win.length; i++) {
				// Assume amount is a BigNumber
				const amt = amount[i].div(win.length);
				const winnerSet: Winner = { wallet: win[i], hash: event.transactionHash, amount: amt};
				winners.add(winnerSet);
			}
			resolve(winners);
		});
	})

}
