// -- IMPORTS

import { subscriptionService } from '../../../service/subscription_service';
import { subscriptionTypeService } from '../../../service/subscription_type_service';
import { providerService } from '../../../service/provider_service';

// -- FUNCTIONS

async function getSubscriptionManager(
    request,
    reply
    )
{
    let subscriptions =
        {
            subscriptionArray: [],
            hasMoreSubscriptionPage: false
        };

    let { subscriptionIdArray, subscriptionPage, subscriptionLimit } = request.body;
    let subscriptionTypeArray = await subscriptionTypeService.getSubscriptionTypeArray();
    let providerArray = await providerService.getProviderArray();

    if ( subscriptionIdArray && subscriptionIdArray.length > 0 )
    {
        let { subscriptionArray, countSubscriptionArray } = await subscriptionService.getSubscriptionArray(
            subscriptionIdArray,
            subscriptionPage,
            subscriptionLimit
            );

        subscriptions.subscriptionArray = subscriptionArray;
    }
    else
    {
        let { subscriptionArray, countSubscriptionArray } = await subscriptionService.getSubscriptionArray(
            [],
            subscriptionPage,
            subscriptionLimit
            );

        if ( subscriptionArray && subscriptionArray.length <= 0 )
        {
            ( { subscriptionArray, countSubscriptionArray } = await subscriptionService.getSubscriptionArray(
                    [],
                    subscriptionPage,
                    subscriptionLimit
                )
                );
        }

        subscriptions.subscriptionArray = subscriptionArray;

        let pageCount = Math.ceil( countSubscriptionArray / subscriptionLimit );

        subscriptions.hasMoreSubscriptionPage = subscriptionPage < pageCount;
    }

    let response =
        {
            subscriptions: subscriptions,
            subscriptionTypeArray: subscriptionTypeArray,
            providerArray: providerArray
        };

    return reply.send( response );
}

export
{
    getSubscriptionManager
}
