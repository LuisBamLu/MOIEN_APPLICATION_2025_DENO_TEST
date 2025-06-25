// -- IMPORTS

import { subscriptionService } from '../../service/subscription_service';
import { subscriptionTypeService } from '../../service/subscription_type_service';
import { profileService } from '../../service/profile_service';

// -- FUNCTIONS

export async function getSubscriptionItem(
    request,
    reply
    )
{
    let subscription = request.body.subscription;
    let profile = await profileService.getProfileByUserId( subscription.userId );
    let type = await subscriptionTypeService.getSubscriptionTypeById( subscription.typeId );
    let provider = { name: 'provider' };
    let data = { profile: profile, type: type, provider: provider };

    return reply.send( data );
}

export async function setSubscription(
    request,
    reply
    )
{
    let subscription = request.body.subscription;
    let subscriptionUpdated = await subscriptionService.setSubscription( subscription );

    return reply.send( { subscription: subscriptionUpdated } );
}

export async function getSubscriptionData(
    request,
    reply
    )
{
    let subscriptionArray = await subscriptionService.getSubscriptionArray();
    let subscriptionTypeArray = await subscriptionTypeService.getSubscriptionTypeArray();
    let data =
        {
            subscriptionArray: subscriptionArray,
            subscriptionTypeArray: subscriptionTypeArray,
        };

    return reply.send( data );
}
