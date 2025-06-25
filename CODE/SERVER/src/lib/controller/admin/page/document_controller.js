// -- IMPORTS

import { getJsonObject, getRandomTuid, logError } from 'senselogic-gist';
import { documentService } from '../../../service/document_service';
import { mangopayService } from '../../../service/mangopay_service';
import { profileService } from '../../../service/profile_service';
import { getMangopayDocumentTypeFromDocumentTypeId, hasAllUserPermissions, hasUserPermission, isMangopayDocument, isNullOrUndefined } from '../../../base';
import { AppError } from '../../../app_error';
import { storageService } from '../../../service/storage_service';
import { notificationCenterService } from '../../../service/notification_center_service';

// -- FUNCTIONS

async function getDocumentArray(
    request,
    reply
    )
{
    return (
        {
            documentArray: await documentService.getDocumentArrayByIdArray( request.body.idArray )
        }
        );
}

// ~~

async function addDocument( request, reply )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let userId = request.profileLogged.userId;
    let body = getJsonObject( request.body );
    let document = {};
    let documentData = body.documentData;
    let mangopayUserId = null;
    let mangopayDocumentId = null;

    if ( isMangopayDocument( documentData.typeId ) )
    {
        if ( request.profileLogged.mangopayUserId )
        {
            let mangopayUser = await mangopayService.getUser( request.profileLogged.mangopayUserId );

            if ( !mangopayUser )
            {
                mangopayUser = await mangopayService.addUserFromProfile( request.profileLogged );

                if ( !mangopayUser )
                {
                    return reply.status( 500 ).send( { error: 'mangopay-profile-create-error-message' } );
                }

                await profileService.setProfileById( { mangopayUserId: mangopayUser.Id }, request.profileLogged.id );
                let mangopayWallet
                    = await mangopayService.addWallet(
                        mangopayUser.Id,
                        request.profileLogged.currencyCode ?? 'EUR',
                        'Moien '
                        + ( request.profileLogged.currencyCode ?? 'EUR' )
                        + ' Wallet'
                        );
            }

            mangopayUserId = mangopayUser.Id;
        }
        else
        {
            let mangopayUser = await mangopayService.addUserFromProfile( request.profileLogged );

            if ( !mangopayUser )
            {
                return reply.status( 500 ).send( { error: 'mangopay-profile-create-error-message' } );
            }

            await profileService.setProfileById( { mangopayUserId: mangopayUser.Id }, request.profileLogged.id );
            await mangopayService.addWallet(
                mangopayUser.Id,
                request.profileLogged.currencyCode ?? 'EUR',
                'Moien '
                + ( request.profileLogged.currencyCode ?? 'EUR' )
                + ' Wallet'
                );

            mangopayUserId = mangopayUser.Id;
        }

        let mangopayDocumentType = getMangopayDocumentTypeFromDocumentTypeId( documentData.typeId )
        let mangopayDocument = await mangopayService.addDocument( mangopayUserId, { Type: mangopayDocumentType } );

        if ( !mangopayDocument )
        {
            return reply.status( 500 ).send( { error: 'mangopay-document-error-message' } );
        }

        mangopayDocumentId = mangopayDocument.Id;

        let file
            = await fetch( process.env.SECRET_MOIEN_STORAGE_URL + body.documentData.filePath )
                .then( async ( response ) => await response.arrayBuffer() )
                .then(
                    async ( data ) =>
                    {
                        let dataBuffer = Buffer.from( data );

                        return dataBuffer.toString( 'base64' );
                    }
                    );
        let documentPage = await mangopayService.addDocumentPage( mangopayUserId, mangopayDocumentId, file );

        if ( documentPage === false )
        {
            return reply.status( 500 ).send( { error: 'mangopay-document-page-error-message' } )
        }

        await mangopayService.requestDocumentValidation( mangopayUserId, mangopayDocumentId );
    }

    document.countryIdArray = [ documentData.countryCode ];
    delete documentData.countryCode;
    delete documentData.issueDate;
    delete documentData.payrollIssueMonth;
    let documentId = getRandomTuid();
    document =
        {
            ...document,
            ...documentData,
            id: documentId,
            validationStatusId: 'pending',
            userId: userId,
            mangopayDocumentId: mangopayDocumentId
        };

    document = await documentService.addDocument( document );

    return reply.status( 200 ).send( { document } );
}

// ~~

async function acceptDocument(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;
    let body = getJsonObject( request.body );
    let document = body.document;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-message-error', 401 );
    }

    let hasSetDocumentPermission = await hasUserPermission( 'set-document', profile.roleSlugArray );

    if ( !hasSetDocumentPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let { documentId } = request.params;
    let updatedDocument = await documentService.setDocumentById( { validationStatusId: 'accepted' }, documentId );

    if ( updatedDocument?.typeId === 'id-card' )
    {
        profileService.setProfileByUserId( { governmentIdValidationStatusId: 'accepted' }, updatedDocument.userId );
    }

    notificationCenterService.addNotification(
        {
            id: getRandomTuid(),
            notificationType: 'appointment-reminder',
            message:
                `**Your document has been accepted! 🎉**\n`
                + `Congratulations! Your document has been successfully reviewed and approved. `
                + `Celebrate this milestone by making a reservation and planning your next adventure.\n`
                + `We can't wait to see where this takes you! 🚀`,
            userId: document.userId,
            isRead: false
        }
        );

        return reply.send( { message: 'document-accepted-message' } );
}

// ~~

async function declineDocument(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;
    let body = getJsonObject( request.body );
    let document = body.document;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-message-error', 401 );
    }

    let hasSetDocumentPermission = await hasUserPermission( 'set-document', profile.roleSlugArray );

    if ( !hasSetDocumentPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let { documentId } = request.params;
    let updatedDocument = await documentService.setDocumentById( {  validationStatusId: 'declined' }, documentId );

    if ( updatedDocument?.typeId === 'id-card' )
    {
        profileService.setProfileByUserId( { governmentIdValidationStatusId: 'declined' }, updatedDocument.userId );
    }

    notificationCenterService.addNotification(
        {
            id: getRandomTuid(),
            notificationType: 'appointment-reminder',
            message:
                `**Your document has been declined 😔**\n`
                + `Unfortunately, your document didn’t meet the required criteria.\n`
                + `Please review the feedback and make the necessary changes. Reach out if you need assistance—we’re here to help! 💪`,
            userId: document.userId,
            isRead: false
        }
        );

        return reply.send( { message: 'document-declined-message' } );
}

// ~~

async function setDocument( request, reply )
{
    try
    {
        let body = getJsonObject( request.body );
        let document = body.document;

        await documentService.setDocumentById(
            {
                typeId: document.typeId,
                validationStatusId: document.validationStatusId,
                expirationDate: document.expirationDate,
                filePath: document.filePath,
                name: document.name,
                description: document.description,
                languageTag: document.languageTag,
                countryIdArray: document.countryIdArray,
                userId: document.userId,
                mangopayDocumentId: document.mangopayDocumentId
            },
            document.id
            );

        if ( document.typeId === 'id-card' )
        {
            await profileService.setProfileGovernmentIdValidationStatusIdByUserId( document.validationStatusId, document.userId );
        }

        return reply.send( { message: 'document-updated' } );
    }
    catch( error )
    {
        logError( error );

        throw new AppError( 'bad-request' );
    }
}

// ~~

async function setDocumentImage(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let userId = request.profileLogged.userId;
    let body = JSON.parse( request.body );
    let documentId = request.params.id;
    let document = await documentService.getDocumentById( documentId );

    if ( document.userId !== userId )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let mangopayDocumentId = null;

    if ( isMangopayDocument( document.typeId ) )
    {
        let mangopayUserId;

        if ( request.profileLogged.mangopayUserId )
        {
            let mangopayUser = await mangopayService.getUser( request.profileLogged.mangopayUserId );

            if ( !mangopayUser )
            {
                mangopayUser = await mangopayService.addUserFromProfile( request.profileLogged );

                if ( !mangopayUser )
                {
                    return reply.status( 500 ).send( { error: 'mangopay-profile-create-error-message' } );
                }

                await profileService.setProfileById( { mangopayUserId: mangopayUser.Id }, request.profileLogged.id );
                let mangopayWallet
                    = await mangopayService.addWallet(
                        mangopayUser.Id,
                        request.profileLogged.currencyCode ?? 'EUR',
                        'Moien '
                        + ( request.profileLogged.currencyCode ?? 'EUR' )
                        + ' Wallet'
                        );
            }

            mangopayUserId = mangopayUser.Id;
        }
        else
        {
            let mangopayUser = await mangopayService.addUserFromProfile( request.profileLogged );

            if ( !mangopayUser )
            {
                return reply.status( 500 ).send( { error: 'mangopay-profile-create-error-message' } );
            }

            await profileService.setProfileById( { mangopayUserId: mangopayUser.Id }, request.profileLogged.id );
            await mangopayService.addWallet(
                mangopayUser.Id,
                request.profileLogged.currencyCode ?? 'EUR',
                'Moien '
                + ( request.profileLogged.currencyCode ?? 'EUR' )
                + ' Wallet'
                );

            mangopayUserId = mangopayUser.Id;
        }

        let mangopayDocumentType = getMangopayDocumentTypeFromDocumentTypeId( document.typeId )
        let mangopayDocument = await mangopayService.addDocument( mangopayUserId, { Type: mangopayDocumentType } );

        if ( !mangopayDocument )
        {
            return reply.status( 500 ).send( { error: 'mangopay-document-error-message' } );
        }

        mangopayDocumentId = mangopayDocument.Id;
        let file
            = await fetch( process.env.SECRET_MOIEN_STORAGE_URL + body.document.filePath )
                .then( async ( response ) => await response.arrayBuffer() )
                .then(
                    async ( data ) =>
                    {
                        let dataBuffer = Buffer.from( data );

                        return dataBuffer.toString( 'base64' );
                    }
                    );
        let documentPage
            = await mangopayService.addDocumentPage(
                mangopayUserId,
                mangopayDocumentId,
                file
                );

        if ( documentPage === false )
        {
            return reply.status( 500 ).send( { error: 'mangopay-document-page-error-message' } )
        }

        await mangopayService.requestDocumentValidation( mangopayUserId, mangopayDocumentId );
    }

    await documentService.setDocumentById(
        {
            filePath: body.document.filePath,
            validationStatusId: 'pending',
            mangopayDocumentId: mangopayDocumentId
        },
        documentId
        );

    return reply.status( 200 ).send( { message: 'document-updated' } );
}

// ~~

async function deleteDocument(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let userId = request.profileLogged.userId;
    let documentId = request.params.id;
    let document = await documentService.getDocumentById( documentId );

    if ( document.userId !== userId )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    if ( document.filePath )
    {
        storageService.deleteFiles( [ document.filePath ] );
    }

    await documentService.removeDocumentById( documentId );

    return reply.status( 200 ).send( { message: 'document-deleted' } );
}

// ~~

async function getDocumentById(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthorized-error-message', 401 );
    }

    let hasListDocumentPermission = await hasAllUserPermissions( [ 'list-document', 'list-user' ], profile.roleSlugArray );

    if (!hasListDocumentPermission )
    {
        throw new AppError( 'unauthorized-error-message', 401 );
    }

    let documentId = request.params.id;
    let document = await documentService.getDocumentById( documentId );

    if ( !document )
    {
        throw new AppError( 'document-not-found', 404 );
    }

    let documentProfile = await profileService.getProfileByUserId( document.userId );
    document.profile = documentProfile;

    return reply.status( 200 ).send( { document } );
}

export
{
    getDocumentArray,
    addDocument,
    setDocument,
    setDocumentImage,
    deleteDocument,
    getDocumentById,
    acceptDocument,
    declineDocument
}
