// -- IMPORTS

import { currencyService } from '../../service/currency_service';

// -- FUNCTIONS

export async function getCurrencyArray(
    request,
    reply
    )
{
    let currencyArray = await currencyService.getCachedCurrencyArray();

    return reply.status( 200 ).send( { currencyArray } );
}
