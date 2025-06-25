// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class PushTemplateService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPushTemplateArray = null;
        this.cachedPushTemplateTimestamp = 0;
    }

    // -- INQUIRIES

    async getPushTemplateArray(
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'PUSH_TEMPLATE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async setTemplateById(
        template,
        templateId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PUSH_TEMPLATE' )
                .update( template )
                .eq( 'id', templateId );

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async getPushTemplateById(
        templateId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PUSH_TEMPLATE' )
                .select()
                .eq( 'id', templateId )
                .single();

        if ( error !== null )
        {
            logError( error );

            return null;
        }

        return data;
    }

    // ~~

    async getCachedPushTemplateArray(
        )
    {
        if ( !this.cachedPushTemplateArray
             || Date.now() > this.cachedPushTemplateArray + 300000 )
        {
            this.cachedPushTemplateArray =
                await this.getPushTemplateArray();
            this.cachedPushTemplateTimestamp = Date.now()
        }

        return this.cachedPushTemplateArray;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedPushTemplateArray = null;
    }
}

// -- VARIABLES

export let pushTemplateService
    = new PushTemplateService();
