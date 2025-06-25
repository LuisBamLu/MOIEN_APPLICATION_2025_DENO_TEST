// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class NewsletterSubscriptionService
{
    // -- INQUIRIES

    async getNewsletterSubscriptionArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
               .from( 'NEWSLETTER_SUBSCRIPTION' )
               .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getNewsletterSubscriptionArrayByLanguageCode(
        languageCode
        )
    {
        let { data, error }
            = await databaseService.getClient()
               .from( 'NEWSLETTER_SUBSCRIPTION' )
               .select()
               .eq( 'languageCode', languageCode );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getNewsletterSubscriptionByEmail(
        email
        )
    {
        let { data, error }
            = await databaseService.getClient()
               .from( 'NEWSLETTER_SUBSCRIPTION' )
               .select()
               .eq( 'email', email )
               .maybeSingle();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async addNewsletterSubscription(
        newsletterSubscription
        )
    {
        let { data, error }
            = await databaseService.getClient()
               .from( 'NEWSLETTER_SUBSCRIPTION' )
               .insert( newsletterSubscription )
               .select()
               .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setNewsletterSubscriptionById(
        newsletterSubscriptionId,
        newsletterSubscription
        )
    {
        let { data, error }
            = await databaseService.getClient()
               .from( 'NEWSLETTER_SUBSCRIPTION' )
               .update( newsletterSubscription )
               .eq( 'id', newsletterSubscriptionId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

export let newsletterSubscriptionService
    = new NewsletterSubscriptionService();
