// -- IMPORTS

import mangopay from 'mangopay2-nodejs-sdk';
import { getRandomTuid, logError } from 'senselogic-gist';
import { currencyConversionService } from './currency_conversion_service.test';

// -- TYPES

class MangopayService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.client = null;
    }

    // -- INQUIRIES

    async getUser(
        userId
        )
    {
        return await this.getClient()
            .Users
            .get( userId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getDocument(
        documentId
        )
    {
        return await this.getClient()
            .KycDocuments
            .get( documentId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getCardRegistrationById(
        cardRegistrationId
        )
    {
        return await this.getClient()
            .CardRegistrations
            .get( cardRegistrationId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getCardById(
        cardId
        )
    {
        return await this.getClient()
            .Cards
            .get( cardId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getCardArrayByUserId(
        mangopayUserId
        )
    {
        return await this.getClient()
            .Users
            .getCards(
                mangopayUserId,
                {
                    parameters: {
                        Active: true
                    }
                }
                )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getWalletArrayByUserId(
        mangopayUserId
        )
    {
        return await this.getClient()
            .Users
            .getWallets( mangopayUserId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getBankAccountArrayByUserId(
        mangopayUserId
        )
    {
        return await this.getClient()
            .Users
            .getBankAccounts( mangopayUserId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getTransactionArrayByUserId(
        userId
        )
    {
        return await this.getClient()
            .Users
            .getTransactions(
                userId,
                {
                    parameters:
                        {
                            per_page: 100,
                            page: 1,
                            Status: 'SUCCEEDED'
                        }
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getWalletTransactionArrayByWalletId(
        walletId,
        page = 1,
        perPage = 5
        )
    {
        return await this.getClient()
            .Wallets
            .getTransactions(
                walletId,
                {
                    parameters:
                        {
                            per_page: perPage,
                            page: page,
                            Status: 'SUCCEEDED',
                            // Type: 'TRANSFER',
                            Sort: 'CreationDate:DESC'
                        }
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getDocumentArrayByUserId(
        userId
        )
    {
        return await this.getClient()
            .Users
            .getKycDocuments( userId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getRecurringPayIn(
        recurringPayInId
        )
    {
        return this.getClient()
            .PayIns
            .getRecurringPayin( recurringPayInId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getMandateArrayByUserId(
        userId
        )
    {
        return this.getClient()
            .Mandates
            .getMandatesForUser( userId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getMandateArrayByUserIdAndBankAccountId(
        userId,
        bankAccountId
        )
    {
        return this.getClient()
            .Mandates
            .getMandatesForBankAccount(
                userId,
                bankAccountId
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getConversionRate(
        sourceCurrencyCode,
        targetCurrencyCode
        )
    {
        return this.getClient()
            .Conversions
            .getConversionRate(
                sourceCurrencyCode,
                targetCurrencyCode
                )
            .then(
                ( response ) =>
                {
                    let id = getRandomTuid()
                    currencyConversionService.addCurrencyConversion(
                        {
                            id: id,
                            sourceCurrencyCode: sourceCurrencyCode,
                            targetCurrencyCode: targetCurrencyCode,
                            rate: response.MarketRate
                        }
                        );

                    return { ...response, id } ;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getConversionById(
        conversionId
        )
    {
        return this.getClient()
            .Conversions
            .getConversion( conversionId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // -- OPERATIONS

    getClient(
        )
    {
        if ( this.client === null )
        {
            this.client = new mangopay(
                {
                    clientId: process.env.MOIEN_MANGOPAY_SANDBOX_CLIENT_ID,
                    clientApiKey: process.env.MOIEN_MANGOPAY_SANDBOX_CLIENT_API_KEY
                }
                );
        }

        return this.client;
    }

    // ~~

    async addUserFromProfile(
        profile
        )
    {
        return await this.getClient()
            .Users
            .create(
                {
                    Address:
                        {
                            AddressLine1: profile.addressLine1,
                            AddressLine2: profile.addressLine2,
                            City: profile.cityName,
                            Country: profile.countryCode,
                            PostalCode: '123456'
                        },
                    FirstName: profile.firstName,
                    LastName: profile.lastName,
                    PersonType: 'NATURAL',
                    Email: profile.email,
                    TermsAndConditionsAccepted: true,
                    Birthday: new Date( profile.birthDate ).getTime() / 1000,
                    Nationality: profile.countryCode,
                    CountryOfResidence: profile.countryCode,
                    PhoneNumber: profile.phonePrefix + profile.phoneNumber
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async setUserFromProfile(
        profile
        )
    {
        let mangopayUser = await this.getUser( profile.mangopayUserId );
        let newMangopayUserData =
            {
                Address:
                    {
                        AddressLine1: profile.addressLine1,
                        AddressLine2: profile.addressLine2,
                        City: profile.cityName,
                        Country: profile.countryCode,
                        PostalCode: '123456'
                    },
                FirstName: profile.firstName,
                LastName: profile.lastName,
                Email: profile.email,
                TermsAndConditionsAccepted: true,
                Birthday: new Date( profile.birthDate ).getTime() / 1000,
                Nationality: profile.countryCode,
                CountryOfResidence: profile.countryCode,
                PhoneNumber: profile.phonePrefix + profile.phoneNumber
            };

        return await this.getClient()
            .Users
            .update(
                {
                    ...mangopayUser,
                    ...newMangopayUserData
                }
                )
            .then(
                ( result ) =>
                {
                    return result;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async categorizeUserAsOwner(
        userId
        )
    {
        let mangopayUser = await this.getUser( userId );

        return await this.getClient()
            .Users
            .categorize(
                {
                    ...mangopayUser,
                    UserCategory: 'OWNER',
                    NaturalSca: true
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async enrollUserInSca(
        userId
        )
    {
        return await this.getClient()
            .Users
            .enroll( userId )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    //  ~~

    async deactivateCard(
        cardId
        )
    {
        let cardData = { Id: cardId, Active: false };

        return await this.getClient()
            .Cards
            .update( cardData )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addCardRegistration(
        userId,
        currency,
        cardType
        )
    {
        let cardData =
            {
                UserId: userId,
                Currency: currency,
                CardType: cardType
            };

        return await this.getClient()
            .CardRegistrations
            .create( cardData )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async updateCardRegistration(
        cardRegistration
        )
    {
        return await this.getClient()
            .CardRegistrations
            .update( cardRegistration )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async setCard(
        card
        )
    {
        return await this.getClient()
            .Cards
            .update( card )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getPayInById(
        payInId
        )
    {
        return await this.getClient()
            .PayIns
            .get( payInId )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addPayIn(
        directCardPayIn
        )
    {
        return await this.getClient()
            .PayIns
            .create( directCardPayIn )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addRecurringPayIn(
        recurringPayIn
        )
    {
        return this.getClient()
            .PayIns
            .createRecurringPayment( recurringPayIn )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async setRecurringPayIn(
        recurringPayIn,
        recurringPayInId
        )
    {
        return this.getClient()
            .PayIns
            .updateRecurringPayin( recurringPayInId, recurringPayIn )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addPayout(
        payout
        )
    {
        return await this.getClient()
            .PayOuts
            .create( payout )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addWallet(
        userId,
        currency,
        description = '',
        tag = ''
        )
    {
        return await this.getClient()
            .Wallets
            .create(
                {
                    Owners: [ userId ],
                    Currency: currency,
                    Description: description,
                    Tag: tag
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async setWallet(
        wallet
        )
    {
        return await this.getClient()
            .Wallets
            .update( wallet )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async getTransferById(
        transferId
        )
    {
        return await this.getClient()
            .Transfers
            .get( transferId )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addTransfer(
        transfer
        )
    {
        return await this.getClient()
            .Transfers
            .create( transfer )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addInstantConversion(
        conversion
        )
    {
        return await this.getClient()
            .Conversions
            .createInstantConversion( conversion )
            .then(
                ( response ) =>
                {
                    currencyConversionService.addCurrencyConversion(
                        {
                            id: getRandomTuid(),
                            sourceCurrencyCode: response.DebitedFunds.Currency,
                            targetCurrencyCode: response.CreditedFunds.Currency,
                            rate: response.ConversionRateResponse.MarketRate
                        }
                        );

                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addBankAccount(
        mangopayUserId,
        bankAccount
        )
    {
        return await this.getClient()
            .Users
            .createBankAccount(
                mangopayUserId,
                bankAccount
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                )
    }

    // ~~

    async addMandate(
        mandate
        )
    {
        return await this.getClient()
            .Mandates
            .create( mandate )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addPayInRefund(
        payInId,
        refund
        )
    {
        return await this.getClient()
            .PayIns
            .createRefund( payInId, refund )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addTransferRefund(
        transferId,
        refund
        )
    {
        return await this.getClient()
            .Transfers
            .createRefund( transferId, refund )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addConversionRefund(
        conversionId,
        refund
        )
    {
        return await this.getClient()
            .Conversions
            .createRefund(
                conversionId,
                refund
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    async addDocument(
        userId,
        document
        )
    {
        return await this.getClient()
            .Users
            .createKycDocument( userId, document )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addDocumentPage(
        userId,
        documentId,
        documentPageBase64String
        )
    {
        return await this.getClient()
            .Users
            .createKycPage(
                userId,
                documentId,
                {
                    File: documentPageBase64String
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async requestDocumentValidation(
        userId,
        documentId
        )
    {
        return await this.getClient()
            .Users
            .updateKycDocument(
                userId,
                {
                    Id: documentId,
                    Status: 'VALIDATION_ASKED'
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return false;
                }
                );
    }

    // ~~

    async addHook(
        hook
        )
    {
        let hookArray = await this.getClient().Hooks.getAll();

        let hookAlreadyRegistered = true;
        let currentHook;

        for ( let _hook of hookArray )
        {
            if ( _hook.EventType === hook.EventType && _hook.Status === 'ENABLED' )
            {
                hookAlreadyRegistered = true;
                currentHook = _hook;
                break;
            }
        }

        if ( !hookAlreadyRegistered )
        {
            return await this.getClient()
                .Hooks
                .create( hook )
                .then(
                    ( response ) =>
                    {
                        return response;
                    }
                    )
                .catch(
                    ( error ) =>
                    {
                        logError( error );

                        return false;
                    }
                    );
        }
        else
        {
            return await this.getClient()
                .Hooks
                .update(
                    {
                        ...hook,
                        Id: currentHook.Id
                    }
                    )
                .then(
                    ( response ) =>
                    {
                        return response;
                    }
                    )
                .catch(
                    ( error ) =>
                    {
                        logError( error );

                        return false;
                    }
                    );
        }
    }
}

export let mangopayService = new MangopayService();
