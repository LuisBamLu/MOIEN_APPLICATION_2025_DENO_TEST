// -- IMPORTS

import { writable } from 'svelte/store';

// -- CONSTANTS

const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 56em)' );
const maxWidthInEmMediaScreenTablet = window.matchMedia( '(max-width: 65em)' );

// -- VARIABLES

export let appDataStore = writable( null );
export let isMobileScreen = writable( maxWidthInEmMediaScreen.matches );
export let isTabletScreen = writable( maxWidthInEmMediaScreenTablet.matches );

// -- FUNCTIONS

export function handleResizeEvent(
    )
{
    isMobileScreen.set( maxWidthInEmMediaScreen.matches );
    isTabletScreen.set( maxWidthInEmMediaScreenTablet.matches );
}
