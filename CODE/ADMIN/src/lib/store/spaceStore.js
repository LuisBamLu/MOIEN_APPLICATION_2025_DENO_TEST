// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { hasUserPermission } from './profileStore';
import { getJsonText, logError } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let spaceArrayStore = writable( [] );
export let profileArrayStore = writable( [] );
export let propertyArrayStore = writable( [] );
export let spaceTypeArrayStore = writable( [] );
export let selectedSpaceStore = writable( getInitialState() );
export let isSpaceLoading = writable( true );
export let errorMessage = writable( null );
export let isSpaceModalOpen = writable( false );
export let hasMorePage = writable( false );
export let isSubmitting = writable( false );
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
let url = '/admin/page/space';

// -- FUNCTIONS

export async function loadSpaceArray(
    page = 1,
    limit = 15
    )
{
    isSpaceLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '/list?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
        );

        let spaceArray = [];

        for ( let space of response.spaceArray )
        {
            let userProfile = response.profileArray.find( ( profile ) => profile.userId === space.userId );
            let property = response.propertyArray.find( ( property ) => property.id === space.propertyId );
            let type = response.spaceTypeArray.find( ( type ) => type.id === space.typeId );

            spaceArray.push(
                {
                    ...space,
                    spaceType: type.name ?? 'Unknown',
                    property,
                    userProfile,
                    type
                }
                );
        }

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );
        mergeStoreAndRemoveDuplicateById( propertyArrayStore, response.propertyArray );

        if ( page === 1 )
        {
            spaceArrayStore.set( spaceArray );
        }
        else
        {
            spaceArrayStore.update(
                ( spaceArray ) => spaceArray.concat( spaceArray )
                );
        }

        spaceTypeArrayStore.set( response.spaceTypeArray );

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
        isSpaceLoading.set( false );
    }
}

// ~~

export async function handleCreateSpace(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedSpaceStore,
        url + '/add',
        finallyFunction,
        toggleSpaceModal,
        loadSpaceArray,
        'add-space',
        isSubmitting
        );
}

// ~~

export async function handleEditSpace(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedSpaceStore,
        url + '/set/',
        finallyFunction,
        toggleSpaceModal,
        loadSpaceArray,
        'set-space',
        isSubmitting
        );
}

// ~~

export async function handleDeleteSpace(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedSpaceStore,
        url + '/remove/',
        finallyFunction,
        toggleSpaceModal,
        loadSpaceArray,
        'remove-space',
        isSubmitting
        );
}

// ~~

export function toggleSpaceModal(
    )
{
    let isOpen = get( isSpaceModalOpen );
    isSpaceModalOpen.set( !isOpen );
    isOpen = get( isSpaceModalOpen );

    if ( !isOpen )
    {
        selectedSpaceStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    return (
        {
            id : null,
            propertyId : null,
            typeId : null,
            name : '',
            description : '',
            floorNumber : 0,
            area : 0,
            userId : null,
            userProfile : {},
            property : {},
            type : {}
        }
        );
}
