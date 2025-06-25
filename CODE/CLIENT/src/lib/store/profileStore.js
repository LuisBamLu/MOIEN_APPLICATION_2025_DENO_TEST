// -- IMPORTS

import { writable } from 'svelte/store';

// -- VARIABLES

export let profileSignedInStore = writable( null );
export let isLoadingProfile = writable( false );
export let profileStateStore = writable({ openProfile: false });
