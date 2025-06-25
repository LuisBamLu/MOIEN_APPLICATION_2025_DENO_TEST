// -- IMPORTS

import { writable } from 'svelte/store';

// -- FUNCTIONS

export function useIntersectionObserver(
    callbackFunction = () => {},
    optionMap = {}
    )
{
    let observer = null;
    let page = writable( 1 );
    let bottomElement = null;

    function handleObserver(
        )
    {
        if ( observer !== null )
        {
            observer.disconnect();
        }

        observer = new IntersectionObserver(
            ( entryArray ) =>
            {
                for ( let index = 0; index < entryArray.length; index += 1 )
                {
                    const entry = entryArray[ index ];

                    if ( entry.isIntersecting )
                    {
                        page.update( ( previousState ) => previousState + 1 );
                        callbackFunction();
                    }
                }
            },
            optionMap
            );

        if ( bottomElement !== null )
        {
            observer.observe( bottomElement );
        }
    }

    function handleStopObserving(
        )
    {
        if ( observer !== null )
        {
            observer.disconnect();
            observer = null;
        }
    }

    return (
        {
            handleObserver,
            page,
            bottomElement,
            handleStopObserving,
            setBottomElement : ( element ) =>
                {
                    bottomElement = element;

                    if ( observer !== null )
                    {
                        observer.observe( bottomElement );
                    }
                }
        }
        );
}
