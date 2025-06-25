// -- IMPORTS

import { writable } from 'svelte/store';

// -- VARIABLES

export let propertyArrayStore = writable( [] );
export let isVerifyIdentityModalOpen = writable( false );
