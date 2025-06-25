// -- IMPORTS

import { billService } from '../../service/bill_service';
import { currencyService } from '../../service/currency_service';

// -- FUNCTIONS

export async function getBillArray(
    request,
    reply
    )
{
    let userId = request.body.userId;
    let billArray = await billService.getBillArray();
    let billLineArray = await billService.getBillLineArray( userId );
    let currencyArray = await currencyService.getCurrencyArray();

    return reply.send(
        {
            billArray : billArray,
            billLineArray : billLineArray,
            currencyArray : currencyArray
        }
        );
}
