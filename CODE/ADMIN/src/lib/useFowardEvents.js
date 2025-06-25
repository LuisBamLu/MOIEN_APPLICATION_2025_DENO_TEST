import { onMount, onDestroy } from 'svelte';

// -- CONSTANTS

const eventPrefix = /^on/;
const events = [];

// -- STATEMENTS

Object.keys( globalThis ).forEach(
    key =>
    {
        if ( eventPrefix.test( key ) )
        {
            events.push( key.replace( eventPrefix, '' ) );
        }
    }
    );

// -- FUNCTIONS

function useForwardEvents(
    getRef,
    forwardCallback
    )
{
    const destructors = [];

    function forward( event )
    {
        if ( typeof forwardCallback === 'function' )
        {
            forwardCallback( event );
        }
    }

    onMount(
        () =>
        {
            const ref = getRef();

            events.forEach(
                event =>
                {
                    if ( ref instanceof Element )
                    {
                        ref.addEventListener( event, forward );
                        destructors.push(
                            () => ref.removeEventListener( event, forward )
                            );
                    }
                    else if ( ref && typeof ref.$on === 'function' )
                    {
                        const unsubscribe = ref.$on( event, forward );
                        destructors.push( unsubscribe );
                    }
                }
                );
        }
        );

    onDestroy(
        () =>
        {
            while ( destructors.length )
            {
                destructors.pop()();
            }
        }
        );
}

// -- EXPORTS
export { useForwardEvents };
