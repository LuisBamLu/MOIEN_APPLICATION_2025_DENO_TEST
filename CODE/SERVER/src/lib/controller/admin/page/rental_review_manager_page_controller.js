// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';
import { rentalReviewService } from '../../../service/rental_review_service';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { AppError } from '../../../app_error';

// -- FUNCTIONS

async function getManagerRentalReview(
    request,
    reply
    )
{
    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthorized-error-message', 401 );
    }

    let hasListReviewPermission = await hasUserPermission( 'list-review', profile.roleSlugArray );

    if ( !hasListReviewPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let body = getJsonObject( request.body );
    let { page = 1, limit = 15 } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let { rentalReviewArray, rentalReviewCount } = await rentalReviewService.getRentalReviewArray(
        page,
        limit,
        filterArray
        );

    let [ userIdArray, propertyIdArray ] =
        [ 'userId', 'propertyId' ]
            .map( ( key ) => getUniqueValues( rentalReviewArray, key ) );

    let propertyArray = await propertyService.getPropertyArrayByIdArray( propertyIdArray );
    let profileArray = await profileService.getProfileArrayByUserIdArray( userIdArray );

    let { hasMorePage } = getHasMorePage( rentalReviewCount, page, limit );

    return reply.send(
        {
            rentalReviewArray,
            propertyArray,
            profileArray,
            hasMorePage
        }
        );
}

export
{
    getManagerRentalReview
}
