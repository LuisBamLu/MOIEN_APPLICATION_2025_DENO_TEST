// -- IMPORTS

import { getJsonText, getLocalizedText, getLocalizedTextBySlug, getUnaccentedText, isArray, logError } from 'senselogic-gist';
import { Capacitor } from '@capacitor/core';
import { get } from 'svelte/store';
import { languageTagStore } from '$store/languageTagStore';
import { hasUserPermission } from '$store/profileStore';
import { toast } from '$lib/toast';

// -- CONSTANTS

export const platform = Capacitor.getPlatform();
export const hostUrl = ( platform === 'android' ? 'https://moien.com/' : 'http://localhost:8000' );
export const storageUrl = 'https://rvmaltqvxnmtvljlghlx.supabase.co/storage/v1/object/public';
export const msInSecond = 1_000;
export const msInMinute = msInSecond * 60;
export const msInHour = msInMinute * 60;
export const msInDay = msInHour * 24;
export const msInWeek = msInDay * 7;
export const msInMonth = msInDay * 30;

// -- VARIABLES

export let userRoleArray =
    [
        'guest',
        'host',
        'backoffice-senior',
        'backoffice',
        'author',
        'agency',
        'administrator'
    ];

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

export let inputTypeFromDataTypeMap =
    {
        number: 'number',
        string: 'text'
    }

// -- FUNCTIONS

export function getHostRoute(
    route
    )
{
    return hostUrl + route;
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
    maximumCharacterCount = undefined
    )
{
    return getLocalizedNameArray( weekdayNameArray, maximumCharacterCount );
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

export function clickOutside(
    node
    )
{
    function handleClickEvent(
        event
        )
    {
        if ( node && !node.contains( event.target ) && !event.defaultPrevented )
        {
            node.dispatchEvent(
                new CustomEvent( 'clickOutside', node )
                );
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

export async function fetchData(
    route,
    options = { method: 'GET' }
    )
{
    let url = getHostRoute( route );

    try
    {
        let response = await fetch( url, options );

        if ( !response.ok )
        {
            let error = await response.json();

            throw new Error( error?.message ?? response.status );
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
        return Math.pow( 2, attemptCount - maxAttempts ) * 56.25;
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

export function getUserRoleIndex(
    userRole
    )
{
    let userRoleIndex = userRoleArray.indexOf( userRole );

    return userRoleIndex;
}

// ~~

export function hasMinimumUserRole(
    userRoleSlugArray,
    minimunUserRole
    )
{
    let hasMinimumUserRole = false;
    let userRoleSlugCount = userRoleSlugArray.length;

    for ( let roleIndex = 0; roleIndex < userRoleSlugCount; roleIndex++ )
    {
        let userRoleSlug = userRoleSlugArray[ roleIndex ];
        let userRoleIndex = getUserRoleIndex( userRoleSlug );
        let minimunRoleIndex = getUserRoleIndex( minimunUserRole );

        if ( hasMinimumUserRole )
        {
            return true;
        }
        else
        {
            hasMinimumUserRole = userRoleIndex >= minimunRoleIndex;
        }
    }

    return hasMinimumUserRole;
}

// ~~

export function getPropertyValueOrDefaultValue(
    object,
    propertyName,
    defaultValue = ''
    )
{
    if ( object && propertyName in object )
    {
        return object[ propertyName ];
    }

    return defaultValue;
}

export function getNormalCaseFromSnakeCaseString(
    string = ''
    )
{
    let normalCaseString = '';

    for ( let index = 0; index < string.length; ++index )
    {
        let character = string[ index ];

        if ( index === 0 )
        {
            character = character.toUpperCase();
        }

        else if ( character === character.toUpperCase() )
        {
            character = ' ' + character;
        }

        normalCaseString += character;
    }

    return normalCaseString;
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

export function searchArrayByProperty(
    array,
    urlParams
    )
{
    if ( urlParams.get( 'searchTerm' ) && urlParams.get( 'searchColumn' ) )
    {
        let searchColumn = urlParams.get( 'searchColumn' );
        let searchTerm = urlParams.get( 'searchTerm' );

        return array.filter(
            item => ( item[ searchColumn ]?.toLowerCase() ?? '' ).includes( searchTerm.toLowerCase() )
        );
    }

    return array;
}

// ~~

export function updateFilterParameterMapFromUrlParams(
    urlParams,
    filterParameterByKeyMap
    )
{
    for ( let key of Object.keys( filterParameterByKeyMap ) )
    {
        filterParameterByKeyMap[ key ].value = '';
    }

    for ( let [ key, value ] of urlParams )
    {
        if ( filterParameterByKeyMap[ key ] )
        {
            filterParameterByKeyMap[ key ].value = value || '';
        }
    }

    return filterParameterByKeyMap;
}

// ~~

export function removeIdFromArray(
    array
    )
{
    let removedIdArray = [];
    let arrayCount = array.length;

    for ( let index = 0; index < arrayCount; index++ )
    {
        let item = array[ index ];

        for ( let key of Object.keys( item ) )
        {
            if ( !key.toLowerCase().includes( 'id' ) )
            {
                removedIdArray.push( item[ key ] );
            }
        }
    }

    return removedIdArray;
}

// ~~

export function orderArrayByFilterKeyMap(
    array,
    filterParameterByKeyMap
    )
{
    let arrayCount = array.length;
    let newArray = [];

    for ( let index = 0; index < arrayCount; index++ )
    {
        let item = array[ index ];
        let newItemMap = {};

        for ( let key of Object.keys( filterParameterByKeyMap ) )
        {
            newItemMap[ key ] = item[ key ];
        }

        newArray.push( newItemMap );
    }

    return newArray;
}

// ~~

export function getFilteredArray(
    array,
    urlParams,
    filterParameterByKeyMap,
    language
    )
{
    // array = searchArrayByProperty( array, urlParams );
    // filterParameterByKeyMap = updateFilterParameterMapFromUrlParams( urlParams, filterParameterByKeyMap );

    // array = array.filter(
    //     item => Object.keys( filterParameterByKeyMap ).every(
    //         key =>
    //         {
    //             if ( filterParameterByKeyMap[ key ].value )
    //             {
    //                 let translatedItem = getLocalizedText( ( item[ key ]?.toString().toLowerCase() ?? '' ), language );
    //                 return  translatedItem === filterParameterByKeyMap[ key ].value.toLowerCase();
    //             }

    //             return true;
    //         }
    //         )
    //     );

    // array = orderArrayByFilterKeyMap( array, filterParameterByKeyMap );

    return array;
}

// ~~

export function getFilterParameterByKeyMap(
    filterParameterByKeyMap,
    urlParams
    )
{
    for ( let key of Object.keys( filterParameterByKeyMap ) )
    {
        if ( urlParams.get( key ) )
        {
            filterParameterByKeyMap[ key ].value = urlParams.get( key );
        }
    }

    return filterParameterByKeyMap;
}

// ~~

export async function handleCreateObject(
    item,
    url,
    finallyFunction = () => {},
    toggleModalFunction = () => {},
    loadItemArray = () => {},
    permissionRequiredSlug = '',
    isSubmitting
    )
{
    isSubmitting.set( true );

    try
    {
        let itemToAdd = get( item );

        if ( !itemToAdd ) return;

        let hasRequiredPermission = hasUserPermission( permissionRequiredSlug );

        if ( !hasRequiredPermission )
        {
            toast.error( getLocalizedTextBySlug( 'no-permission-to-perform-action-label', get( languageTagStore ) ) );

            return;
        }

        let result
            = await fetchData(
                url,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: getJsonText( itemToAdd )
                }
                );

        await loadItemArray();
    }
    catch ( error )
    {
        logError( error );
    }
    finally
    {
        await finallyFunction();
        isSubmitting.set( false );
        toggleModalFunction();
    }
}

// ~~

export async function handleEditObject(
    item,
    url,
    finallyFunction  = () => {},
    toggleModalFunction = () => {},
    loadItemArray = () => {},
    permissionRequiredSlug = '',
    isSubmitting
    )
{
    isSubmitting.set( true );

    try
    {
        let itemToEdit = get( item );

        if ( !itemToEdit ) return;

        let hasRequiredPermission = hasUserPermission( permissionRequiredSlug );

        if ( !hasRequiredPermission )
        {
            toast.error( getLocalizedTextBySlug( 'no-permission-to-perform-action-label', get( languageTagStore ) ) );

            return;
        }

        let id = itemToEdit.id;

        await fetchData(
            url + id,
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( itemToEdit )
            }
            );

        await loadItemArray();
    }
    catch ( error )
    {
        logError( error );
    }
    finally
    {
        await finallyFunction();
        isSubmitting.set( false );
        toggleModalFunction();
    }
}

// ~~

export async function handleDeleteObject(
    item,
    url,
    finallyFunction = () => {},
    toggleModalFunction = () => {},
    loadItemArray = () => {},
    permissionRequiredSlug = '',
    isSubmitting,
    itemKeyToSend = 'id'
    )
{
    isSubmitting.set( true );

    try
    {
        let itemToDelete = get( item );

        if ( !itemToDelete ) return;

        let hasRequiredPermission = hasUserPermission( permissionRequiredSlug );

        if ( !hasRequiredPermission )
        {
            toast.error( getLocalizedTextBySlug( 'no-permission-to-perform-action-label', get( languageTagStore ) ) );

            return;
        }

        await fetchData(
            url + itemToDelete[ itemKeyToSend ],
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        await loadItemArray();
    }
    catch( error )
    {
        logError( error );
    }
    finally
    {
        await finallyFunction();
        isSubmitting.set( false );
        toggleModalFunction();
    }
}

// ~~

export function getOptionArray(
    array
    )
{
    let optionArray = array || [];

    return optionArray.map(
        ( option ) => ( { value: option.id, label: option.name } )
    );
}

// ~~

export function formatDate(
    date,
    optionMap =
    {
        dateStyle : 'short',
        timeStyle : 'short'
    }
    )
{
    let { format } = new Intl.DateTimeFormat(
        navigator.language,
        optionMap
        );

    if ( !( date instanceof Date ) )
    {
        date = new Date( date )
    }

    return isNaN( date )
         ? null
         : format( date );
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

// ~~

export function getFormattedPrice(
    amount,
    currency = 'EUR'
    )
{
    let amountNumber = Number( amount );

    if ( Number.isNaN( amountNumber ) )
    {
        amountNumber = 0;
    }

    let formattedAmount = new Intl.NumberFormat(
        get( languageTagStore ),
        {
            style : 'currency',
            currency
        }
        ).format( amount );

    return formattedAmount;
}

// ~~

export async function copyToClipboard(
    text
    )
{
    if ( !navigator.clipboard )
    {
        console.warn( 'Clipboard not supported' );

        return false;
    }

    try
    {
        await navigator.clipboard.writeText( text );

        return true;
    }
    catch ( error )
    {
        console.warn( 'Copy failed ', error );

        return false;
    }
}

// ~~

export function isObjectEmpty(
    object
    )
{
    for ( let key in object )
    {
        if ( object.hasOwnProperty( key ) && object[ key ].trim() !== '' )
        {
            return false;
        }
    }

    return true;
}

// ~~

export function getTextSlug(
    text
    )
{
    if ( isNullOrUndefined( text ) ) return '';

    let slug = getUnaccentedText( text.toLowerCase() )
        .trim()
        .replace( /\s+/g, '-' )
        .replace( /[^\w\-]+/g, '' )
        .replace( /^-+/, '' )
        .replace( /-+$/, '' );

    return slug;
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

// ~~

export function isValidColor(
    color
    )
{
    let htmlOptionElement = new Option();
    let htmlOptionElementStyle = htmlOptionElement.style;
    htmlOptionElementStyle.color = color;

    return htmlOptionElementStyle.color !== '';
}

// ~~

export function mergeStoreAndRemoveDuplicateById(
    store,
    responseArray
    )
{
    store.update(
        ( currentArray ) =>
        {
            let newArray = currentArray.concat( responseArray );

            return Array.from(
                new Map(
                    newArray.map( item => [ item.id, item ] ) ).values()
                );
        }
        );
}

// ~~

export function getCurrencySymbol(
    currencyCode = 'USD'
    )
{
    if ( isNullOrUndefined( currencyCode ) )
    {
        return null;
    }

    let formatter = new Intl.NumberFormat(
        'default',
        {
            style: 'currency',
            currency: currencyCode
        }
        );
    let format = formatter.formatToParts( 0 ).find( part => part.type === 'currency' );

    return format ? format.value : null;
}

// ~~

export function formatPercentage(
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

export function getFormattedBirthday(
    birthday
    )
{
    return birthday
        .replace( /\D/g, '' )
        .replace( /^(\d{2})(\d{2})$/g, '$1/$2' );
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
