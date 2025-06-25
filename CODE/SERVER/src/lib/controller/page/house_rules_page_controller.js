// -- IMPORTS

import { getMap } from 'senselogic-gist';
import { featureService } from '../../service/feature_service';
import { featureTypeService } from '../../service/feature_type_service';

// -- FUNCTIONS

export async function getHouseRulesPageData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let propertyId = request.params.id;
    let featureArray = await featureService.getFeatureArrayByPropertyIdAndSubcategoryId( propertyId, 'rules' );
    let featureTypeArray = await featureTypeService.getFeatureTypeArrayBySubcategoryId( 'rules' );
    let featureByTypeIdMap = getMap( featureArray, 'typeId' );

    return reply.status( 200 ).send( { featureArray, featureTypeArray, featureByTypeIdMap } )
}
