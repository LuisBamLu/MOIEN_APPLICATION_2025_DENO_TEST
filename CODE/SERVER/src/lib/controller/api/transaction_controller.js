// -- IMPORTS

import { mangopayService } from '../../service/mangopay_service';

// -- FUNCTIONS

export async function getTransactionArray(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let transactionArray = await mangopayService.getWalletTransactionArrayByWalletId( body.walletId, body.page );

    return reply.status( 200 ).send( { transactionArray } );
}
