// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getTextSlug, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { hasUserPermission } from './profileStore';
import { getJsonText, logError } from 'senselogic-gist';
import { toast } from '$lib/toast';

// -- VARIABLES

export let documentTypeArrayStore = writable( [] );
export let selectedDocumentTypeStore = writable( getInitialState() );
export let isDocumentTypeLoading = writable( true );
export let errorMessage = writable( null );
export let isDocumentTypeModalOpen = writable( false );
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
let url = '/admin/api/document-type';

// -- FUNCTIONS

export async function loadDocumentTypeArray(
    )
{
    isDocumentTypeLoading.set( true );

    try
    {
        let hasRemoveUserRightPermission = hasUserPermission( 'list-document-type' );

        if ( !hasRemoveUserRightPermission )
        {
            return;
        }

        let response = await fetchData(
            '/api/document-type/list',
            { method: 'POST', credentials: 'include' }
        );

        documentTypeArrayStore.set(
            response.documentTypeArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isDocumentTypeLoading.set( false );
    }
}

// ~~

export async function handleCreateDocumentType(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedDocumentTypeStore,
        url + '/add',
        finallyFunction,
        toggleDocumentTypeModal,
        loadDocumentTypeArray,
        'add-document-type',
        isSubmitting
        );
}

// ~~

export async function handleEditDocumentType(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedDocumentTypeStore,
        url + '/set/',
        finallyFunction,
        toggleDocumentTypeModal,
        loadDocumentTypeArray,
        'set-document-type',
        isSubmitting
        );
}

// ~~

export async function handleDeleteDocumentType(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedDocumentTypeStore,
        url + '/remove/',
        finallyFunction,
        toggleDocumentTypeModal,
        loadDocumentTypeArray,
        'remove-document-type',
        isSubmitting
        );
}

// ~~

export function toggleDocumentTypeModal(
    )
{
    let isOpen = get( isDocumentTypeModalOpen );
    isDocumentTypeModalOpen.set( !isOpen );
    isOpen = get( isDocumentTypeModalOpen );

    if ( !isOpen )
    {
        selectedDocumentTypeStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let documentTypeArray = get( documentTypeArrayStore );
    let documentTypeCount = documentTypeArray.length;

    return (
        {
            id : null,
            number : documentTypeCount + 1,
            name : ''
        }
        );
}
