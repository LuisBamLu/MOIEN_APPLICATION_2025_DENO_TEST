// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { toast } from '$lib/toast';
import { hasUserPermission } from './profileStore';
import { urlParamsStore } from '$store/urlParamsStore';

// -- VARIABLES

export let bedArrayStore = writable( [] );
export let profileArrayStore = writable( [] );
export let propertyArrayStore = writable( [] );
export let spaceArrayStore = writable( [] );
export let bedTypeArrayStore = writable( [] );
export let selectedBedStore = writable( getInitialState() );
export let isBedLoading = writable( true );
export let errorMessage = writable( null );
export let isBedModalOpen = writable( false );
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
let url = '/admin/page/bed';

// -- FUNCTIONS

export async function loadBedArray(
    page = 1,
    limit = 15
    )
{
    isBedLoading.set( true );

    try
    {
        let urlParams = get( urlParamsStore );

        let response = await fetchData(
            url + '/list?' + urlParams.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
        );

        let bedArray = [];

        for ( let bed of response.bedMap.bedArray )
        {
            let userProfile = response.profileArray.find( ( profile ) => profile.userId === bed.userId );
            let property = response.propertyArray.find( ( property ) => property.id === bed.propertyId );
            let space = response.spaceArray.find( ( space ) => space.id === bed.spaceId );
            let bedType = response.bedTypeArray.find( ( bedType ) => bedType.id === bed.typeId );

            bedArray.push(
                {
                    ...bed,
                    spaceName: space ? space.name : 'Unknown',
                    bedType: bedType ? bedType.name : 'Unknown',
                    space,
                    property,
                    userProfile
                }
                );
        }

        if ( page === 1 )
        {
            bedArrayStore.set( bedArray )
        }
        else
        {
            bedArrayStore.update(
                ( _bedArray ) => _bedArray.concat( bedArray )
                );
        }

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );
        mergeStoreAndRemoveDuplicateById( propertyArrayStore, response.propertyArray );
        mergeStoreAndRemoveDuplicateById( spaceArrayStore, response.spaceArray );

        bedTypeArrayStore.set( response.bedTypeArray );

        hasMorePage.set(
            response.bedMap.hasMorePage
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isBedLoading.set( false );
    }
}

// ~~

export async function handleCreateBed(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedBedStore,
        url + '/add',
        finallyFunction,
        toggleBedModal,
        loadBedArray,
        'add-bed',
        isSubmitting
        );
}

// ~~

export async function handleEditBed(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedBedStore,
        url + '/set/',
        finallyFunction,
        toggleBedModal,
        loadBedArray,
        'set-bed',
        isSubmitting
        );
}

// ~~

export async function handleDeleteBed(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedBedStore,
        url + '/remove/',
        finallyFunction,
        toggleBedModal,
        loadBedArray,
        'remove-bed',
        isSubmitting
        );
}

// ~~

export function toggleBedModal(
    )
{
    let isOpen = get( isBedModalOpen );
    isBedModalOpen.set( !isOpen );
    isOpen = get( isBedModalOpen );

    if ( !isOpen )
    {
        selectedBedStore.set( getInitialState() );
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
            spaceId : null,
            typeId : null,
            personCount : 0,
            count : 0,
            userId : null
        }
        );
}
