// -- IMPORTS

import { getMapByCode, logError, getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class CityService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedCityArray = null;
        this.cachedCityByCodeMap = null;
        this.cachedCityByIdMap = null;
        this.cachedCityTimestamp = 0;
    }

    // -- INQUIRIES

    async getCityArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .select()
                .limit( 200 );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCityById(
        cityId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .select()
                .eq( 'id', cityId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getCityByCode(
        cityCode
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .select()
                .eq( 'code', cityCode );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getCityArrayByIdArray(
        idArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .select()
                .in( 'id', idArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCityIdMapByIdArray(
        idArray
        )
    {
        let cityByIdMap = getMapById( await this.getCityArrayByIdArray( idArray ) );

        return cityByIdMap
    }

    // ~~

    async getCityArrayBySearchName(
        searchName
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .select()
                .ilike( 'searchName', `%${ searchName }%` );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCityArrayBySearchNameAndCountryCode(
        searchName,
        countryCode
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .select()
                .eq( 'countryCode', countryCode )
                .ilike( 'searchName', `%${ searchName }%` );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCityArrayByCountryCodeArray(
        countryCodeArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .select()
                .in( 'countryCode', countryCodeArray )

        if ( error )
        {
            logError( error );
            return { cityArray: [], total: 0 }
        }

        let uniqueCityArrayByCityName = []
        let uniqueCities = new Set()

        for ( let city of data )
        {
            let cityName = city.name.replace(/\s*\d+$/, '')
            if ( !uniqueCities.has( cityName ) )
            {
                uniqueCities.add( cityName )
                uniqueCityArrayByCityName.push( city )
            }
        }

        return uniqueCityArrayByCityName
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedCityArray = null;
        this.cachedCityByCodeMap = null;
        this.cachedCityByIdMap = null;
    }

    // ~~

    async getCachedCityArray(
        )
    {
        if ( this.cachedCityArray === null
             || Date.now() > this.cachedCityTimestamp + 300000 )
        {
            this.cachedCityArray = await this.getCityArray();
            this.cachedCityTimestamp = Date.now();
            this.cachedCityByIdMap = null;
            this.cachedCityByCodeMap = null;
        }

        return this.cachedCityArray;
    }

    // ~~

    async getCachedCityArrayByIdArray(
        idArray
        )
    {
        if ( this.cachedFilteredCityArray === null )
        {
            this.cachedFilteredCityArray = await this.getCityArrayByIdArray( idArray );
        }

        return this.cachedFilteredCityArray;
    }

    // ~~

    async getCachedCityByCodeMap(
        )
    {
        if ( this.cachedCityByCodeMap === null )
        {
            this.cachedCityByCodeMap = getMapByCode( await this.getCachedCityArray() );
        }

        return this.cachedCityByCodeMap;
    }

    // ~~

    async getCachedCityByIdMap(
        )
    {
        if ( this.cachedCityByIdMap === null )
        {
            this.cachedCityByIdMap = getMapById( await this.getCachedCityArray() )
        }

        return this.cachedCityByIdMap;
    }

    // ~~

    async addCity(
        city
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .insert( city );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setCityByCode(
        city,
        cityCode
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .update( city )
                .eq( 'code', cityCode );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeCityByCode(
        cityCode
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CITY' )
                .delete()
                .eq( 'code', cityCode );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let cityService
    = new CityService();
