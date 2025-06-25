// -- IMPORTS

import { writable, get } from 'svelte/store';

// -- VARIABLES

export let isSidebarOpen = writable( true );

// -- FUNCTIONS

export function toggleSidebar(
    )
{
    let isOpen = get( isSidebarOpen );
    isSidebarOpen.set( !isOpen );
}
