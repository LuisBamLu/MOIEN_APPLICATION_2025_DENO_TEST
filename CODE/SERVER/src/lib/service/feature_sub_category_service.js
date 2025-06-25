// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class FeatureSubCategoryService
{
    // -- INQUIRIES

    async getFeatureSubCategoryArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_SUBCATEGORY' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getFeatureSubCategoryById(
        featureSubCategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_SUBCATEGORY' )
                .select()
                .eq( 'id', featureSubCategoryId );

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

    async addFeatureSubCategory(
        featureSubCategory
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_SUBCATEGORY' )
                .insert( featureSubCategory );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setFeatureSubCategoryById(
        featureSubCategory,
        featureSubCategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_SUBCATEGORY' )
                .update( featureSubCategory )
                .eq( 'id', featureSubCategoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeFeatureSubCategoryById(
        featureSubCategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_SUBCATEGORY' )
                .delete()
                .eq( 'id', featureSubCategoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let featureSubCategoryService
    = new FeatureSubCategoryService();
