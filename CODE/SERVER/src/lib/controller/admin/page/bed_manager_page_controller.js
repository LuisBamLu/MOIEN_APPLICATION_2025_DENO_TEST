// -- IMPORTS

import { getJsonObject, isArray } from 'senselogic-gist';
import { getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { bedService } from '../../../service/bed_service';
import { bedTypeService } from '../../../service/bed_type_service';
import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';
import { spaceService } from '../../../service/space_service';
import { AppError } from '../../../utils/app_error';

// -- FUNCTIONS

async function bedManagerPageData(
    request,
    reply
    )
{
    let bedMap =
    {
        bedArray : [],
        hasMorePage : false
    };

    let body = getJsonObject( request.body );
    let { bedIdArray, page, limit } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;

    if ( isArray( bedIdArray ) && bedIdArray.length > 0 )
    {
        let { bedArray, countBedArray } = await bedService.getBedArray(
            bedIdArray,
            page,
            limit,
            filterArray
            );

        bedMap.bedArray = bedArray;
    }
    else
    {
        let { bedArray, countBedArray } = await bedService.getBedArray(
            [],
            page,
            limit,
            filterArray
        );

        if ( bedArray && bedArray.length <= 0 )
        {
            ( { bedArray, countBedArray } = await bedService.getBedArray(
                    [],
                    page,
                    limit,
                    filterArray
                )
                );
        }

        bedMap.bedArray = bedArray;

        let pageCount = Math.ceil( countBedArray / limit );

        bedMap.hasMorePage = page < pageCount;
    }

    let [ userIdArray, propertyIdArray, spaceIdArray] =
        ['userId', 'propertyId', 'spaceId'].map( key => getUniqueValues( bedMap.bedArray, key ) );

    let [ bedTypeArray, profileArray, propertyArray, spaceArray ] =
        await Promise.all( [
            bedTypeService.getBedTypeArray(),
            profileService.getProfileArrayByUserIdArray( userIdArray ),
            propertyService.getPropertyArrayByIdArray( propertyIdArray ),
            spaceService.getSpaceArrayByIdArray( spaceIdArray )
        ] );

    return reply.send(
        {
            bedMap,
            bedTypeArray,
            profileArray,
            propertyArray,
            spaceArray
        }
        );
}

// ~~

async function setBedData(
    request,
    reply
    )
{
    let { bedId } = request.params;
    let body = getJsonObject( request.body );
    let bedData = body;

    if ( !bedId || !bedData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetBedPermission = await hasUserPermission( 'set-bed', profile.roleSlugArray );

    if ( !hasSetBedPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await bedService.setBedById(
        {
            count : bedData.count,
            personCount : bedData.personCount,
            typeId : bedData.typeId
        },
        bedId
        );

    return reply.send( { message: 'bed-updated-message' } );
}

// ~~

async function removeBedData(
    request,
    reply
    )
{
    let { bedId } = request.params;

    if ( !bedId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetBedPermission = await hasUserPermission( 'remove-bed', profile.roleSlugArray );

    if ( !hasSetBedPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await bedService.removeBedById( bedId );

    return reply.send( { message: 'bed-deleted-message' } );
}

export
{
    bedManagerPageData,
    setBedData,
    removeBedData
}
