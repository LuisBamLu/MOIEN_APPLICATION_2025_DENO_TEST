// -- IMPORTS

import { writable } from 'svelte/store';

// -- VARIABLES

export let cityArrayStore = writable( null );
export let cityArrayStoreByCountryCode = writable( null );
export let cityArrayStoreLoading = writable( false );
export let showCitySelector = writable( false );
