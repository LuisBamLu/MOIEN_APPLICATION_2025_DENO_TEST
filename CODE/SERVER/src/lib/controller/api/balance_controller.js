// -- IMPORTS

import { mangopayService } from '../../service/mangopay_service';
import { profileService } from '../../service/profile_service';

// -- FUNCTIONS

export async function getBalance(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let mangopayUser = await mangopayService.getUser( request.profileLogged.mangopayUserId );
    let mangopayWallet;

    if ( !mangopayUser )
    {
        mangopayUser = await mangopayService.addUserFromProfile( request.profileLogged );

        if ( !mangopayUser )
        {
            return reply
                .status( 404 )
                .send(
                    {
                        error: 'mangopay-profile-create-error-message'
                    }
                    );
        }

        mangopayWallet
            = await mangopayService
                .addWallet(
                    mangopayUser.Id,
                    request.profileLogged.currencyCode ?? 'EUR',
                    'Moien '
                    + ( request.profileLogged.currencyCode ?? 'EUR' )
                    + ' wallet'
                    );
        await profileService.setProfileById( { mangopayUserId: mangopayUser.Id }, request.profileLogged.id );
    }

    if ( !mangopayWallet )
    {
        let mangopayWalletArray = await mangopayService.getWalletArrayByUserId( mangopayUser.Id );

        if ( mangopayWalletArray )
        {
            for ( let wallet of mangopayWalletArray )
            {
                if ( wallet.Currency === ( request.profileLogged.currencyCode ?? 'EUR' ) )
                {
                    mangopayWallet = wallet;
                    break;
                }
            }
        }

        if ( !mangopayWallet )
        {
            mangopayWallet
                = await mangopayService.addWallet(
                    mangopayUser.Id,
                    request.profileLogged.currencyCode ?? 'EUR',
                    'Moien '
                    + ( request.profileLogged.currencyCode ?? 'EUR' )
                    + ' wallet'
                    );
        }
    }

    let balance = mangopayWallet?.Balance?.Amount ?? 0;
    balance = balance;
    let currencyCode = mangopayWallet?.Currency ?? 'EUR';

    return reply.status( 200 ).send( { balance, walletId: mangopayWallet?.Id, currencyCode: currencyCode } );
}
