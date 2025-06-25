// -- IMPORTS

import { getJsonObject, getJsonText, getRandomUuid } from 'senselogic-gist';
import { mangopayService } from '../../service/mangopay_service';
import { profileService } from '../../service/profile_service';
import { userService } from '../../service/user_service';
import { authentificationService } from '../../service/authentification_service';
import { AppError } from '../../utils/app_error';
import { hasUserPermission, isDefinedAndNotNull, isNullOrUndefined } from '../../base';
import { validateDashboardProfileData } from '../../validators/profile_validator';

// -- FUNCTIONS

export async function isDataRegistered( data )
{
    let phoneNumberProfile = await profileService.getProfileByPhonePrefixAndPhoneNumber( data.phonePrefix, data.phoneNumber );
    let isPhoneNumberRegistered =
        phoneNumberProfile !== null
        && phoneNumberProfile !== undefined
        && phoneNumberProfile.emailValidationStatusId === 'verified';

    if ( isPhoneNumberRegistered )
    {
        return { error: 'auth-sign-up-phone-in-use', step: 0 };
    }

    let emailProfile = await profileService.getProfileByEmail( data.email );
    let isEmailRegistered =
        emailProfile
        && emailProfile.emailValidationStatusId === 'verified';

    if ( isEmailRegistered )
    {
        return { error: 'auth-sign-up-email-in-use', step: 1 };
    }

    return false;
}

// ~~

export async function getAllProfiles(
    request,
    reply
    )
{
    return (
        {
            profileArray: await profileService.getProfileArray()
        }
        );
}

// ~~

export async function getProfileById(
    request,
    reply
    )
{
    return (
        {
            profile : await profileService.getProfileByUserId( request.body.userId )
        }
        );
}

// ~~

export async function setProfileFavoriteProperty(
    request,
    reply
    )
{
    await profileService.setProfileById( { favoritePropertyId: request.body.favoritePropertyId }, request.body.profileId );

    return (
        {
            message: 'update-profile-update-successful'
        }
        );
}

// ~~

export async function addManyProfiles(
    request,
    reply
    )
{
    let profileArray = [];
    let newProfileArray = [];
    let redirectTo;

    if ( request.headers.origin === '' || request.headers.origin === 'http://localhost' )
    {
        if ( process.env.NODE_ENV === 'development' )
        {
            redirectTo = 'http://localhost:5173'
        }
        else if ( process.env.NODE_ENV === 'release' )
        {
            redirectTo = 'https://release.moien.com/'
        }
        else
        {
            redirectTo = 'https://moien-groupbam.koyeb.app'
        }
    }
    else
    {
        redirectTo = request.headers.origin;
    }

    for ( let profile of request.body.profileArray )
    {
        let newProfile =
            {
                id: getRandomUuid(),
                firstName: profile.firstName,
                lastName: profile.lastName,
                phoneNumber: profile.phoneNumber,
                phonePrefix: profile.phonePrefix,
                email: profile.email,
                imagePath: '/image/profile/default.png',
                phoneNumberValidationStatusId: 'pending',
                governmentIdValidationStatusId: 'pending',
                emailValidationStatusId: 'pending',
                roleId: profile.roleId,
                statusId: 'active'
            };

        profileArray.push( newProfile );
    }

    for ( let profile of profileArray )
    {
        let result = await isDataRegistered( profile );

        if ( result )
        {
            return reply.status( 401 ).send( result );
        }

        let newProfile = profileService.addProfile( profile );

        newProfileArray.push( newProfile );
    }

    await Promise.all( newProfileArray );

    let resultArray = [];

    for ( let profile of profileArray )
    {
        let result = authentificationService.signInUser( profile.email, redirectTo );

        resultArray.push( result );
    }

    resultArray = await Promise.all( resultArray );

    for ( let i = 0; i < resultArray.length; i++ )
    {
        if ( resultArray[ i ].error )
        {
            return reply.status( 401 ).send( { error: 'auth-sign-up-failed', user: profile[ i ] } );
        }
    }

    return reply.status( 200 ).send( { message: `auth-sign-up-${ profileArray.length }-users-successful` } );
}

// ~~

export async function addProfile(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    if ( !request.profileLogged )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    if ( request.profileLogged.id !== request.params.profileId )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let profileData = getJsonObject( request.body );

    if ( profileData.email )
    {
        let emailProfile = await profileService.getProfileByEmail( profileData.email );
        let isEmailRegistered =
            emailProfile
            && emailProfile.emailValidationStatusId === 'verified';

        if ( isEmailRegistered )
        {
            return { error: 'auth-sign-up-email-in-use', step: 1 };
        }

        await userService.setUserEmail( profileData.email, request.headers.origin );

        return;
    }

    let profile = await profileService.setProfileById( profileData, request.params.profileId );

    if ( profile.addressLine1
         && profile.cityName
         && profile.countryCode
         && !profile.mangopayUserId )
    {
        let mangopayProfile = await mangopayService.addUserFromProfile( profile );

        if ( mangopayProfile )
        {
            profile.mangopayUserId = mangopayProfile.Id;
            profile = await profileService.setProfileById( profile, profile.id );

            await mangopayService
                .addWallet(
                    mangopayProfile.Id,
                    profile.currencyCode ?? 'EUR',
                    `Moien ${ profile.currencyCode ?? 'EUR' } Wallet`
                    );
        }
    }

    return reply.status( 200 ).send( getJsonText( { profile } ) );
}

// ~~

export async function updateProfile(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    if ( !request.profileLogged )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    if ( request.profileLogged.id !== request.params.profileId )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let profileData = getJsonObject( request.body );

    if ( profileData.email )
    {
        let emailProfile = await profileService.getProfileByEmail( profileData.email );
        let isEmailRegistered =
            emailProfile
            && emailProfile.emailValidationStatusId === 'verified';

        if ( isEmailRegistered )
        {
            return reply.status( 409 ).send( { error: 'auth-sign-up-email-in-use' } );
        }

        await userService.setUserEmail( profileData.email, request.headers.origin );

        return reply.status( 200 ).send( { message: 'check-email-update-label' } );
    }

    let validationErrors = await validateDashboardProfileData( profileData );

    if ( validationErrors.length > 0 )
    {
        return reply.status( 400 ).send( { error: 'validation-error', validationErrors } );
    }

    let profileToSet =
        {
            genderId: profileData.genderId,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            legalName: [ profileData.firstName, profileData.lastName ].filter( Boolean ).join( ' ' ) || undefined,
            birthDate: profileData.birthDate,
            aboutDescription: profileData.aboutDescription,
            email: profileData.email,
            phonePrefix: profileData.phonePrefix,
            phoneNumber: profileData.phoneNumber,
            addressLine1: profileData.addressLine1,
            addressLine2: profileData.addressLine2,
            cityCode: profileData.cityCode,
            cityName: profileData.cityName,
            countryCode: profileData.countryCode,
            languageTag: profileData.languageTag,
            languageTagArray: profileData.languageTagArray,
            currencyCode: profileData.currencyCode,
            imagePath: profileData.imagePath,
            backgroundImagePath: profileData.backgroundImagePath
        };

    let filteredProfileData
        = Object.entries( profileToSet )
            .filter( ( [ key, value ] ) => isDefinedAndNotNull( value ) )
            .reduce( ( acc, [ key, value ] ) => ( { ...acc, [ key ]: value } ), {} );

    let profile = await profileService.setProfileById( filteredProfileData, request.params.profileId );

    if ( profile.addressLine1
         && profile.cityName
         && profile.countryCode
         && profile.birthDate
         && profile.phonePrefix
         && profile.phoneNumber )
    {
        if ( !profile.mangopayUserId )
        {
            let mangopayProfile = await mangopayService.addUserFromProfile( profile );

            if ( mangopayProfile )
            {
                profile.mangopayUserId = mangopayProfile.Id;
                profile = await profileService.setProfileById( profile, profile.id );

                await mangopayService
                    .addWallet(
                        mangopayProfile.Id,
                        profile.currencyCode ?? 'EUR',
                        `Moien ${ profile.currencyCode ?? 'EUR' } wallet`
                        );
            }
        }
        else
        {
            let mangopayUser = await mangopayService.setUserFromProfile( profile );
        }
    }

    return reply.status( 200 ).send( getJsonText( { profile } ) );
}

// ~~

export async function updateProfileImage(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    if ( !request.profileLogged )
    {
        return reply.status( 401 ).send( { error: 'auth-sign-up-email-in-use' } );
    }

    let body = getJsonObject( request.body );

    let profile = await profileService.setProfileById(
        {
            imagePath: body.profile.imagePath ?? null,
            backgroundImagePath: body.profile.backgroundImagePath ?? null
        },
        request.profileLogged.id
        );

    return reply.status( 200 ).send( profile );
}

// ~~

export async function getSimplifiedProfileArray(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-message-error', 401 );
    }

    let hasListUserPermission = await hasUserPermission( 'list-user', profile.roleSlugArray );

    if ( !hasListUserPermission )
    {
        throw new AppError( 'unauthorized-message-error', 403 );
    }

    let { searchTerm = '' } = request.query;

    let profileArray = await profileService.getSimplifiedProfileArray( searchTerm );
    let simplifiedProfileArray = profileArray.map(
        profile =>
            (
                {
                    ...profile,
                    text: [ profile.firstName, profile.lastName ].join( ' ' ),
                    value: profile.userId
                }
            )
        );

    return reply.send( simplifiedProfileArray );
}
