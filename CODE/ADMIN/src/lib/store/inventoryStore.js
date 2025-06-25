// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { hasUserPermission } from './profileStore';
import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let inventoryArrayStore = writable( [] );
export let selectedInventoryStore = writable( getInitialState() );
export let profileArrayStore = writable( [] );
export let documentArrayStore = writable( [] );
export let propertyArrayStore = writable( [] );
export let isInventoryLoading = writable( true );
export let errorMessage = writable( null );
export let isInventoryModalOpen = writable( false );
export let hasMorePage = writable( false );
export let
{
    addNavigationEventListener,
    finalizeNavigation,
    handleChange,
    interceptNavigation,
    isConfirmationModalOpen,
    isFormModified,
    pendingNavigation,
    removeNavigationEventListener,
    toggleConfirmModal
} = useConfirmationModal();
let url = '/api/admin/page/inventory';

// -- FUNCTIONS

export async function loadInventoryArray(
    page = 1,
    limit = 15
    )
{
    isInventoryLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
        );

        if ( page === 1 )
        {
            inventoryArrayStore.set( response.inventoryArray );
        }
        else
        {
            inventoryArrayStore.update( ( _inventoryArray ) => _inventoryArray.concat( response.inventoryArray ) );
        }
        profileArrayStore.set( response.profileArray );
        documentArrayStore.set( response.documentArray );
        propertyArrayStore.set( response.propertyArray );
        hasMorePage.set(
            response.hasMorePage
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isInventoryLoading.set( false );
    }
}

// ~~

export async function handleCreateInventory(
    finallyFunction = () => {}
    )
{
    inventoryArrayStore.set(
        await handleCreateObject(
            inventoryArrayStore,
            selectedInventoryStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleEditInventory(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetInventoryPermission = hasUserPermission( 'set-inventory' );

        if ( !hasSetInventoryPermission )
        {
            return;
        }

        let inventoryData = get( selectedInventoryStore )
        let { id : inventoryId, ...updatedInventory } = inventoryData;

        let response = await fetchData(
            url + '/' + inventoryId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { inventoryData : updatedInventory } )
            }
            );

        inventoryArrayStore.update(
            inventoryArray =>
                inventoryArray.map( inventory => inventory.id === inventoryId
                    ? inventoryData
                    : inventory
                )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleInventoryModal();
    }
}

// ~~

export async function handleDeleteInventory(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetInventoryPermission = hasUserPermission( 'set-inventory' );

        if ( !hasSetInventoryPermission )
        {
            return;
        }

        let inventoryData = get( selectedInventoryStore )
        let { id : inventoryId } = inventoryData;

        let response = await fetchData(
            url + '/' + inventoryId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        inventoryArrayStore.update(
            inventoryArray =>
                inventoryArray.filter( inventory => inventory.id !== inventoryId )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleInventoryModal();
    }
}

export function toggleInventoryModal(
    )
{
    let isOpen = get( isInventoryModalOpen );
    isInventoryModalOpen.set( !isOpen );
    isOpen = get( isInventoryModalOpen );

    if ( !isOpen )
    {
        selectedInventoryStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    return (
        {
            id: null,
            propertyId: null,
            date: '',
            name: '',
            lessorUserProfileId: null,
            tenantUserProfileId: null,
            keyCount: 0,
            description: '',
            documentIdArray: null,
            userId: null
        }
        );
}
