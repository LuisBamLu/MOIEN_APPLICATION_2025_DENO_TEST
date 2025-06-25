// -- IMPORTS

import { featureService } from '../../service/feature_service';
import { mangopayService } from '../../service/mangopay_service';
import { profileService } from '../../service/profile_service';

// -- FUNCTIONS

export async function checkoutPageData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = JSON.parse( request.body );

    if ( !request.profileLogged )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let mangopayUser = await mangopayService.getUser( request.profileLogged.mangopayUserId );

    if ( !mangopayUser )
    {
        mangopayUser = await mangopayService.addUserFromProfile( request.profileLogged );

        if ( !mangopayUser )
        {
            return reply.send( { error: 'mangopay-profile-create-error-message' } );
        }

        await profileService.setProfileById( { mangopayUserId: mangopayUser.Id }, request.profileLogged.id );
        await mangopayService.addWallet(
            mangopayUser.Id,
            request.profileLogged.currencyCode ?? 'EUR',
            'Moien '
            + ( request.profileLogged.currencyCode ?? 'EUR' )
            + ' wallet'
            );
    }

    let [ profileCardArray, profileWalletArray, profileBankAccountArray, cancellationPolicy ]
        = await Promise.all(
            [
                mangopayService.getCardArrayByUserId( mangopayUser.Id ),
                mangopayService.getWalletArrayByUserId( mangopayUser.Id ),
                mangopayService.getBankAccountArrayByUserId( mangopayUser.Id ),
                featureService.getFeatureByPropertyIdAndTypeId( body.propertyId, 'cancellation-policy' )
            ]
            );
    let profilePaymentMethodMap =
        {
            cardArray: profileCardArray ? profileCardArray : [],
            walletArray: profileWalletArray ? profileWalletArray : [],
            bankAccountArray: profileBankAccountArray ? profileBankAccountArray : [],
            cancellationPolicy: cancellationPolicy
        };

    return reply.status( 200 ).send( { profilePaymentMethodMap, cancellationPolicy } );
}
