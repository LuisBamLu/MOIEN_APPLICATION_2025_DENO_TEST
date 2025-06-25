// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class MessageService
{
    // -- INQUIRIES

    async getMessageArrayByConversationId(
        conversationId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'MESSAGE' )
                .select()
                .eq( 'conversationId', conversationId )
                .order( 'creationTimestamp', { ascending: true } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getMessageArrayByConversationIdArrayAndSourceUserProfileId(
        conversationIdArray,
        sourceUserProfileId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'MESSAGE' )
                .select()
                .in( 'conversationId', conversationIdArray )
                .eq( 'sourceUserProfileId', sourceUserProfileId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getMessageLastByConversationId(
        conversationId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'MESSAGE' )
                .select()
                .eq( 'conversationId', conversationId )
                .order( 'creationTimestamp', { ascending: false } )
                .limit( 1 );

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

    async addMessage(
        message
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'MESSAGE' )
                .insert( message )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async setMessage(
        message,
        messageId
        )
    {
        message =
            {
                ...message,
                updateTimestamp: new Date()
            };

        let { data, error }
            = await databaseService.getClient()
                .from( 'MESSAGE' )
                .update( message )
                .eq( 'id', messageId )
                .select();

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

    async markMessageAsRead(
        messageId,
        readedTimestamp
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'MESSAGE' )
                .update(
                    {
                        isReaded : true,
                        readedTimestamp
                    }
                    )
                .eq( 'id', messageId )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data;
        }
    }
}

// -- VARIABLES

export let messageService
    = new MessageService();
