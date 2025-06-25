// -- IMPORTS

import { writable } from 'svelte/store';
import { fetchData } from '$lib/base';

// -- VARIABLES

export let articleCategoryArrayStore = writable( null );
export let isLoadingArticleCategory = writable( true );
export let errorMessage = writable( null );

// -- FUNCTIONS

export async function loadArticleCategoryArray(
    )
{
    isLoadingArticleCategory.set( true );
    errorMessage.set( null );

    try
    {
        let response = await fetchData(
            '/api/blog/article-categories/get',
            {
                method : 'POST'
            }
            );

        articleCategoryArrayStore.set( response.categoryArray );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isLoadingArticleCategory.set( false );
    }
}
