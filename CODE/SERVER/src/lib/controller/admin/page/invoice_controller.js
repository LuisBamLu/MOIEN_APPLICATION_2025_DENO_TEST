// -- IMPORTS

import { invoiceService } from '../../../service/invoice_service';
import { currencyService } from '../../../service/currency_service';
import { billService } from '../../../service/bill_service';
import { profileService } from '../../../service/profile_service';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { AppError } from '../../../utils/app_error';
import { getJsonObject } from 'senselogic-gist';

// -- FUNCTIONS

async function addInvoice(
    request,
    reply
    )
{
    let invoice = request.body.invoice;
    await invoiceService.addInvoice( invoice );

    return reply.send(
        {
            invoice : invoice,
        }
        );
}

async function setInvoice(
    request,
    reply
    )
{
    let { invoiceId } = request.params;
    let body = JSON.parse( request.body );
    let { invoiceData } = body;

    if ( !invoiceId || !invoiceData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetInvoicePermission = await hasUserPermission( 'set-invoice', profile.roleSlugArray );

    if ( !hasSetInvoicePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let invoice = await invoiceService.setInvoice(
        {
            title: invoiceData.title,
            currencyCode: invoiceData.currencyCode,
            userId: invoiceData.userId,
        },
        invoiceId
        );

    return reply.send(
        {
            message: 'invoide-updated-message',
            invoice,
        }
        );
}

async function deleteInvoice(
    request,
    reply
    )
{
    let { invoiceId } = request.params;

    if ( !invoiceId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveInvoicePermission = await hasUserPermission( 'remove-invoice', profile.roleSlugArray );

    if ( !hasRemoveInvoicePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let invoice = await invoiceService.removeInvoice( invoiceId );

    return reply.send(
        {
            message: 'invoide-deleted-message',
            invoice,
        }
        );
}

async function getAllInvoiceData(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { page = 1, limit = 10 } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let billArray = await billService.getBillArray();
    let userIdArray = getUniqueValues( billArray, 'userId' );
    let [ { invoiceArray, invoiceCount }, currencyArray, billLineArray, profileArray ] =
        await Promise.all(
            [
                invoiceService.getInvoiceArray( page, limit, filterArray ),
                currencyService.getCurrencyArray(),
                billService.getBillLineArrayByBillIdArray( billArray.map( bill => bill.id ) ),
                profileService.getProfileArrayByUserIdArray( userIdArray )
            ]
            );

    let { hasMorePage } = getHasMorePage( invoiceCount, page, limit );

    return (
        {
            invoiceArray,
            currencyArray,
            billArray,
            billLineArray,
            profileArray,
            hasMorePage
        }
        );
}

export
{
    addInvoice,
    setInvoice,
    getAllInvoiceData,
    deleteInvoice
}
