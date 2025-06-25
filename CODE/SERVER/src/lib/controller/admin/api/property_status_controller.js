// -- IMPORTS

import { getJsonObject, logError } from 'senselogic-gist';
import { propertyStatusService } from '../../../service/property_status_service';
import { AppError } from '../../../utils/app_error';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../../base';

// -- FUNCTIONS

async function getPropertyStatus(
    request,
    reply
    )
{
    let propertyStatusArray = await propertyStatusService.getCachedPropertyStatusArray();

    return reply.status( 200 ).send( { propertyStatusArray } );
}

// ~~

async function updatePropertyStatus(
    request,
    reply
    )
{
    try
    {
        let { propertyStatusId } = request.params;
        let body = getJsonObject( request.body );
        let propertyStatusData = body;

        if ( !propertyStatusId || !propertyStatusData )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasSetPropertyStatusPermission = await hasUserPermission( 'set-property-status', profile.roleSlugArray );

        if ( !hasSetPropertyStatusPermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        let propertyStatusExists = await propertyStatusService.getPropertyStatusById( propertyStatusId );

        if ( !propertyStatusExists )
        {
            throw new AppError( 'property-status-not-found-error', 404 );
        }

            let propertyStatus = await propertyStatusService.setPropertyStatusById(
                {
                    number : propertyStatusData.number,
                    name : propertyStatusData.name,
                    color : propertyStatusData.color
                },
                propertyStatusId
                );

            return reply.send( { propertyStatus, message: 'property-type-updated-message' } );
        }
        catch( error )
        {
            logError( error );
            throw new AppError( error.message );
        }
    }

// ~~

async function deletePropertyStatus(
    request,
    reply
    )
{
    try
    {
        let { propertyStatusId } = request.params;

        if ( !propertyStatusId )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasRemovePropertyStatusPermission = await hasUserPermission( 'remove-property-status', profile.roleSlugArray );

        if ( !hasRemovePropertyStatusPermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        await propertyStatusService.removePropertyStatusById( propertyStatusId );

        return reply.send( { message: 'property-status-deleted-message' } );
    }
    catch( error )
    {
        logError( error );
        throw new AppError( error.message );
    }
}

// ~~

async function addPropertyStatus(
    request,
    reply
    )
{
    try
    {
        let body = getJsonObject( request.body );
        let propertyStatusData = body;

        if ( !propertyStatusData )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasAddPropertyStatusPermission = await hasUserPermission( 'add-property-status', profile.roleSlugArray );

        if ( !hasAddPropertyStatusPermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        let propertyStatusId = getTextSlug( propertyStatusData.name );

        let propertyStatus = await propertyStatusService.addPropertyStatus(
            {
                id : propertyStatusId,
                number : propertyStatusData.number,
                name : propertyStatusData.name,
                color : propertyStatusData.color
            }
            );

        return reply.status( 201 ).send( { propertyStatus, message: 'property-status-created-message' } );
    }
    catch ( error )
    {
        logError( error );
        throw new AppError( error.message );
    }
}

export
{
    getPropertyStatus,
    updatePropertyStatus,
    deletePropertyStatus,
    addPropertyStatus
}
