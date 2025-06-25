// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class ArticleTypeService
{
    // -- INQUIRIES

    async getArticleTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getArticleTypeById(
        articleTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE_TYPE' )
                .select()
                .eq( 'id', articleTypeId );

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

    // -- OPERATIONS

    async addArticleType(
        articleType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE_TYPE' )
                .insert( articleType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setArticleTypeById(
        articleType,
        articleTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE_TYPE' )
                .update( articleType )
                .eq( 'id', articleTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeArticleTypeById(
        articleTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE_TYPE' )
                .delete()
                .eq( 'id', articleTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let articleTypeService
    = new ArticleTypeService();
