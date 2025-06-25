// -- IMPORTS

import { writable } from 'svelte/store';

// -- VARIABLES

export let newFileArray = writable( [] );
export let initialFileArray = writable( [] );
export let deletedFileArray = writable( [] );
