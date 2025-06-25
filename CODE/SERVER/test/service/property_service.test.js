// -- IMPORTS

import { getInteger, getMapById, getReal, logError } from 'senselogic-gist';
import { databaseService } from './database_service.test';
import { featureService } from '../service/feature_service';
import { profileService } from './profile_service.test';
import { applyFilterToQuery, getLocationRangeBoundingBox, getPaginationIndexMap, getHaversineDistance, getDegreeRange } from '../base';
import { supabaseService } from './supabase_service.test';
import { rentalBookingService } from './rental_booking_service.test';
import { rentalDayService } from './rental_day_service.test';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'date',
        'reference',
        'typeId',
        'rentalTypeId',
        'statusId',
        'heatingTypeId',
        'energyDiagnosisId',
        'title',
        'description',
        'streetName',
        'buildingNumber',
        'apartmentNumber',
        'cityName',
        'cityId',
        'countryCode',
        'countryName',
        'latitude',
        'longitude',
        'isAvailableForShortTerm',
        'isAvailableForLongTerm',
        'isAvailableForSublet',
        'shortTermForSublet',
        'shortTermDailyPrice',
        'hasShortTermExtendedStayDiscount',
        'shortTermExtendedStayDayCount',
        'shortTermExtendedStayDailyPrice',
        'hasShortTermProlongedStayDiscount',
        'shortTermProlongedStayDayCount',
        'shortTermProlongedStayDailyPrice',
        'longTermMonthlyPrice',
        'requiredLongTermMonthlyIncome',
        'requiredLongTermDocumentTypeIdList',
        'requiresCompleteRequestForVisits',
        'managesLongTermDocuments',
        'averageRating',
        'averageCleanlinessRating',
        'averageCommunnicationRating',
        'averageCheckInRating',
        'averageAccuracyRating',
        'averageLocationRating',
        'averageValueRating',
        'managerUserId',
        'userId',
        'showsPreciseLocation',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class PropertyService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPropertyArray = null;
        this.cachedPropertyByIdMap = null;
        this.cachedPropertyTimestamp = 0;
    }

    // -- INQUIRIES

    inflateProperty(
        property,
        propertyFeatureArray
        )
    {
        property.featureArray = propertyFeatureArray;
        property.featureByIdMap = getMapById( propertyFeatureArray );
    }

    // ~~

    async inflatePropertyArray(
        propertyArray
        )
    {
        for ( let property of propertyArray )
        {
            let propertyFeatureArray = await featureService.getFeatureArrayByPropertyId( property.id, true );

            property.featureArray = propertyFeatureArray;
            property.featureByIdMap = getMapById( propertyFeatureArray );
        }
    }

    // ~~

    async getAdminPropertyArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'PROPERTY' )
            .select( '*' );
        let countQuery = databaseService.getClient()
            .from( 'PROPERTY' )
            .select( 'id', { count : 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );
        query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] = await Promise.all( [ query, countQuery ] );

        if ( error !== null )
        {
            logError( error );

            return (
                {
                    propertyArray : [],
                    totalCount : 0
                }
                );
        }

        return (
            {
                propertyArray : data,
                totalCount : count
            }
            );
    }

    // ~~

    async getPropertyArray(
        isInflated = false,
        isStatusIdOnline = 'offline',
        propertyFieldValueByNameMap = {},
        locationParameterMap = {},
        bookingParameterMap = {},
        featureValueByTypeIdMap = {},
        propertyIdArray = [],
        propertyPage = 1,
        propertyLimit = 10,
        filterArray = []
        )
    {
        let query
            = databaseService.getClient()
                .from( 'PROPERTY' )
                .select(
                    'id, '
                    + 'latitude, '
                    + 'longitude, '
                    + 'imagePathArray, '
                    + 'imagePath, '
                    + 'averageRating, '
                    + 'title, '
                    + 'cityName, '
                    + 'countryName, '
                    + 'shortTermDailyPrice, '
                    + 'longTermMonthlyPrice, '
                    + 'currencyCode, '
                    + 'statusId'
                    );

        let countQuery
            = databaseService.getClient()
                .from( 'PROPERTY' )
                .select( 'id', { count: 'exact', head: true } )

        if ( propertyFieldValueByNameMap )
        {
            if ( Object.keys( propertyFieldValueByNameMap ).length > 0 )
            {
                for ( let [ propertyFieldName, propertyFieldValue ] of Object.entries( propertyFieldValueByNameMap ) )
                {
                    if ( propertyFieldName === 'profileId' )
                    {
                        if ( propertyFieldValue )
                        {
                            let profile = await profileService.getProfileById( propertyFieldValue );

                            if ( profile )
                            {
                                propertyFieldName = 'userId';
                                propertyFieldValue = profile.userId;
                            }
                        }
                    }

                    if ( propertyFieldValue !== undefined )
                    {
                        query = query.eq( propertyFieldName, propertyFieldValue );
                        countQuery = countQuery.eq( propertyFieldName, propertyFieldValue );
                    }
                }
            }
        }

        let locationBoundingBox = {};

        if ( locationParameterMap && locationParameterMap.currentCoordinates )
        {
            if ( locationParameterMap.rangeDistance )
            {
                let coordinates = locationParameterMap.currentCoordinates.split( ',' );
                let latitude = getReal( coordinates[ 0 ] );
                let longitude = getReal( coordinates[ 1 ] );

                let rangeDistance = locationParameterMap.rangeDistance;
                locationBoundingBox = getLocationRangeBoundingBox( latitude, longitude, rangeDistance );
            }
            else
            {
                locationBoundingBox.minimumLatitude = locationParameterMap.minimumLatitude;
                locationBoundingBox.maximumLatitude = locationParameterMap.maximumLatitude;
                locationBoundingBox.minimumLongitude = locationParameterMap.minimumLongitude;
                locationBoundingBox.maximumLongitude = locationParameterMap.maximumLongitude;
            }

            query = query
                .gte( 'latitude', getReal( locationBoundingBox.minimumLatitude ) )
                .lte( 'latitude', getReal( locationBoundingBox.maximumLatitude ) )
                .gte( 'longitude', getReal( locationBoundingBox.minimumLongitude ) )
                .lte( 'longitude', getReal( locationBoundingBox.maximumLongitude ) );

            countQuery = countQuery
                .gte( 'latitude', getReal( locationBoundingBox.minimumLatitude ) )
                .lte( 'latitude', getReal( locationBoundingBox.maximumLatitude ) )
                .gte( 'longitude', getReal( locationBoundingBox.minimumLongitude ) )
                .lte( 'longitude', getReal( locationBoundingBox.maximumLongitude ) );
        }

        if ( featureValueByTypeIdMap && Object.keys( featureValueByTypeIdMap ).length > 0 )
        {
            let featurePropertyIdArrays =
                await Promise.all(
                    Object.entries( featureValueByTypeIdMap ).map(
                        async ( [ featureTypeId, featureValue ] ) =>
                            await featureService.getFeatureArrayByTypeIdAndValue( featureTypeId, featureValue.toString() )
                        )
                    );

            if ( featurePropertyIdArrays.some( array => array.length === 0 ) )
            {
                return { propertyArray: [], countPropertyArray: 0 };
            }

            let commonPropertyIdArray =
                featurePropertyIdArrays.reduce(
                    ( commonIds, currentIds ) =>
                    {
                        return commonIds.filter( id => currentIds.includes( id ) );
                    }
                    );

            if ( commonPropertyIdArray.length > 0 )
            {
                query = query.in( 'id', commonPropertyIdArray );
                countQuery = countQuery.in( 'id', commonPropertyIdArray );
            }
            else
            {
                return { propertyArray: [], countPropertyArray: 0 };
            }
        }

        if ( bookingParameterMap )
        {
            if ( bookingParameterMap.arrivalDate !== undefined
                 && bookingParameterMap.departureDate !== undefined )
            {
                let [ rentalBookingArray, rentalDayArray ]
                    = await Promise.all(
                        [
                            rentalBookingService.getRentalBookingByDateRangeAndStatusArray(
                                [ bookingParameterMap.arrivalDate, bookingParameterMap.departureDate ],
                                [ 'confirmed', 'paid' ]
                                ),
                            rentalDayService.getUnavailableRentalDayArrayByDateRange(
                                [ bookingParameterMap.arrivalDate, bookingParameterMap.departureDate ]
                                )
                        ]
                        );

                let propertyIdSet = new Set();

                for ( let rentalBooking of rentalBookingArray )
                {
                    propertyIdSet.add( rentalBooking.propertyId );
                }

                for ( let rentalDay of rentalDayArray )
                {
                    propertyIdSet.add( rentalDay.propertyId );
                }

                query.not( 'id', 'in', '(' + Array.from( propertyIdSet ) + ')' );
                countQuery.not( 'id', 'in', '(' + Array.from( propertyIdSet ) + ')' );
            }

            if ( bookingParameterMap.minimumDailyBudget !== undefined )
            {
                query = query.gte( 'shortTermDailyPrice', bookingParameterMap.minimumDailyBudget );
                countQuery = countQuery.gte( 'shortTermDailyPrice', bookingParameterMap.minimumDailyBudget );
            }

            if ( bookingParameterMap.maximumDailyBudget !== undefined )
            {
                query = query.lte( 'shortTermDailyPrice', bookingParameterMap.maximumDailyBudget );
                countQuery = countQuery.lte( 'shortTermDailyPrice', bookingParameterMap.maximumDailyBudget );
            }

            if ( bookingParameterMap.minimumMonthlyBudget !== undefined)
            {
                query = query.gte( 'longTermMonthlyPrice', bookingParameterMap.minimumMonthlyBudget );
                countQuery = countQuery.gte( 'longTermMonthlyPrice', bookingParameterMap.minimumMonthlyBudget );
            }
            if ( bookingParameterMap.maximumMonthlyBudget !== undefined )
            {
                query = query.lte( 'longTermMonthlyPrice', bookingParameterMap.maximumMonthlyBudget );
                countQuery = countQuery.lte( 'longTermMonthlyPrice', bookingParameterMap.maximumMonthlyBudget );
            }
        }

        if ( propertyIdArray.length > 0 )
        {
            query = query.in( 'id', propertyIdArray );
            countQuery = countQuery.in( 'id', propertyIdArray );
        }

        let { count } = await countQuery;
        let countPropertyArray = count;

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let startIndex = ( propertyPage - 1 ) * propertyLimit;
        let endIndex = startIndex + propertyLimit - 1;
        query = query.range( startIndex, endIndex );

        let { data, error } = await query;
        let propertyArray = data;

        if ( error !== null )
        {
            logError( error );
        }

        if ( propertyArray && !isInflated )
        {
            await this.inflatePropertyArray(
                propertyArray
                );
        }

        return { propertyArray, countPropertyArray };
    }

    // ~~

    async getPropertyArrayByIdArray(
        idArray
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'PROPERTY' )
                .select()
                .in( 'id', idArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPropertyArrayByProfile(
        profile
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY' )
                .select()
                .eq( 'userId', profile.userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPropertyArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY' )
                .select()
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPropertyById(
        propertyId,
        isInflated = false
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY' )
                .select()
                .eq( 'id', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data.length > 0 )
        {
            if ( !isInflated )
            {
                this.inflateProperty(
                    data[ 0 ],
                    await featureService.getFeatureArrayByPropertyId( data[ 0 ].id, true )
                    );
            }
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getPropertyCountByUserId(
        userId
        )
    {
        let { count, error }
            = await databaseService.getClient()
                .from( 'PROPERTY' )
                .select( 'id', { count: 'exact', head: true } )
                .eq( 'userId', userId );

        if ( error )
        {
            logError( error );

            return 0;
        }
        else
        {
            return count || 0;
        }
    }

    // ~~

    async getNearestPropertyArray(
        latitude,
        longitude,
        distanceInKilometersCount = 10
        )
    {
        let
            {
                latitudeRange,
                longitudeRange
            } = getDegreeRange( latitude, distanceInKilometersCount );

        let { data, error } = await supabaseService.getClient()
            .from( 'PROPERTY' )
            .select(
                'id, '
                + 'latitude, '
                + 'longitude, '
                + 'imagePathArray, '
                + 'imagePath, '
                + 'averageRating, '
                + 'title, '
                + 'cityName, '
                + 'countryName, '
                + 'shortTermDailyPrice, '
                + 'longTermMonthlyPrice, '
                + 'currencyCode, '
                + 'statusId'
                )
            .gte( 'latitude', latitude - latitudeRange )
            .lte( 'latitude', latitude + latitudeRange )
            .gte( 'longitude', longitude - longitudeRange )
            .lte( 'longitude', longitude + longitudeRange );

        if ( error )
        {
            logError( error );

            return [];
        }

        let nearbyPropertyArray = [];

        for ( let property of data )
        {
            let distance = getHaversineDistance( latitude, longitude, property.latitude, property.longitude );

            if( distance <= distanceInKilometersCount )
            {
                nearbyPropertyArray.push(
                    {
                        ...property,
                        distance
                    }
                    );
            }
        }

        nearbyPropertyArray.sort(
            ( propertyA, propertyB ) => propertyA.distance - propertyB.distance
            );

        return nearbyPropertyArray;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedPropertyArray = null;
        this.cachedPropertyByIdMap = null;
    }

    // ~~

    async getCachedPropertyArray(
        isInflated = false,
        isStatusIdOnline = false,
        propertyFieldValueByNameMap,
        locationParameterMap,
        bookingParameterMap,
        featureValueByTypeIdMap
        )
    {
        if ( this.cachedPropertyArray === null
             || Date.now() > this.cachedPropertyTimestamp + 300000 )
        {
            this.cachedPropertyArray
                = await this.getPropertyArray(
                    isInflated,
                    isStatusIdOnline,
                    propertyFieldValueByNameMap,
                    locationParameterMap,
                    bookingParameterMap,
                    featureValueByTypeIdMap
                    );
            this.cachedPropertyTimestamp = Date.now();
            this.cachedPropertyByIdMap = null;
        }

        return this.cachedPropertyArray;
    }

    // ~~

    async getCachedPropertyByIdMap(
        )
    {
        if ( this.cachedPropertyByIdMap === null )
        {
            this.cachedPropertyByIdMap = getMapById( await this.getCachedPropertyArray() );
        }

        return this.cachedPropertyByIdMap;
    }

    // ~~

    async addProperty(
        property
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY' )
                .insert( property );

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async setPropertyById(
        property,
        propertyId
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'PROPERTY' )
                .update( property )
                .eq( 'id', propertyId )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async upsertPropertyArray(
        propertyArray
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY' )
                .upsert( propertyArray )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removePropertyById(
        propertyId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY' )
                .delete()
                .eq( 'id', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let propertyService
    = new PropertyService();
