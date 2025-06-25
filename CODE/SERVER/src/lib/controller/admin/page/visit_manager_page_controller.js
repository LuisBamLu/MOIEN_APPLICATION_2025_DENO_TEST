// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { AppError } from '../../../app_error';
import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';
import { visitService } from '../../../service/visit_service';
import { visitStatusService } from '../../../service/visit_status_service';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';

// -- FUNCTIONS

async function getVisitManager(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { page = 1, limit = 15 } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let { visitArray, visitCount } = await visitService.getVisitArray( page, limit, filterArray );
    let visitStatusArray = await visitStatusService.getCachedVisitStatusArray();
    let visitStatusByIdMap = await visitStatusService.getCachedVisitStatusByIdMap();
    let [ userIdArray, visitorIdArray, propertyIdArray ] = [ 'userId', 'visitorUserId', 'propertyId' ]
        .map( key => getUniqueValues( visitArray, key ) );
    let uniqueUserIdArray = new Set( [ ...userIdArray, ...visitorIdArray ] );
    let [ profileArray, propertyArray ] = await Promise.all(
        [
            profileService.getProfileArrayByUserIdArray( Array.from( uniqueUserIdArray ) ),
            propertyService.getPropertyArrayByIdArray( propertyIdArray )
        ]
        );

    let { hasMorePage } = getHasMorePage( visitCount, page, limit );

    return reply
        .send(
            {
                visitArray,
                visitStatusArray,
                visitStatusByIdMap,
                profileArray,
                propertyArray,
                hasMorePage
            }
            );
}

// ~~

async function setVisitManager(
    request,
    reply
    )
{
    let { visitId } = request.params;
    let body = getJsonObject( request.body );
    let { visitData } = body;

    if ( !visitId || !visitData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetVisitPermission = await hasUserPermission( 'set-visit', profile.roleSlugArray );

    if ( !hasSetVisitPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await visitService.setVisit(
        {
            propertyId: visitData.propertyId,
            date: visitData.date,
            time: visitData.time,
            duration: visitData.duration,
            status: visitData.status,
            visitorUserId: visitData.visitorUserId,
            userId: visitData.userId
        },
        visitId
        );

    return reply.send( { message: 'visit-updated-message' } );
}

// ~~

async function removeVisitManager(
    request,
    reply
    )
{
    let { visitId } = request.params;

    if ( !visitId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveVisitPermission = await hasUserPermission( 'remove-visit', profile.roleSlugArray );

    if ( !hasRemoveVisitPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await visitService.removeVisit( visitId );

    return reply.send( { message: 'visit-deleted-message' } );
}

export
{
    getVisitManager,
    setVisitManager,
    removeVisitManager
}
