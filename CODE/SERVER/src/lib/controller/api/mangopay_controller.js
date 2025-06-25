// -- IMPORTS

import { mangopayService } from '../../service/mangopay_service';
import { profileService } from '../../service/profile_service';

// -- FUNCTIONS

export async function addCardRegistration(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let cardRegistration
        = await mangopayService.addCardRegistration(
            request.profileLogged.mangopayUserId,
            request.profileLogged.currencyCode ?? 'EUR',
            'CB_VISA_MASTERCARD'
            );

    if ( !cardRegistration )
    {
        return reply.status( 500 ).send( { message: 'Could not create card registration' } );
    }

    return reply.status( 200 ).send( { cardRegistration } );
}

// ~~

export async function setCardRegistration(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let cardRegistrationResult = await mangopayService.updateCardRegistration( body.cardRegistration );

    if ( cardRegistrationResult.ResultMessage !== 'Success' )
    {
        return reply.status( 500 ).send( { message: 'Could not validate card' } );
    }

    let card = await mangopayService.getCardById( body.cardRegistration.CardId );

    return reply.status( 200 ).send( { card } );
}

// ~~

export async function setCard(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let card = await mangopayService.setCard( body.card );

    if ( !card )
    {
        return reply.status( 500 ).send( { error: 'Could not deactivate card' } );
    }

    return reply.status( 200 ).send( { card } );
}

// ~~

export async function addBankAccount(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let mangopayUser = await mangopayService.getUser( request.profileLogged.mangopayUserId );
    let body = JSON.parse( request.body );
    let bankAccountData =
        {
            Type: 'IBAN',
            OwnerName: body.bankAccount.ownerName,
            OwnerAddress: mangopayUser.Address,
            IBAN: body.bankAccount.accountNumber,
            BIC: body.bankAccount.bank,
            Tag: ''
        };
    let bankAccount = await mangopayService.addBankAccount( request.profileLogged.mangopayUserId, bankAccountData );

    if ( !bankAccount )
    {
        return reply.status( 200 ).send( { message: 'Could not add your bank account' } );
    }

    return reply.status( 200 ).send( { bankAccount } );
}

// ~~

export async function addPayout(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = JSON.parse( request.body );
    let walletArray = await mangopayService.getWalletArrayByUserId( request.profileLogged.mangopayUserId );
    let payoutData =
        {
            DebitedWalletId: walletArray[ 0 ].Id,
            PaymentType: 'BANK_WIRE',
            BankAccountId: body.bankAccount.Id,
            DebitedFunds:
                {
                    Currency: 'EUR',
                    Amount: body.amount * 100
                },
            Fees:
                {
                    Currency: 'EUR',
                    Amount: 0
                },
            AuthorId: body.bankAccount.UserId
        };
    let payout = await mangopayService.addPayout( payoutData );

    if ( !payout )
    {
        return reply.status( 500 ).send( { error: 'mangopay-payout-error-message' } );
    }

    return reply.status( 200 ).send( { payout } );
}

// ~~

export async function getPaymentMethodMap(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

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
            +' wallet'
            );
    }

    let [ profileCardArray, profileWalletArray, profileBankAccountArray ]
        = await Promise.all(
            [
                mangopayService.getCardArrayByUserId( mangopayUser.Id ),
                mangopayService.getWalletArrayByUserId( mangopayUser.Id ),
                mangopayService.getBankAccountArrayByUserId( mangopayUser.Id )
            ]
            );

    let holderInfo = {
        firstName: mangopayUser.FirstName,
        lastName: mangopayUser.LastName,
        address: mangopayUser.Address
    };

    let profilePaymentMethodMap =
        {
            cardArray: profileCardArray ? profileCardArray : [],
            walletArray: profileWalletArray ? profileWalletArray : [],
            bankAccountArray: profileBankAccountArray ? profileBankAccountArray : [],
            holderInfo: holderInfo ? holderInfo : {}
        };

    return reply.status( 200 ).send( profilePaymentMethodMap );
}
