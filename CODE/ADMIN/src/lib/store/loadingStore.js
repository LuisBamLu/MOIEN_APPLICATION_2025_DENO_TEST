// -- IMPORTS

import { writable } from 'svelte/store';

// -- VARIABLES

export let loading = writable( false );
export let progress = writable( 0 );

// -- FUNCTIONS

export function setLoaded(
    )
{
    let intervalId =
        setInterval(
            () =>
            {
                progress.update(
                    value =>
                    {
                        if ( value >= 100 )
                        {
                            clearInterval( intervalId );
                            loading.set( false );
                        }

                        return Math.min( 100, value + 1 );
                    }
                    );
            },
            50
            );
}

// ~~

export function setLoading(
    )
{
    loading.set( true );
    progress.set( 0 );
}

// ~~

export function increaseProgress(
    value
    )
{
    progress.update( n => n + value );
}
