// -- IMPORTS

import { writable } from 'svelte/store';

// -- VARIABLES

export let urlParamsStore =
    writable( new URLSearchParams( window.location.search ) );

// -- FUNCTIONS
export function updateUrlParamsStore(
    )
{
    urlParamsStore
        .set( new URLSearchParams( window.location.search ) );
}

// -- STATEMENTS

window.addEventListener( 'popstate', updateUrlParamsStore );

// ~~

urlParamsStore.subscribe(
    ( urlParam ) =>
    {
        let newUrl = `${ window.location.pathname }?${ urlParam.toString() }`;

        if ( newUrl !== window.location.href )
        {
            window.history.replaceState( {}, '', newUrl );
        }
    }
    );
