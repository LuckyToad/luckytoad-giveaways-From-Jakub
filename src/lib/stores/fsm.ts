import fsm from 'svelte-fsm';
import { connected } from 'svelte-ethers-store';
import { giveaway } from './giveaway';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { findWinners } from '$lib/web3';

let isConnected: boolean;
connected.subscribe((val) => (isConnected = val));

const state = fsm('uninitialized', {
	uninitialized: {
		init(state) {
			// check if received state is valid state and transition to it (or default)
			return ['start', 'needs-giveaway-type', 'needs-contract-address', 'needs-amount', 'needs-winners', 'needs-confirmation', 'spreadsheet-formatting', 'needs-spreadsheet', 'finding-winner', 'winners', 'summary'].includes(state) ? state : 'start';
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
			return currentState.type === 'ethereum' ? 'needs-giveaway-type' : 'needs-contract-address';
		},
		next: 'needs-winners'
	},
	'needs-winners': {
		back: 'needs-amount',
		next: 'needs-confirmation'
	},
	'needs-confirmation': {
		back: 'needs-winners',
		next: 'spreadsheet-formatting'
	},
	'spreadsheet-formatting': {
		back: 'needs-confirmation',
		next: 'needs-spreadsheet'
	},
	'needs-spreadsheet': {
		back: 'needs-confirmation',
		next: 'finding-winners'
	},
	'finding-winners': {
		_enter({ event }) {
			if (['next', 'reroll'].includes(event)) {
				findWinners().then(this.next);
			} else {
				// if you need to transition to another state, do something like this – calling
				// `debounce` puts it on the event loop so it's not sync w/in this function
				// this.oops.debounce();
			}
		},
		next: 'winners'
		// oops: 'somewhereElse'
	},
	winners: {
		reroll: 'finding-winners',
		summary: 'summary'
	},
	summary: {
		restart: 'needs-giveaway-type'
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
