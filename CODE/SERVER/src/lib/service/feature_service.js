// -- IMPORTS

import { getJsonObject, getMapById, getMaximumReal, getNumber, getReal, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { featureTypeService } from '../service/feature_type_service';
import { isNullOrUndefined } from '../base';

// -- TYPES

class FeatureService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedFeatureArray = null;
        this.cachedFeatureByIdMap = null;
        this.cachedFeatureTimestamp = 0
    }

    // -- INQUIRIES

    inflateFeatureArray(
        featureArray,
        featureTypeByIdMap
        )
    {
        for ( let feature of featureArray )
        {
            feature.type = featureTypeByIdMap[ feature.typeId ];
        }
    }

    // ~~

    async getFeatureArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getFeatureById(
        featureId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .select()
                .eq( 'id', featureId );

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

    async getFeatureIdByPropertyIdAndTypeId(
        propertyId,
        typeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .select( 'id' )
                .eq( 'propertyId', propertyId )
                .eq( 'typeId', typeId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null && data.length > 1 )
        {
            return data[ 0 ].id;
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getFeatureByPropertyIdAndTypeId(
        propertyId,
        typeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .select()
                .eq( 'propertyId', propertyId )
                .eq( 'typeId', typeId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null && data.length > 0 )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getFeatureArrayByPropertyId(
        propertyId,
        isInflated = false
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            if ( isInflated )
            {
                this.inflateFeatureArray(
                    data,
                    await featureTypeService.getCachedFeatureTypeByIdMap()
                    );
            }
        }

        return data;
    }

    // ~~

    async getFeatureArrayByPropertyIdAndSubcategoryId(
        propertyId,
        subcategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .select(
                    `
                    *,
                    FEATURE_TYPE!inner ( subcategoryId )
                    `
                    )
                .eq( 'propertyId', propertyId )
                .eq( 'FEATURE_TYPE.subcategoryId', subcategoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getFeatureArrayByPropertyIdArray(
        propertyIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .select()
                .in( 'propertyId', propertyIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getFeatureArrayByTypeIdAndValue(
        typeId,
        value
        )
    {
        let query
            = databaseService.getClient()
                .from( 'FEATURE' )
                .select( 'propertyId' )
                .eq( 'typeId', typeId );

        if ( !isNaN( value ) && !isNaN( parseFloat( value ) ) )
        {
            query = query.gte( 'value', value );
        }
        else if ( value.includes( ',' ) && !isNaN( value.split( ',' )[ 0 ] ) )
        {
            query
                = query
                    .lte( 'value', value.split( ',' )[ 1 ] )
                    .gte( 'value', value.split( ',' )[ 0 ] );
        }
        else
        {
            query = query.eq( 'value', value );
        }

        let { data, error } = await query;

        if ( error !== null )
        {
            logError( error );
        }

        return data ? data.map( feature => feature.propertyId ) : [];
    }

    // ~~

    getFeatureValueByTypeId(
        featureTypeId,
        featureByTypeIdMap,
        featureTypeByIdMap,
        useDefaultValue = true
        )
    {
        let feature = featureByTypeIdMap[ featureTypeId ];
        let featureType = featureTypeByIdMap[ featureTypeId ];

        let featureValueTypeId = featureType.valueTypeId;
        let featureValue = null;
        let defaultValue = null;

        switch( featureValueTypeId )
        {
            case 'boolean':
            case 'booking-option':
                featureValue = feature?.value === 'true';
                defaultValue = featureType.defaultValue === 'true';
                break;
            case 'integer':
            case 'real':
                featureValue = getNumber( feature?.value ?? 0 );
                defaultValue
                    = getMaximumReal(
                        getNumber( featureType.defaultValue ),
                        getNumber( featureType.maximumValue )
                        );
                break;
            case 'date':
                featureValue = new Date( feature?.value );
                defaultValue = new Date( featureType.defaultValue );
                break;
            case 'text':
                featureValue = feature?.value?.trim();
                defaultValue = featureType.defaultValue;
                break;
            default:
                featureValue = feature?.value;
                defaultValue = featureType.defaultValue;
        }

        if ( isNullOrUndefined( feature ) && useDefaultValue )
        {
            return defaultValue;
        }

        return featureValue;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedFeatureArray = null;
    }

    // ~~

    async getCachedFeatureArray(
        )
    {
        if ( this.cachedFeatureArray === null
             || Date.now() > this.cachedFeatureTimestamp + 300000 )
        {
            this.cachedFeatureArray = await this.getFeatureArray();
            this.cachedFeatureByIdMap = null;
            this.cachedFeatureTimestamp = Date.now()
        }

        return this.cachedFeatureArray;
    }

    // ~~

    async getCachedFeatureByIdMap(
        )
    {
        if ( this.cachedFeatureByIdMap === null )
        {
            this.cachedFeatureByIdMap = getMapById( await this.getCachedFeatureArray() );
        }

        return this.cachedFeatureByIdMap;
    }

    // ~~

    async addFeature(
        feature
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .insert( feature );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setFeatureById(
        feature,
        featureId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .update( feature )
                .eq( 'id', featureId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async upsertFeatureArray(
        featureArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .upsert( featureArray )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeFeatureById(
        featureId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .delete()
                .eq( 'id', featureId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeFeatureByPropertyId(
        propertyId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE' )
                .delete()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return { data, error };
    }
}

// -- VARIABLES

export let featureService
    = new FeatureService();
