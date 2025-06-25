// -- IMPORTS

import { getFormattedDateText, getLocalizedText, getSinus, isArray, pi } from 'senselogic-gist';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { updateUrlParameter } from '$lib/url';
import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
import haversine from 'haversine-distance';
import { categoryArrayStore } from '$store/categoryArrayStore';
import { get } from 'svelte/store';
import { fade, fly } from 'svelte/transition';
import { toast } from './toast';
import { SafeArea } from 'capacitor-plugin-safe-area';

// -- CONSTANTS

export const platform = Capacitor.getPlatform();
export const device = Device.getInfo();
export const hostUrl = getHostUrl( platform, 'http', false, 'release' );
export const webSocketUrl = getHostUrl( platform, 'ws', false, 'release' );
export const googleAuthUrl = 'https://rvmaltqvxnmtvljlghlx.supabase.co/auth/v1/authorize?provider=google';
export const getInsets = async () => ( await SafeArea.getSafeAreaInsets() ).insets;

const regexCardNumberToBrandMap =
    {
        'hipercard': /^(606282\d{10}(\d{3})?)|(3841\d{15})$/,
        'diners': /^3(0[0-5]|[68]\d)\d{11}$/,
        'amex': /^3[47]\d{13}$/,
        'mastercard': /^(5[1-5]\d{4}|677189)\d{10}$/,
        'visa': /^4\d{12}(\d{3})?$/,
        'discover': /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        'jcb': /^(?:2131|1800|35\d{3})\d{11}$/,
        'aura': /^(5078\d{2})(\d{2})(\d{11})$/,
        'maestro': /^(?:5[0678]\d\d|6304|6390|67\d\d)\d{8,15}$/,
    };

// -- VARIABLES

export let monthNameArray =
    [
        'January¨fr:Janvier',
        'February¨fr:Février',
        'March¨fr:Mars',
        'April¨fr:Avril',
        'May¨fr:May',
        'June¨fr:Juin',
        'July¨fr:Juillet',
        'August¨fr:Août',
        'September¨fr:Septembre',
        'October¨fr:Octobre',
        'November¨fr:Novembre',
        'December¨fr:Décembre'
    ];

export let weekdayNameArray =
    [
        'Monday¨fr:Lundi',
        'Tuesday¨fr:Mardi',
        'Wednesday¨fr:Mercredi',
        'Thursday¨fr:Jeudi',
        'Friday¨fr:Vendredi',
        'Saterday¨fr:Samedi',
        'Sunday¨fr:Dimanche'
    ];

export let capitalizedCardNameByCardBrandMap =
    {
        'hipercard': 'HiperCard',
        'diners': 'Diners Club',
        'amex': 'American Express',
        'mastercard': 'MasterCard',
        'visa': 'Visa',
        'discover': 'Discover',
        'jcb': 'JCB',
        'aura': 'Aura',
        'maestro': 'Maestro',
    };

// -- FUNCTIONS

/**
 * Generates a URL based on the platform, connection type, and environment.
 *
 * @param {string} platform - The platform for which the URL is being generated (e.g., 'web', 'android', 'ios').
 * @param {string} connectionType - The type of connection ('http' or 'ws').
 * @param {boolean} development - Whether the environment is in development mode.
 * @param {string} [subdomain] - The subdomain to use for WebSocket connections on the 'web' platform.
 * @returns {string} - The generated URL.
 *
 * @example
 * // For web platform in development with HTTP
 * generateUrl( 'web', 'http', true, '', 'dev' );
 * // Returns 'http://localhost:3000'
 *
 * @example
 * // For android platform with WebSocket
 * generateUrl( 'android', 'ws', false, 'www' );
 * // Returns 'ws://www.moien.com'
 */
function getHostUrl(
    platform,
    connectionType,
    development = false,
    subdomain = 'www'
    )
{
    let baseUrl = ( platform !== 'web' ? `s://${ subdomain }.moien.com` : '' );

    if ( development )
    {
        baseUrl = ( platform === 'android' ? '://10.0.2.2:8000' : '://localhost:8000' );
    }

    if ( platform === 'web' )
    {
        return (
            connectionType === 'http'
            ? `${ development ? 'http' : '' }${ baseUrl }`
            : `ws${ development ? baseUrl : `s://${ subdomain }.moien.com` }`
            );
    }
    else if ( platform === 'android' )
    {
        return (
            connectionType === 'http'
            ? `http${ baseUrl }`
            : `ws${ baseUrl }`
            );
    }
    else if ( platform === 'ios' )
    {
        return (
            connectionType === 'http'
            ? `http${ baseUrl }`
            : `ws${ baseUrl }`
            );
    }
}

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

export function getRatingText(
    rating
    )
{
    if ( rating )
    {
        return rating.toString().slice( 0, 3 );
    }
}

// ~~

export function getTruncatedValue(
    value
    )
{
    return Math.trunc( value );
}

// ~~

export function getShortenedName(
    name,
    maximumCharacterCount = undefined
    )
{
    if ( maximumCharacterCount === undefined )
    {
        return name;
    }
    else
    {
        return name.slice( 0, maximumCharacterCount );
    }
}

// ~~

export function getLocalizedNameArray(
    nameArray,
    maximumCharacterCount = undefined
    )
{
    return nameArray.map( name => getShortenedName( getLocalizedText( name ), maximumCharacterCount ) );
}

// ~~

export function getLocalizedMonthNameArray(
    maximumCharacterCount = undefined
    )
{
    return getLocalizedNameArray( monthNameArray, maximumCharacterCount );
}

// ~~

export function getLocalizedWeekdayNameArray(
    languageTag
    )
{
    let weekdayNameArray = [];
    let currentDate = new Date();
    let currentDateWeekIndex = ( currentDate.getDay() + 6 ) % 7;
    let currentWeekStartDate =
        new Date(
            new Date( currentDate )
                .setDate( currentDate.getDate() - currentDateWeekIndex )
            );

    for ( let weekDayIndex = 0; weekDayIndex < 7; ++weekDayIndex )
    {
        let weekDay = new Date();
        weekDay.setDate( currentWeekStartDate.getDate() + weekDayIndex );
        let weekDayName = weekDay.toLocaleString( languageTag, { weekday: 'short' } );

        weekdayNameArray.push( weekDayName );
    }

    return weekdayNameArray;
}

// ~~

export function getLocalizedMonthName(
    monthIndex,
    maximumCharacterCount = undefined
    )
{
    return getLocalizedText( monthNameArray[ monthIndex ] );
}

// ~~

export function getLocalizedWeekdayName(
    weekdayIndex,
    maximumCharacterCount = undefined
    )
{
    return getLocalizedText( weekdayNameArray[ weekdayIndex ] );
}

// ~~

export function getLocalizedYearMonthDayTextFromDate(
    date
    )
{
    return getFormattedDateText( date, undefined, 'UTC', 'numeric', '2-digit', '2-digit' );
}

// ~~

export function getLocalizedYearMonthDayTextFromDateText(
    dateText
    )
{
    return getLocalizedYearMonthDayTextFromDate( new Date( dateText ) );
}

// ~~

export function getLocalizedMonthDayYearTextFromDate(
    date
    )
{
    let day = date.getDate();
    let month = getLocalizedMonthName( date.getMonth(), 3 );
    let year = date.getFullYear();

    return `${ month } ${ day }, ${ year }`;
}

// ~~

export function getLocalizedMonthDayYearTextFromDateText(
    dateText
    )
{
    return getLocalizedMonthDayYearTextFromDate( new Date( dateText ) );
}

// ~~

export function getLocalizedMonthYearTextFromDate(
    date,
    languageTag
    )
{
    return date.toLocaleDateString( languageTag, { month: 'long', year: 'numeric' } );
}

// ~~

export function getDigitsCompleteDate(
    dateText
    )
{
    return getFormattedDateText( new Date( dateText ), undefined, 'UTC', 'numeric', '2-digit', '2-digit' );
}

// ~~

export function getLocalizedHourMinuteTextFromDate(
    date
    )
{
    date = new Date( date );
    let hours = date.getHours().toString().padStart( 2, '0' );
    let minutes = date.getMinutes().toString().padStart( 2, '0' );

    return `${ hours }:${ minutes }`;
}

// ~~

export function getLocalizedMonthYearTextFromDateText(
    dateText,
    languageTag = 'en'
    )
{
    return getLocalizedMonthYearTextFromDate( new Date( dateText ), languageTag );
}

// ~~

export function getLocalizedMonthDayTextFromDate(
    date
    )
{
    let day = date.getDate();
    let month = getLocalizedMonthName( date.getMonth(), 3 );

    return `${ month } ${ day }`;
}

// ~~

export function getLocalizedMonthDayTextFromDateText(
    dateText
    )
{
    return getFormattedDateText( new Date( dateText ), undefined, 'UTC', undefined, 'long', 'numeric' );
}

// ~~

export function getLocalizedShortMonthDayTextFromDateText(
    dateText
    )
{
    return getFormattedDateText( new Date( dateText ), undefined, 'UTC', undefined, 'short', 'numeric' );
}

// ~~

export function getLocalizedDayTextFromDate(
    date
    )
{
    let day = date.getDate();

    return `${ day }`;
}

// ~~

export function getLocalizedDayTextFromDateText(
    dateText
    )
{
    return getLocalizedDayTextFromDate( new Date( dateText ) );
}

// ~~

export function getLocalizedDateWeekdayMonthDay(
    dateText
    )
{
    return getFormattedDateText( new Date( dateText ), undefined, 'UTC', undefined, 'long', 'numeric', 'long' );
}

// ~~

export function getTimelessISOStringFromDate(
    date
    )
{
    return date.toISOString().split( 'T' )[ 0 ];
}

// ~~

export function getLocalizedWeekdayStringFromDateISOString(
    dateISOString,
    languageTag
    )
{
    return new Date( dateISOString ).toLocaleString( languageTag, { weekday: 'long', day: 'numeric', timeZone: 'UTC' } );
}

// ~~

export function getDayCountFromDateRangeArray(
    dateRangeArray
    )
{
    let [ startDate, endDate ] = dateRangeArray;
    let startDateTime = new Date( startDate ).getTime();
    let endDateTime = new Date( endDate ).getTime();

    let dayCount = Math.floor( ( endDateTime - startDateTime ) / ( 86400 * 1000 ) );

    return dayCount;
}

// ~~

export function clickOutside(
    node
    )
{
    function handleClickEvent(
        event
        )
    {
        let isNodeVisible = ( node.clientHeight + node.clientWidth ) > 1;

        if ( isNodeVisible && !node.contains( event.target ) && !event.defaultPrevented )
        {
            node.dispatchEvent( new CustomEvent( 'clickOutside', node ) );
        }
    }

    document.addEventListener( 'click', handleClickEvent, true );

    return (
        {
            destroy()
            {
                document.removeEventListener( 'click', handleClickEvent, true );
            }
        }
        );
}

// ~~

export function getValueByTypeId(
    typeId,
    featureByIdMap
    )
{
    for ( let key in featureByIdMap )
    {
        if ( featureByIdMap[ key ].typeId === typeId )
        {
            return  featureByIdMap[ key ].value;
        }
    }

    return null;
}

// ~~

export async function fetchData(
    endpoint,
    fetchOptionMap = { method: 'GET' }
    )
{
    let url = hostUrl + endpoint;

    try
    {
        let response = await fetch( url, fetchOptionMap );

        if ( !response.ok )
        {
            if ( response.status >= 400 && response.status < 500 )
            {
                let data = await response.json();

                if ( data?.message !== undefined && data.message !== '' )
                {
                    toast.error( data.message );
                }
            }

            throw new Error( 'Network response was not ok: ' + response.status );
        }

        return await response.json();
    }
    catch ( error )
    {
        console.error( 'There was a problem with your fetch operation:', error );

        throw error;
    }
}

// ~~

export function getCardBrandByCardNumber(
    cardNumber
    )
{
    let cardNumberWithouSpaces = cardNumber.trim().split( ' ' ).join( '' );

    for ( let brandName in regexCardNumberToBrandMap )
    {
        if ( regexCardNumberToBrandMap[ brandName ].test( cardNumberWithouSpaces ) )
        {
            return brandName;
        }
    }
}

// ~~

export function clearAllfilterParameterByKeyMap(
    )
{
    filterParameterByKeyMapStore.set(
        {
            propertyParameters: {},
            locationParameters: {},
            bookingParameters: {},
            featureParameters: {},
            propertyIdArray: null
        }
    );

    updateUrlParameter( filterParameterByKeyMapStore );
}

// ~~

export function encodeFileToBase64Url(
    file
    )
{
    return new Promise(
        ( resolve, reject ) =>
        {
            let reader = new FileReader();
            reader.onload = () => resolve( reader.result.toString() );
            reader.onerror = error => reject( error);
            reader.readAsDataURL( file );
        }
        );
}

// ~~

export function decodeBase64UrlToFile(
    base64Url,
    filename
    )
{
    return new Promise( ( resolve, reject ) =>
    {
        const base64EncodedData = base64Url.split( ';base64,' ).pop();

        const byteCharacters = atob( base64EncodedData );
        const byteNumbers = new Array( byteCharacters.length );

        for ( let i = 0; i < byteCharacters.length; i++ )
        {
            byteNumbers[ i ] = byteCharacters.charCodeAt( i );
        }

        const byteArray = new Uint8Array( byteNumbers );

        const fileBlob = new Blob( [ byteArray ], { type: 'application/octet-stream' } );

        const file = new File( [ fileBlob ], filename, { type: 'application/octet-stream' } );

        resolve( file );
    }
    );
}

// ~~

export function localizeDate(
    date,
    languageTag
    )
{
    switch( languageTag )
    {
        case 'fr':
            return date.toLocaleDateString( 'fr-FR' );

        case 'de':
            return date.toLocaleDateString( 'de-DE' );

        case 'en':
            return date.toLocaleDateString( 'en-US' );

        default:
            return date.toLocaleDateString( 'fr-FR' );
    }
}

// ~~

export function calculateCarbonEmission(
    departureCity,
    destinationCity,
    vehicleType,
    passangerCount
    )
{
    passangerCount = passangerCount || 1;

    let departure = { latitude: departureCity.latitude, longitude: departureCity.longitude };
    let destination = { latitude: destinationCity.latitude, longitude: destinationCity.longitude };
    let distance = haversine( departure, destination );

    if ( vehicleType.fourPassengers !== undefined && passangerCount > 2 )
    {
        return ( distance / 1000 ) * ( vehicleType.fourPassengers / 1000 ) * passangerCount;
    }

    return ( distance / 1000 ) * ( vehicleType.grams / 1000 ) * passangerCount;
}

// ~~

export function getCategoryName(
    categoryIdArray
    )
{
    let categories = get( categoryArrayStore );
    let category = categories.find( category => category.id === categoryIdArray[ 0 ] );

    return category ? category.name : '';
}

// ~~

export function toClassName(
    value
    )
{
    let result = '';

    if ( typeof value === 'string' || typeof value === 'number' )
    {
        result += value;
    }
    else if ( typeof value === 'object' )
    {
        if ( isArray( value ) )
        {
            result = value
                .map( toClassName )
                .filter( Boolean )
                .join( ' ' );
        }
        else
        {
            for ( let key in value )
            {
                if ( value[ key ] )
                {
                    result && ( result += ' ' );
                    result += key;
                }
            }
        }
    }

    return result;
}

// ~~

export function getClassName(
    ...argumentArray
    )
{
    return argumentArray
        .map( toClassName )
        .filter( Boolean )
        .join( ' ' );
}

// ~~

export function getPercentage(
    percentage
    )
{
    let { format } = new Intl.NumberFormat(
        'default',
        {
            style: 'percent',
            maximumFractionDigits: 1,
            minimumFractionDigits: 0
        }
        );

    return format( percentage );
}

// ~~

export function shake(
    node,
    { delay = 0, duration = 800, intensity = 10 } = {}
    )
{
    let effectStyleMap =
        {
            delay,
            duration,
            css:
                ( t ) =>
                {
                    let shakeProgress = getSinus( t * pi * 10 );
                    let offset = shakeProgress * intensity * ( 1 - t );

                    return `transform: translateX(${ offset }px)`;
                }
        };

    return effectStyleMap;
}

// ~~

export function flyFade(
    node,
    optionMap
    )
{
    let fadeTransition = fade( node, optionMap );
    let flyTransition = fly( node, optionMap );
    let effectStyleMap =
        {
            duration: optionMap.duration,
            delay: optionMap.delay,
            easing: optionMap.easing,
            css:
                ( t ) =>
                `
                    ${ fadeTransition.css( t ) };
                    ${ flyTransition.css( t ) };
                `
        };

    return effectStyleMap;
}

// ~~

export function getRgbString(
    hex,
    alpha
    )
{
    let r, g, b = 0;
    let hexCount = hex.length;

    if ( hexCount !== 7 )
    {
        console.error( 'Hex color must be 7 characters long' );

        return 'rgba(0, 0, 0, 1)';
    }
    r = parseInt( hex[ 1 ] + hex[ 2 ], 16 );
    g = parseInt( hex[ 3 ] + hex[ 4 ], 16 );
    b = parseInt( hex[ 5 ] + hex[ 6 ], 16 );

    return `rgba(${ r }, ${ g }, ${ b }, ${ alpha })`;
}
