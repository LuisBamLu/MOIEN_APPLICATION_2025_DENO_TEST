// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData } from '$lib/base';

// -- VARIABLES

export let articleArrayStore = writable( [] );
export let articleCategoryArrayStore = writable( [] );
export let selectArticleArrayStore = writable( [] );
export let selectArticleCategoryArrayStore = writable( [] );
export let isBlogLoading = writable( true );

// -- FUNCTIONS

export async function getArticleArray(
    )
{
    let response = await fetchData(
        '/api/blog/articles',
        { method: 'GET', credentials: 'include' }
        );

    articleArrayStore.set( response.articleArray );
}

// ~~

export async function getArticleCategoryArray(
    )
{
    let response = await fetchData(
        '/api/blog/categories',
        { method: 'GET', credentials: 'include' }
        );

    articleCategoryArrayStore.set( response.categoryArray );
}

// ~~

export async function loadBlogContent(
    )
{
    isBlogLoading.set( true );

    try
    {
        await getArticleArray();
        await getArticleCategoryArray();
    }
    catch ( error )
    {
        console.error( error );
    }
    finally
    {
        isBlogLoading.set( false );
    }
}

// ~~

export async function getSelectArticleArray(
    )
{
    try
    {
        let articleArray = get( articleArrayStore );
        let articleCategoryArray =
            get( selectArticleArrayStore )
            || get( articleCategoryArrayStore );

        let articleCategoryIdArray = new Set(
            articleCategoryArray.map( category => category.id )
            );

        let selectArticleArray = articleArray.filter(
            article => article.categoryIdArray.some(
                categoryId => articleCategoryIdArray.has( categoryId )
                )
            );

        selectArticleArrayStore.set( selectArticleArray );
    }
    catch ( error )
    {
        console.error( error );
    }
}
