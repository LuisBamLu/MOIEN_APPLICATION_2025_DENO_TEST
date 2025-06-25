// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { featureCategoryService } from '../service/feature_category_service';
import { featureSubCategoryService } from '../service/feature_sub_category_service';

// -- TYPES

class FeatureTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedFeatureTypeArray = null;
        this.cachedFeatureTypeByIdMap = null;
        this.cachedFeatureTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getFeatureTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getFeatureTypeById(
        featureTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_TYPE' )
                .select()
                .eq( 'id', featureTypeId );

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

    async getFeatureTypeArrayBySubcategoryId(
        subcategoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_TYPE' )
                .select()
                .eq( 'subcategoryId', subcategoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getFeatureByCategoryAndSubCategoryMap(
        )
    {
        let featureTypeArray = await this.getCachedFeatureTypeArray();

        let featureCategoryArray = await featureCategoryService.getFeatureCategoryArray();
        let featureSubCategoryArray = await featureSubCategoryService.getFeatureSubCategoryArray();

        let sortedFeatureCategoryArray =
            Object.values( featureCategoryArray )
                .sort(
                    ( a, b ) =>
                    {
                        return a.number - b.number;
                    }
                    );

        let sortedFeatureSubCategoryArray =
            Object.values( featureSubCategoryArray )
                .sort(
                    ( a, b ) =>
                    {
                        return a.number - b.number;
                    }
                    );

        let featureCategoryById = getMapById( sortedFeatureCategoryArray );
        let featureSubCategoryById = getMapById( sortedFeatureSubCategoryArray );

        let featureTypeByCategoryAndSubCategory = {};

        for ( let featureType of featureTypeArray )
        {
            let featureCategory = featureCategoryById[ featureType.categoryId ];
            let featureSubCategory = featureSubCategoryById[ featureType.subcategoryId ];

            let featureCategoryId = featureType.categoryId;
            let featureSubCategoryId = featureType.subcategoryId;

            if ( !featureTypeByCategoryAndSubCategory[ featureCategoryId ] )
            {
                featureTypeByCategoryAndSubCategory[ featureCategoryId ] =
                    {
                        name: featureCategory ? featureCategory.name : '',
                        number: featureCategory ? featureCategory.number : undefined,
                        subCategory: {}
                    };
            }

            if ( !featureTypeByCategoryAndSubCategory[ featureCategoryId ].subCategory[ featureSubCategoryId ] )
            {
                featureTypeByCategoryAndSubCategory[ featureCategoryId ].subCategory[ featureSubCategoryId ] =
                    {
                        name: featureSubCategory ? featureSubCategory.name : '',
                        number: featureCategory ? featureCategory.number : undefined,
                        featureTypeArray: []
                    };
            }

            featureTypeByCategoryAndSubCategory[ featureCategoryId ].subCategory[ featureSubCategoryId ].featureTypeArray.push( featureType );
        }

        return featureTypeByCategoryAndSubCategory;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedFeatureTypeArray = null;
        this.cachedFeatureTypeByIdMap = null;
    }

    // ~~

    async getCachedFeatureTypeArray(
        )
    {
        if ( this.cachedFeatureTypeArray === null
             || Date.now() > this.cachedFeatureTypeTimestamp + 300000 )
        {
            this.cachedFeatureTypeArray = await this.getFeatureTypeArray();
            this.cachedFeatureTypeByIdMap = null;
            this.cachedFeatureTypeTimestamp = Date.now()
        }

        return this.cachedFeatureTypeArray;
    }

    // ~~

    async getCachedFeatureTypeByIdMap(
        )
    {
        if ( this.cachedFeatureTypeByIdMap === null )
        {
            let featureTypeArray = await this.getCachedFeatureTypeArray();
            this.cachedFeatureTypeByIdMap = getMapById( featureTypeArray );
        }

        return this.cachedFeatureTypeByIdMap;
    }

    // ~~

    async addFeatureType(
        featureType
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_TYPE' )
                .insert( featureType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setFeatureTypeById(
        featureType,
        featureTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_TYPE' )
                .update( featureType )
                .eq( 'id', featureTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeFeatureTypeById(
        featureTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'FEATURE_TYPE' )
                .delete()
                .eq( 'id', featureTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let featureTypeService
    = new FeatureTypeService();
