// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { getJsonText, getMap, getMapById } from 'senselogic-gist';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let blogArrayStore = writable( [] );
export let selectedBlogStore = writable( {} );
export let isBlogLoading = writable( true );
export let errorMessage = writable( null );
export let isBlogModalOpen = writable( false );
export let hasMoreArticlePage = writable( false );
export let profileByUserIdMap = writable( {} );
export let articleTypeByTypeIdMap = writable( {} );
export let articleCategoryByCategoryIdMap = writable( {} );
export let articleCategoryArrayStore = writable( [] );
let url = '/api/blog/articles';

// -- FUNCTIONS

export async function loadBlogArray(
    articlePage = 1,
    articleLimit = 10
    )
{
    isBlogLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '/get?' + urlParam.toString(),
            {
                method: 'POST',
                body : getJsonText(
                    {
                        type: 'getArticleArray',
                        articlePage,
                        articleLimit
                    }
                    ),
                headers:
                    {
                        'Content-Type': 'application/json'
                    }
            }
        );

        if ( articlePage === 1 )
        {
            blogArrayStore.set( response.articleArray );
        }
        else
        {
            blogArrayStore.update(
                articleArray => articleArray.concat( response.articleArray )
                );
        }
        profileByUserIdMap.update(
            previousProfileByUserIdMap => ( { ...previousProfileByUserIdMap, ...getMap( response.profileArray, 'userId' ) } )
            );
        articleTypeByTypeIdMap.update(
            ( previousArticleTypeByTypeIdMap ) => ( { ...previousArticleTypeByTypeIdMap, ...getMapById( response.articleTypeArray ) } )
            );
        articleCategoryArrayStore.update(
            ( articleCategoryArray ) => articleCategoryArray.concat( response.articleCategoryArray )
            );
        articleCategoryByCategoryIdMap.update(
            ( previousArticleCategoryByCategoryIdMap ) => ( { ...previousArticleCategoryByCategoryIdMap, ...getMapById( response.articleCategoryArray ) })
            );
        hasMoreArticlePage.set( response.hasMoreArticlePage );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isBlogLoading.set( false );
    }
}

// ~~

export async function handleCreateBlog(
    finallyFunction = () => {}
    )
{
    blogArrayStore.set(
        await handleCreateObject(
            blogArrayStore,
            selectedBlogStore,
            url + '/add',
            finallyFunction
            )
        );
}

// ~~

export async function handleEditBlog(
    finallyFunction = () => {}
    )
{
    blogArrayStore.set(
        await handleEditObject(
            blogArrayStore,
            selectedBlogStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleDeleteBlog(
    finallyFunction = () => {}
    )
{
    blogArrayStore.set(
        await handleDeleteObject(
            blogArrayStore,
            selectedBlogStore,
            url + '/delete-by-id',
            finallyFunction
            )
        );
}

export function toggleBlogModal(
    )
{
    let isOpen = get( isBlogModalOpen );
    isBlogModalOpen.set( !isOpen );
}

export async function fetchCategoryArray(
    )
{
    let response = await fetchData(
        '/api/blog/article-categories/get',
        {
            method: 'POST'
        }
        );

    articleCategoryArrayStore.set(
        response.categoryArray
        );
    articleCategoryByCategoryIdMap.set(
        getMapById( response.categoryArray )
        );
}
