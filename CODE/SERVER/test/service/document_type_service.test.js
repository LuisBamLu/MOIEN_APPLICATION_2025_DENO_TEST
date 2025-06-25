// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class DocumentTypeService
{
    // -- CONSTRUCTORS

    constructor (
        )
    {
        this.cachedDocumentTypeArray = null;
        this.cachedDocumentTypeMap = null;
        this.cachedDocumentTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getDocumentTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async getCachedDocumentTypeArray(
        )
    {
        if ( this.cachedDocumentTypeArray === null
             || Date.now() > this.cachedDocumentTypeTimestamp + 300000 )
        {
            this.cachedDocumentTypeArray = await this.getDocumentTypeArray();
            this.cachedDocumentTypeTimestamp = Date.now();
            this.cachedDocumentTypeMap = null;
        }

        return this.cachedDocumentTypeArray;
    }

    // ~~

    async getCachedDocumentTypeMap(
        )
    {
        if ( this.cachedDocumentTypeMap === null )
        {
            let documentTypeArray = await this.getCachedDocumentTypeArray();
            this.cachedDocumentTypeMap = getMapById( documentTypeArray );
        }

        return this.cachedDocumentTypeMap;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedDocumentTypeArray = null;
        this.cachedDocumentTypeMap = null;
    }

    // ~~

    async addDocumentType(
        documentType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT_TYPE' )
                .insert( documentType )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async setDocumentType(
        documentType,
        documentTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT_TYPE' )
                .update( documentType )
                .eq( 'id', documentTypeId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async removeDocumentType(
        documentTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT_TYPE' )
                .delete()
                .eq( 'id', documentTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }
}

export let documentTypeService
    = new DocumentTypeService();
