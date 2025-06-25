// -- IMPORTS

import { rentalBookingService } from '../../../service/rental_booking_service';
import { mangopayService } from '../../../service/mangopay_service';
import { profileService } from '../../../service/profile_service';
import { featureService } from '../../../service/feature_service';
import { paymentService } from '../../../service/payment_service';
import { paymentMethodService } from '../../../service/payment_method_service';
import { getJsonObject, getLocalizedText, getMap, getMaximumReal, getRandomTuid, getTimeZoneFromLocation } from 'senselogic-gist';
import { propertyService } from '../../../service/property_service';
import { cancellationPolicyService } from '../../../service/cancellation_policy_service';
import { rentalBookingStatusService } from '../../../service/rental_booking_status_service';
import { getFormattedPrice, getTimeDifferenceInDay, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { notificationService } from '../../../service/notification_service';
import { deviceTokenService } from '../../../service/device_token_service';
import { AppError } from '../../../utils/app_error';
import { getStorageImagePath } from '../../../utils/fileUtils';
import { notificationCenterService } from '../../../service/notification_center_service';
import { ticketService } from '../../../service/ticket_service';
import { currencyConversionService } from '../../../service/currency_conversion_service';
import { featureTypeService } from '../../../service/feature_type_service';
import { rentalDayService } from '../../../service/rental_day_service';

// -- FUNCTIONS

async function getAdminRentalBooking(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { page, limit } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let { rentalBookingArray, rentalBookingCount }
        = await rentalBookingService.getRentalBookingArray(
            page,
            limit,
            filterArray
            );
    let totalPageCount = Math.ceil( rentalBookingCount / limit );
    let hasMorePage = page < totalPageCount;
    let [ userIdArray, propertyIdArray ] = [ 'userId', 'propertyId' ].map( key => getUniqueValues( rentalBookingArray, key ) );
    let [ profileArray, propertyArray, rentalBookingStatusArray, cancellationPolicyArray ]
        = await Promise.all(
            [
                profileService.getProfileArrayByUserIdArray( userIdArray ),
                propertyService.getPropertyArrayByIdArray( propertyIdArray ),
                rentalBookingStatusService.getCachedRentalBookingStatusArray(),
                cancellationPolicyService.getCachedCancellationPolicyArray()
            ]
            );

    return reply.status( 200 ).send(
        {
            rentalBookingArray,
            profileArray,
            propertyArray,
            rentalBookingStatusArray,
            cancellationPolicyArray,
            hasMorePage
        }
        );
}

// ~~

async function getRentalBookingById(
    request,
    reply
    )
{
    let rentalBookingId = request.params.id;

    let [
            rentalBooking,
            rentalBookingStatusArray,
            paymentArray,
            cancellationPolicyArray
        ] = await Promise.all(
            [
                rentalBookingService.getRentalBookingById(rentalBookingId),
                rentalBookingStatusService.getCachedRentalBookingStatusArray(),
                paymentService.getPaymentArrayByTransactionId(rentalBookingId),
                cancellationPolicyService.getCachedCancellationPolicyArray()
            ]
            );

    let [
            property,
            guestProfile,
            hostProfile
        ] = await Promise.all(
            [
                propertyService.getPropertyById(rentalBooking.propertyId),
                profileService.getProfileByUserId(rentalBooking.userId),
                profileService.getProfileByUserId((await propertyService.getPropertyById(rentalBooking.propertyId)).userId)
            ]
            );

    return reply
        .status( 200 )
        .send(
            {
                rentalBooking,
                property,
                guestProfile,
                hostProfile,
                rentalBookingStatusArray,
                paymentArray,
                cancellationPolicyArray
            }
            );
}

// ~~

function validateMinimumRequirement(
    property,
    rentalBooking,
    featureByTypeIdMap,
    featureTypeByIdMap
    )
{
    let shortTermMaximumDayCount =
        featureService.getFeatureValueByTypeId(
            'short-term-maximum-day-count',
            featureByTypeIdMap,
            featureTypeByIdMap
            );
    let maximumAdultCount =
        featureService.getFeatureValueByTypeId(
            'maximum-adult-count',
            featureByTypeIdMap,
            featureTypeByIdMap
            );
    let maximumChildCount =
        featureService.getFeatureValueByTypeId(
            'maximum-child-count',
            featureByTypeIdMap,
            featureTypeByIdMap
            );
    let maximumGuestCount = maximumAdultCount + maximumChildCount;
    let dayCount =
        getTimeDifferenceInDay(
            rentalBooking.arrivalDate,
            rentalBooking.departureDate
            );

    if ( dayCount > shortTermMaximumDayCount )
    {
        throw new AppError( 'short-term-maximum-day-exceeded' );
    }

    if ( rentalBooking.guestCount > maximumGuestCount )
    {
        throw new AppError( 'maximum-guest-count-exceeded' );
    }

    if ( !property.isAvailableForShortTerm )
    {
        throw new AppError( 'property-not-available-for-short-term-error' );
    }
}

// ~~

function getDayPrice(
    rentalDay,
    property,
    dayCount
    )
{
    if ( rentalDay !== undefined )
    {
        if ( dayCount > 30 )
        {
            if ( rentalDay.hasShortTermProlongedStayDiscount )
            {
                return rentalDay.shortTermProlongedStayDailyPrice;
            }
            else if ( rentalDay.hasShortTermExtendedStayDiscount )
            {
                return rentalDay.shortTermExtendedStayDailyPrice;
            }
            else
            {
                return rentalDay.shortTermDailyPrice;
            }
        }
        else if ( dayCount > 7 )
        {
            if ( rentalDay.hasShortTermExtendedStayDiscount )
            {
                return rentalDay.shortTermExtendedStayDailyPrice;
            }
            else
            {
                return rentalDay.shortTermDailyPrice;
            }
        }
        else
        {
            return rentalDay.shortTermDailyPrice;
        }
    }
    else
    {
        if ( dayCount > 30 )
        {
            if ( property.hasShortTermProlongedStayDiscount )
            {
                return property.shortTermProlongedStayDailyPrice;
            }
            else if ( property.hasShortTermExtendedStayDiscount )
            {
                return property.shortTermExtendedStayDailyPrice;
            }
            else
            {
                return property.shortTermDailyPrice;
            }
        }
        else if ( dayCount > 7 )
        {
            if ( property.hasShortTermExtendedStayDiscount )
            {
                return property.shortTermExtendedStayDailyPrice;
            }
            else
            {
                return property.shortTermDailyPrice;
            }
        }
        else
        {
            return property.shortTermDailyPrice;
        }
    }
}

// ~~

function getBasePrice(
    rentalDayByDateMap,
    property,
    arrivalDateString,
    dayCount
    )
{
    let basePrice = 0;
    let arrivalDate = new Date( arrivalDateString )

    for ( let currentDateIndex = 0; currentDateIndex < dayCount; currentDateIndex++ )
    {
        let currentDate = new Date( arrivalDate );
        currentDate.setUTCDate( arrivalDate.getUTCDate() + currentDateIndex )
        let dateString = currentDate.toISOString().slice( 0, 10 );

        let rentalDay = rentalDayByDateMap[ dateString ];
        basePrice = basePrice + getDayPrice( rentalDay, property, dayCount );
    }

    return basePrice;
}

// ~~

async function getNewRentalBookingData(
    property,
    rentalBookingData,
    profile,
    featureByTypeIdMap,
    featureTypeByIdMap,
    conversionId
    )
{
    let isNonRefundable =
        featureService.getFeatureValueByTypeId(
            'is-non-refundable',
            featureByTypeIdMap,
            featureTypeByIdMap
            );
    let shortTermCleaningFee =
        featureService.getFeatureValueByTypeId(
            'short-term-cleaning-fee',
            featureByTypeIdMap,
            featureTypeByIdMap,
            false
            );
    let shortTermSheetsFee =
        featureService.getFeatureValueByTypeId(
            'short-term-sheets-fee',
            featureByTypeIdMap,
            featureTypeByIdMap,
            false
            );
    let shortTermTowelsFee =
        featureService.getFeatureValueByTypeId(
            'short-term-towels-fee',
            featureByTypeIdMap,
            featureTypeByIdMap,
            false
            );
    let shortTermOtherFee =
        featureService.getFeatureValueByTypeId(
            'short-term-other-fee',
            featureByTypeIdMap,
            featureTypeByIdMap,
            false
            );
    let cancellationPolicyId =
        featureService.getFeatureValueByTypeId(
            'cancellation-policy',
            featureByTypeIdMap,
            featureTypeByIdMap,
            false
            );
    let totalFeeAmount =
        shortTermCleaningFee
        + shortTermSheetsFee
        + shortTermTowelsFee
        + shortTermOtherFee;
    let dayCount =
        getTimeDifferenceInDay(
            rentalBookingData.arrivalDate,
            rentalBookingData.departureDate
            );
    let rentalDayArray
        = await rentalDayService.getRentalDayArrayByPropertyIdAndDateRange(
            property.id,
            [ rentalBookingData.arrivalDate, rentalBookingData.departureDate ]
            );
    let rentalDayByDateMap = getMap( rentalDayArray, 'date' );
    let basePrice =
        getBasePrice(
            rentalDayByDateMap,
            property,
            rentalBookingData.arrivalDate,
            dayCount
            );
    let conversionRate = 1;

    if ( !isNullOrUndefined( conversionId ) )
    {
        let currencyConversion =
            await currencyConversionService.getCurrencyConversionById( conversionId );

        conversionRate = currencyConversion.rate;
    }

    return (
        {
            ...rentalBookingData,
            dayCount,
            cleaningFee: shortTermCleaningFee,
            sheetsFee: shortTermSheetsFee,
            towelsFee: shortTermTowelsFee,
            otherFee: shortTermOtherFee,
            totalPrice:
                totalFeeAmount
                + basePrice
                + getMaximumReal( rentalBookingData.donation, basePrice * 0.01 )
                + rentalBookingData.carbonCompensationDonation,
            cancellationPolicyId,
            isNonRefundable,
            userId: profile.userId,
            conversionRate
        }
        );
}

// ~~

async function addRentalBooking(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-message-error', 401 );
    }

    let {
            rentalBooking: rentalBookingData,
            propertyUserId,
            conversionId
        } = getJsonObject( request.body ).data;

    let [
            rentalBooking,
            property,
            hostProfile
        ] = await Promise.all(
            [
                rentalBookingService.getRentalBookingById( rentalBookingData.id ),
                propertyService.getPropertyById( rentalBookingData.propertyId ),
                profileService.getProfileByUserId( propertyUserId )
            ]
            );

    if ( isNullOrUndefined( property ) )
    {
        throw new AppError( 'invalid-property-error-message' );
    }
    if ( isNullOrUndefined( hostProfile ) )
    {
        throw new AppError( 'invalid-host-error-message' );
    }
    if ( isNullOrUndefined( rentalBookingData.arrivalDate ) )
    {
        throw new AppError( 'invalid-arrival-date-error-message' );
    }
    if ( isNullOrUndefined( rentalBookingData.departureDate ) )
    {
        throw new AppError( 'invalid-departure-date-error-message' );
    }
    if ( isNullOrUndefined( rentalBookingData.guestCount ) )
    {
        throw new AppError( 'invalid-guest-count-error-message' );
    }
    if ( isNullOrUndefined( rentalBookingData.status ) )
    {
        throw new AppError( 'invalid-status-error-message' );
    }

    let featureByTypeIdMap = getMap( property.featureArray, 'typeId' );
    let featureTypeByIdMap = await featureTypeService.getCachedFeatureTypeByIdMap();

    validateMinimumRequirement(
        property,
        rentalBookingData,
        featureByTypeIdMap,
        featureTypeByIdMap
        );

    if ( isNullOrUndefined( rentalBooking ) )
    {
        let newRentalBookingData
            = await getNewRentalBookingData(
                property,
                rentalBookingData,
                profile,
                featureByTypeIdMap,
                featureTypeByIdMap,
                conversionId
                );

        rentalBooking =
            await rentalBookingService.addRentalBooking( newRentalBookingData );
    }

    let deviceToken =
        await deviceTokenService.getDeviceTokenByUserId( hostProfile.userId );
    let checkInDate
        = new Date( rentalBooking.arrivalDate ).toLocaleDateString(
            'en',
            {
                timeZone: getTimeZoneFromLocation(
                    property.latitude,
                    property.longitude,
                    property.countryCode
                    )
            }
            );
    let checkOutDate
        = new Date( rentalBooking.departureDate ).toLocaleDateString(
            'en',
            {
                timeZone: getTimeZoneFromLocation(
                    property.latitude,
                    property.longitude,
                    property.countryCode
                    )
            }
            );
    let confirmBookingLink =
        `/${ hostProfile.languageTag
        || 'en' }/dashboard/ads/current-stays/${ rentalBooking.id }`;

    notificationService.sendTemplateNotification(
        'booking-confirmation-host',
        {
            profile: hostProfile,
            propertyName:
                getLocalizedText(
                    property.title,
                    {},
                    hostProfile.languageTag
                    ),
            propertyDescription:
                getLocalizedText(
                    property.description,
                    {},
                    hostProfile.languageTag
                    ),
            guestName: profile.firstName,
            confirmBookingLink: request.headers.origin + confirmBookingLink,
            propertyFullWidthImagePath: getStorageImagePath( property.imagePath, 1280 ),
            propertyPreloadImagePath: getStorageImagePath( property.imagePath, 360 ),
            checkInDate,
            checkOutDate,
            device: deviceToken
        }
        );
    notificationCenterService.addNotification(
        {
            id: getRandomTuid(),
            notificationType: 'partner-ads',
            message: `You have a new booking request, ((${ confirmBookingLink })(click here)) to see.`
                + `¨fr:Vous avez une nouvelle demande de réservation, ((${ confirmBookingLink })(cliquez ici)) à voir.`
                + `¨de:Sie haben eine neue Buchungsanfrage, ((${ confirmBookingLink })(hier klicken)) zu sehen.`,
            userId: hostProfile.userId,
            isRead: false
        }
        );
    let hasInstantBooking =
        featureService.getFeatureValueByTypeId(
            'has-instant-booking',
            featureByTypeIdMap,
            featureTypeByIdMap
            );

    if ( hasInstantBooking && rentalBooking.status === 'requested' )
    {
        rentalBooking =
            await rentalBookingService.setRentalBookingById(
                { status: 'confirmed' },
                rentalBooking.id
                );

        await payRentalBooking( request, reply );
    }
    else
    {
        return reply.send( { rentalBooking } );
    }
}

// ~~

async function payRentalBooking(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = getJsonObject( request.body );
    let paymentMangopayId;
    let paymentMessage;
    let paymentStatus;
    let mangopayUser;
    let userId;

    let rentalBooking =
        await rentalBookingService.getRentalBookingById(
            body.data.rentalBooking.id
            );

    if ( rentalBooking === null )
    {
        return reply.send( { error: 'Rental booking not found' } );
    }

    if ( rentalBooking.status === 'paid' )
    {
        return reply.send( { error: 'Rental booking has already been paid for' } );
    }

    if ( rentalBooking.status === 'cancelled' )
    {
        return reply.send( { error: 'cancelled-rental-booking-payment' } );
    }

    if ( request.profileLogged )
    {
        mangopayUser =
            await mangopayService.getUser( request.profileLogged.mangopayUserId );

        if ( !mangopayUser )
        {
            return reply.send( { error: 'mangopay-profile-create-error-message' } );
        }

        userId = request.profileLogged.userId;
    }
    else if ( body.data.mangopayUserId )
    {
        userId = body.data.userId;

        (
            [ mangopayUser, request.profileLogged ]
                = await Promise.all(
                    [
                        mangopayService.getUser( body.data.mangopayUserId ),
                        profileService.getProfileByUserId( userId )
                    ]
                    )
        );
    }
    else
    {
        return reply.send( { error: 'booking-checkout-must-be-signed-in-error-message' } );
    }

    if ( !mangopayUser )
    {
        return reply.send( { error: 'mangopay-payment-error-message' } );
    }

    let [ property, guestWalletArray, hostProfile, paymentMethod ]
        = await Promise.all(
            [
                propertyService.getPropertyById( body.data.rentalBooking.propertyId ),
                mangopayService.getWalletArrayByUserId( mangopayUser.Id ),
                profileService.getProfileByUserId( body.data.propertyUserId ),
                paymentMethodService.getPaymentMethodByMangopayId( body.data.paymentMethodId )
            ]
            );
    let guestWalletId;

    for ( let wallet of guestWalletArray )
    {
        if ( wallet.Currency === property.currencyCode )
        {
            guestWalletId = wallet.Id;

            break;
        }
    }

    body.data.browserInfo.AcceptHeader = '*/*';
    let hostMangopayUser = await mangopayService.getUser( hostProfile.mangopayUserId );
    let hostWallet;
    rentalBooking = body.data.rentalBooking;

    if ( !hostMangopayUser )
    {
        hostMangopayUser = await mangopayService.addUserFromProfile( hostProfile );

        if ( !hostMangopayUser )
        {
            return reply.send( { error: 'mangopay-property-owner-error-message' } );
        }

        hostWallet
            = await mangopayService.addWallet(
                hostMangopayUser.Id,
                property.currencyCode ?? 'EUR',
                'Moien '
                +  ( property.currencyCode ?? 'EUR' )
                + ' Wallet'
                );
        await profileService.setProfileById( { mangopayUserId: hostMangopayUser.Id }, hostProfile.id );
    }
    else
    {
        let hostWalletArray = await mangopayService.getWalletArrayByUserId( hostMangopayUser.Id );

        if ( !hostWalletArray || hostWalletArray.length === 0 )
        {
            hostWallet
                = await mangopayService.addWallet(
                    hostMangopayUser.Id,
                    property.currencyCode ?? 'EUR',
                    'Moien '
                    + ( property.currencyCode ?? 'EUR' )
                    + ' Wallet'
                    );
        }
        else
        {
            for ( let _hostWallet of hostWalletArray )
            {
                if ( _hostWallet.Currency === property.currencyCode )
                {
                    hostWallet = _hostWallet;

                    break;
                }
            }

            if ( !hostWallet )
            {
                hostWallet
                    = await mangopayService.addWallet(
                        hostMangopayUser.Id,
                        property.currencyCode ?? 'EUR',
                        'Moien '
                        + ( property.currencyCode ?? 'EUR' )
                        + ' Wallet'
                        );
            }
        }
    }

    let totalPrice = Number( rentalBooking.totalPrice );
    let donationAmount = Number( rentalBooking.donation ) ?? 0;
    let carbonCompensationDonation = Number( rentalBooking.carbonCompensationDonation ) ?? 0;
    let stayPrice =
        totalPrice
        - carbonCompensationDonation
        - donationAmount
        - Number( rentalBooking.cleaningFee )
        - Number( rentalBooking.sheetsFee )
        - Number( rentalBooking.towelsFee )
        - Number( rentalBooking.otherFee );
    let totalMoienFee = donationAmount + stayPrice * 0.01;

    if ( body.data.paymentMethodId.includes( 'card' ) )
    {
        let card = await mangopayService.getCardById( body.data.paymentMethodId );

        if ( body.data.rentalBooking.conversionRate !== 1 )
        {
            for ( let wallet of guestWalletArray )
            {
                if ( wallet.Currency === card.Currency )
                {
                    guestWalletId = wallet.Id;

                    break;
                }
                else
                {
                    guestWalletId = null;
                }
            }
        }

        if ( guestWalletId === null )
        {
            let guestWallet
                = await mangopayService.addWallet(
                    mangopayUser.Id,
                    card.Currency,
                    'Moïen '
                    + card.Currency
                    + ' wallet'
                    );

            guestWalletId = guestWallet.Id;
        }

        let dataSearchParams
            = new URLSearchParams(
                {
                    ...body.data,
                    paymentMethodId: '',
                    donation: donationAmount,
                    rentalBooking: '',
                    browserInfo: '',
                    mangopayUserId: mangopayUser.Id,
                    userId: userId,
                    ...body.data.rentalBooking,
                    ...body.data.browserInfo
                }
                )
                .toString();

        let conversionRate = rentalBooking.conversionRate;
        let payIn
            = await mangopayService.addPayIn(
                {
                    PaymentType: 'CARD',
                    ExecutionType: 'DIRECT',
                    AuthorId: mangopayUser.Id,
                    DebitedFunds:
                        {
                            Currency: card.Currency,
                            // An amount of money in the smallest sub-division of the currency
                            // (e.g EUR 12.60 would be represented as 1260 whereas JPY 12 would be represented as just 12).
                            Amount: totalPrice * conversionRate * 100
                        },
                    Fees: { Currency: card.Currency, Amount: 0 },
                    CreditedWalletId: guestWalletId,
                    CardId: body.data.paymentMethodId,
                    BrowserInfo: body.data.browserInfo,
                    IpAddress: request.ip,
                    SecureModeReturnURL:
                        ( process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://moien.com' )
                        + `/api/confirm-booking-payment?${ dataSearchParams }`,
                    SecureMode: 'FORCE',
                    Tag: 'Moien wallet pay-in'
                }
                );

        paymentMangopayId = payIn.Id;
        paymentMessage = payIn.ResultMessage;
        paymentStatus = payIn.Status;
        let secureModeRedirectUrl = payIn.SecureModeRedirectURL;
        paymentService.addPayment(
            {
                id: getRandomTuid(),
                typeId: 'payin',
                methodId: paymentMethod?.id ?? null,
                payerUserProfileId: userId,
                userId: userId,
                amount: totalPrice * conversionRate,
                currencyCode: card.Currency,
                mangopayId: paymentMangopayId,
                transactionId: body.data.rentalBooking.id,
                statusId: String( payIn?.Status ?? '' ).toLowerCase()
            }
            );

        if ( paymentStatus === 'FAILED' )
        {
            return reply.send( { error: paymentMessage } );
        }

        if ( secureModeRedirectUrl )
        {
            return reply.status( 200 ).send( { paymentMessage, paymentStatus, secureModeRedirectUrl } );
        }
    }
    else if ( body.data.paymentMethodId.includes( 'bankacc' ) )
    {
        if ( property.currencyCode !== request.profileLogged.currencyCode )
        {
            return reply.send( { error: 'Direct debit is not yet supported for cross-currency payments.' } );
        }

        let mandateArray
            = await mangopayService.getMandateArrayByUserIdAndBankAccountId(
                mangopayUser.Id,
                body.data.paymentMethodId
                );

        let directDebitMandate = null;

        for ( let mandate of mandateArray )
        {
            if ( mandate.Status === 'ACTIVE' || mandate.Status === 'SUBMITTED' )
            {
                directDebitMandate = mandate;

                break;
            }
        }

        if ( directDebitMandate === null )
        {
            let dataSearchParams
                = new URLSearchParams(
                    {
                        ...body.data,
                        donation: donationAmount,
                        rentalBooking: '',
                        browserInfo: '',
                        mangopayUserId: mangopayUser.Id,
                        userId: userId,
                        ...body.data.rentalBooking,
                        ...body.data.browserInfo
                    }
                    )
                    .toString();

            let mandate
                = await mangopayService.addMandate(
                    {
                        BankAccountId: body.data.paymentMethodId,
                        AuthorId: mangopayUser.Id,
                        UserId: mangopayUser.Id,
                        Culture: 'EN',
                        ReturnURL:
                            ( process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://moien.com' )
                            + `/api/confirm-booking-payment?${ dataSearchParams }`,
                    }
                    );

            paymentMessage = mandate.ResultMessage;
            paymentStatus = mandate.Status;
            let secureModeRedirectUrl = mandate.RedirectURL;

            if ( paymentStatus === 'FAILED' )
            {
                return reply.send( { error: paymentMessage } );
            }

            return reply.status( 200 ).send( { paymentMessage, paymentStatus, secureModeRedirectUrl } );
        }

        let directDebitPayIn
            = await mangopayService.addPayIn(
                {
                    PaymentType: 'DIRECT_DEBIT',
                    ExecutionType: 'DIRECT',
                    AuthorId: mangopayUser.Id,
                    DebitedFunds:
                        {
                            Currency: property.currencyCode,
                            Amount: ( totalPrice - carbonCompensationDonation ) * 100
                        },
                    Fees:
                        {
                            Currency: property.currencyCode,
                            Amount: totalMoienFee * 100
                        },
                    CreditedWalletId: hostWallet.Id,
                    MandateId: directDebitMandate.Id,
                    BrowserInfo: body.data.browserInfo,
                    IpAddress: request.ip,
                    Tag:
                        'Property rental -'
                        + ` ${ body.data.rentalBooking.dayCount } days`
                        + ` ${ body.data.rentalBooking.guestCount } guests`
                }
                );

        if ( Number( body.data.rentalBooking.carbonCompensationDonation ) > 0 )
        {
            let directDebitEcotreeDonationPayIn
                = await mangopayService.addPayIn(
                    {
                        PaymentType: 'DIRECT_DEBIT',
                        ExecutionType: 'DIRECT',
                        AuthorId: mangopayUser.Id,
                        DebitedFunds:
                            {
                                Currency: property.currencyCode,
                                Amount: carbonCompensationDonation * 100
                            },
                        Fees: { Currency: property.currencyCode, Amount: 0 },
                        CreditedWalletId: process.env.MOIEN_MANGOPAY_ECOTREE_WALLET_ID,
                        MandateId: directDebitMandate.Id,
                        Tag: 'Ecotree donation'
                    }
                    );

            paymentService.addPayment(
                {
                    id: getRandomTuid(),
                    typeId: 'payin',
                    payerUserProfileId: userId,
                    userId: userId,
                    amount: carbonCompensationDonation,
                    currencyCode: property.currencyCode,
                    mangopayId: directDebitPayIn.Id,
                    transactionId: body.data.rentalBooking.id,
                    statusId: String( directDebitEcotreeDonationPayIn?.Status ?? '' ).toLowerCase()
                }
                );
        }

        if ( !directDebitPayIn )
        {
            return reply.send( { error: 'mangopay-payment-error-message' } );
        }

        paymentMangopayId = directDebitPayIn.Id;
        paymentMessage = directDebitPayIn.ResultMessage;
        paymentStatus = directDebitPayIn.Status;
        await paymentService.addPayment(
            {
                id: getRandomTuid(),
                typeId: 'payin',
                methodId: paymentMethod?.id ?? null,
                payerUserProfileId: userId,
                payeeUserProfileId: hostProfile.userId,
                userId: userId,
                amount: totalPrice - carbonCompensationDonation,
                currencyCode: property.currencyCode,
                mangopayId: paymentMangopayId,
                transactionId: body.data.rentalBooking.id,
                statusId: String( paymentStatus ?? '' ).toLowerCase()
            }
            );

        if ( paymentStatus === 'FAILED' )
        {
            return reply.send( { error: paymentMessage } );
        }
    }
    else if ( body.data.paymentMethodId.includes( 'wlt' ) )
    {
        guestWalletId = body.data.paymentMethodId;
    }

    let reverseConversionRate = 1;
    let conversionRate = 1;

    if ( !body.data.paymentMethodId.includes( 'bankacc' ) )
    {
        let rentalBooking = { ...body.data.rentalBooking };
        rentalBooking.conversionRate = Number( rentalBooking.conversionRate );

        if ( rentalBooking.conversionRate !== 1 )
        {
            let sourceCurrencyWallet = null;
            let targetCurrencyWallet = null;

            for ( let wallet of guestWalletArray )
            {
                if ( wallet.Currency === request.profileLogged.currencyCode )
                {
                    if ( sourceCurrencyWallet === null )
                    {
                        sourceCurrencyWallet = wallet;
                    }
                    else
                    {
                        mangopayService.setWallet( wallet.Id, { Active: false } );
                    }
                }
                else if ( wallet.Currency === property.currencyCode )
                {
                    if ( targetCurrencyWallet === null )
                    {
                        targetCurrencyWallet = wallet;
                    }
                    else
                    {
                        mangopayService.setWallet( wallet.Id, { Active: false } );
                    }
                }
            }

            if ( sourceCurrencyWallet === null )
            {
                sourceCurrencyWallet
                    = await mangopayService.addWallet(
                        mangopayUser.Id,
                        request.profileLogged.currencyCode,
                        'Moien '
                        + request.profileLogged.currencyCode
                        + ' wallet'
                        );
            }

            if ( targetCurrencyWallet === null )
            {
                targetCurrencyWallet
                    = await mangopayService.addWallet(
                        mangopayUser.Id,
                        property.currencyCode,
                        'Moien '
                        + property.currencyCode
                        + ' wallet'
                        );
            }

            let conversion
                = await mangopayService.addInstantConversion(
                    {
                        AuthorId: mangopayUser.Id,
                        DebitedWalletId: sourceCurrencyWallet.Id,
                        CreditedWalletId: targetCurrencyWallet.Id,
                        DebitedFunds:
                            {
                                Currency: sourceCurrencyWallet.Currency,
                                Amount:
                                    Number( totalPrice )
                                    * rentalBooking.conversionRate
                                    * 100
                            },
                        CreditedFunds:
                            {
                                Currency: targetCurrencyWallet.Currency
                            },
                        Fees:
                            {
                                Currency: sourceCurrencyWallet.Currency,
                                Amount: 0
                            },
                        Tag: 'Currency conversion'
                    }
                    );

            if ( !conversion )
            {
                return reply.send( { error: 'Could not convert currencies' } );
            }

            reverseConversionRate = ( conversion.CreditedFunds.Amount / 100 ) / rentalBooking.totalPrice;
            conversionRate =
                ( rentalBooking.totalPrice * rentalBooking.conversionRate )
                / ( rentalBooking.totalPrice * reverseConversionRate );
            guestWalletId = targetCurrencyWallet.Id;

            paymentService.addPayment(
                {
                    id: getRandomTuid(),
                    typeId: 'conversion',
                    methodId: paymentMethod?.id ?? null,
                    payerUserProfileId: userId,
                    userId: userId,
                    amount: totalPrice * rentalBooking.conversionRate,
                    currencyCode: conversion.DebitedFunds.Currency,
                    mangopayId: conversion.Id,
                    transactionId: rentalBooking.id,
                    statusId: String( conversion.Status ?? '' ).toLowerCase()
                }
                );
        }

        let transfer
            = await mangopayService.addTransfer(
                {
                    AuthorId: mangopayUser.Id,
                    DebitedFunds:
                        {
                            Currency: property.currencyCode,
                            Amount: ( totalPrice - carbonCompensationDonation ) * reverseConversionRate * 100
                        },
                    Fees:
                        {
                            Currency: property.currencyCode,
                            Amount: totalMoienFee * reverseConversionRate * 100
                        },
                    CreditedWalletId: hostWallet.Id,
                    DebitedWalletId: guestWalletId,
                    Tag:
                        'Property rental -'
                        + ` ${ rentalBooking.dayCount } days`
                        + ` ${ rentalBooking.guestCount } guests`
                }
                );

        paymentMangopayId = transfer.Id;
        paymentMessage = transfer.ResultMessage;
        paymentStatus = transfer.Status;
        paymentService.addPayment(
            {
                id: getRandomTuid(),
                typeId: 'transfer',
                methodId: paymentMethod?.id ?? null,
                payerUserProfileId: userId,
                userId: userId,
                payeeUserProfileId: hostProfile.userId,
                amount: ( totalPrice - carbonCompensationDonation ) * reverseConversionRate,
                currencyCode: property.currencyCode,
                mangopayId: paymentMangopayId,
                transactionId: rentalBooking.id,
                statusId: String( paymentStatus ).toLowerCase()
            }
            );

        if ( Number( body.data.rentalBooking.carbonCompensationDonation ) > 0 )
        {
            let ecotreeDonationTransfer
                = await mangopayService.addTransfer(
                    {
                        AuthorId: mangopayUser.Id,
                        DebitedFunds:
                            {
                                Currency: property.currencyCode,
                                Amount: carbonCompensationDonation  * reverseConversionRate * 100
                            },
                        Fees: { Currency: property.currencyCode, Amount: 0 },
                        CreditedWalletId: process.env.MOIEN_MANGOPAY_ECOTREE_WALLET_ID,
                        DebitedWalletId: guestWalletId,
                        Tag: 'Carbon compensation donation'
                    }
                    );
            paymentService.addPayment(
                {
                    id: getRandomTuid(),
                    typeId: 'transfer',
                    methodId: paymentMethod?.id ?? null,
                    payerUserProfileId: userId,
                    amount: rentalBooking.carbonCompensationDonation * reverseConversionRate,
                    currencyCode: property.currencyCode,
                    mangopayId: ecotreeDonationTransfer.Id,
                    transactionId: rentalBooking.id,
                    statusId: String( ecotreeDonationTransfer?.Status ?? '' ).toLowerCase()
                }
                );
        }
    }

    let amount = totalPrice * reverseConversionRate;
    let guestProfile = await profileService.getProfileByUserId( userId );
    let guestDevice = await deviceTokenService.getDeviceTokenByUserId( userId );
    let hostDevice = await deviceTokenService.getDeviceTokenByUserId( property.userId );

    if ( paymentStatus === 'SUCCEEDED' || paymentStatus === 'CREATED' )
    {
        rentalBooking
            = await rentalBookingService.setRentalBookingById(
                {
                    cleaningFee: Number( rentalBooking.cleaningFee ) * reverseConversionRate,
                    sheetsFee: Number( rentalBooking.sheetsFee ) * reverseConversionRate,
                    towelsFee: Number( rentalBooking.towelsFee ) * reverseConversionRate,
                    otherFee: Number( rentalBooking.otherFee ) * reverseConversionRate,
                    donation: Number( rentalBooking.donation ) * reverseConversionRate,
                    carbonCompensationDonation: Number( rentalBooking.carbonCompensationDonation ) * reverseConversionRate,
                    totalPrice: Number( rentalBooking.totalPrice ) * reverseConversionRate,
                    conversionRate: conversionRate,
                    status: 'paid'
                },
                rentalBooking.id
                );
        let checkInDate
            = new Date( rentalBooking.arrivalDate )
                .toLocaleDateString(
                    'en',
                    {
                        timeZone:
                            getTimeZoneFromLocation(
                                property.latitude,
                                property.longitude,
                                property.countryCode
                                )
                    }
                    );
        let checkOutDate
            = new Date( rentalBooking.departureDate ).toLocaleDateString(
                'en',
                {
                    timeZone: getTimeZoneFromLocation(
                        property.latitude,
                        property.longitude,
                        property.countryCode
                        )
                }
                );
        let propertyFullWidthImagePath = getStorageImagePath( property.imagePath, 1280 );
        let propertyPreloadImagePath = getStorageImagePath( property.imagePath, 360 );

        notificationService.sendTemplateNotification(
            'payment-confirmation-guest',
            {
                profile: guestProfile,
                guestName: guestProfile.firstName,
                propertyName: getLocalizedText( property.title, {}, guestProfile.languageTag ),
                rentalBooking,
                amount: getFormattedPrice( amount ),
                checkInDate,
                checkOutDate,
                propertyFullWidthImagePath,
                propertyPreloadImagePath,
                device: guestDevice
            }
            );
        notificationService.sendTemplateNotification(
            'payment-received-host',
            {
                profile: hostProfile,
                guestName: guestProfile.firstName + ' ' + guestProfile.lastName,
                hostName: hostProfile.firstName,
                propertyFullWidthImagePath,
                propertyPreloadImagePath,
                amount: getFormattedPrice( totalPrice - carbonCompensationDonation - totalMoienFee ),
                checkInDate,
                checkOutDate,
                propertyName: getLocalizedText( property.title, {}, guestProfile.languageTag ),
                device: hostDevice
            }
            );
        notificationCenterService.addNotification(
            {
                id: getRandomTuid(),
                notificationType: 'appointment-reminder',
                message:
                    `You have received a payment for the booking at `
                    + `${ getLocalizedText( property.title, guestProfile.languageTag ) } from ${ guestProfile.firstName }.`
                    + `¨fr:Vous avez reçu un paiement pour la réservation à `
                    + `${ getLocalizedText( property.title, guestProfile.languageTag ) } de ${ guestProfile.firstName }.`
                    + `¨de:Sie haben eine Zahlung für die Buchung unter `
                    + `${ getLocalizedText( property.title, guestProfile.languageTag ) } von ${ guestProfile.firstName } erhalten.`,
                userId: hostProfile.userId,
                isRead: false
            }
            );
        notificationCenterService.addNotification(
            {
                id: getRandomTuid(),
                notificationType: 'appointment-reminder',
                message:
                    `Your payment for the booking at `
                    + `${ getLocalizedText( property.title, guestProfile.languageTag ) } has been processed successfully.`
                    + `¨fr:Votre paiement pour la réservation à `
                    + `${ getLocalizedText( property.title, guestProfile.languageTag ) } a été traité avec succès.`
                    + `¨de:Ihre Zahlung für die Buchung unter `
                    + `${ getLocalizedText( property.title, guestProfile.languageTag ) } wurde erfolgreich verarbeitet.`,
                userId: guestProfile.userId,
                isRead: false
            }
            );

        if ( body.type !== 'addRentalBooking' )
        {
            return reply.redirect( '/confirm-booking-payment/' + rentalBooking.id + '?status=succeeded' );
        }

        return reply.status( 200 ).send( { rentalBooking } );
    }
    else
    {
        await paymentService.addPayment(
            {
                id: getRandomTuid(),
                typeId: 'payin',
                methodId: paymentMethod?.id ?? null,
                payerUserProfileId: userId,
                userId: userId,
                payeeUserProfileId: hostProfile.userId,
                amount: totalPrice,
                mangopayId: paymentMangopayId,
                transactionId: body.data.rentalBooking.id,
                statusId: 'failed'
            }
            );

        if ( body.type === 'addRentalBooking' )
        {
            return reply.send( { error: paymentMessage, paymentStatus } );
        }
        else
        {
            return reply.redirect( '/confirm-booking-payment/' + rentalBooking.id + '?status=failed' );
        }
    }
}

// ~~

async function setRentalBooking(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = getJsonObject( request.body );
    let rentalBookingId = request.params.id;
    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let rentalBooking = await rentalBookingService.getRentalBookingById( rentalBookingId );
    let property = await propertyService.getPropertyById( rentalBooking.propertyId );

    if ( isNullOrUndefined( rentalBooking )
         || isNullOrUndefined( property ) )
    {
        throw new AppError( 'rental-booking-not-found-error-message', 404 );
    }

    if ( rentalBooking.userId !== profile.userId
         && property.userId !== profile.userId )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    if ( [ 'confirmed', 'paid' ].includes( body.rentalBooking.status ) )
    {
        throw new AppError( 'invalid-rental-booking-status-error-message', 403 );
    }

    rentalBooking = await rentalBookingService.setRentalBookingById( { status: 'cancelled' }, rentalBookingId );

    return reply.send( { rentalBooking } );
}

// ~~

async function confirmRentalBooking(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let rentalBookingId = request.params.id;
    let rentalBooking = await rentalBookingService.getRentalBookingById( rentalBookingId );

    if ( !rentalBooking )
    {
        return reply.status( 404 ).send( { error: 'rental booking not found' } );
    }

    let property = await propertyService.getPropertyById( rentalBooking.propertyId );

    if ( request.profileLogged?.userId !== property.userId )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message'} );
    }

    let rentalBookingArray
        = await rentalBookingService.getRentalBookingArrayByPropertyIdAndStatusArray(
            property.id,
            [ 'confirmed', 'paid' ]
            );
    let arrivalDate = new Date( rentalBooking.arrivalDate );
    let departureDate = new Date( rentalBooking.departureDate );

    for ( let rentalBooking of rentalBookingArray )
    {
        let rentalBookingArrivalDate = new Date( rentalBooking.arrivalDate );
        let rentalBookingDepartureDate = new Date( rentalBooking.departureDate );

        if ( !( departureDate.getTime() <= rentalBookingArrivalDate.getTime()
                || arrivalDate.getTime() >= rentalBookingDepartureDate.getTime() ) )
        {
            return reply.send(
                {
                    error: 'current-stays-page-property-already-booked-error',
                    arrivalDate: rentalBooking.arrivalDate,
                    departureDate: rentalBooking.departureDate
                }
                );
        }
    }

    let [ confirmedRentalBooking, guestProfile, deviceToken, hostProfile ]
        = await Promise.all(
            [
                rentalBookingService.setRentalBookingById( { status: 'confirmed' }, rentalBookingId ),
                profileService.getProfileByUserId( rentalBooking.userId ),
                deviceTokenService.getDeviceTokenByUserId( rentalBooking.userId ),
                profileService.getProfileByUserId( property.userId )
            ]
            );
    let propertyFullWidthImagePath = getStorageImagePath( property.imagePath, 1280 );
    let propertyPreloadImagePath = getStorageImagePath( property.imagePath, 360 );
    let confirmAndPayLink = `/${ guestProfile.languageTag || 'en' }/dashboard/rental-booking/${ rentalBooking.id }`;
    notificationService.sendTemplateNotification(
        'booking-confirmation-guest',
        {
            profile: guestProfile,
            propertyName: getLocalizedText( property.title, {}, guestProfile.languageTag ),
            propertyAddress:
                `${ property.streetName }, `
                + `${ property.buildingNumber }`
                + `${ property.typeId === 'appartment' ? ' ' + property.apartmentNumber : '' } `
                + `- ${ property.cityName } ${ property.countryName }`,
            hostName: hostProfile.firstName,
            checkInDate:
                new Date( rentalBooking.arrivalDate ).toLocaleDateString(
                    'en',
                    {
                        timeZone: getTimeZoneFromLocation(
                            property.latitude,
                            property.longitude,
                            property.countryCode
                            )
                    }
                    ),
            checkOutDate:
                new Date( confirmedRentalBooking.departureDate ).toLocaleDateString(
                    'en',
                    {
                        timeZone: getTimeZoneFromLocation(
                            property.latitude,
                            property.longitude,
                            property.countryCode
                            )
                    }
                    ),
            propertyFullWidthImagePath,
            propertyPreloadImagePath,
            confirmAndPayLink: request.headers.origin + confirmAndPayLink,
            device: deviceToken
        }
        );
    notificationCenterService.addNotification(
        {
            id: getRandomTuid(),
            notificationType: 'partner-ads',
            message: 'Your booking was confirmed by host, '
                + `((${ confirmAndPayLink })(click here)) to see.`
                + `¨fr:Votre réservation a été confirmée par l'hôte, `
                + `((${ confirmAndPayLink })(cliquez ici)) pour voir.`
                + `¨de:Ihre Buchung wurde vom Gastgeber bestätigt, `
                + `((${ confirmAndPayLink })(hier klicken)) um zu sehen.`,
            userId: guestProfile.userId,
            isRead: false
        }
        );

    return reply.send( { rentalBooking } );
}

// ~~

async function cancelRentalBooking(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let rentalBookingId = request.params.id;
    let rentalBooking = await rentalBookingService.getRentalBookingById( rentalBookingId );

    if ( !rentalBooking )
    {
        return reply.status( 404 ).send( { error: 'rental booking not found' } );
    }

    let property = await propertyService.getPropertyById( rentalBooking.propertyId );

    if ( request.profileLogged?.userId !== rentalBooking.userId && request.profileLogged?.userId !== property.userId )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let [ guestProfile, hostProfile, guestDevice, hostDevice ]
        = await Promise.all(
            [
                profileService.getProfileByUserId( rentalBooking.userId ),
                profileService.getProfileByUserId( property.userId ),
                deviceTokenService.getDeviceTokenByUserId( rentalBooking.userId ),
                deviceTokenService.getDeviceTokenByUserId( property.userId )
            ]
            );

    let refundRatio = 0;
    let paymentArray = await paymentService.getPaymentArrayByTransactionId( rentalBookingId );
    let paymentByTypeIdMap = getMap( paymentArray, 'typeId' );

    if ( request.profileLogged.userId === property.userId )
    {
        refundRatio = 1;
    }
    else if ( request.profileLogged.userId === rentalBooking.userId )
    {
        let cancellationPolicy = await cancellationPolicyService.getCancellationPolicyById( rentalBooking.cancellationPolicyId );

        if ( cancellationPolicy )
        {
            let partialRefundMinimumMilisecondCount = cancellationPolicy.partialRefundMinimumDayCount * 24 * 60 * 60 * 1000;
            let fullRefundMinimumMilisecondCount = cancellationPolicy.fullRefundMinimumDayCount * 24 * 60 * 60 * 1000;

            if ( new Date( rentalBooking.arrivalDate ).getTime() - Date.now() > fullRefundMinimumMilisecondCount
                 && fullRefundMinimumMilisecondCount !== 0 )
            {
                refundRatio = 1;
            }
            else if ( new Date( rentalBooking.arrivalDate ).getTime() - Date.now() > partialRefundMinimumMilisecondCount )
            {
                refundRatio = cancellationPolicy.partialRefundRatio / 100;
            }
        }
    }

    if ( refundRatio > 0 && !paymentByTypeIdMap[ 'refund' ] )
    {
        let transferArray = [];
        let payInArray = [];
        let conversionArray = [];
        let mangopayPaymentPromiseArray = [];

        for ( let payment of paymentArray )
        {
            if ( payment.statusId !== 'failed' )
            {
                if ( payment.typeId === 'transfer' )
                {
                    transferArray.push( payment );

                    mangopayPaymentPromiseArray.push(
                        mangopayService.getTransferById( payment.mangopayId )
                        );
                }
                else if ( payment.typeId === 'payin' )
                {
                    payInArray.push( payment );

                    mangopayPaymentPromiseArray.push(
                        mangopayService.getPayInById( payment.mangopayId )
                        );
                }
                else if ( payment.typeId === 'conversion' )
                {
                    conversionArray.push( payment );

                    mangopayPaymentPromiseArray.push(
                        mangopayService.getConversionById( payment.mangopayId )
                        );
                }
            }
        }

        let mangopayPaymentArray = await Promise.all( mangopayPaymentPromiseArray );
        let mangopayPaymentByIdMap = getMap( mangopayPaymentArray, 'Id' );

        for ( let payment of transferArray )
        {
            let transfer = mangopayPaymentByIdMap[ payment.mangopayId ];

            let refund = await mangopayService.addTransferRefund(
                payment.mangopayId,
                {
                    AuthorId: transfer.AuthorId,
                    DebitedFunds:
                        {
                            ...transfer.CreditedFunds,
                            Amount: transfer.CreditedFunds.Amount * refundRatio
                        },
                    Fees:
                        {
                            ...transfer.Fees,
                            Amount: transfer.Fees.Amount * -1
                        }
                }
                );

            if ( refund )
            {
                paymentService.addPayment(
                    {
                        ...payment,
                        id: getRandomTuid(),
                        amount: payment.amount * refundRatio,
                        typeId: 'refund',
                        mangopayId: refund.Id
                    }
                    );

                if ( payment.payeeUserProfileId !== null )
                {
                    let propertyName = getLocalizedText( property.title, {}, guestProfile.languageTag );
                    let amount = getFormattedPrice( payment.amount * refundRatio, 'en' );

                    notificationService.sendTemplateNotification(
                        'refund-processed',
                        {
                            profile: guestProfile,
                            guestName: guestProfile.firstName,
                            propertyName,
                            amount,
                        }
                        );
                    notificationCenterService.addNotification(
                        {
                            id: getRandomTuid(),
                            notificationType: 'appointment-reminder',
                            message:
                                `Your refund for the booking at **${ propertyName }** has been processed. `
                                + `The amount of **${ amount }** will be credited to your account shortly.`
                                + `¨fr:Votre remboursement pour la réservation à **${ propertyName }** a été effectué. `
                                + `Le montant de **${ amount }** sera crédité sur votre compte dans les plus brefs délais.`
                                + `¨de:Ihre Rückerstattung für die Buchung bei **${ propertyName }** wurde bearbeitet. `
                                + `Der Betrag von **${ amount }** wird Ihrem Konto in Kürze gutgeschrieben`,
                            userId: guestProfile.userId,
                            isRead: false
                        }
                        );
                }
            }
        }

        let reverseConversionRate = 1;

        for ( let payment of conversionArray )
        {
            let conversion = mangopayPaymentByIdMap[ payment.mangopayId ];

            let reverseConversion
                = await mangopayService.addInstantConversion(
                    {
                        AuthorId: conversion.AuthorId,
                        DebitedWalletId: conversion.CreditedWalletId,
                        CreditedWalletId: conversion.DebitedWalletId,
                        DebitedFunds:
                            {
                                ...conversion.CreditedFunds,
                                Amount: conversion.CreditedFunds.Amount * refundRatio
                            },
                        CreditedFunds: { Currency: conversion.DebitedFunds.Currency },
                        Fees:
                            {
                                Currency: conversion.CreditedFunds.Currency,
                                Amount: 0
                            }
                    }
                    );

            if ( reverseConversion )
            {
                reverseConversionRate
                    = Math.min( 1, reverseConversion.CreditedFunds.Amount / conversion.DebitedFunds.Amount ) ;

                paymentService.addPayment(
                    {
                        ...payment,
                        id: getRandomTuid(),
                        amount: reverseConversion.DebitedFunds.Amount / 100,
                        currencyCode: reverseConversion.DebitedFunds.Currency,
                        typeId: 'conversion',
                        mangopayId: reverseConversion.Id
                    }
                    );
            }
        }

        for ( payment of payInArray )
        {
            let payIn = mangopayPaymentByIdMap[ payment.mangopayId ];

            let refund = await mangopayService.addPayInRefund(
                payment.mangopayId,
                {
                    AuthorId: payIn.AuthorId,
                    DebitedFunds:
                        {
                            ...payIn.CreditedFunds,
                            Amount: payIn.CreditedFunds.Amount * refundRatio * reverseConversionRate
                        },
                    Fees:
                        {
                            ...payIn.Fees,
                            Amount: payIn.Fees.Amount * -1 * reverseConversionRate
                        }
                }
                );

            if ( refund )
            {
                paymentService.addPayment(
                    {
                        ...payment,
                        id: getRandomTuid(),
                        amount: payment.amount * refundRatio * reverseConversionRate,
                        typeId: 'refund',
                        mangopayId: refund.Id
                    }
                    );
            }
        }
    }

    rentalBooking = await rentalBookingService.setRentalBookingById( { status: 'cancelled' }, rentalBookingId );
    let propertyFullWidthImagePath = getStorageImagePath( property.imagePath, 1280 );
    let propertyPreloadImagePath = getStorageImagePath( property.imagePath, 360 );
    let propertyName = getLocalizedText( property.title, {}, guestProfile.languageTag );
    let checkInDate
        = new Date( rentalBooking.arrivalDate ).toLocaleDateString(
            'en',
            {
                timeZone: getTimeZoneFromLocation(
                    property.latitude,
                    property.longitude,
                    property.countryCode
                    )
            }
            );
    let checkOutDate
        = new Date( rentalBooking.departureDate ).toLocaleDateString(
            'en',
            {
                timeZone: getTimeZoneFromLocation(
                    property.latitude,
                    property.longitude,
                    property.countryCode
                    )
            }
            );

    notificationService.sendTemplateNotification(
        'reservation-cancellation-guest',
        {
            profile: guestProfile,
            propertyName,
            propertyFullWidthImagePath,
            propertyPreloadImagePath,
            device: guestDevice
        }
        );
    notificationCenterService.addNotification(
        {
            id: getRandomTuid(),
            notificationType: 'appointment-reminder',
            message: `Your reservation at **${ propertyName }** has been cancelled. `
                + `We hope to host you in the future.`
                + `¨fr:Votre réservation à **${ propertyName }** a été annulée. `
                + `Nous espérons pouvoir vous accueillir à l'avenir.`
                + `¨de:Ihre Reservierung bei **${ propertyName }** wurde storniert. `
                + `Wir hoffen, Sie in der Zukunft zu empfangen.`,
            userId: guestProfile.userId,
            isRead: false
        }
        );
    notificationService.sendTemplateNotification(
        'reservation-cancellation-host',
        {
            profile: hostProfile,
            propertyName,
            guestName: guestProfile.firstName,
            propertyFullWidthImagePath,
            propertyPreloadImagePath,
            checkInDate,
            checkOutDate,
            device: hostDevice
        }
        );
    notificationCenterService.addNotification(
        {
            id: getRandomTuid(),
            notificationType: 'appointment-reminder',
            message:
                `The reservation at **${ propertyName }** `
                + `from **${ guestProfile.firstName }** `
                + `for the dates ${ checkInDate } `
                + `to ${ checkOutDate } has been cancelled.`
                + `¨fr:La réservation à **${ propertyName }** `
                + `de **${ guestProfile.firstName }** `
                + `pour les dates ${ checkInDate } `
                + `à ${ checkOutDate } a été annulée.`
                + `¨de:Die Reservierung bei **${ propertyName }** `
                + `von **${ guestProfile.firstName }** `
                + `für die Daten ${ checkInDate } `
                + `bis ${ checkOutDate } wurde storniert.`,
            userId: hostProfile.userId,
            isRead: false
        }
        );

    return reply.status( 200 ).send( { rentalBooking } );
}

// ~~

async function removeAdminRentalBooking(
    request,
    reply
    )
{
    let { rentalBookingId } = request.params;

    if ( !rentalBookingId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthorized-error-message', 401 );
    }

    let hasRemoveRentalBookingPermission = await hasUserPermission( 'remove-rental-booking', profile.roleSlugArray );

    if ( !hasRemoveRentalBookingPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await rentalBookingService.removeBookingById( rentalBookingId );

    return reply.send( { message: 'rental-booking-deleted-message' } );
}

// ~~

async function setAdminRentalBooking(
    request,
    reply
    )
{
    let { rentalBookingId } = request.params;
    let body = getJsonObject( request.body );
    let { rentalBookingData } = body;

    if ( !rentalBookingId || !rentalBookingData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetRentalBookingPermission = await hasUserPermission( 'set-rental-booking', profile.roleSlugArray );

    if ( !hasSetRentalBookingPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let rentalBooking = await rentalBookingService.setRentalBookingById(
        {
            propertyId: rentalBookingData.propertyId,
            guestCount: rentalBookingData.guestCount,
            arrivalDate: rentalBookingData.arrivalDate,
            arrivalTime: rentalBookingData.arrivalTime,
            departureDate: rentalBookingData.departureDate,
            departureTime: rentalBookingData.departureTime,
            dayCount: rentalBookingData.dayCount,
            cleaningFee: rentalBookingData.cleaningFee,
            sheetsFee: rentalBookingData.sheetsFee,
            towelsFee: rentalBookingData.towelsFee,
            otherFee: rentalBookingData.otherFee,
            donation: rentalBookingData.donation,
            carbonCompensationDonation: rentalBookingData.carbonCompensationDonation,
            totalPrice: rentalBookingData.totalPrice,
            cancellationPolicyId: rentalBookingData.cancellationPolicyId,
            isNonRefundable: rentalBookingData.isNonRefundable,
            userId: rentalBookingData.userId
        },
        rentalBookingId
        );

    return reply.send( { message: 'rental-booking-updated-message', rentalBooking } );
}

// ~~

async function refundAdminRentalBooking(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRefundRentalBookingPermission = await hasUserPermission( 'remove-rental-booking', profile.roleSlugArray );

    if ( !hasRefundRentalBookingPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let { rentalBookingId } = request.params;
    let body = getJsonObject( request.body );
    let { ticketId } = body;

    if ( isNullOrUndefined( ticketId ) )
    {
        throw new AppError( 'bad-request' );
    }

    let rentalBooking = await rentalBookingService.getRentalBookingById( rentalBookingId );

    if ( isNullOrUndefined( rentalBooking ) )
    {
        throw new AppError( 'rental-booking-not-found-error-message', 404 );
    }

    let ticket = await ticketService.getTicketById( ticketId );

    if ( isNullOrUndefined( ticket ) )
    {
        throw new AppError( 'Administrator can only cancel bookings with associated tickets', 403 );
    }

    if ( ticket.statusId === 'cancelled' || ticket.statusId === 'resolved' )
    {
        throw new AppError( 'Cannot refund a cancelled or resolved ticket', 403 );
    }

    let property = await propertyService.getPropertyById( rentalBooking.propertyId );
    let [ guestProfile, guestDevice, hostProfile, hostDevice ]
        = await Promise.all(
            [
                profileService.getProfileByUserId( rentalBooking.userId ),
                deviceTokenService.getDeviceTokenByUserId( rentalBooking.userId ),
                profileService.getProfileByUserId( property.userId ),
                deviceTokenService.getDeviceTokenByUserId( property.userId )
            ]
            );
    let isGuestReporter = ticket.reporterUserId === rentalBooking.userId;
    let isHostReporter = ticket.reporterUserId === property.userId;

    if ( isGuestReporter )
    {
        let isNonRefundable = rentalBooking.isNonRefundable;

        if ( isNonRefundable )
        {
            throw new AppError( 'non-refundable-booking-error-message', 403 );
        }

        let paymentArray = await paymentService.getPaymentArrayByTransactionId( rentalBookingId );
        let paymentByTypeIdMap = getMap( paymentArray, 'typeId' );
        let cancellationPolicy = await cancellationPolicyService.getCancellationPolicyById( rentalBooking.cancellationPolicyId );

        if ( cancellationPolicy )
        {
            let partialRefundMinimumMilisecondCount = cancellationPolicy.partialRefundMinimumDayCount * 24 * 60 * 60 * 1000;
            let fullRefundMinimumMilisecondCount = cancellationPolicy.fullRefundMinimumDayCount * 24 * 60 * 60 * 1000;
            let refundRatio = 0;

            if ( new Date( rentalBooking.arrivalDate ).getTime() - Date.now() > fullRefundMinimumMilisecondCount
                 && fullRefundMinimumMilisecondCount !== 0 )
            {
                refundRatio = 1;
            }
            else if ( new Date( rentalBooking.arrivalDate ).getTime() - Date.now() > partialRefundMinimumMilisecondCount )
            {
                refundRatio = cancellationPolicy.partialRefundRatio / 100;
            }

            if ( refundRatio > 0 && !paymentByTypeIdMap[ 'refund' ] )
            {
                let transferArray = [];
                let payInArray = [];

                for ( let payment of paymentArray )
                {
                    if ( payment.typeId === 'transfer' )
                    {
                        transferArray.push( payment );
                    }
                    else if ( payment.typeId === 'payin' )
                    {
                        payInArray.push( payment );
                    }
                }

                for ( let payment of transferArray )
                {
                    let transfer = await mangopayService.getTransferById( payment.mangopayId )

                    let refund = await mangopayService.addTransferRefund(
                        payment.mangopayId,
                        {
                            AuthorId: transfer.AuthorId,
                            DebitedFunds: { ...transfer.CreditedFunds, Amount: transfer.CreditedFunds.Amount * refundRatio },
                            Fees: { ...transfer.Fees, Amount: transfer.Fees.Amount * -1 }
                        }
                        );

                    if ( refund )
                    {
                        paymentService.addPayment(
                            {
                                ...payment,
                                id: getRandomTuid(),
                                amount: payment.amount * refundRatio,
                                typeId: 'refund',
                                mangopayId: refund.Id
                            }
                            );

                        if ( payment.payeeUserProfileId !== null )
                        {
                            let propertyName = getLocalizedText( property.title, {}, guestProfile.languageTag );
                            let amount = getFormattedPrice( payment.amount * refundRatio, 'en' );

                            notificationService.sendTemplateNotification(
                                'refund-processed',
                                {
                                    profile: guestProfile,
                                    guestName: guestProfile.firstName,
                                    propertyName,
                                    amount,
                                }
                                );
                            notificationCenterService.addNotification(
                                {
                                    id: getRandomTuid(),
                                    notificationType: 'appointment-reminder',
                                    message:
                                        `Your refund for the booking at **${ propertyName }** has been processed. `
                                        + `The amount of **${ amount }** will be credited to your account shortly.`
                                        + `¨fr:Votre remboursement pour la réservation à **${ propertyName }** a été effectué. `
                                        + `Le montant de **${ amount }** sera crédité sur votre compte sous peu.`
                                        + `¨de:Ihre Erstattung für die Buchung bei **${ propertyName }** wurde bearbeitet. `
                                        + `Der Betrag von **${ amount }** wird Ihrem Konto in Kürze gutgeschrieben.`,
                                    userId: guestProfile.userId,
                                    isRead: false
                                }
                                );
                        }
                    }
                }

                for ( payment of payInArray )
                {
                    let payIn = await mangopayService.getPayInById( payment.mangopayId );

                    let refund = await mangopayService.addPayInRefund(
                        payment.mangopayId,
                        {
                            AuthorId: payIn.AuthorId,
                            DebitedFunds: { ...payIn.CreditedFunds, Amount: payIn.CreditedFunds.Amount * refundRatio },
                            Fees: { ...payIn.Fees, Amount: payIn.Fees.Amount * -1 }
                        }
                        );

                    if ( refund )
                    {
                        paymentService.addPayment(
                            {
                                ...payment,
                                id: getRandomTuid(),
                                amount: payment.amount * refundRatio,
                                typeId: 'refund',
                                mangopayId: refund.Id
                            }
                            );
                    }
                }
            }
        }
    }
    else if ( isHostReporter )
    {
        let paymentArray = await paymentService.getPaymentArrayByTransactionId( rentalBookingId );
        let guestProfile = await profileService.getProfileByUserId( rentalBooking.userId );
        let paymentByTypeIdMap = getMap( paymentArray, 'typeId' );

        if ( !paymentByTypeIdMap[ 'refund' ] )
        {
            for ( let payment of paymentArray )
            {
                let refund = null;

                if ( payment.typeId === 'transfer' )
                {
                    refund = await mangopayService.addTransferRefund(
                        payment.mangopayId,
                        {
                            AuthorId: guestProfile.mangopayUserId,
                            DebitedFunds: { Currency: 'EUR', Amount: payment.amount * 100 },
                            Fees: { Currency: 'EUR', Amount: 0 }
                        }
                        );

                    if ( refund )
                    {
                        paymentService.addPayment(
                            {
                                ...payment,
                                id: getRandomTuid(),
                                typeId: 'refund',
                                mangopayId: refund.Id
                            }
                            );

                        notificationService.sendTemplateNotification(
                            'refund-processed',
                            {
                                profile: guestProfile,
                                guestName: guestProfile.firstName,
                                propertyName: getLocalizedText( property.title, {}, guestProfile.languageTag ),
                                amount: getFormattedPrice( payment.amount, 'en' ),
                            }
                            );
                    }
                }
            }
        }
    }

    rentalBooking = await rentalBookingService.setRentalBookingById( { status: 'cancelled' }, rentalBookingId );
    let propertyFullWidthImagePath = getStorageImagePath( property.imagePath, 1280 );
    let propertyPreloadImagePath = getStorageImagePath( property.imagePath, 360 );
    let propertyName = getLocalizedText( property.title, {}, guestProfile.languageTag );
    let checkInDate =
        new Date( rentalBooking.arrivalDate )
            .toLocaleDateString(
                'en',
                {
                    timeZone: getTimeZoneFromLocation(
                        property.latitude,
                        property.longitude,
                        property.countryCode
                        )
                }
                );
    let checkOutDate =
        new Date( rentalBooking.departureDate )
            .toLocaleDateString(
                'en',
                {
                    timeZone: getTimeZoneFromLocation(
                        property.latitude,
                        property.longitude,
                        property.countryCode
                        )
                }
                );

    notificationService.sendTemplateNotification(
        'reservation-cancellation-guest',
        {
            profile: guestProfile,
            propertyName,
            propertyFullWidthImagePath,
            propertyPreloadImagePath,
            device: guestDevice
        }
        );
    notificationCenterService.addNotification(
        {
            id: getRandomTuid(),
            notificationType: 'appointment-reminder',
            message: `Your reservation at **${ propertyName }** has been cancelled. We hope to host you in the future.`
                + `¨fr:Votre réservation à **${ propertyName }** a été annulée. Nous espérons vous accueillir à l'avenir.`
                + `¨de:Ihre Reservierung bei **${ propertyName }** wurde storniert. Wir hoffen, Sie in der Zukunft zu empfangen.`,
            userId: guestProfile.userId,
            isRead: false
        }
        );
    notificationService.sendTemplateNotification(
        'reservation-cancellation-host',
        {
            profile: hostProfile,
            propertyName,
            guestName: guestProfile.firstName,
            propertyFullWidthImagePath,
            propertyPreloadImagePath,
            checkInDate,
            checkOutDate,
            device: hostDevice
        }
        );
    notificationCenterService.addNotification(
        {
            id: getRandomTuid(),
            notificationType: 'appointment-reminder',
            message:
                `The reservation at **${ propertyName }** `
                + `from **${ guestProfile.firstName }** `
                + `for the dates ${ checkInDate } `
                + `to ${ checkOutDate } has been cancelled.`
                + `¨fr:La réservation à **${ propertyName }** `
                + `de **${ guestProfile.firstName }** `
                + `pour les dates ${ checkInDate } `
                + `à ${ checkOutDate } a été annulée.`
                + `¨de:Die Reservierung bei **${ propertyName }** `
                + `von **${ guestProfile.firstName }** `
                + `für die Daten ${ checkInDate } `
                + `bis ${ checkOutDate } wurde storniert.`,
            userId: hostProfile.userId,
            isRead: false
        }
        );
    await ticketService.setTicketById( { statusId: 'resolved' }, ticketId );

    return reply.status( 200 ).send( { rentalBooking } );
}

// ~~

async function getAdminRentalBookingTickets(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRefundRentalBookingPermission = await hasUserPermission( 'list-ticket', profile.roleSlugArray );

    if ( !hasRefundRentalBookingPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let { rentalBookingId } = request.params;

    let ticketArray = await ticketService.getTicketArrayByTitleOrText( rentalBookingId );

    return reply.send( { ticketArray } );
}

export
{
    getAdminRentalBooking,
    getRentalBookingById,
    addRentalBooking,
    payRentalBooking,
    setRentalBooking,
    confirmRentalBooking,
    cancelRentalBooking,
    removeAdminRentalBooking,
    setAdminRentalBooking,
    refundAdminRentalBooking,
    getAdminRentalBookingTickets
}
