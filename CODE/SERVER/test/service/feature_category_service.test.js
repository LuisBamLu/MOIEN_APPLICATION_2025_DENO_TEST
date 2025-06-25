// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service.test';

// -- TYPES

class FeatureCategoryService
{
    // -- INQUIRIES

    async getFeatureCategoryArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_CATEGORY' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getFeatureCategoryById(
        featureCategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_CATEGORY' )
                .select()
                .eq( 'id', featureCategoryId );

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

    async addFeatureCategory(
        featureCategory
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_CATEGORY' )
                .insert( featureCategory );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setFeatureCategoryById(
        featureCategory,
        featureCategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_CATEGORY' )
                .update( featureCategory )
                .eq( 'id', featureCategoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeFeatureCategoryById(
        featureCategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_CATEGORY' )
                .delete()
                .eq( 'id', featureCategoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let featureCategoryService
    = new FeatureCategoryService();
