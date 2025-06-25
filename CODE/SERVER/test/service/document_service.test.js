// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'typeId',
        'validationStatusId',
        'expirationDate',
        'name',
        'description',
        'languageTag',
        'countryIdArray',
        'userId',
        'mangopayDocumentId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class DocumentService
{
    // -- INQUIRIES

    async getDocumentById(
        documentId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'DOCUMENT' )
                .select()
                .eq( 'id', documentId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data.length > 0 )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getDocumentByMangopayDocumentId(
        mangopayDocumentId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT' )
                .select()
                .eq( 'mangopayDocumentId', mangopayDocumentId );

            if ( error !== null )
            {
                logError( error );
            }

        if ( data.length > 0 )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getDocumentArray(
        documentIdArray = [],
        documentPage = 1,
        documentLimit = 10,
        filterArray = []
        )
    {
        let query =
            databaseService.getClient()
                .from( 'DOCUMENT' )
                .select();
        let countQuery =
            databaseService.getClient()
                .from( 'DOCUMENT' )
                .select( 'id', { count: 'exact', head: true } );

        if ( documentIdArray.length > 0 )
        {
            query = query.in( 'id', documentIdArray );
            countQuery = countQuery.in( 'id', documentIdArray );
        }

        let { count } = await countQuery;
        let countDocumentArray = count;

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray )

        let startIndex = ( documentPage - 1 ) * documentLimit;
        let endIndex = startIndex + documentLimit - 1;
        query = query.range( startIndex, endIndex );

        let { data, error } = await query;
        let documentArray = data;

        if ( error !== null )
        {
            logError( error );
        }

        return { documentArray, countDocumentArray };
    }

    // ~~

    async getAllDocumentArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getDocumentArrayByIdArray(
        documentIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT' )
                .select()
                .in( 'id', documentIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
    // ~~

    async getDocumentArrayByIdArrayAndUserId(
        documentIdArray,
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT' )
                .select()
                .in( 'id', documentIdArray )
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getDocumentArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT' )
                .select()
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
    // ~~

    async getDocumentArrayByUserIdAndTypeIdArray(
        userId,
        typeIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT' )
                .select()
                .eq( 'userId', userId )
                .in( 'typeId', typeIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getDocumentArrayByUserIdAndValidationStatusId(
        userId,
        validationStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT' )
                .select()
                .eq( 'userId', userId )
                .eq( 'validationStatusId', validationStatusId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getDocumentArrayByUserIdArray(
        userIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT' )
                .select()
                .in( 'userId', userIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addDocument(
        document
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT' )
                .insert( document )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async setDocumentById(
        document,
        documentId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'DOCUMENT' )
                .update( document )
                .eq( 'id', documentId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        if ( data.length > 0 )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async setDocumentByMangopayDocumentId(
        document,
        mangopayDocumentId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'DOCUMENT' )
                .update( document )
                .eq( 'mangopayDocumentId', mangopayDocumentId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeDocumentById(
        documentId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'DOCUMENT' )
                .delete()
                .eq( 'id', documentId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

export let documentService
    = new DocumentService();
