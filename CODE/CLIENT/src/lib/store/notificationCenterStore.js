// -- IMPORTS

import { writable } from 'svelte/store';
import { fetchData } from '../base';

// -- FUNCTIONS

function createStore() {
    let { subscribe, set, update } = writable( [] );

    let add = ( notification ) =>
            update( ( notificationArray ) =>
                notificationArray
                    .concat( notification )
                    .sort( ( a, b ) => new Date( b.creationTimestamp ).getTime() - new Date( a.creationTimestamp ).getTime() )
                );

    let read = ( notificationId ) =>
        update( ( notificationArray ) =>
            notificationArray.map( ( notification ) =>
                notification.id === notificationId
                ? { ...notification, isRead: true }
                : notification
                )
            );

    let markAllAsRead = () =>
        update( ( notificationArray ) =>
            notificationArray.map(
                ( notification ) => ( { ...notification, isRead: true } )
                )
            );

    let dismiss = ( notificationId ) =>
            update( ( notificationArray ) =>
                notificationArray.filter(
                    ( notification ) => notification.id !== notificationId
                    )
                );

    let dismissAll = () => update( () => [] );

    return (
        {
            subscribe,
            read,
            markAllAsRead,
            add,
            dismiss,
            dismissAll,
            clear : () => set( [] ),
            init : set,
        }
        );
}

// ~~

export async function loadNotificationArray(
    )
{
    let notificationResponse = await fetchData(
        '/api/notification',
        {
            method: 'POST',
            credentials : 'include'
        }
        );

    if ( notificationResponse )
    {
        notificationCenterStore.init( notificationResponse.notificationArray )
    }
}

// -- VARIABLES

export let notificationCenterStore = createStore();
