// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';

// -- VARIABLES

export let errorMessage = writable( null );
export let isRentalAnnouncementLoading = writable( true );
export let isRentalAnnouncementModalOpen = writable( false );
export let profileArrayStore = writable( null );
export let rentalAnnouncementArrayStore = writable( null );
export let selectedRentalAnnouncementStore = writable( null );
export let propertyArrayStore = writable( null );
let url = '/api/admin/page/rental-announcement';

// -- FUNCTIONS

export async function loadRentalAnnouncementArray(
    )
{
    isRentalAnnouncementLoading.set( true );

    try
    {
        let response = await fetchData(
            url,
            { method: 'POST', credentials: 'include' }
        );

        rentalAnnouncementArrayStore.set(
            response.rentalAnnouncementArray
            );

        profileArrayStore.set(
            response.profileArray
            );

        propertyArrayStore.set(
            response.propertyArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isRentalAnnouncementLoading.set( false );
    }
}

// ~~

export async function handleCreateRentalAnnouncement(
    finallyFunction = () => {}
    )
{
    rentalAnnouncementArrayStore.set(
        await handleCreateObject(
            rentalAnnouncementArrayStore,
            selectedRentalAnnouncementStore,
            url + '/add',
            finallyFunction
            )
        );
}

// ~~

export async function handleEditRentalAnnouncement(
    finallyFunction = () => {}
    )
{
    rentalAnnouncementArrayStore.set(
        await handleEditObject(
            rentalAnnouncementArrayStore,
            selectedRentalAnnouncementStore,
            url + '/set',
            finallyFunction
            )
        );
}

// ~~

export async function handleDeleteRentalAnnouncement(
    finallyFunction = () => {}
    )
{
    rentalAnnouncementArrayStore.set(
        await handleDeleteObject(
            rentalAnnouncementArrayStore,
            selectedRentalAnnouncementStore,
            url + '/delete',
            finallyFunction
            )
        );
}

export function toggleRentalAnnouncementModal(
    )
{
    let isOpen = get( isRentalAnnouncementModalOpen );
    isRentalAnnouncementModalOpen.set( !isOpen );
}
