// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData } from '$lib/base';

// -- VARIABLES

export let notificationArrayStore = writable( null );
export let mediumArrayStore = writable( null );
export let typeArrayStore = writable( null );
export let isNotificationLoading = writable( true );
export let errorMessage = writable( null );
export let isNotificationModalOpen = writable( false );

// -- FUNCTIONS

export async function loadNotificationArray(
    )
{
    isNotificationLoading.set( true );

    try
    {
        let response = await fetchData(
            '/api/notifications',
            { method: 'POST', credentials: 'include' }
        );

        notificationArrayStore.set(
            response.notificationArray
            );
        mediumArrayStore.set(
            response.mediumArray
            );
        typeArrayStore.set(
            response.typeArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isNotificationLoading.set( false );
    }
}

// ~~

export function toggleNotificationModal(
    )
{
    let isOpen = get( isNotificationModalOpen );
    isNotificationModalOpen.set( !isOpen );
}
