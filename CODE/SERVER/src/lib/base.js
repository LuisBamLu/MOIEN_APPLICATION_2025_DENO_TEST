// -- IMPORTS

import { Sitemap } from 'senselogic-link'
import { userRoleService } from './service/user_role_service';
import { userPermissionService } from './service/user_permission_service';
import { degreesToRadians, getArcTangent2, getCeilInteger, getCosinus, getDegreeAngle, getFloorInteger, getJsonText, getLocalizedText, getMaximumReal, getPositiveReal, getPower, getRadianAngle, getSinus, getSquareRoot, getUnaccentedText, getUniversalDate, isArray, logError } from 'senselogic-gist';
import { articleService } from './service/article_service';
import { languageService } from './service/language_service';
import { propertyService } from './service/property_service';

// -- CONSTANTS

const validOperatorArray =
    [
        'eq',
        'neq',
        'gt',
        'gte',
        'lt',
        'lte',
        'is',
        'in',
        'like',
        'ilike'
    ];
const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
const millisecondCountPerSecond = 1000;
const secondCountPerMinute = 60;
const minuteCountPerHour = 60;
const hourCountPerDay = 24;
const millisecondCountPerDay = millisecondCountPerSecond * secondCountPerMinute * minuteCountPerHour * hourCountPerDay;
const earthRadiusKilometerCount = 6371;

// -- FUNCTIONS

export function getLocationRangeBoundingBox(
    latitude,
    longitude,
    kilometerDistance
    )
{
    let kilometerEarthRadius = 6371;
    let maximumLatitude = latitude + getDegreeAngle( kilometerDistance / kilometerEarthRadius );
    let minimumLatitude = latitude - getDegreeAngle( kilometerDistance / kilometerEarthRadius );

    let maximumLongitude = longitude + getDegreeAngle( kilometerDistance / kilometerEarthRadius / getCosinus( getRadianAngle( latitude ) ) );
    let minimumLongitude = longitude - getDegreeAngle( kilometerDistance / kilometerEarthRadius / getCosinus( getRadianAngle( latitude ) ) );

    return { minimumLatitude, maximumLatitude, minimumLongitude, maximumLongitude };
}

// ~~

export async function generateSitemap(
    )
{
    let articleData = await articleService.getArticleArray( [], 1, 1000);
    let propertiesData = await propertyService.getPropertyArray();
    let languageArray = await languageService.getCachedLanguageArray();

    let articleArray = articleData.articleArray;
    let propertyArray = propertiesData.propertyArray;

    let sitemapMain = new Sitemap(
        {
            websiteUrl: 'https://www.moien.com',
            changeFrequency: 'weekly',
            crawlPriority: 0.8,
            rootFolderPath: 'sitemaps/main/'
        }
        );

    let sitemapBlog = new Sitemap(
        {
            websiteUrl: 'https://www.moien.com',
            changeFrequency: 'weekly',
            crawlPriority: 0.8,
            rootFolderPath: 'sitemaps/blog/'
        }
        );

    let sitemapProperty = new Sitemap(
        {
            websiteUrl: 'https://www.moien.com',
            changeFrequency: 'weekly',
            crawlPriority: 0.8,
            rootFolderPath: 'sitemaps/property/'
        }
        );

    for ( let languageData of languageArray )
    {
        sitemapMain.addRoute(
            `/${ languageData.code }/`,
            '',
            languageData.code
            );

        sitemapMain.addRoute(
            `/${ languageData.code }/privacy-policy`,
            '',
            languageData.code
            );

        sitemapMain.addRoute(
            `/${ languageData.code }/about`,
            '',
            languageData.code
            );

        sitemapMain.addRoute(
            `/${ languageData.code }/blog`,
            '',
            languageData.code
            );

        // sitemapMain.addRoute(
        //     `/${ languageData.code }/search`,
        //     '',
        //     languageData.code
        //     );

        sitemapMain.addRoute(
            `/${ languageData.code }/terms`,
            '',
            languageData.code
            );

        if ( isArray( articleArray ) && articleArray.length > 0 )
        {
            for ( let article of articleArray )
            {
                sitemapBlog.addRoute(
                    `/${ languageData.code }/blog/article/${ article.id }/${ article.slug }`,
                    `${ article.categoryIdArray[ 0 ] }/`,
                    languageData.code,
                    { crawlPriority: 0.8 },
                    );
            }
        }

        // if ( isArray( propertyArray ) && propertyArray.length > 0 )
        // {
        //     for ( let property of propertyArray )
        //     {
        //         let latitudeIndex = Math.floor( property.latitude / 2 ) * 2;
        //         let longitudeIndex = Math.floor( property.longitude / 2 ) * 2;

        //         sitemapProperty.addRoute(
        //             `/${ languageData.code }/property/${ property.id }`,
        //             `${ latitudeIndex }_${ longitudeIndex }/`,
        //             languageData.code,
        //             { crawlPriority: 0.8 },
        //             );
        //     }
        // }
    }

    await sitemapMain.writeSitemapFiles();
    await sitemapBlog.writeSitemapFiles();
    await sitemapProperty.writeSitemapFiles();
}

// ~~

export function isMangopayDocument( documentTypeId )
{
    switch ( documentTypeId )
    {
        case 'proof-of-residence':
        case 'passport':
        case 'id-card':
            return true;
        default:
            return false;
    }
}

// ~~

export function getMangopayDocumentTypeFromDocumentTypeId(
    documentTypeId
    )
{
    switch ( documentTypeId )
    {
        case 'proof-of-residence':
            return 'ADDRESS_PROOF';
        case 'passport':
        case 'id-card':
        default:
            return 'IDENTITY_PROOF';
    }
}

// ~~

export function getBackoffSecondCount(
    attemptCount,
    maxAttempts,
    doubleUntilMaxAttempts
    )
{
    if ( attemptCount < maxAttempts )
    {
        return 0;
    }
    else if ( attemptCount >= maxAttempts && attemptCount < maxAttempts + doubleUntilMaxAttempts )
    {
        return getPower( 2, attemptCount - maxAttempts ) * 56.25;
    }
    else
    {
        return 14400;
    }
}

// ~~

export function getCurrentTimestamp(
    )
{
    return Math.floor(
        new Date(
            new Date(
                )
                .toLocaleString(
                    'en-US',
                    {
                        timeZone : 'America/New_York'
                    }
                    )
            )
            .getTime() / 1000
        );
}

// ~~

export function getTimestampFromDateTime(
    dateTime
    )
{
    return Math.floor( new Date( dateTime ).getTime() / 1000 );
}

// ~~

export function getUniqueValues(
    array,
    key
    )
{
    return Array.from( new Set( array.map( item => item [ key ] ) ) ).filter( Boolean );
}

// ~~

export async function requireAdmin(
    request,
    reply,
    next
    )
{
    if ( !request.profileLogged || !request.profileLogged?.roleSlugArray.includes( 'administrator' )  )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }
    else
    {
        return await next( request, reply );
    }
}

// ~~

export function getFormattedPrice(
    price,
    languageTag,
    currency = 'EUR'
    )
{
    let formatter = new Intl.NumberFormat( languageTag, { style: 'currency', currency: currency } );

    return formatter.format( price );
}

// ~~

export async function hasUserRole(
    roleSlug,
    profileRoleSlugArray
    )
{
    return profileRoleSlugArray.includes( roleSlug );
}

// ~~

export async function hasAnyUserRole(
    roleSlugArray,
    profileRoleSlugArray
    )
{
    return roleSlugArray.some( ( roleSlug ) => profileRoleSlugArray.includes( roleSlug ) );
}

// ~~

export async function hasAllUserRoles(
    roleSlugArray,
    profileRoleSlugArray
    )
{
    let roleSlugCount = roleSlugArray.length;

    if ( roleSlugCount === 0 )
    {
        return false;
    }

    return roleSlugArray.every( ( roleSlug ) => profileRoleSlugArray.includes( roleSlug ) );
}

// ~~

export async function hasUserPermission(
    permissionSlug,
    profileRoleSlugArray
    )
{
    let permissionSlugArray =
        await userRoleService.getPermissionSlugArrayFromRoleSlugArray( profileRoleSlugArray );

    let permissionData =
        await userPermissionService.getUserPermissionBySlug( permissionSlug );

    return permissionSlugArray.includes( permissionData?.slug );
}

// ~~

export async function hasAnyUserPermission(
    permissionSlugArray,
    profileRoleSlugArray
    )
{
    let roleArray = await userRoleService
        .getPermissionSlugArrayFromRoleSlugArray( profileRoleSlugArray );

    let permissionData = await getUserPermissionSlugArray( roleArray );

    return permissionData.some( ( permission ) => permissionSlugArray.includes( permission.slug ) );
}

// ~~

export async function hasAllUserPermissions(
    permissionSlugArray,
    profileRoleSlugArray
    )
{
    let permissionArray = await userRoleService
        .getPermissionSlugArrayFromRoleSlugArray( profileRoleSlugArray );
    let permissionData = await userPermissionService
        .getUserPermissionSlugArray( permissionArray );

    return permissionSlugArray.every(
        ( requiredPermission ) =>
        permissionData.some( ( permission ) => permission.slug === requiredPermission )
        );
}

// ~~

export function applyComparisonQueryFilter(
    query,
    filterArray = [],
    validColumnArray = [],
    validOperatorArray = [ 'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'is', 'in', 'like', 'ilike' ]
    )
{
    for ( let filter of filterArray )
    {
        let { column, operator, value } = filter;

        if ( !validColumnArray.includes( column )
             || !validOperatorArray.includes( operator ) )
        {
            return;
        }

        query = query.filter( column, operator, value );
    }

    return query;
}

// ~~

export function applySearchQueryFilter(
    query,
    searchColumn,
    searchTerm,
    validColumnArray = []
    )
{
    if ( searchColumn
         && searchTerm
         && searchColumn.trim() !== ''
         && searchTerm.trim() !== ''
         && validColumnArray.includes( searchColumn ) )
    {
        query = query.or( `${ searchColumn }.ilike.%${ searchTerm }%` );
    }

    return query;
}

// ~~

export function applyFilterToQuery(
    query,
    filter,
    filterableColumnNameArray = []
    )
{
    try
    {
        if ( isArray( filter ) )
        {
            let filterArray = filter;

            for ( let filter of filterArray )
            {
                let [ column, operator, value ] = filter.split( ':' );

                if ( column.trim() !== ''
                     && operator.trim() !== ''
                     && value.trim() !== ''
                     && filterableColumnNameArray.includes( column ) )
                {
                    query = query.filter( column, operator, value );
                }
            }
        }
        else if ( typeof filter === 'string' )
        {
            let [ column, operator, value ] = filter.split( ':' );

            if ( column.trim() !== ''
                 && operator.trim() !== ''
                 && value.trim() !== ''
                 && filterableColumnNameArray.includes( column ) )
            {
                if ( validOperatorArray.includes( operator ) )
                {
                    if ( operator === 'ilike' || operator === 'like' )
                    {
                        value = `%${ value }%`;
                    }

                    if ( operator === 'in' )
                    {
                        value = value.split( ',' );
                        value = getJsonText( value );
                        value = value
                            .replace( /\[/g, '(' )
                            .replace( /\]/g, ')' );
                    }

                    query = query.filter( column, operator, value );
                }
            }
        }
    }
    catch ( error )
    {
        logError( error );
    }

    return query;
}

// ~~

export function getPaginationIndexMap(
    page = 1,
    limit = 15
    )
{
    let startIndex = ( page - 1 ) * limit;
    let endIndex = startIndex + limit - 1;

    return (
        {
            startIndex,
            endIndex
        }
        );
}

// ~~

export function getHasMorePage(
    count,
    page = 1,
    limit = 15
    )
{
    let pageCount = getCeilInteger( count / limit );
    let hasMorePage = page < pageCount;

    return (
        {
            pageCount,
            hasMorePage
        }
        );
}

// ~~

export function isValidUuid(
    uuid
    )
{
    return uuidPattern.test( uuid );
}

// ~~

export function isNullOrUndefined(
    value
    )
{
    return value === null || value === undefined;
}

// ~~

export function isDefinedAndNotNull(
    value
    )
{
    return value !== null && value !== undefined;
}

//  ~~

export function getTextSlug(
    text
    )
{
    if ( isNullOrUndefined( text ) ) return '';

    text = getLocalizedText( text );

    let slug = getUnaccentedText( text.toLowerCase() )
        .trim()
        .replace( /\s+/g, '-' )
        .replace( /[^\w\-]+/g, '' )
        .replace( /^-+/, '' )
        .replace( /-+$/, '' );

    return slug;
}

// ~~

export function getTimeDifferenceInMillisecond(
    firstDate,
    secondDate
    )
{
    firstDate = getUniversalDate( firstDate );
    secondDate = getUniversalDate( secondDate );
    let firstUTCDate = Date.UTC( firstDate.year, firstDate.month, firstDate.day );
    let secondUTCDate = Date.UTC( secondDate.year, secondDate.month, secondDate.day );

    return getPositiveReal( secondUTCDate - firstUTCDate );
}

// ~~

export function getTimeDifferenceInDay(
    firstDate,
    secondDate
    )
{
    let timeDifferenceInMillisecondCount = getTimeDifferenceInMillisecond( firstDate, secondDate );

    return getCeilInteger( timeDifferenceInMillisecondCount / ( millisecondCountPerDay ) );
}

// ~~

export function getHaversineDistance(
    startLatitudeValue,
    startLongitudeValue,
    endLatitudeValue,
    endLongitudeValue
    )
{
    let latitudeDifferenceRadianCount = getRadianAngle( endLatitudeValue - startLatitudeValue );
    let longitudeDifferenceRadianCount = getRadianAngle( endLongitudeValue - startLongitudeValue );

    let haversineFormulaComponentCount =
        getPower( getSinus(latitudeDifferenceRadianCount / 2 ), 2 )
        + getCosinus( startLatitudeValue * degreesToRadians ) * getCosinus( endLatitudeValue * degreesToRadians )
        * getPower( getSinus(longitudeDifferenceRadianCount / 2 ), 2 );

    let angularDistanceRadianValue = 2 * getArcTangent2(
        getSquareRoot( haversineFormulaComponentCount ),
        getSquareRoot( 1 - haversineFormulaComponentCount )
        );

    let distanceKilometerCount = earthRadiusKilometerCount * angularDistanceRadianValue;

    return distanceKilometerCount;
}

// ~~

export function getDegreeRange(
    latitude,
    radiusKilometerCount
    )
{
    const degreesPerKilometer = 1 / 111;
    let latitudeRange = radiusKilometerCount * degreesPerKilometer;
    let longitudeRange = radiusKilometerCount * degreesPerKilometer / getCosinus( latitude * degreesToRadians );

    return (
        {
            latitudeRange,
            longitudeRange
        }
        );
}
