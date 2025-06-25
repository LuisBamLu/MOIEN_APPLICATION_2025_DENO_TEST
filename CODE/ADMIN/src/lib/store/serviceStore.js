// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';

// -- VARIABLES

export let serviceArrayStore = writable( [] );
export let profileArrayStore = writable( [] );
export let serviceTypeArrayStore = writable( [] );
export let selectedServiceStore = writable( null );
export let isServiceLoading = writable( true );
export let errorMessage = writable( null );
export let isServiceModalOpen = writable( false );
let url = '/api/admin/page/service';

// -- FUNCTIONS

export async function loadServiceArray(
    )
{
    isServiceLoading.set( true );

    try
    {
        let response = await fetchData(
            url,
            { method: 'POST', credentials: 'include' }
        );

        serviceArrayStore.set(
            response.serviceArray
            );
        serviceTypeArrayStore.set(
            response.serviceTypeArray
            );
        profileArrayStore.set(
            response.profileArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isServiceLoading.set( false );
    }
}

// ~~

export async function handleCreateService(
    finallyFunction = () => {}
    )
{
    serviceArrayStore.set(
        await handleCreateObject(
            serviceArrayStore,
            selectedServiceStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleEditService(
    finallyFunction = () => {}
    )
{
    serviceArrayStore.set(
        await handleEditObject(
            serviceArrayStore,
            selectedServiceStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleDeleteService(
    finallyFunction = () => {}
    )
{
    serviceArrayStore.set(
        await handleDeleteObject(
            serviceArrayStore,
            selectedServiceStore,
            url,
            finallyFunction
            )
        );
}

export function toggleServiceModal(
    )
{
    let isOpen = get( isServiceModalOpen );
    isServiceModalOpen.set( !isOpen );
}
