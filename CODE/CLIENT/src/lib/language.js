// -- IMPORTS

import { setLanguageTag  } from 'senselogic-gist';
import { navigate } from 'svelte-routing';

// -- FUNCTIONS

export function getUpdatedLanguageTag(
    languageTagArrayStore
    )
{
    let currentLanguageTag = getLanguageFromPathname( window.location.pathname, languageTagArrayStore );

    let browserLanguageCode = navigator.language.split( '-' )[ 0 ];
    let localStorageLanguageTag = localStorage.getItem( 'languageTag' );

    if ( currentLanguageTag )
    {
        if ( languageTagArrayStore.includes( currentLanguageTag ) )
        {
            localStorage.setItem( 'languageTag', currentLanguageTag );
        }
        else
        {
            localStorage.setItem( 'languageTag', 'en' );
            currentLanguageTag = 'en';

            let currentPath = window.location.pathname;
            let newPath = currentPath.replace( /^\/[^\/]+\//, `/${ currentLanguageTag }/` );

            navigate( newPath );
        }
    }
    else
    {
        if ( localStorageLanguageTag && localStorageLanguageTag !== 'undefined' )
        {
            currentLanguageTag = localStorageLanguageTag;
        }
        else
        {
            if ( languageTagArrayStore.includes( browserLanguageCode ) )
            {
                localStorage.setItem( 'languageTag', browserLanguageCode );
                currentLanguageTag = browserLanguageCode;
            }
            else
            {
                localStorage.setItem( 'languageTag', 'en' );
                currentLanguageTag = 'en';
            }
        }
    }

    setLanguageTag( currentLanguageTag );

    return currentLanguageTag;
}

// ~~

function getLanguageFromPathname(
    pathname,
    supportedLanguagesTags
    )
{
    let parts = pathname.split( '/' );
    let language = parts.find( part => supportedLanguagesTags.includes( part ) );

    return language || null;
}
