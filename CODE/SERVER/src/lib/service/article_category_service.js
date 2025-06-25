// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'name',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class ArticleCategoryService
{
    // -- INQUIRIES

    async getArticleCategoryArray(
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'ARTICLE_CATEGORY' )
            .select();

        let { data, error } = await applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getArticleCategoryArrayByCategoryIdArray(
        categoryIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE_CATEGORY' )
                .select()
                .in( 'id', categoryIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getArticleCategoryById(
        articleCategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE_CATEGORY' )
                .select()
                .eq( 'id', articleCategoryId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async addArticleCategory(
        articleCategory
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE_CATEGORY' )
                .insert( articleCategory )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setArticleCategoryById(
        articleCategory,
        articleCategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE_CATEGORY' )
                .update( articleCategory )
                .eq( 'id', articleCategoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeArticleCategoryById(
        categoryId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'ARTICLE_CATEGORY' )
                .delete()
                .eq( 'id', categoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

export let articleCategoryService
    = new ArticleCategoryService();
