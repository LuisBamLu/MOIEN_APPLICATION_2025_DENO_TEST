// -- IMPORTS

import { navigate } from 'svelte5-router';
import { get, writable } from 'svelte/store';

// -- FUNCTIONS

export function useConfirmationModal(
    )
{
    // -- VARIABLES

    let isFormModified = writable( false );
    let isConfirmationModalOpen = writable( false );
    let pendingNavigation = writable( null );

    // -- FUNCTIONS

    function toggleConfirmModal(
        )
    {
        isConfirmationModalOpen.set( !get( isConfirmationModalOpen ) );
    }

    // ~~

    function interceptNavigation(
        event
        )
    {
        if ( get( isFormModified ) )
        {
            event.preventDefault();
            toggleConfirmModal();
            pendingNavigation.set( event );
        }
    }

    // ~~

    function addNavigationEventListener(
        )
    {
        navigation.addEventListener(
                'navigate',
                interceptNavigation
                );
    }

    // ~~

    function removeNavigationEventListener(
        )
    {
        navigation.removeEventListener(
                'navigate',
                interceptNavigation
                );
    }

    // ~~

    function finalizeNavigation(
        )
    {
        let navigation = get( pendingNavigation );

        if ( navigation )
        {
            let url = new URL( navigation.destination.url );

            pendingNavigation.set( null );
            isFormModified.set( false );

            navigate( url.pathname, { replace: true } );
        }

        toggleConfirmModal();
    }

    // ~~

    function handleChange(
        )
    {
        isFormModified.set( true );
    }

    return (
        {
            addNavigationEventListener,
            finalizeNavigation,
            handleChange,
            interceptNavigation,
            isConfirmationModalOpen,
            isFormModified,
            pendingNavigation,
            removeNavigationEventListener,
            toggleConfirmModal,
        }
        );
}
