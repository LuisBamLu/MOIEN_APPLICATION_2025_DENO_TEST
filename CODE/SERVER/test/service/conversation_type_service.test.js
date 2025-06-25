// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service.test';

// -- TYPES

class ConversationTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedConversationTypeArray = null;
        this.cachedConversationTypeByIdMap = null;
        this.cachedConversationTimestamp = 0;
    }

    // -- INQUIRIES

    async getConversationTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getConversationTypeById(
        conversationTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION_TYPE' )
                .select()
                .eq( 'id', conversationTypeId );

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

    clearCache(
        )
    {
        this.cachedConversationTypeArray = null;
        this.cachedConversationTypeByIdMap = null;
    }

    // ~~

    async getCachedConversationTypeArray(
        )
    {
        if ( this.cachedConversationTypeArray === null
             || Date.now() > this.cachedConversationTimestamp + 300000 )
        {
            this.cachedConversationTypeArray = await this.getConversationTypeArray();
            this.cachedConversationTimestamp = Date.now();
            this.cachedConversationTypeByIdMap = null;
        }

        return this.cachedConversationTypeArray;
    }

    // ~~

    async getCachedConversationTypeByIdMap(
        )
    {
        if ( this.cachedConversationTypeByIdMap === null )
        {
            this.cachedConversationTypeByIdMap = getMapById( await this.getCachedConversationTypeArray() );
        }

        return this.cachedConversationTypeByIdMap;
    }

    // ~~

    async addConversationType(
        conversationType
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION_TYPE' )
                .insert( conversationType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setConversationTypeById(
        conversationType,
        conversationTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION_TYPE' )
                .update( conversationType )
                .eq( 'id', conversationTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeConversationTypeById(
        conversationTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION_TYPE' )
                .delete()
                .eq( 'id', conversationTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let conversationTypeService
    = new ConversationTypeService();
