// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getTextSlug, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { getJsonText, logError } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { hasUserPermission } from './profileStore';

// -- VARIABLES

export let propertyTypeArrayStore = writable( [] );
export let selectedPropertyTypeStore = writable( getInitialState() );
export let isPropertyTypeLoading = writable( true );
export let errorMessage = writable( null );
export let isPropertyTypeModalOpen = writable( false );
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
let url = '/admin/api/property-type';

// -- FUNCTIONS

export async function loadPropertyTypeArray(
    )
{
    isPropertyTypeLoading.set( true );

    try
    {
        let response =
            await fetchData(
                '/api/property-type/get',
                { method: 'POST', credentials: 'include' }
            );

        propertyTypeArrayStore.set(
            response.propertyTypeArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isPropertyTypeLoading.set( false );
    }
}

// ~~

export async function handleCreatePropertyType(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedPropertyTypeStore,
        url + '/add',
        finallyFunction,
        togglePropertyTypeModal,
        loadPropertyTypeArray,
        'add-property-type',
        isSubmitting
        );
}

// ~~

export async function handleEditPropertyType(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedPropertyTypeStore,
        url + '/set/',
        finallyFunction,
        togglePropertyTypeModal,
        loadPropertyTypeArray,
        'set-property-type',
        isSubmitting
        );
}

// ~~

export async function handleDeletePropertyType(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedPropertyTypeStore,
        url + '/remove/',
        finallyFunction,
        togglePropertyTypeModal,
        loadPropertyTypeArray,
        'remove-property-type',
        isSubmitting
        );
}

export function togglePropertyTypeModal(
    )
{
    let isOpen = get( isPropertyTypeModalOpen );
    isPropertyTypeModalOpen.set( !isOpen );
    isOpen = get( isPropertyTypeModalOpen );

    if ( !isOpen )
    {
        selectedPropertyTypeStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let propertyTypeArray = get( propertyTypeArrayStore );
    let propertyTypeCount = propertyTypeArray.length;

    return (
        {
            id : null,
            number : propertyTypeCount + 1,
            name : ''
        }
        );
}
