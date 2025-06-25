// -- IMPORTS

import { storageService } from '../../../service/storage_service';
import { AppError } from '../../../utils/app_error';
import { getFileBufferBySizeMap } from '../../../utils/fileUtils';
import { hasUserPermission } from '../../../base';

// -- FUNCTIONS

async function getImageArray(
    request,
    reply
    )
{
    try
    {
        let body = JSON.parse( request.body );

        let profileLogged = request.profileLogged;

        if ( !profileLogged )
        {
            throw new AppError( 'unauthenticated-message-error', 401 );
        }

        let hasListImagePermission = await hasUserPermission( 'list-image', profileLogged.roleSlugArray );

        if ( !hasListImagePermission )
        {
            throw new AppError( 'unauthorized-message-error', 403 );
        }

        let page = body.page || 1;
        let limit = body.limit || 1000;

        let {
                imageArray,
                imageArrayCount
            } = await storageService.getImageArray(
                page,
                limit
                );

        let hasMorePagination = ( page * limit ) < imageArrayCount;

        return reply.send(
            {
                imageArray,
                imageArrayCount,
                hasMorePagination
            }
            );
    }
    catch ( error )
    {
        throw new AppError( error );
    }
}

// ~~

async function updateFile(
    request,
    reply
    )
{
    try
    {
        let profileLogged = request.profileLogged;

        if ( !profileLogged )
        {
            throw new AppError( 'unauthenticated-message-error', 401 );
        }

        let hasSetImagePermission = await hasUserPermission( 'set-image', profileLogged.roleSlugArray );

        if ( !hasSetImagePermission )
        {
            throw new AppError( 'unauthorized-message-error', 403 );
        }

        if ( !request || !request.body || !request.body.file )
        {
            throw new AppError( 'bad-request' );
        }

        let filePart = request.body.file;
        let originalFileName = request.body.fileName.value;

        let fileBuffer = await filePart.toBuffer();

        if ( !fileBuffer )
        {
            throw new AppError( 'file-not-uploaded' );
        }

        let fileBufferByResolutionMap = await getFileBufferBySizeMap( fileBuffer );

        let [ _, fileExtension ] = originalFileName.split( '.' );

        let filePathByResolutionMap =
            {
                extraLarge: originalFileName + '.3840.' + fileExtension.toLowerCase(),
                large: originalFileName + '.1920.' + fileExtension.toLowerCase(),
                medium: originalFileName + '.1280.' + fileExtension.toLowerCase(),
                small: originalFileName + '.640.' + fileExtension.toLowerCase(),
                preload: originalFileName + '.512.' + fileExtension.toLowerCase(),
            };

        let upsertImage = true;
        let fileMimeType = filePart.mimetype;

        await storageService.uploadFiles(
            filePathByResolutionMap,
            fileBufferByResolutionMap,
            fileMimeType,
            upsertImage
            );

        return reply.send( { message: 'file-updated-successfully' } );
    }
    catch ( error )
    {
        if ( !reply.sent )
        {
            return reply.status( 400 ).send( { error: 'failed-to-update-file' } );
        }

        return reply.status( 400 ).send( { error: 'bad-request' } );
    }
}

// ~~

async function deleteFile(
    request,
    reply
    )
{
    try
    {
        let profileLogged = request.profileLogged;

        if ( !profileLogged )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasRemoveImagePermission = await hasUserPermission( 'remove-image', profileLogged.roleSlugArray );

        if ( !hasRemoveImagePermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        if ( !request || !request.body || !request.body.filePath )
        {
            throw new AppError( 'bad-request' );
        }

        let filePath = request.body.filePath.value;

        let fileNameSplitedArray = filePath.split( '.' );

        let [
            fileNameWithFolder,
            fileOriginalExtension,
            _,
            fileExtension
            ] = fileNameSplitedArray;

        let originalFileName =
            [ fileNameWithFolder, fileOriginalExtension ].join( '.' );

        let filePathArray =
            [
                originalFileName
            ];

        await storageService.deleteFiles( filePathArray );

        return reply.send( { message: 'file-deleted-successfully' } );
    }
    catch ( error )
    {
        console.error( error );

        throw new AppError( 'bad-request' );
    }
}

export
{
    getImageArray,
    updateFile,
    deleteFile
}
