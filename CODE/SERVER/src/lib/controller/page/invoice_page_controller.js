// -- IMPORTS

import { invoiceService } from '../../service/invoice_service';
import { currencyService } from '../../service/currency_service';
import { billTypeService } from '../../service/bill_type_service';

// -- FUNCTIONS

export async function getInvoiceArray(
    request,
    reply
    )
{
    let { userId } = request.body;

    try
    {
        let [ invoiceArray, currencyArray, billTypeArray ] = await Promise.all(
            [
                invoiceService.getInvoiceArrayByUserId( userId ),
                currencyService.getCurrencyArray(),
                billTypeService.getBillTypeArray()
            ]
            );

        return reply.send(
            {
                invoiceArray : invoiceArray ?? [],
                currencyArray : currencyArray ?? [],
                billTypeArray : billTypeArray ?? []
            }
            );
    }
    catch ( error )
    {
        return reply.send(
            {
                error : error.message,
            }
            );
    }
}
