// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class BlockService
{
    // -- INQUIRIES

    async getBlockArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBlockById(
        blockId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK' )
                .select()
                .eq( 'id', blockId );

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

    async getBlockArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK' )
                .select()
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBlockArrayByArticleId(
        articleId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK' )
                .select()
                .eq( 'articleId', articleId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addBlock(
        block
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK' )
                .insert( block )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setBlockById(
        block,
        blockId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK' )
                .update( block )
                .eq( 'id', blockId )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeBlockById(
        blockId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK' )
                .delete()
                .eq( 'id', blockId )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeBlockByArticleId(
        articleId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK' )
                .delete()
                .eq( 'articleId', articleId );

        if ( error !== null )
        {
            logError( error );
        }

        return { data, error }
    }
}

// -- VARIABLES

export let blockService
    = new BlockService();
