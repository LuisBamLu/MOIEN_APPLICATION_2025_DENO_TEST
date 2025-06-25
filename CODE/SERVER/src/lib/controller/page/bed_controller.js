// -- IMPORTS

import { bedService } from '../../service/bed_service';
import { bedTypeService } from '../../service/bed_type_service';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';
import { spaceService } from '../../service/space_service';
import { getUniqueValues } from '../../base';

// -- FUNCTIONS

export async function getBedByPropertyId(
    request,
    reply
    )
{
    return (
        {
            bedArray : await bedService.getBedArrayByPropertyId( request.body.propertyId )
        }
        );
}

export async function getBedData(
    request,
    reply
    )
{
    let bedArray = await bedService.getAllBedArray();
    let [ userIdArray, propertyIdArray, spaceIdArray ] =
        ['userId', 'propertyId', 'spaceId'].map( key => getUniqueValues( bedArray, key ) );
    let [ profileArray, propertyArray, spaceArray, bedTypeArray ]
        = await Promise.all(
            [
                profileService.getProfileArrayByUserIdArray( userIdArray ),
                propertyService.getPropertyArrayByIdArray( propertyIdArray ),
                spaceService.getSpaceArrayByIdArray( spaceIdArray ),
                bedTypeService.getBedTypeArray()
            ]
            );

    return ( { bedArray, profileArray, propertyArray, spaceArray, bedTypeArray } );
}
