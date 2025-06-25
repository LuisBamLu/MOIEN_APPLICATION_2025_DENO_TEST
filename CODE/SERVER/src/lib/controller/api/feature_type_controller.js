// -- IMPORTS

import { featureTypeService } from '../../service/feature_type_service';

// -- FUNCTIONS

export async function getFeatureByCategoryAndSubCategoryMap(
    request,
    reply
    )
{
    return (
        {
            featureTypeByCategoryAndSubCategoryArray : await featureTypeService.getFeatureByCategoryAndSubCategoryMap()
        }
        );
}

// ~~

export async function getFeatureType(
    request,
    reply
    )
{
    return (
        {
            featureTypeArray: await featureTypeService.getCachedFeatureTypeArray()
        }
    )
}

// ~~

export async function getFeatureTypeByIdMap(
    request,
    reply
    )
{
    return (
        {
            featureTypeByIdMap: await featureTypeService.getCachedFeatureTypeByIdMap()
        }
    )
}
