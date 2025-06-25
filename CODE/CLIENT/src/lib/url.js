// -- IMPORTS

import { urlParamsStore } from '$store/urlParamsStore';
import { navigate } from 'svelte-routing';

// -- FUNCTIONS

export function updateUrlParameter(
    filterParameterByKeyMapStore
    )
{
    let queryString = '';

    if ( filterParameterByKeyMapStore.featureParameters
         && Object.keys( filterParameterByKeyMapStore.featureParameters ).length > 0 )
    {
        for ( const [ key, value ] of Object.entries( filterParameterByKeyMapStore.featureParameters ) )
        {
            if ( typeof value === 'boolean' )
            {
                if ( value )
                {
                    queryString += `feature-${ key }&`;
                }
            }
            else
            {
                queryString += `feature-${ key }=${ value }&`;
            }
        }
    }

    if ( filterParameterByKeyMapStore.bookingParameters
         && Object.keys( filterParameterByKeyMapStore.bookingParameters ).length > 0 )
    {
        for ( const [ key, value ] of Object.entries( filterParameterByKeyMapStore.bookingParameters ) )
        {
            if ( value !== null && value !== undefined && value !== '' )
            {
                queryString += `${ key }=${ value }&`;
            }
        }
    }

    if ( filterParameterByKeyMapStore.propertyParameters
         && Object.keys( filterParameterByKeyMapStore.propertyParameters ).length > 0 )
    {
        for ( const [ key, value ] of Object.entries( filterParameterByKeyMapStore.propertyParameters ) )
        {
            if ( value !== null && value !== undefined && value !== '' )
            {
                queryString += `${ key }=${ value }&`;
            }
        }
    }

    if ( filterParameterByKeyMapStore.locationParameters
         && Object.keys( filterParameterByKeyMapStore.locationParameters ).length > 0 )
    {
        for ( const [ key, value ] of Object.entries( filterParameterByKeyMapStore.locationParameters ) )
        {
            if ( value !== null && value !== undefined && value !== '' )
            {
                queryString += `${ key }=${ value }&`;
            }
        }
    }

    if ( queryString.endsWith( '&' ) )
    {
        queryString = queryString.slice( 0, -1 );
    }

    let newUrl = `${ window.location.pathname }?${ queryString }`;

    window.history.pushState( { path: newUrl }, '', newUrl );

    urlParamsStore.set( queryString );
}

// ~~

export function setUrlQueryParameter(
    query,
    key,
    value
    )
{
    if ( value )
    {
        query.set( key, value );
    }
    else
    {
        query.delete( key );
    }

    navigate( `?${ query.toString() }` );
}

// ~~

export function getURL(
    )
{
    let url =
        process?.env?.PUBLIC_SITE_URL
        ?? process?.env?.NEXT_PUBLIC_VERCEL_URL
        ?? 'http://localhost:5173';

    url = url.includes('http') ? url : `https://${ url }`;

    return url;
}
