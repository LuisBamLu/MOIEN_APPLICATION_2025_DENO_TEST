// -- IMPORTS

import { getJsonObject, getJsonText } from 'senselogic-gist';
import { writable, derived } from 'svelte/store';

// -- CONSTANTS

const bookedPropertyStorageKey = 'booked-property';
const guestCounterStorageKey = 'guest-counter';

// -- VARIABLES

let initialBookedPropertyState =
    {
        featureArray: [],
        nightCountByPriceMap: {},
        conversionRate: 0,
        userId: null,
        id: null
    };
let initialGuestCounter =
    {
        adult: 0,
        children: 0,
        infant: 0,
        pet: 0
    };
export let guestCounterMaxStore = writable( 10 );
export let guestCounterStore = createStore( initialGuestCounter, guestCounterStorageKey );
export let totalGuestCounterStore =
    derived(
        guestCounterStore,
        ( $guestCounter )  =>
        {
            return $guestCounter.adult + $guestCounter.children + $guestCounter.infant + $guestCounter.pet;
        }
        );
export let maxBugdetShortTermStore = writable( 4000 );
export let maxBugdetLongTermStore = writable( 10000 );
export let bookedPropertyStore = createStore( initialBookedPropertyState, bookedPropertyStorageKey );

// -- FUNCTIONS

function createStore(
    initialValue,
    storageKey
    )
{
    let storedDeviceToken = getJsonObject( localStorage.getItem( storageKey ) );
    let { subscribe, set, update } = writable( storedDeviceToken ?? initialValue );

    return (
        {
            subscribe,
            set:
                ( value ) =>
                {
                    localStorage.setItem( storageKey, getJsonText( value ) );
                    set( value );
                },
            update,
            clear:
                () =>
                {
                    localStorage.removeItem( storageKey );
                    set( null );
                }
        }
        );
}
