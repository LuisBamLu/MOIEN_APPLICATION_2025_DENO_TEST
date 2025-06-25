// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';

// -- VARIABLES

export let visitStatusArrayStore = writable( null );
export let selectedVisitStatusStore = writable( null );
export let isVisitStatusLoading = writable( true );
export let errorMessage = writable( null );
export let isVisitStatusModalOpen = writable( false );
let url = '/api/visit-status';

// -- FUNCTIONS

export async function loadVisitStatusArray(
    )
{
    isVisitStatusLoading.set( true );

    try
    {
        let response = await fetchData(
            url,
            { method: 'POST', credentials: 'include' }
        );

        visitStatusArrayStore.set(
            response.visitStatusArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isVisitStatusLoading.set( false );
    }
}

// ~~

export async function handleCreateVisitStatus(
    finallyFunction = () => {}
    )
{
    visitStatusArrayStore.set(
        await handleCreateObject(
            visitStatusArrayStore,
            selectedVisitStatusStore,
            url + '/add',
            finallyFunction
            )
        );
}

// ~~

export async function handleEditVisitStatus(
    finallyFunction = () => {}
    )
{
    visitStatusArrayStore.set(
        await handleEditObject(
            visitStatusArrayStore,
            selectedVisitStatusStore,
            url + '/set',
            finallyFunction
            )
        );
}

// ~~

export async function handleDeleteVisitStatus(
    finallyFunction = () => {}
    )
{
    visitStatusArrayStore.set(
        await handleDeleteObject(
            visitStatusArrayStore,
            selectedVisitStatusStore,
            url +  '/delete',
            finallyFunction
            )
        );
}

export function toggleVisitStatusModal(
    )
{
    let isOpen = get( isVisitStatusModalOpen );
    isVisitStatusModalOpen.set( !isOpen );
}
