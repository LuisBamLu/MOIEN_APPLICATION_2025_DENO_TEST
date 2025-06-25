// -- IMPORTS

import { billService } from '../../service/bill_service';
import { currencyService } from '../../service/currency_service';

// -- FUNCTIONS

export async function addBill(
    request,
    reply
    )
{
    let bill = request.body.bill;
    await billService.addBill( bill );

    return reply.send(
        {
            bill : bill,
        }
        );
}

export async function addBillLine(
    request,
    reply
    )
{
    let billLine = request.body.billLine;
    await billService.addBillLine( billLine );

    return reply.send(
        {
            billLine : billLine,
        }
        );
}

export async function setBill(
    request,
    reply
    )
{
    let bill = request.body.bill;
    await billService.setBill( bill );

    return reply.send(
        {
            bill : bill,
        }
        );
}

export async function setBillLine(
    request,
    reply
    )
{
    let billLine = request.body.billLine;
    await billService.setBillLine( billLine );

    return reply.send(
        {
            billLine : billLine,
        }
        );
}

export async function getBillArray(
    request,
    reply
    )
{
    let billIdArray = request.body.billIdArray;
    let billArray = await billService.getBillArrayByIdArray( billIdArray );
    let billLineArray = await billService.getBillLineArrayByBillIdArray( billIdArray );
    let currencyArray = await currencyService.getCurrencyArray();

    return reply.send( { billArray, billLineArray, currencyArray } );
}
