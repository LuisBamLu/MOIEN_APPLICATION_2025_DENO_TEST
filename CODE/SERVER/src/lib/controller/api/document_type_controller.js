// -- IMPORTS

import { getJsonObject, logError } from 'senselogic-gist';
import { AppError } from '../../app_error';
import { documentTypeService } from '../../service/document_type_service';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../base';

// -- FUNCTIONS

export async function getDocumentType(
    request,
    reply,
    )
{
    return (
        {
            documentTypeArray : await documentTypeService.getCachedDocumentTypeArray(),
            documentTypeMap : await documentTypeService.getCachedDocumentTypeMap()
        }
    )
}

// ~~

export async function setDocumentType(
    request,
    reply
    )
{
    try
    {
        let { documentTypeId } = request.params;
        let body = getJsonObject( request.body );
        let documentTypeData = body;

        if ( !documentTypeId || !documentTypeData )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasSetDocumentTypePermission = await hasUserPermission( 'set-document-type', profile.roleSlugArray );

        if ( !hasSetDocumentTypePermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        let documentType = await documentTypeService.setDocumentType(
            {
                number: documentTypeData.number,
                name: documentTypeData.name
            },
            documentTypeId
            );

        return reply.send( { documentType, message: 'document-type-updated-message' } );
    }
    catch( error )
    {
        logError( error );

        throw new AppError( error.message );
    }
}

// ~~

export async function addDocumentType(
    request,
    reply
    )
{
    try
    {
        let body = getJsonObject( request.body );
        let documentTypeData = body;

        if ( !documentTypeData )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasAddUserRightPermission = await hasUserPermission( 'add-document-type', profile.roleSlugArray );

        if ( !hasAddUserRightPermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        let documentTypeId = getTextSlug( documentTypeData.name );

        let documentType = await documentTypeService.addDocumentType(
            {
                id : documentTypeId,
                name : documentTypeData.name,
                number : documentTypeData.number
            }
            );

        return reply.status( 201 ).send( { documentType, message: 'document-type-added-message' } );
    }
    catch ( error )
    {
        logError( error );
        throw new AppError( error.message );
    }
}

// ~~

export async function deleteDocumentType(
    request,
    reply
    )
{
    try
    {
        let { documentTypeId } = request.params;

        if ( !documentTypeId )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasRemoveDocumentTypePermission = hasUserPermission( 'remove-document-type', profile.roleSlugArray );

        if ( !hasRemoveDocumentTypePermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        let documentType = await documentTypeService.removeDocumentType( documentTypeId );

        return reply.send( { documentType, message: 'document-type-deleted-message' } );
    }
    catch ( error )
    {
        logError( error );
        throw new AppError( error.message );
    }
}
