// -- IMPORTS

import { getJsonObject, getJsonText } from 'senselogic-gist';
import { writable } from 'svelte/store';

// -- CONSTANTS

const newsletterSubscriptionStorageKey = 'newsletter-subscription';

// -- VARIABLES

function createNewsletterSubscriptionStore(
    )
{
    let storedNewsletterSubscription = localStorage.getItem( newsletterSubscriptionStorageKey );
    let { subscribe, set, update } = writable( getJsonObject( storedNewsletterSubscription ) );

    return (
        {
            subscribe,
            set:
                ( value ) =>
                {
                    localStorage.setItem( newsletterSubscriptionStorageKey, getJsonText( value ) );
                    set( value );
                },
            update,
            clear:
                () =>
                {
                    localStorage.removeItem( newsletterSubscriptionStorageKey );
                    set( null );
                }
        }
        );
}

// ~~

export let newsletterSubscriptionStore = createNewsletterSubscriptionStore();
