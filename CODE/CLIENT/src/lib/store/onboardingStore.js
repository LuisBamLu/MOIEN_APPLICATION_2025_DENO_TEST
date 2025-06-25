// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { writable } from 'svelte/store';

// -- VARIABLES

export let isOnboardingCompletedStore = writable(
    getJsonObject(
        localStorage.getItem( 'isOnboardingCompleted' )
        )
    );
