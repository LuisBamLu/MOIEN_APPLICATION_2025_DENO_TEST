// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { AppError } from '../../../app_error';
import { getHasMorePage, hasUserPermission, isNullOrUndefined } from '../../../base';
import { profileService } from '../../../service/profile_service';
import { userReviewService } from '../../../service/user_review_service';

// -- FUNCTIONS

async function getUserReviewData(
    request,
    reply
    )
{
    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
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

    let { userReviewArray, userReviewCount } = await userReviewService.getUserReviewArray(
        page,
        limit,
        filterArray,
        );
    let userIdSet = new Set();

    for ( let userReview of userReviewArray )
    {
        userIdSet.add( userReview.userId );
        userIdSet.add( userReview.ratedUserProfileId );
    }

    let profileArray = await profileService.getProfileArrayByUserIdArray( Array.from( userIdSet ) );

    let { hasMorePage } = getHasMorePage( userReviewCount, page, limit );

    return reply.send( { userReviewArray, profileArray, hasMorePage } );
}

export
{
    getUserReviewData
}
