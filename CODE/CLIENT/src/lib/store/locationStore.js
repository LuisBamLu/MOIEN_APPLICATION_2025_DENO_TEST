// -- IMPORTS

import { writable } from 'svelte/store';

// -- VARIABLES

export let selectedLocationStore = writable( null );
export let defaultLocationStore = writable( null );
export let isMobileListOpenStore = writable( true );
export let isMobileMapOpenStore = writable( false );
export let isDesktopMapOpenStore = writable( true );
export let isDesktopListOpenStore = writable( true );

// -- STATEMENTS

defaultLocationStore.set( { latitude: '49.610', longitude: '6.130' } );
