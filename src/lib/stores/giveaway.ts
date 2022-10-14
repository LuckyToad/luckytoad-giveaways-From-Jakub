import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface Giveaway {
	type: string;
	contract_address: string;
	currency: string;
	amount: number;
	participants: object[];
	round: number;
	no_winners: number;
	winners: object[];
}

const InitialState: Giveaway = {
	type: '',
	contract_address: '',
	currency: '',
	amount: 0,
	participants: [],
	round: 0,
	no_winners: 0,
	winners: []
};

const sessionState = browser && sessionStorage.getItem('giveaway');
export const giveaway = writable(sessionState ? JSON.parse(sessionState) : InitialState);

giveaway.subscribe((state) => {
	browser && sessionStorage.setItem('giveaway', JSON.stringify(state));
});
