// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class FeatureValueTypeService
{
    // -- INQUIRIES

    async getFeatureValueTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_VALUE_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getFeatureValueTypeById(
        featureValueTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_VALUE_TYPE' )
                .select()
                .eq( 'id', featureValueTypeId );

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

    // -- OPERATIONS

    async addFeatureValueType(
        featureValueType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_VALUE_TYPE' )
                .insert( featureValueType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setFeatureValueTypeById(
        featureValueType,
        featureValueTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_VALUE_TYPE' )
                .update( featureValueType )
                .eq( 'id', featureValueTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeFeatureValueTypeById(
        featureValueTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_VALUE_TYPE' )
                .delete()
                .eq( 'id', featureValueTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let featureValueTypeService
    = new FeatureValueTypeService();
