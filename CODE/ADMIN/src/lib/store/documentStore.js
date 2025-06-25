// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { hasMorePagination } from './storageStore';
import { hasUserPermission } from './profileStore';
import { urlParamsStore } from './urlParamsStore';
import { getJsonText } from 'senselogic-gist';

// -- VARIABLES

export let documentArrayStore = writable( [] );
export let errorMessage = writable( null );
export let isDocumentLoading = writable( true );
export let isDocumentModalOpen = writable( false );
export let profileArrayStore = writable( [] );
export let selectedDocumentStore = writable( null );
export let languageArrayStore = writable( [] );
export let countryArrayStore = writable( [] );
export let validationStatusArrayStore = writable( [] );
export let documentTypeArrayStore = writable( [] );
export let hasMorePage = writable( false );
let url = '/api/admin/page/document-manager';

// -- FUNCTIONS

export async function loadDocumentArray(
    page = 1,
    limit = 10
    )
{
    isDocumentLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText(
                {
                    page,
                    limit,
                }
                )
            }
        );

        if ( page === 1 )
        {
            documentArrayStore.set( response.documentArray );
        }
        else
        {
            documentArrayStore.update(
                ( documentArray ) => documentArray.concat( response.documentArray )
                );
        }

        profileArrayStore.update(
            ( userArray ) => userArray.concat( response.userArray )
            );
        languageArrayStore.set(
            response.optionMap.languageArray
            );
        countryArrayStore.set(
            response.optionMap.countryArray
            );
        validationStatusArrayStore.set(
            response.optionMap.validationStatusArray
            );
        documentTypeArrayStore.set(
            response.optionMap.documentTypeArray
            );
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
        isDocumentLoading.set( false );
    }
}

// ~~

export async function handleCreateDocument(
    finallyFunction = () => {}
    )
{
}

// ~~

export function toggleDocumentModal(
    )
{
    if ( !hasUserPermission( 'list-document' ) ) return;

    let isOpen = get( isDocumentModalOpen );
    isDocumentModalOpen.set( !isOpen );
}
