// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { newsletterSubscriptionService } from '../../service/newsletter_subscription_service';
import { AppError } from '../../app_error';
import { addListMember } from '../../newsletter/lists/members';
import { hubspotService } from '../../service/hubspot_service';

// -- FUNCTIONS

export async function addNewsletterSubscription(
    request,
    reply
    )
{
    let newsletterSubscriptionData = request.body.newsletterSubscription;

    if ( !( 'email' in newsletterSubscriptionData ) )
    {
        throw new AppError( 'bad-request' );
    }

        await addListMember(
            process.env.MAILCHIMP_LIST_ID,
            false,
            newsletterSubscriptionData.email,
            'subscribed',
            'html',
            {},
            {},
            newsletterSubscriptionData.languageCode,
            false,
            {},
            [],
            request.ip
            );
    let subscriptionAlreadyExists = await newsletterSubscriptionService
        .getNewsletterSubscriptionByEmail( newsletterSubscriptionData.email );

    if ( subscriptionAlreadyExists !== null )
    {
        return reply.send(
            {
                newsletterSubscription: subscriptionAlreadyExists
            }
            );
    }

    let newsletterSubscription = await newsletterSubscriptionService.addNewsletterSubscription(
        {
            id: getRandomTuid(),
            email: newsletterSubscriptionData.email,
            isActive: newsletterSubscriptionData.isActive,
            languageCode: newsletterSubscriptionData.languageCode
        }
        );

    let contact = await hubspotService.getContactByEmail( newsletterSubscriptionData.email );

    if ( contact === null )
    {
        contact = await hubspotService.addContact( { email: newsletterSubscriptionData.email } );
    }

    await hubspotService.subscribeContact( '531614319', newsletterSubscriptionData.email );

    return reply.code( 201 ).send(
        {
            newsletterSubscription
        }
        );
}
