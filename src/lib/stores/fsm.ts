import fsm from 'svelte-fsm';
import { connected } from 'svelte-ethers-store';
import { giveaway } from './giveaway';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

const sessionState = browser && sessionStorage.getItem('state');

export const state = fsm(sessionState ? sessionState : 'start', {
	start: {
		next: 'needs-connect'
	},
	'needs-connect': {
		back: 'start',
		next: 'needs-giveaway-type'
	},
	'needs-giveaway-type': {
		back() {
			return get(connected) ? 'start' : 'needs-connect';
		},
		selectType(type: string) {
			return type === 'ethereum' ? 'needs-amount' : 'needs-contract-address';
		}
	},
	'needs-contract-address': {
		back: 'needs-giveaway-type',
		next(validatorFunction: () => boolean) {
			return validatorFunction() ? 'needs-amount' : 'needs-contract-address';
		}
	},
	'needs-amount': {
		back() {
			const currentState = get(giveaway);
			return currentState.giveaway_type === 'ethereum' ? 'needs-giveaway-type' : 'needs-contract-address';
		},
		next(validatorFunction: () => boolean) {
			return validatorFunction() ? 'needs-spreadsheet' : 'needs-amount';
		}
	},
	'needs-spreadsheet': {
		back: 'needs-amount',
		next: () => '' // processFile()
	},

	final: {}
});

state.subscribe((state) => {
	giveaway;
	browser && sessionStorage.setItem('state', state);
});
