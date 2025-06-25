// -- IMPORTS

import { propertyService } from '../../../service/property_service';
import { rentalTypeService } from '../../../service/rental_type_service';
import { heatingTypeService } from '../../../service/heating_type_service';
import { energyDiagnosisService } from '../../../service/energy_diagnosis_service';
import { propertyStatusService } from '../../../service/property_status_service';
import { propertyTypeService } from '../../../service/property_type_service';
import { profileService } from '../../../service/profile_service';
import { featureTypeService } from '../../../service/feature_type_service';
import { featureService } from '../../../service/feature_service';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { AppError } from '../../../utils/app_error';
import { getJsonObject } from 'senselogic-gist';
import { rentalBookingService } from '../../../service/rental_booking_service';
import { currencyConversionService } from '../../../service/currency_conversion_service';

// -- FUNCTIONS

async function getPropertyArray(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    if ( !request.body )
    {
        let propertyArray = await propertyService.getCachedPropertyArray();
        propertyArray = propertyArray.propertyArray;

        let [ userIdArray, managerUserIdArray ] =
            [ 'userId', 'managerUserId' ].map( key => getUniqueValues( propertyArray, key ) );

        let
        [
            profileArray,
            managerProfileArray,
            propertyTypeArray,
            rentalTypeArray,
            propertyStatusArray,
            heatingTypeArray,
            diagnosisArray
        ] = await Promise.all(
            [
                profileService.getProfileArrayByUserIdArray( userIdArray ),
                profileService.getProfileArrayByUserIdArray( managerUserIdArray ),
                propertyTypeService.getCachedPropertyTypeArray(),
                rentalTypeService.getCachedRentalTypeArray(),
                propertyStatusService.getCachedPropertyStatusArray(),
                heatingTypeService.getCachedHeatingTypeArray(),
                energyDiagnosisService.getCachedEnergyDiagnosisArray()
            ]
            );

        return reply.send(
            {
                propertyArray,
                propertyTypeArray,
                rentalTypeArray,
                propertyStatusArray,
                heatingTypeArray,
                diagnosisArray,
                managerProfileArray,
                profileArray
            }
            );
    }
    else
    {
        let response =
            {
                propertyArray: [],
                isCityProperty: true,
                hasMorePropertyPages: false
            };

        let { propertyParameters, locationParameters, bookingParameters, featureParameters, propertyIdArray, propertyPage, propertyLimit }
            = getJsonObject( request.body );
        let { propertyArray, countPropertyArray }
            = await propertyService.getPropertyArray(
                true,
                'online',
                propertyParameters,
                locationParameters,
                bookingParameters,
                featureParameters,
                propertyIdArray ?? [],
                propertyPage,
                propertyLimit
                );

        if ( propertyArray && propertyArray.length <= 0 )
        {
            delete propertyParameters.cityId;
            response.isCityProperty = false;

            (
                { propertyArray, countPropertyArray }
                    = await propertyService.getPropertyArray(
                        true,
                        'online',
                        propertyParameters,
                        locationParameters,
                        bookingParameters,
                        featureParameters,
                        propertyIdArray ?? [],
                        propertyPage,
                        propertyLimit
                        )

            );
        }

        response.propertyArray = propertyArray;
        let totalPages = Math.ceil( countPropertyArray / propertyLimit );
        response.hasMorePropertyPages = propertyPage < totalPages;

        let [ userIdArray, managerUserIdArray, currencyCodeArray ] =
            [ 'userId', 'managerUserId', 'currencyCode' ].map( key => getUniqueValues( propertyArray, key ) );

        let [
            profileArray,
            managerProfileArray,
            propertyTypeArray,
            rentalTypeArray,
            propertyStatusArray,
            heatingTypeArray,
            diagnosisArray
            ]
            = await Promise.all(
                [
                    profileService.getProfileArrayByUserIdArray( userIdArray ),
                    profileService.getProfileArrayByUserIdArray( managerUserIdArray ),
                    propertyTypeService.getCachedPropertyTypeArray(),
                    rentalTypeService.getCachedRentalTypeArray(),
                    propertyStatusService.getCachedPropertyStatusArray(),
                    heatingTypeService.getCachedHeatingTypeArray(),
                    energyDiagnosisService.getCachedEnergyDiagnosisArray()
                ]
                );

        let conversionCodeArray = [];
        let promiseArray = [];

        for ( let currencyCode of currencyCodeArray )
        {
            let targetCurrencyCode = request.profileLogged?.currencyCode ?? 'EUR'

            let conversionCode =
                currencyCode
                + ', '
                + targetCurrencyCode;

            conversionCodeArray.push( conversionCode );

            promiseArray.push(
                currencyConversionService
                    .getCachedCurrencyConversionByConversionCode(
                        conversionCode
                        )
                );
        }

        let currencyConversionRateArray = await Promise.all( promiseArray );
        let currencyConversionByConversionCodeMap = {};

        for ( let currencyConversionIndex = 0;
              currencyConversionIndex < conversionCodeArray.length;
              ++currencyConversionIndex )
        {
            let conversionCode = conversionCodeArray[ currencyConversionIndex ];
            let currencyConversionRate = currencyConversionRateArray[ currencyConversionIndex ];

            currencyConversionByConversionCodeMap[ conversionCode ] = currencyConversionRate;
        }

        response.optionMap =
            {
                propertyTypeArray,
                rentalTypeArray,
                propertyStatusArray,
                heatingTypeArray,
                diagnosisArray,
                managerProfileArray,
                profileArray,
                currencyConversionByConversionCodeMap
            };

        return response;
    }
}

// ~~

async function getPropertyCountByUserId(
    request,
    reply
    )
{
    return (
        {
            count : await propertyService.getPropertyCountByUserId( request.body.userId )
        }
        );
}

// ~~

async function getPropertyById(
    request,
    reply
    )
{
    return (
        {
            property : await propertyService.getPropertyById( request.params.id, true )
        }
        );
}

// ~~

async function getFavoritePropertyArray(
    request,
    reply
    )
{
    let { propertyIdArray } = request.body;

    let { propertyArray }
        = await propertyService.getPropertyArray(
            true,
            'online',
            {},
            {},
            {},
            {},
            propertyIdArray ?? [],
            1,
            );

    return reply.status( 200 ).send( { propertyArray, isCityProperty: false } );
}

// ~~

async function setProperty(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let propertyId = request.params.id;
    let property = await propertyService.getPropertyById( propertyId );
    let body = getJsonObject( request.body );

    if ( !property )
    {
        return reply.status( 404 ).send();
    }

    if ( property.userId !== request.profileLogged?.userId )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    delete body.property.featureArray;
    delete body.property.featureByIdMap;

    await propertyService.setPropertyById( body.property, propertyId );

    return reply.status( 200 ).send( {} );
}

// ~~

async function adminGetProperty(
    request,
    reply
    )
{
    let { propertyId } = request.params;
    let property = await propertyService.getPropertyById( propertyId, false );

    if ( !property )
    {
        throw new AppError( 'property-not-found', 404 );
    }

    let propertyUserProfile = await profileService.getProfileByUserId( property.userId );
    let propertyManagerProfile = await profileService.getProfileByUserId( property.managerUserId );
    let featureTypeByIdMap = await featureTypeService.getCachedFeatureTypeByIdMap();
    let propertyTypeArray = await propertyTypeService.getCachedPropertyTypeArray();
    let energyDiagnosisArray = await energyDiagnosisService.getCachedEnergyDiagnosisArray();
    let propertyStatusArray = await propertyStatusService.getCachedPropertyStatusArray();
    let heatingTypeArray = await heatingTypeService.getCachedHeatingTypeArray();
    let rentalTypeArray = await rentalTypeService.getCachedRentalTypeArray();

    return reply.send(
        {
            property,
            propertyUserProfile,
            propertyManagerProfile,
            featureTypeByIdMap,
            propertyTypeArray,
            energyDiagnosisArray,
            propertyStatusArray,
            heatingTypeArray,
            rentalTypeArray
        }
        );
}

// ~~

async function adminUpdateProperty(
    request,
    reply
    )
{
    let { propertyId } = request.params;
    let body = getJsonObject( request.body );
    let propertyData = body;

    if ( !propertyId || !propertyData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetPropertyPermission = await hasUserPermission( 'set-property', profile.roleSlugArray );

    if ( !hasSetPropertyPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    // let featureArray = body.featureArray;

    // delete property.featureArray;
    // delete property.featureByIdMap;

    // for ( let feature of featureArray )
    // {
    //     delete feature.type;
    // }

    let property = await propertyService.setPropertyById(
        {
            apartmentNumber: propertyData.apartmentNumber,
            averageAccuracyRating: propertyData.averageAccuracyRating,
            averageCheckInRating: propertyData.averageCheckInRating,
            averageCleanlinessRating: propertyData.averageCleanlinessRating,
            averageCommunicationRating: propertyData.averageCommunicationRating,
            averageLocationRating: propertyData.averageLocationRating,
            averageRating: propertyData.averageRating,
            averageValueRating: propertyData.averageValueRating,
            buildingNumber: propertyData.buildingNumber,
            cityId: propertyData.cityId,
            cityName: propertyData.cityName,
            countryCode: propertyData.countryCode,
            countryName: propertyData.countryName,
            creationTimestamp: propertyData.creationTimestamp,
            date: propertyData.date,
            description: propertyData.description,
            energyDiagnosisId: propertyData.energyDiagnosisId,
            hasShortTermExtendedStayDiscount: propertyData.hasShortTermExtendedStayDiscount,
            hasShortTermProlongedStayDiscount: propertyData.hasShortTermProlongedStayDiscount,
            heatingTypeId: propertyData.heatingTypeId,
            isAvailableForLongTerm: propertyData.isAvailableForLongTerm,
            isAvailableForShortTerm: propertyData.isAvailableForShortTerm,
            isAvailableForSublet: propertyData.isAvailableForSublet,
            latitude: propertyData.latitude,
            longTermMonthlyPrice: propertyData.longTermMonthlyPrice,
            longitude: propertyData.longitude,
            managesLongTermDocuments: propertyData.managesLongTermDocuments,
            reference: propertyData.reference,
            rentalTypeId: propertyData.rentalTypeId,
            requiredLongTermDocumentTypeIdList: propertyData.requiredLongTermDocumentTypeIdList,
            requiredLongTermMonthlyIncome: propertyData.requiredLongTermMonthlyIncome,
            requiresCompleteRequestForVisits: propertyData.requiresCompleteRequestForVisits,
            shortTermDailyPrice: propertyData.shortTermDailyPrice,
            shortTermExtendedStayDailyPrice: propertyData.shortTermExtendedStayDailyPrice,
            shortTermExtendedStayDayCount: propertyData.shortTermExtendedStayDayCount,
            shortTermProlongedStayDailyPrice: propertyData.shortTermProlongedStayDailyPrice,
            shortTermProlongedStayDayCount: propertyData.shortTermProlongedStayDayCount,
            showsPreciseLocation: propertyData.showsPreciseLocation,
            statusId: propertyData.statusId,
            streetName: propertyData.streetName,
            title: propertyData.title,
            typeId: propertyData.typeId,
        },
        propertyId
        );
    // featureArray = await featureService.upsertFeatureArray( body.featureArray );

    return reply.send( { property, message: 'property-updated-message' } );
}

// ~~

async function adminRemoveProperty(
    request,
    reply
    )
{
    let { propertyId } = request.params;

    if ( !propertyId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemovePropertyPermission = await hasUserPermission( 'remove-property', profile.roleSlugArray );

    if ( !hasRemovePropertyPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await featureService.removeFeatureByPropertyId( propertyId );
    await rentalBookingService.removeBookingByPropertyId( propertyId );
    await propertyService.removePropertyById( propertyId );

    return reply.send( { message: 'property-deleted-message' } );
}

// ~~

async function adminGetPropertyArray(
    request,
    reply
    )
{
    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-message-error', 401 );
    }

    let hasListPropertyPermission = await hasUserPermission( 'list-property', profile.roleSlugArray );

    if ( !hasListPropertyPermission )
    {
        throw new AppError( 'unauthorized-message-error', 403 );
    }

    let body = getJsonObject( request.body );
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let { propertyPage, propertyLimit } = body;
    let page = Number( propertyPage ) || 1;
    let limit = Number( propertyLimit ) || 15;

    let { propertyArray, totalCount } = await propertyService.getAdminPropertyArray(
        page,
        limit,
        filterArray
        );

    let { hasMorePage } = getHasMorePage( totalCount, page, limit );

    let [ userIdArray, managerUserIdArray ] =
        [ 'userId', 'managerUserId' ].map( key => getUniqueValues( propertyArray, key ) );

    let [
            profileArray,
            managerProfileArray,
            propertyTypeArray,
            rentalTypeArray,
            propertyStatusArray,
            heatingTypeArray,
            diagnosisArray
        ]
        = await Promise.all(
            [
                profileService.getProfileArrayByUserIdArray( userIdArray ),
                profileService.getProfileArrayByUserIdArray( managerUserIdArray ),
                propertyTypeService.getCachedPropertyTypeArray(),
                rentalTypeService.getCachedRentalTypeArray(),
                propertyStatusService.getCachedPropertyStatusArray(),
                heatingTypeService.getCachedHeatingTypeArray(),
                energyDiagnosisService.getCachedEnergyDiagnosisArray()
            ]
            );

    return reply.send(
        {
            propertyArray,
            propertyTypeArray,
            rentalTypeArray,
            propertyStatusArray,
            heatingTypeArray,
            diagnosisArray,
            managerProfileArray,
            profileArray,
            hasMorePage
        }
        );
}

// ~~

async function getNearestPropertyArray(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { latitude, longitude, distanceInKilometersCount } = body;

    if ( isNullOrUndefined( latitude )
         || isNullOrUndefined( longitude ) )
    {
        return reply.send( [] );
    }

    let propertyArray = await propertyService.getNearestPropertyArray(
        latitude,
        longitude,
        distanceInKilometersCount
        );

    while ( propertyArray.length === 0 )
    {
        propertyArray = await propertyService.getNearestPropertyArray(
            latitude,
            longitude,
            distanceInKilometersCount
            );

        distanceInKilometersCount += 500;
    }

    return reply.send( propertyArray );
}

export
{
    getPropertyArray,
    getPropertyCountByUserId,
    getPropertyById,
    getFavoritePropertyArray,
    setProperty,
    adminGetProperty,
    adminUpdateProperty,
    adminRemoveProperty,
    adminGetPropertyArray,
    getNearestPropertyArray
}
