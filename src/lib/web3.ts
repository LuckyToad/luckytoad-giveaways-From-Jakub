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
const INFURA_GOERLI_URL = import.meta.env.VITE_INFURA_GOERLI_URL;
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
		// {
		// 	id: '0x5',
		// 	token: 'goETH',
		// 	label: 'Ethereum Goerli',
		// 	rpcUrl: INFURA_GOERLI_URL
		// }
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
	wallet: string;
	hash: string;
	amount: string;
}

export const findWinners = async () => {
	const giveawayObj = get(giveaway);

	// logic for determining winners...
	const sign = get(signer);
	const giveawayContract = new ethers.Contract('0x134640E09e67e5ed408Fe2892030Ac9780f31A83', giveawayabi, sign);
	// Convert the $giveaway participants array into two lists: wallets and entries
	const walletList: string[] = [];
	const entryList: number[] = [];
	for (const participant of giveawayObj.participants) {
		walletList.push(participant.wallet);
		entryList.push(participant.entries);
	}
	let decimals;
	if (giveawayObj.type == 'native-token') {
		decimals = await new ethers.Contract(giveawayObj.contract_address, abi, sign).decimals();
	} else {
		decimals = 18;
	}
	const weiAmt = ethers.utils.parseUnits(giveawayObj.amount.toString(), decimals);

	const tokenDistribution: BigNumber[] = [];
	tokenDistribution.length = giveawayObj.no_winners;
	tokenDistribution.fill(weiAmt.div(giveawayObj.no_winners));

	// The resulting tx
	let output;

	// The filter to use for the output
	let filter: ethers.Filter;
	let winnersPromise;
	if (giveawayObj.type == 'native-token') {
		let approval = await giveawayContract.approve("0x134640E09e67e5ed408Fe2892030Ac9780f31A83", weiAmt);
		await approval.wait();
		filter = giveawayContract.filters.TokenGiveawayFinalised(get(signerAddress));
		winnersPromise = waitForWinners(filter, giveawayContract, decimals);
		output = await giveawayContract.lodgeGiveawayTokens(walletList, entryList, tokenDistribution, giveawayObj.contract_address, {});
		
	} else {
		
		filter = giveawayContract.filters.ETHGiveawayFinalised(get(signerAddress));
		winnersPromise = waitForWinners(filter, giveawayContract, decimals);
		output = await giveawayContract.lodgeGiveawayETH(walletList, entryList, tokenDistribution, { value: weiAmt });
	}

	console.time('tx');
	let winners = await winnersPromise;
	// Don't wait for the tx to actually be lodged to the network, just start the winner wait
	//const txFinalised = await output.wait();
	//console.timeEnd('tx');


	// Sign up to wait for the first event sent
	console.time('winners');
	
	console.timeEnd('winners');

	if (winners.size === giveawayObj.no_winners) {
		giveaway.update(($giveaway) => {
			// update the giveaway...
			$giveaway.winners = Array.from(winners);
			$giveaway.round++;
			return $giveaway;
		});
	}

	return winners;
};

const waitForWinners = (filter: ethers.EventFilter, contract: ethers.Contract, decimals: number): Promise<Set<Winner>> => {
	return new Promise((resolve, reject) => {
		const winners = new Set<Winner>();

		contract.once(filter, (sender, amount: BigNumber, win, event) => {
			for (const element of win) {
				// Assume amount is a BigNumber
				const amt = ethers.utils.formatUnits(amount.div(win.length), decimals);
				const winnerSet: Winner = { wallet: element, hash: event.transactionHash, amount: amt };
				winners.add(winnerSet);
			}
			resolve(winners);
		});
	});
};
