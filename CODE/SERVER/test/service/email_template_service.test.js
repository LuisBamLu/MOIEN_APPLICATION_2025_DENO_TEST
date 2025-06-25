// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class EmailTemplateService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedEmailTemplateArray = null;
        this.cachedEmailTemplateTimestamp = 0;
    }

    // -- INQUIRIES

    async getEmailTemplateArray(
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'EMAIL_TEMPLATE' )
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
                .from( 'EMAIL_TEMPLATE' )
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

    async getEmailTemplateById(
        templateId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'EMAIL_TEMPLATE' )
                .select()
                .eq( 'id', templateId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getEmailSubjectAndContentById(
        templateId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'EMAIL_TEMPLATE' )
                .select( 'subject, content' )
                .eq( 'id', templateId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCachedEmailTemplateArray(
        )
    {
        if ( !this.cachedEmailTemplateArray
             || Date.now() > this.cachedEmailTemplateTimestamp + 300000 )
        {
            this.cachedEmailTemplateArray =
                await this.getEmailTemplateArray();
            this.cachedEmailTemplateTimestamp = Date.now()
        }

        return this.cachedEmailTemplateArray;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedEmailTemplateArray = null;
    }
}

// -- VARIABLES

export let emailTemplateService
    = new EmailTemplateService();
