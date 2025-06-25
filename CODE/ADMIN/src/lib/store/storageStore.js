// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';

// -- VARIABLES

export let imageArrayStore = writable( [] );
export let selectedImageStore = writable( null );
export let isImageArrayLoading = writable( true );
export let errorMessage = writable( null );
export let isImageModalOpen = writable( false );
export let hasMorePagination = writable( false );
let url = '/admin/page/image';

// -- FUNCTIONS

export async function loadImageArray(
    page = 1,
    limit = 1000
    )
{
    isImageArrayLoading.set( true );

    try
    {
        let response = await fetchData(
            url + '/list',
            {
                method : 'POST',
                body :
                    JSON.stringify(
                        {
                            type : 'getImageArray',
                            page,
                            limit
                        }
                    ),
                credentials: 'include',
            }
        );

        let imageMap = response.imageArray.reduce(
            ( acc, curr) =>
            {
                let [
                        fileNameWithFolder,
                        originalExtension,
                        resolution,
                        extension
                    ] = curr.name.split( '.' );
                let originalFileName =
                    [ fileNameWithFolder, originalExtension ].join( '.' );

                if ( !acc[ originalFileName ] ) acc[ originalFileName ] = [];

                acc[ originalFileName ].push( curr );

                return acc;
            },
            {});

        let imageArray = Object
            .entries( imageMap )
            .map(
                ( [ originalImagePath, imageResolutionArray ] ) =>
                (
                {
                    ...imageResolutionArray[ 0 ],
                    originalImagePath
                }
                )
                );

        imageArrayStore.set(
            [
                ...get( imageArrayStore ),
                ...imageArray
            ]
            );
        hasMorePagination.set( response.hasMorePagination );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isImageArrayLoading.set( false );
    }
}

// ~~

export async function handleCreateImage(
    finallyFunction = () => {}
    )
{
}

// ~~

export async function handleEditImage(
    finallyFunction = () => {}
    )
{
}

// ~~

export async function handleDeleteImage(
    finallyFunction = () => {}
    )
{
}

// ~~

export function toggleImageModal(
    )
{
    let isOpen = get( isImageModalOpen );
    isImageModalOpen.set( !isOpen );
}
