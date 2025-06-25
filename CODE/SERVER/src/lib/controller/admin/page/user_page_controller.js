//  -- IMPORTS

import { profileService } from '../../../service/profile_service';
import { AppError } from '../../../app_error';
import { userRoleService } from '../../../service/user_role_service';
import { userStatusService } from '../../../service/user_status_service';
import { userGenderService } from '../../../service/user_gender_service';
import { validationStatusService } from '../../../service/validation_status_service';
import { getHasMorePage, hasAllUserPermissions, hasUserPermission, isNullOrUndefined } from '../../../base';
import { getJsonObject } from 'senselogic-gist';

// -- FUNCTIONS

async function getProfileArray(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthorized-error-message', 401 );
    }

    let hasListUserPermission = await hasUserPermission( 'list-user', request.profileLogged.roleSlugArray );

    if ( !hasListUserPermission )
    {
        throw new AppError( 'unauthorized-message-error', 403 );
    }

    let page = Number( body.page ) || 1;
    let limit = Number( body.limit ) || 10;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;

    let responsePromise = profileService
        .getProfileArrayWithPagination(
            page,
            limit,
            filterArray
            );

    let userRolePromise = userRoleService.getCachedUserRoleArray();
    let userStatusPromise = userStatusService.getCachedUserStatusArray();
    let userGenderPromise = userGenderService.getCachedUserGenderArray();
    let validationStatusPromise = validationStatusService.getCachedValidationStatusArray();

    let [
            response,
            userRoleArray,
            userStatusArray,
            userGenderArray,
            validationStatusArray
        ] = await Promise.all(
            [
                responsePromise,
                userRolePromise,
                userStatusPromise,
                userGenderPromise,
                validationStatusPromise
            ]
            );

    let { hasMorePage } = getHasMorePage( response.totalCount, page, limit );

    return reply.send(
        {
            profileArray : response.profileArray,
            hasMorePage,
            userRoleArray,
            userStatusArray,
            userGenderArray,
            validationStatusArray
        }
        );
}

// ~~

async function updateProfile(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { profile: updatedProfile } = body;

    if ( isNullOrUndefined( updatedProfile ) )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthorized-error-message', 401 );
    }

    let hasSetAndListUserPermission = await hasAllUserPermissions( [ 'set-user', 'list-user' ], profile.roleSlugArray );

    if ( !hasSetAndListUserPermission )
    {
        throw new AppError( 'unauthorized-message-error', 403 );
    }

    let profileId = request.params.profileId;

    let response =
        await profileService
            .setProfileById(
                {
                    aboutDescription: updatedProfile.aboutDescription,
                    addressLine1: updatedProfile.addressLine1,
                    addressLine2: updatedProfile.addressLine2,
                    cityCode: updatedProfile.cityCode,
                    cityName: updatedProfile.cityName,
                    countryCode: updatedProfile.countryCode,
                    creationTimestamp: updatedProfile.creationTimestamp,
                    currencyCode: updatedProfile.currencyCode,
                    email: updatedProfile.email,
                    emailValidationStatusId: updatedProfile.emailValidationStatusId,
                    favoritePropertyId: updatedProfile.favoritePropertyId,
                    firstName: updatedProfile.firstName,
                    genderId: updatedProfile.genderId,
                    governmentId: updatedProfile.governmentId,
                    governmentIdValidationStatusId: updatedProfile.governmentIdValidationStatusId,
                    imagePath: updatedProfile.imagePath,
                    languageTag: updatedProfile.languageTag,
                    languageTagArray: updatedProfile.languageTagArray,
                    lastName: updatedProfile.lastName,
                    legalName: updatedProfile.legalName,
                    mangopayUserId: updatedProfile.mangopayUserId,
                    phoneNumber: updatedProfile.phoneNumber,
                    phoneNumberValidationStatusId: updatedProfile.phoneNumberValidationStatusId,
                    phonePrefix: updatedProfile.phonePrefix,
                    roleSlugArray: updatedProfile.roleSlugArray,
                    statusId: updatedProfile.statusId,
                    updateTimestamp: updatedProfile.updateTimestamp,
                    userId: updatedProfile.userId,
                    birthDate: updatedProfile.birthDate,
                    backgroundImagePath: updatedProfile.backgroundImagePath
                },
                profileId
                );

    return reply.send(
        {
            profile : response
        }
        );
}

// ~~

async function getProfileByUserId(
    request,
    reply
    )
{
    let { profileLogged } = request;

    if ( isNullOrUndefined( profileLogged ) )
    {
        throw new AppError( 'unauthenticated-message-error', 401 );
    }

    let hasListUserPermission = await hasUserPermission( 'list-user', profileLogged.roleSlugArray );

    if ( !hasListUserPermission )
    {
        throw new AppError( 'unauthorized-message-error', 403 );
    }

    let userId = request.params.userId;
    let profilePromise = profileService.getProfileByUserId( userId );
    let userRolePromise = userRoleService.getCachedUserRoleArray();
    let userStatusPromise = userStatusService.getCachedUserStatusArray();
    let userGenderPromise = userGenderService.getCachedUserGenderArray();
    let validationStatusPromise = validationStatusService.getCachedValidationStatusArray();

    let [
            profile,
            userRoleArray,
            userStatusArray,
            userGenderArray,
            validationStatusArray
        ] = await Promise.all(
            [
                profilePromise,
                userRolePromise,
                userStatusPromise,
                userGenderPromise,
                validationStatusPromise
            ]
            );

    if ( !profile )
    {
        throw new AppError( 'profile-not-found', 404 );
    }

    return reply.send(
        {
            profile,
            userRoleArray,
            userStatusArray,
            userGenderArray,
            validationStatusArray
        }
        );
}

export
{
    getProfileArray,
    updateProfile,
    getProfileByUserId
}
