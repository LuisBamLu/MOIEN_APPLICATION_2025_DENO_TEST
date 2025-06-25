// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '../confirmation_modal';
import { hasUserPermission } from './profileStore';
import { toast } from '$lib/toast';
import { getJsonText, logError } from 'senselogic-gist';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let categoryArrayStore = writable( [] );
export let selectedCategoryStore = writable( getInitialState() );
export let isCategoryLoading = writable( true );
export let errorMessage = writable( null );
export let isCategoryModalOpen = writable( false );
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
let url = '/api/blog/article-categories';

// -- FUNCTIONS

export async function loadCategoryArray(
    )
{
    isCategoryLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            '/api/blog/categories?' + urlParam.toString(),
            { method: 'GET', credentials: 'include' }
            );

        categoryArrayStore.set(
            response.categoryArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isCategoryLoading.set( false );
    }
}

// ~~

export async function handleCreateCategory(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedCategoryStore,
        url + '/add',
        finallyFunction,
        toggleCategoryModal,
        loadCategoryArray,
        'add-category',
        isSubmitting
        );
}

// ~~

export async function handleEditCategory(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedCategoryStore,
        url + '/set/',
        finallyFunction,
        toggleCategoryModal,
        loadCategoryArray,
        'set-category',
        isSubmitting
        );
}

// ~~

export async function handleDeleteCategory(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedCategoryStore,
        url + '/remove/',
        finallyFunction,
        toggleCategoryModal,
        loadCategoryArray,
        'remove-category',
        isSubmitting
        );
}

// ~~

export function toggleCategoryModal(
    )
{
    let isOpen = get( isCategoryModalOpen );
    isCategoryModalOpen.set( !isOpen );

    console.log( isOpen, get( isCategoryModalOpen ) )
    isOpen = get( isCategoryModalOpen );

    if ( !isOpen )
    {
        selectedCategoryStore.set( getInitialState() );
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
            name : ''
        }
        );
}
