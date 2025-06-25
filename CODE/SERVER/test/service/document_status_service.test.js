// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class DocumentStatusService
{
    // -- CONSTRUCTORS

    constructor (
        )
    {
        this.cachedDocumentStatusArray = null;
        this.cachedDocumentStatusMap = null;
        this.cachedDocumentStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getDocumentStatusArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DOCUMENT_STATUS' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async getCachedDocumentStatusArray(
        )
    {
        if ( this.cachedDocumentStatusArray === null
             || Date.now() > this.cachedDocumentStatusTimestamp + 300000 )
        {
            this.cachedDocumentStatusArray = await this.getDocumentStatusArray();
            this.cachedDocumentStatusTimestamp = Date.now();
            this.cachedDocumentStatusMap = null;
        }

        return this.cachedDocumentStatusArray;
    }

    // ~~

    async getCachedDocumentStatusMap(
        )
    {
        if ( this.cachedDocumentStatusMap === null )
        {
            let documentStatusArray = await this.getCachedDocumentStatusArray();
            this.cachedDocumentStatusMap = getMapById( documentStatusArray );
        }

        return this.cachedDocumentStatusMap;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedDocumentStatusArray = null;
    }
}

export let documentStatusService
    = new DocumentStatusService();
