// -- IMPORTS

import { writable } from 'svelte/store';

// -- CONSTANTS

const deviceTokenStorageKey = 'device-token';

// -- FUNCTIONS

function createDeviceTokenStore(
    )
{
    let storedDeviceToken = localStorage.getItem( deviceTokenStorageKey );
    let { subscribe, set, update } = writable( storedDeviceToken );

    return (
        {
            subscribe,
            set:
                ( value ) =>
                {
                    localStorage.setItem( deviceTokenStorageKey, value );
                    set( value );
                },
            update,
            clear:
                () =>
                {
                    localStorage.removeItem( deviceTokenStorageKey );
                    set( null );
                }
        }
        );
}

// -- VARIABLES

export let deviceTokenStore = createDeviceTokenStore();
