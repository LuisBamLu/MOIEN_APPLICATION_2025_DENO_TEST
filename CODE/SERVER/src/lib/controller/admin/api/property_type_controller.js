// -- IMPORTS

import { getJsonObject, logError } from 'senselogic-gist';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../../base';
import { propertyTypeService } from '../../../service/property_type_service';
import { AppError } from '../../../app_error';

// -- FUNCTIONS

async function getPropertyType(
    request,
    reply
    )
{
    let type = request.body?.type;

    if ( type === 'getCachedPropertyTypeMap' )
    {
        return (
            {
                propertyTypeMap : await propertyTypeService.getCachedPropertyTypeMap()
            }
            );
    }

    return ( { propertyTypeArray : await propertyTypeService.getCachedPropertyTypeArray() } );
}

// ~~

async function updatePropertyType(
    request,
    reply
    )
{
    try
    {
        let { propertyTypeId } = request.params;
        let body = getJsonObject( request.body );
        let propertyTypeData = body;

        if ( !propertyTypeId || !propertyTypeData )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasSetPropertyTypePermission = await hasUserPermission( 'set-property-type', profile.roleSlugArray );

        if ( !hasSetPropertyTypePermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        let propertyTypeExists = await propertyTypeService.getPropertyTypeById( propertyTypeId );

        if ( !propertyTypeExists )
        {
            throw new AppError( 'property-type-not-found-error', 404 );
        }

        let propertyType = await propertyTypeService.setPropertyTypeById(
            {
                number: propertyTypeData.number,
                name: propertyTypeData.name
            },
            propertyTypeId
            );

        return reply.send( { propertyType, message: 'property-type-updated-message' } );
    }
    catch ( error )
    {
        logError( error );
        throw new AppError( 'bad-request' );
    }
}

// ~~

async function addPropertyType(
    request,
    reply
    )
{
    try
    {
        let body = getJsonObject( request.body );
        let propertyTypeData = body;

        if ( !propertyTypeData )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasAddPropertyTypePermission = await hasUserPermission( 'add-property-type', profile.roleSlugArray );

        if ( !hasAddPropertyTypePermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        let propertyTypeId = getTextSlug( propertyTypeData.name );
        let propertyType = await propertyTypeService.addPropertyType(
            {
                id : propertyTypeId,
                name : propertyTypeData.name,
                number : propertyTypeData.number
            }
            );

        return reply.status( 201 ).send( { propertyType, message: 'property-type-created-message' } );
    }
    catch ( error )
    {
        logError( error );
        throw new AppError( error.message );
    }
}

// ~~

async function deletePropertyType(
    request,
    reply
    )
{
    try
    {
        let { propertyTypeId } = request.params;

        if ( !propertyTypeId )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasRemovePropertyTypePermission = await hasUserPermission( 'remove-property-type', profile.roleSlugArray );

        if ( !hasRemovePropertyTypePermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        await propertyTypeService.removePropertyTypeById( propertyTypeId );

        return reply.send( { message: 'property-type-deleted-message' } );
    }
    catch ( error )
    {
        logError( error );
        throw new AppError( error.message );
    }
}

export
{
    getPropertyType,
    updatePropertyType,
    addPropertyType,
    deletePropertyType
}
