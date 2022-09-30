import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { get } from 'svelte/store';

interface Giveaway {
	giveaway_type: string;
	project_contract_address: string;
	giveaway_amount: number;
}

const InitialState: Giveaway = {
	giveaway_type: '',
	project_contract_address: '',
	giveaway_amount: 0
};

export const giveaway = writable(InitialState);

giveaway.subscribe((state) => browser && sessionStorage.setItem('giveaway', JSON.stringify(state)));
