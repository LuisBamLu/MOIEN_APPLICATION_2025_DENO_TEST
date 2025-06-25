// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { currencyConversionService } from '../../service/currency_conversion_service';

// -- FUNCTIONS

export async function getConversionRate(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let conversionRate = { id: null, rate: 1 };

    if ( body.sourceCurrencyCode !== body.targetCurrencyCode )
    {
        conversionRate =
            await currencyConversionService.getCachedCurrencyConversionByConversionCode(
                body.sourceCurrencyCode
                + ', '
                + body.targetCurrencyCode
                );
    }

    return reply.send( { conversionRate } );
}
