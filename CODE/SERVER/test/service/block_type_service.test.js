// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service.test';

// -- TYPES

class BlockTypeService
{
    // -- INQUIRIES

    async getBlockTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBlockTypeById(
        blockTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK_TYPE' )
                .select()
                .eq( 'id', blockTypeId );

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

    async addBlockType(
        blockType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK_TYPE' )
                .insert( blockType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setBlockTypeById(
        blockType,
        blockTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK_TYPE' )
                .update( blockType )
                .eq( 'id', blockTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeBlockTypeById(
        blockTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BLOCK_TYPE' )
                .delete()
                .eq( 'id', blockTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let blockTypeService
    = new BlockTypeService();
