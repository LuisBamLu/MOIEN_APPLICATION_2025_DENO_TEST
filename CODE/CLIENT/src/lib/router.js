// -- IMPORTS

import { writable } from 'svelte/store';
import { useRouter, navigate } from 'svelte-routing';
import { readable } from 'svelte/store';
import { navigationAdjustedStore } from '$store/navigationStore';

// -- VARIABLES

export let currentPathname = writable( window.location.pathname );
export let currentRoutePath =
    readable(
        '',
        set =>
        {
            let router = useRouter();
            let unsubscribe =
                router.activeRoute.subscribe(
                    $activeRoute =>
                    {
                        if ( $activeRoute && $activeRoute.route )
                        {
                            set( $activeRoute.route.path );
                        }
                    }
                    );

            return unsubscribe;
        }
    );

let originalPushState = history.pushState;
let originalReplaceState = history.replaceState;

// -- FUNCTIONS

function setPathname(
    newPath
    )
{
    currentPathname.set( newPath );
}

// ~~

export function ensureLanguageTagInPath(
    location,
    languageTagStore
    )
{
    let pathSegments = location.pathname.split( '/' ).filter( Boolean );

    if ( location.pathname === '/' || ( pathSegments.length > 0 && pathSegments[ 0 ].length !== 2 ) )
    {
        let newPath = location.pathname === '/' ? `/${ languageTagStore }/` : `/${ languageTagStore }/${ pathSegments.join( '/' ) }`;

        if ( location.search )
        {
            newPath += location.search;
        }

        navigate( newPath, { replace: true } );
    }

    navigationAdjustedStore.set( true );
}

// -- STATEMENTS

window.addEventListener(
    'popstate',
    () =>
    {
        setPathname( window.location.pathname );
    }
    );

// ~~

history.pushState =
    function( state, title, url )
    {
        originalPushState.call( this, state, title, url );
        setPathname( window.location.pathname );
    };

// ~~

history.replaceState =
    function( state, title, url )
    {
        originalReplaceState.call( this, state, title, url );
        setPathname( window.location.pathname );
    };
