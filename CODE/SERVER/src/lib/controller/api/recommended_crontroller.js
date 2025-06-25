// -- IMPORTS

import { profileService } from "../../service/profile_service";
import { propertyService } from "../../service/property_service";

// -- TYPES

/**
 * @typedef { Object } Type
 *
 * @property { string } id - Identifier for the type
 * @property { string } categoryId - Identifier for the category
 * @property { string } subcategoryId - Identifier for the subcategory
 * @property { string } valueTypeId - Identifier for the value type
 * @property { string } defaultValue - Default value
 * @property { string } minimumValue - Minimum value
 * @property { string } maximumValue - Maximum value
 */

/**
 * @typedef { Object } Feature
 *
 * @property { string } id - Identifier for the feature
 * @property { string } propertyId - Property identifier
 * @property { string } typeId - Feature type identifier
 * @property { any } value - Feature value
 * @property { boolean | null } isPromoted - Is feature promoted on Ad
 * @property { string[] | null } spaceIdArray - Array of space identifiers
 * @property { Type } type - Feature type
 */

/**
 * @typedef { Object } Property
 *
 * @property { number } latitude - Latitude of the property
 * @property { number } longitude - Longitude of the property
 * @property { string } streetName - Street name of the property
 * @property { string } buildingNumber - Building number of the property
 * @property { string } cityId - Identifier for the city
 * @property { string } cityName - Name of the city
 * @property { string } countryCode - Country code of the property
 *
 * @property { string } typeId - Identifier for the property type
 * @property { string } rentalTypeId - Identifier for the rental type
 * @property { string } heatingTypeId - Identifier for the heating type
 * @property { string } energyDiagnosisId - Identifier for the energy diagnosis
 *
 * @property { boolean } isAvailableForShortTerm - Whether the property is available for short-term rental
 * @property { boolean } isAvailableForLongTerm - Whether the property is available for long-term rental
 * @property { boolean | null } isAvailableForSublet - Whether the property is available for sublet
 *
 * @property { number } shortTermDailyPrice - Daily price for short-term rental
 * @property { number } longTermMonthlyPrice - Monthly price for long-term rental
 *
 * @property { boolean | null } hasShortTermExtendedStayDiscount - Whether there is a discount for extended stay
 * @property { number | null } shortTermExtendedStayDayCount - Number of days for extended stay discount
 * @property { number | null } shortTermExtendedStayDailyPrice - Daily price for extended stay
 * @property { boolean | null } hasShortTermProlongedStayDiscount - Whether there is a discount for prolonged stay
 * @property { number | null } shortTermProlongedStayDayCount - Number of days for prolonged stay discount
 * @property { number | null } shortTermProlongedStayDailyPrice - Daily price for prolonged stay
 *
 * @property { number } requiredLongTermMonthlyIncome - Required monthly income for long-term rental
 * @property { string[] } requiredLongTermDocumentTypeIdList - List of required document type IDs for long-term rental
 * @property { boolean } requiresCompleteRequestForVisits - Whether a complete request is required for visits
 * @property { boolean | null } managesLongTermDocuments - Whether long-term documents are managed
 *
 * @property { number } averageRating - Average rating of the property
 *
 * @property { Feature[] } featureArray - Array of features
 */

// -- FUNCTIONS

async function getFavoritePropertyArray(
    profileData
    )
{
    let { favoritePropertyId } = profileData;
        let favoriteCount =
            favoritePropertyId === undefined || favoritePropertyId === null
                ? 10
                : favoritePropertyId.length + 1;

    let { propertyArray, propertyError } =
            await propertyService.getPropertyArray(
                true,
                'online',
                {},
                {},
                {},
                {},
                favoritePropertyId ?? [],
                1,
                favoriteCount
            );

        if ( propertyError )
        {
            throw new Error( propertyError );
        }

        if ( propertyArray === null )
        {
            throw new Error( 'Property not found' );
        }

        if ( favoritePropertyId && favoritePropertyId.length > 0 )
        {
            propertyArray.sort(
                ( a, b ) =>
                {
                    return (
                        favoritePropertyId.indexOf( a.id )
                        - favoritePropertyId.indexOf( b.id )
                    );
                }
                )
        }

        return propertyArray;
}

// ~~

async function getClosePropertyArray(
    property,
    rangeDistanceByKilometer
    )
{
    let { latitude, longitude } = property;
    let { propertyArray, propertyError } =
        await propertyService.getPropertyArray(
            true,
            'online',
            {
                currentCoordinates: `${ latitude },${ longitude }`,
                rangeDistanceByKilometer: rangeDistanceByKilometer
            },
            {},
            {},
            {},
            [],
            1,
            100
        );

    if ( propertyError )
    {
        throw new Error( propertyError );
    }

    if ( propertyArray === null )
    {
        throw new Error( 'Property not found' );
    }

    return propertyArray;
}

// ~~

function calculateDistance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
    )
{
    const earthRadiusInKilometer = 6371;
    const latitudeDifference = ( latitude2 - latitude1 ) * Math.PI / 180;
    const longitudeDifference = ( longitude2 - longitude1 ) * Math.PI / 180;
    const a =
        0.5 - Math.cos( latitudeDifference ) / 2
        + Math.cos( latitude1 * Math.PI / 180 )
        * Math.cos( latitude2 * Math.PI / 180 )
        * ( 1 - Math.cos( longitudeDifference ) ) / 2;

    return earthRadiusInKilometer * 2 * Math.asin( Math.sqrt( a ) );
}

// ~~

function filterPropertyArrayByRangeDistance(
    rangeDistanceByKilometer,
    favoriteProperty,
    propertyArray
    )
{
    let similarPropertyArray = [];

    for ( let i = 0.1; i < rangeDistanceByKilometer; i += 0.1 )
    {
        let filteredPropertyArray = propertyArray.filter(
            property =>
            {
                let distance =
                    calculateDistance(
                        favoriteProperty.latitude,
                        favoriteProperty.longitude,
                        property.latitude,
                        property.longitude
                    );

                return distance <= i;
            }
            );

            similarPropertyArray =
                similarPropertyArray.concat( filteredPropertyArray );

            if ( similarPropertyArray.length >= 10 )
            {
                return similarPropertyArray;
            }
    }

    return similarPropertyArray;
}

// ~~

async function getSimilarPropertyArray(
    property
    )
{
    let similarProperties = [];
    let rangeDistances = [ 2, 5, 10 ];
    let rangeIndex = 0;

    try
    {
        while ( similarProperties.length < 10 && rangeIndex < rangeDistances.length )
        {
            let rangeDistanceByKilometer = rangeDistances[ rangeIndex ];
            let closePropertyArray =
                await getClosePropertyArray( property, rangeDistanceByKilometer );

            if ( closePropertyArray.length > 0 )
            {
                similarProperties =
                    filterPropertyArrayByRangeDistance(
                        rangeDistanceByKilometer,
                        property,
                        closePropertyArray
                        );
            }

            rangeIndex++;
        }
    }
    catch ( error )
    {
        console.error( error );
    }

    return similarProperties.slice( 0, 10 );
}

// ~~

/**
 *
 * @param { Property } similarProperty Similar property to score
 * @param { Property } favoriteProperty Favorite property to compare
 * @returns { number } The calculated attribute score
 */
function getPropertyAttributScore(
    similarProperty,
    favoriteProperty
    )
{
    let score = 0;

    if ( similarProperty.cityId
         === favoriteProperty.cityId )
    {
        score += 2;
    }

    if ( similarProperty.countryCode
         === favoriteProperty.countryCode )
    {
        score += 1;
    }

    if ( similarProperty.typeId
         === favoriteProperty.typeId )
    {
        score += 3;
    }

    if ( similarProperty.rentalTypeId
         === favoriteProperty.rentalTypeId )
    {
        score += 2;
    }

    if ( similarProperty.heatingTypeId
         === favoriteProperty.heatingTypeId )
    {
        score += 1;
    }

    if ( similarProperty.energyDiagnosisId
         === favoriteProperty.energyDiagnosisId )
    {
        score += 1;
    }

    if ( similarProperty.isAvailableForShortTerm
         === favoriteProperty.isAvailableForShortTerm )
    {
        score += 1;
    }

    if ( similarProperty.isAvailableForLongTerm
         === favoriteProperty.isAvailableForLongTerm )
    {
        score += 1;
    }

    let favoriteShortTermDailyPrice = favoriteProperty.shortTermDailyPrice;
    let similarShortTermDailyPrice = similarProperty.shortTermDailyPrice;

    if ( favoriteShortTermDailyPrice > 0 && similarShortTermDailyPrice > 0 )
    {
        let difference =
            Math.abs( favoriteShortTermDailyPrice - similarShortTermDailyPrice );
        let percentageDifference = difference / favoriteShortTermDailyPrice;
        if ( percentageDifference <= 0.1 )
        {
            score += 2;
        }
        else if ( percentageDifference <= 0.2 )
        {
            score += 1;
        }
    }

    let favoriteLongTermMonthlyPrice = favoriteProperty.longTermMonthlyPrice;
    let similarLongTermMonthlyPrice = similarProperty.longTermMonthlyPrice;

    if ( favoriteLongTermMonthlyPrice > 0 && similarLongTermMonthlyPrice > 0 )
    {
        let difference =
            Math.abs( favoriteLongTermMonthlyPrice - similarLongTermMonthlyPrice );
        let percentageDifference = difference / favoriteLongTermMonthlyPrice;
        if ( percentageDifference <= 0.1 )
        {
            score += 2;
        }
        else if ( percentageDifference <= 0.2 )
        {
            score += 1;
        }
    }

    let favoriteRating = favoriteProperty.averageRating;
    let similarRating = similarProperty.averageRating;

    if ( similarRating >= favoriteRating )
    {
        score += 2;
    }
    else if ( similarRating >= ( favoriteRating - 0.3 ) )
    {
        score += 1;
    }

    return score;
}

// ~~

/**
 *
 * @param { Feature } feature Feature of similar property to be matched
 * @param { Feature } favoriteFeature Feature of favorite property to be matched
 */
function getMatchValueByFeature(
    feature,
    favoriteFeature
    )
{
    let value = feature.value;
    let favoriteValue = favoriteFeature.value;
    let comparisonValue = value === favoriteValue;
    let typeId = feature.type.valueTypeId;

    if ( typeId === 'boolean'
         || typeId === 'cancellation-policy'
         || typeId === 'taxation'
         || typeId === 'booking-option' )
    {
        return comparisonValue ? 1 : 0;
    }
    else if ( typeId === 'integer' || typeId === 'real' )
    {
        if ( comparisonValue )
        {
            return 3;
        }
        if ( value > favoriteValue )
        {
            return (
                value / 2 >= favoriteValue
                ? 1
                : 2
                );
        }
        if ( value < favoriteValue )
        {
            return (
                ( favoriteValue - 1 ) > value
                ? 0
                : 1
                );
        }
    }
    else if ( typeId === 'text'
              || typeId === 'date'
              || typeId === 'currency-code'
              || typeId === 'time-range' )
    {
        return null;
    }
    else
    {
        throw new Error( `Invalid type id: ${ typeId }` );
    }
}

// ~~

/**
 *
 * @param { Property[] } similarPropertyArray Property array
 * @param { Property } favoriteProperty Favorite property to be compared
 * @returns { Array<Property> } Top ranked property array
 */
function getTopRankedPropertyArray(
    similarPropertyArray,
    favoriteProperty
    )
{
    let favoriteFeatureMap = new Map(
        favoriteProperty.featureArray.map(
            feature => [ feature.type.id, feature ]
            )
        );

    let scoredPropertyArray =
        similarPropertyArray.map(
            property =>
            {
                let [ totalScores, featureScores ] =
                    property.featureArray.reduce(
                        ( [ score, details ], feature ) =>
                        {
                            let favoriteFeature =
                                favoriteFeatureMap.get( feature.type.id );

                            if ( favoriteFeature === undefined
                                 || favoriteFeature === null )
                            {
                                return [ score, details ];
                            }

                            let featureScore =
                                getMatchValueByFeature( feature, favoriteFeature );

                            if ( feature.isPromoted === true
                                && favoriteFeature.isPromoted === feature.isPromoted
                                && featureScore > 1 )
                            {
                                featureScore += 1;
                            }

                            return [
                                score + featureScore,
                                [
                                    ...details,
                                    {
                                        feature,
                                        featureScore
                                    }
                                ]
                                ];
                        },
                        [ 0, [] ]
                        );

                let attributeScore = getPropertyAttributScore( property, favoriteProperty );
                totalScores += attributeScore;

                return { ...property, totalScores, featureScores };
            }
            );

    return (
        scoredPropertyArray.sort(
            ( a, b ) =>
            {
                return b.totalScores - a.totalScores;
            }
            ).slice( 0, 10 )
        );
}

// ~~

export async function getRecommendProperties(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let { userId, limit } = request.body;

    limit = limit ?? 10;

    if ( userId === undefined || userId === null )
    {
        return reply.code( 400 ).send( 'Invalid user id' );
    }

    try
    {
        let { profileData, profileError } =
            await profileService.getProfileByUserId( userId );

        if ( profileError )
        {
            return reply.code( 500 ).send( profileError );
        }

        if ( profileData === null )
        {
            return reply.code( 404 ).send( 'Profile not found' );
        }

        let recommendProperties = [];
        let favoritePropertyArray =
            await getFavoritePropertyArray( profileData );

        for ( let favoriteProperty of favoritePropertyArray )
        {
            let similarPropertyArray =
                await getSimilarPropertyArray( favoriteProperty );
            let topRankedPropertyArray =
                getTopRankedPropertyArray( similarPropertyArray, favoriteProperty );
            recommendProperties =
                recommendProperties.concat( topRankedPropertyArray );
        }

        recommendProperties.sort( ( a, b ) => b.matchValue - a.matchValue );

        return reply.code( 200 ).send( recommendProperties.slice( 0, limit ) );
    }
    catch ( error )
    {
        console.error( error );
        return reply.code( 500 ).send( error.message );
    }
}
