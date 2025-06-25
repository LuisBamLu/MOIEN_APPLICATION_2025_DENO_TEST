// -- IMPORTS

import { getUnaccentedText } from 'senselogic-gist';
import { cityService } from '../../service/city_service';

// -- FUNCTIONS

export async function getAllCities(
    request,
    reply
    )
{
    return (
        {
            cityArray : await cityService.getCachedCityArray()
        }
        );
}

// ~~

export async function getCityByName(
    request,
    reply
    )
{
    return (
        {
            cityArray : await cityService.getCityArrayBySearchName( request.body.searchTerm )
        }
        );
}

// ~~

export async function getCityArrayByCountryCode(
    request,
    reply
    )
{
    let countryCode = request.body

    if ( !Array.isArray( countryCode ) )
    {
        countryCode = [ countryCode ];
    }

    return (
        {
            cityArray : await cityService.getCityArrayByCountryCodeArray( countryCode )
        }
        );
}

// ~~

export async function getCityById(
    request,
    reply
    )
{
    return (
        {
            city : await cityService.getCityById( request.body.cityId )
        }
        );
}

// ~~

export async function getCityBySearchName(
    request,
    reply
    )
{
    let cityArray = [];
    let searchName = getUnaccentedText( request.body.searchName );
    searchName = searchName.replaceAll( '-', ' ' );

    if ( request.body.countryCode )
    {
        cityArray = await cityService.getCityArrayBySearchNameAndCountryCode( searchName, request.body.countryCode );

        if ( cityArray.length < 1 )
        {
            cityArray = await cityService.getCityArrayBySearchName( searchName );
        }
    }
    else
    {
        cityArray = await cityService.getCityArrayBySearchName( searchName );
    }

    return ( { cityArray: cityArray } );
}

// ~~

export async function getCityIdMapByIdArray(
    request,
    reply
    )
{
    return (
        {
            cityByIdMap : await cityService.getCityIdMapByIdArray( request.body.idArray )
        }
    )
}

// ~~

export async function getCityByCode(
    request,
    reply
    )
{
    let cityCode = request.body.cityCode;

    try
    {
        let city = await cityService.getCityByCode( cityCode );

        if ( city )
        {
            return reply.status( 200 ).send( { city: city } );
        }
        else
        {
            return reply.status( 404 ).send( { error: 'City not found' } );
        }
    }
    catch ( error )
    {
        console.error( error );

        return reply.status( 200 ).header( 'Content-Type', 'application/json' ).send( { city: city } );
    }
}
