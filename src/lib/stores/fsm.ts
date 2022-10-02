import fsm from 'svelte-fsm';
import { connected } from 'svelte-ethers-store';
import { giveaway } from './giveaway';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

let isConnected: boolean;
connected.subscribe((val) => (isConnected = val));

const state = fsm('uninitialized', {
	uninitialized: {
		init(state) {
			// check if received state is valid state and transition to it (or default)
			return ['start', 'needs-giveaway-type', 'needs-contract-address', 'needs-amount', 'needs-spreadsheet'].includes(state) ? state : 'start';
		}
	},
	start: {
		next: 'needs-giveaway-type'
	},
	'needs-giveaway-type': {
		selectType(type: string) {
			return type === 'ethereum' ? 'needs-amount' : 'needs-contract-address';
		}
	},
	'needs-contract-address': {
		back: 'needs-giveaway-type',
		next: 'needs-amount'
	},
	'needs-amount': {
		back() {
			const currentState = get(giveaway);
			return currentState.giveaway_type === 'ethereum' ? 'needs-giveaway-type' : 'needs-contract-address';
		},
		next: 'needs-spreadsheet'
	},
	'needs-spreadsheet': {
		back: 'needs-amount',
		next: () => '' // processFile()
	}
});

state.init(browser && sessionStorage.getItem('state'));
state.subscribe((state) => browser && sessionStorage.setItem('state', state));

export default new Proxy(state, {
	get(target, property) {
		if (property === 'subscribe') return Reflect.get(target, property);
		return (...args) => {
			if (isConnected) {
				return Reflect.get(target, property)(...args);
			} else {
				return Reflect.get(target, 'bogusActionReturnsCurrentState')();
			}
		};
	}
});
