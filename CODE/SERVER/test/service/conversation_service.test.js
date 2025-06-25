// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service.test';
import { profileService } from './profile_service.test';
import { conversationTypeService } from './conversation_type_service.test';
import { rentalModeService } from './rental_mode_service';
import { messageService } from './message_service.test';
import { propertyService } from './property_service';

// -- TYPES

class ConversationService
{
    // -- INQUIRIES

    async getConversationArray(
        isInflated = false
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'CONVERSATION' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            if ( isInflated )
            {
                await this.inflateConversationArray( data );
            }
        }

        return data;
    }

    // ~~

    async inflateConversationArray(
        conversationArray
        )
    {
        for ( let conversation of conversationArray )
        {
            conversation.sourceUserProfile = await profileService.getProfileByUserId( conversation.sourceUserProfileId );
            conversation.targetUserProfile = await profileService.getProfileByUserId( conversation.targetUserProfileId );
            conversation.type = await conversationTypeService.getConversationTypeById( conversation.typeId );
            conversation.rentalMode = await rentalModeService.getRentalModeById( conversation.rentalModeId );
            conversation.lastMessage = await messageService.getMessageLastByConversationId( conversation.id );
            conversation.property = await propertyService.getPropertyById( conversation.propertyId );
        }
    }

    // ~~

    async inflateConversation(
        conversation
        )
    {
        conversation.sourceUserProfile = await profileService.getProfileByUserId( conversation.sourceUserProfileId );
        conversation.targetUserProfile = await profileService.getProfileByUserId( conversation.targetUserProfileId );
        conversation.type = await conversationTypeService.getConversationTypeById( conversation.typeId );
        conversation.rentalMode = await rentalModeService.getRentalModeById( conversation.rentalModeId );
        conversation.lastMessage = await messageService.getMessageLastByConversationId( conversation.id );
    }

    // ~~

    async getConversation(
        propertyId,
        conversationTypeId,
        sourceUserProfileId,
        targetUserProfileId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION' )
                .select()
                .eq( 'propertyId', propertyId )
                .eq( 'typeId', conversationTypeId )
                .eq( 'sourceUserProfileId', sourceUserProfileId )
                .eq( 'targetUserProfileId', targetUserProfileId );

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

    async getConversationArrayByUserProfileId(
        userProfileId,
        isInflated = false
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION' )
                .select( '*, messageCountArray:MESSAGE(count)' )
                .or( `sourceUserProfileId.eq.${ userProfileId },targetUserProfileId.eq.${ userProfileId }` )
                .order( 'updateTimestamp', { ascending: false } );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            if ( isInflated )
            {
                await this.inflateConversationArray( data );
            }
        }

        return data;
    }

    // ~~

    async getConversationArrayByTargetUserProfileId(
        targetUserProfileId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION' )
                .select( '*' )
                .eq( 'targetUserProfileId', targetUserProfileId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getConversationById(
        id,
        isInflated = false
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION' )
                .select()
                .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            if ( isInflated )
            {
                await this.inflateConversation( data[ 0 ] );
            }

            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // -- OPERATIONS

    async addConversation(
        conversation
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION' )
                .insert( conversation )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async setConversation(
        conversation,
        conversationId,
        isInflated = false
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CONVERSATION' )
                .update( conversation )
                .eq( 'id', conversationId )
                .select( '*, messageCountArray:MESSAGE(count)' );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            if ( isInflated )
            {
                await this.inflateConversation( data[ 0 ] );
            }

            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }
}

// -- VARIABLES

export let conversationService
    = new ConversationService();
