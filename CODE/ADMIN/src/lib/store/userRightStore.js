// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getTextSlug, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { getJsonText, getLocalizedTextBySlug, getMap, logError } from 'senselogic-gist';
import { hasUserPermission } from './profileStore';
import { toast } from '$lib/toast';
import { useConfirmationModal } from '$lib/confirmation_modal';

// -- VARIABLES

export let userRightArrayStore = writable( [] );
export let userPermissionArrayStore = writable( [] );
export let selectedUserRightStore = writable( getInitialState() );
export let isUserRightLoading = writable( true );
export let errorMessage = writable( null );
export let isUserRightModalOpen = writable( false );
export let userPermissionBySlugMap = {};
export let isSubmitting = writable( false );
export let userPermissionByTypeMap = {};
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
let url = '/admin/page/user-right';

// -- FUNCTIONS

export async function loadUserRightArray(
    )
{
    isUserRightLoading.set( true );

    try
    {
        let response = await fetchData(
            url + '/list',
            { method: 'POST', credentials: 'include' }
            );

        userRightArrayStore.set(
            response.userRightArray
            );
        userPermissionArrayStore.set(
            response.userPermissionArray
            );
        userPermissionBySlugMap = getMap( response.userPermissionArray, 'slug' );
        userPermissionByTypeMap = response.userPermissionByTypeMap;
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isUserRightLoading.set( false );
    }
}

// ~~

export async function handleCreateUserRight(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedUserRightStore,
        url + '/add',
        finallyFunction,
        toggleUserRightModal,
        loadUserRightArray,
        'add-user-right',
        isSubmitting
        );
}

// ~~

export async function handleEditUserRight(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedUserRightStore,
        url + '/set/',
        finallyFunction,
        toggleUserRightModal,
        loadUserRightArray,
        'set-user-right',
        isSubmitting
        );
}

// ~~

export async function handleDeleteUserRight(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedUserRightStore,
        url + '/remove/',
        finallyFunction,
        toggleUserRightModal,
        loadUserRightArray,
        'remove-user-right',
        isSubmitting
        );
}

// ~~

export function toggleUserRightModal(
    )
{
    let isOpen = get( isUserRightModalOpen );
    isUserRightModalOpen.set( !isOpen );
    isOpen = get( isUserRightModalOpen );

    if ( !isOpen )
    {
        selectedUserRightStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let userRightArray = get( userRightArrayStore );
    let userRightCount = userRightArray.length;

    return (
        {
            id : null,
            number : userRightCount + 1,
            slug : '',
            name : '',
            permissionSlugArray : []
        }
        );
}
