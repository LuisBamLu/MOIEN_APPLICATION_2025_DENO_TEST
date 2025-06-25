// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getTextSlug, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { getJsonText, logError } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { hasUserPermission } from './profileStore';

// -- VARIABLES

export let spaceTypeArrayStore = writable( [] );
export let selectedSpaceTypeStore = writable( getInitialState() );
export let isSpaceTypeLoading = writable( true );
export let errorMessage = writable( null );
export let isSpaceTypeModalOpen = writable( false );
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
let url = '/admin/api/space-type';

// -- FUNCTIONS

export async function loadSpaceTypeArray(
    )
{
    isSpaceTypeLoading.set( true );

    try
    {
        let response = await fetchData(
            '/api/space-type/get',
            { method: 'POST', credentials: 'include' }
        );

        spaceTypeArrayStore.set(
            response.spaceTypeArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isSpaceTypeLoading.set( false );
    }
}

// ~~

export async function handleCreateSpaceType(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedSpaceTypeStore,
        url + '/add',
        finallyFunction,
        toggleSpaceTypeModal,
        loadSpaceTypeArray,
        'add-space-type',
        isSubmitting
        );
}

// ~~

export async function handleEditSpaceType(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedSpaceTypeStore,
        url + '/set/',
        finallyFunction,
        toggleSpaceTypeModal,
        loadSpaceTypeArray,
        'set-space-type',
        isSubmitting
        );
}

// ~~

export async function handleDeleteSpaceType(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedSpaceTypeStore,
        url + '/remove/',
        finallyFunction,
        toggleSpaceTypeModal,
        loadSpaceTypeArray,
        'remove-space-type',
        isSubmitting
        );
}

export function toggleSpaceTypeModal(
    )
{
    let isOpen = get( isSpaceTypeModalOpen );
    isSpaceTypeModalOpen.set( !isOpen );
    isOpen = get( isSpaceTypeModalOpen );

    if ( !isOpen )
    {
        selectedSpaceTypeStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let spaceTypeArray = get( spaceTypeArrayStore );
    let spaceTypeCount = spaceTypeArray.length;

    return (
        {
            id : null,
            number : spaceTypeCount + 1,
            name : ''
        }
        );
}
