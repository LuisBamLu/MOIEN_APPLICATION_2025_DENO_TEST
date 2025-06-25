// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { hasUserPermission } from './profileStore';

// -- VARIABLES

export let diagnosisArrayStore = writable( null );
export let selectedDiagnosisStore = writable( null );
export let isDiagnosisLoading = writable( true );
export let errorMessage = writable( null );
export let isDiagnosisModalOpen = writable( false );
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
let url = '/admin/page/energy-diagnosis';

// -- FUNCTIONS

export async function loadDiagnosisArray(
    )
{
    isDiagnosisLoading.set( true );

    try
    {
        let response = await fetchData(
            url + '/list',
            { method: 'POST', credentials: 'include' }
        );

        diagnosisArrayStore.set(
            response.energyDiagnosisArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isDiagnosisLoading.set( false );
    }
}

// ~~

export async function handleCreateDiagnosis(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedDiagnosisStore,
        url + '/add',
        finallyFunction,
        toggleDiagnosisModal,
        loadDiagnosisArray,
        'add-diagnosis',
        isSubmitting
        );
}

// ~~

export async function handleEditDiagnosis(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedDiagnosisStore,
        url + '/set/',
        finallyFunction,
        toggleDiagnosisModal,
        loadDiagnosisArray,
        'set-diagnosis',
        isSubmitting
        );
}

// ~~

export async function handleDeleteDiagnosis(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedDiagnosisStore,
        url + '/remove/',
        finallyFunction,
        toggleDiagnosisModal,
        loadDiagnosisArray,
        'remove-diagnosis',
        isSubmitting
        );
}

export function toggleDiagnosisModal(
    )
{
    let isOpen = get( isDiagnosisModalOpen );
    isDiagnosisModalOpen.set( !isOpen );
    isOpen = get( isDiagnosisModalOpen );

    if ( !isOpen )
    {
        selectedDiagnosisStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let diagnosisArray = get( diagnosisArrayStore );
    let diagnosisCount = diagnosisArray.length;

    return (
        {
            id : null,
            number : diagnosisCount + 1,
            name : '',
            minimumValue : 0,
            maximumValue : 0
        }
        );
}
