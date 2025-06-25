// -- IMPORTS

import { authentificationService } from '../../../service/authentification_service';
import { profileService } from '../../../service/profile_service';
import { getCurrentLocalDateTime, getJsonObject, getLocalizedText, getRandomTuid, getRandomUuid } from 'senselogic-gist';
import { supabaseService } from '../../../service/supabase_service';
import { userService } from '../../../service/user_service';
import { connectionService } from '../../../service/connection_service';
import { getBackoffSecondCount, getCurrentTimestamp, getTimestampFromDateTime, hasAnyUserRole, isNullOrUndefined } from '../../../base';
import { betaApplicantService } from '../../../service/beta_applicant_service';
import { notificationService } from '../../../service/notification_service';
import { databaseService } from '../../../service/database_service';
import { AppError } from '../../../app_error';
import { notificationCenterService } from '../../../service/notification_center_service';
import { hubspotService } from '../../../service/hubspot_service';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import fastifyCookie from '@fastify/cookie';
import { mangopayService } from '../../../service/mangopay_service';

// -- FUNCTIONS

async function requestToken(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let profile = await profileService.getProfileByEmail( body.email );

    if ( !profile )
    {
        return reply.status( 400 ).send( { error: 'auth-email-inexistent-error-message' } );
    }

    let result = await authentificationService.signInUser( body.email );

    if ( result.error )
    {
        return reply.status( 500 ).send( { error: 'auth-sign-in-failed' } );
    }
    else
    {
        return reply.status( 200 ).send( { message: 'auth-sign-in-enter-token' } )
    }
}

// ~~

async function authRegisterProfile(
    session
    )
{
    let fullNamePartArray = session.user.user_metadata.full_name.split(' ');
    let firstName = fullNamePartArray.shift();
    let lastName = fullNamePartArray.join(' ');
    let profile =
        {
            id: getRandomUuid(),
            userId: session.user.id,
            firstName: firstName,
            lastName: lastName,
            email: session.user.email,
            imagePath: '/image/profile/default.png',
            emailValidationStatusId: 'verified',
            roleId: 'guest',
            statusId: 'active'
        };

    await profileService.addProfile( profile );
    await hubspotService.addContact(
        {
            email: profile.email,
            firstname: profile.firstName,
            lastname: profile.lastName,
            lifecyclestage: 'customer'
        }
        );

    return profile;
}

// ~~

async function openAuth(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let { redirectionToUrl, provider } = request.body;

    try
    {
        let client = supabaseService.getClient();

        let { data, error } = await client.auth.signInWithOAuth(
            {
                provider,
                options: { redirectTo: redirectionToUrl }
            }
            );

        if ( data.url )
        {
            let url = data.url;

            return reply.code( 200 ).send( { url } );
        }

        // let { user, session, error } =
        //     await supabaseService.getClient()
        //         .auth.setSession(
        //             { access_token: accessToken }
        //             );

        if ( error )
        {
            if ( session === null || session === undefined )
            {
                return reply.code( 400 ).send( { error } );
            }
            else
            {
                let profile = await authRegisterProfile( session );
                return reply.code( 200 ).send( { profile } );
            }
        }
        // else
        // {
        //     return reply.code( 400 ).send( { error: error } );
        // }
    }
    catch ( error )
    {
        return reply.code( 500 ).send(
            {
                error: 'Server error', details: error
            }
            );
    }
}

// ~~

async function authCallback(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let authTokenCodeVerifier = supabaseService.getAuthToken();
    let serializedCookie = supabaseService.getSerializedCookie();
    await client.auth.storage.setItem(  `${ client.storageKey }-code-verifier`, authTokenCodeVerifier );

    request.headers = { 'Set-Cookie': serializedCookie };
    request.headers.cookie = authTokenCodeVerifier;
    request.cookies = authTokenCodeVerifier;

    let code = request.body.code;
    let route = request.body.route ?? '/';

    try
    {
        if ( code )
        {
            let { data, error } =
                await supabaseService.getClient().auth.exchangeCodeForSession( code );

            // const supabase =
            //     createServerClient(
            //         process.env.MOIEN_DATABASE_URL,
            //         process.env.MOIEN_DATABASE_KEY,
            //         {
            //             cookies:
            //             {
            //                 getAll()
            //                 {
            //                     return parseCookieHeader( request.headers.cookie ?? '' );
            //                 },
            //                 setAll( cookiesToSet )
            //                 {
            //                     cookiesToSet.forEach(
            //                         ( { name, value, options } ) =>
            //                         {
            //                             let serializedCookie = serializeCookieHeader( name, value, options );

            //                             reply.header( 'set-cookie', serializedCookie );
            //                         }
            //                         );
            //                 }
            //             }
            //         }
            //         );

            // let { data, error } = await supabase.auth.exchangeCodeForSession( code );

            if ( error )
            {
                return reply.code( 400 ).send(
                    {
                        success: false,
                        error: error.message
                    }
                    );
            }
            else if ( data.session !== null && data.session !== undefined )
            {
                let profile = await authRegisterProfile( data.session );

                return reply.code( 200 ).send(
                    {
                        success: true,
                        route
                    }
                    );
            }

            return reply.code( 200 ).send(
                {
                    success: true,
                    route
                }
                );
        }
        else
        {
            return reply.code( 400 ).send(
                {
                    success: false,
                    error: 'No code provided'
                }
                );
        }
    }
    catch ( error )
    {
        return reply.code( 500 ).send(
            {
                success: false,
                error: 'Server error', details: error
            }
            );
    }
}

// ~~

async function betaApply(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let data = getJsonObject( request.body );
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
            redirectTo = 'https://www.moien.com/'
        }
    }
    else
    {
        redirectTo = request.headers.origin;
    }

    let emailApplicant = await betaApplicantService.getBetaApplicantByEmail( data.email );

    if ( emailApplicant )
    {
        return reply.send( { error: 'auth-beta-email-in-use', step: 0 } );
    }

    if ( isNullOrUndefined( data.firstName )
         || isNullOrUndefined( data.lastName )
         || isNullOrUndefined( data.email ) )
    {
        throw new AppError(
            `Please provide your name, surname, and email address. All fields are required.`
            + `¨fr:Veuillez indiquer votre nom, votre prénom et votre adresse électronique. Tous les champs sont obligatoires.`
            + `¨de:Bitte geben Sie Ihren Namen, Nachnamen und Ihre E-Mail-Adresse an. Alle Felder sind erforderlich.` );
    }

    let betaApplicant =
        {
            id: getRandomTuid(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            languageCode: data.languageCode
        }

    let betaUser = await betaApplicantService.addBetaApplicant( betaApplicant );
    let contact = await hubspotService.addContact(
        {
            email: data.email,
            firstname: data.firstName,
            lastname: data.lastName,
            lifecyclestage: 'lead'
        }
        );

    if ( contact === null )
    {
        contact = await hubspotService.setContactByEmail(
            data.email,
            {
                email: data.email,
                firstname: data.firstName,
                lastname: data.lastName,
                lifecyclestage: 'lead'
            }
            );
    }

    let templateId = 'beta-subscription'
    let variableMap =
        {
            profile:
                {
                    ...betaUser,
                    languageTag: data.languageCode
                },
            betaUser,
            requirePermissionGranted: false
        }

    await notificationService.sendTemplateNotification(
        templateId,
        variableMap
        );

    return reply.send( { message: 'auth-beta-successful', step: 1 } );
}

// ~~

async function signIn(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = JSON.parse( request.body );

    if ( body.token )
    {
        let { data: { user, session }, error }
            = await authentificationService.verifyUserSignInToken( body.email, body.token );

        if ( error )
        {
            return reply.status( 401 ).send( { error: 'auth-sign-in-token-failed' } );
        }
        else
        {
            let profile = await profileService.getProfileByUserId( user.id );
            if ( !profile.addressLine1
                 || !profile.cityName
                 || !profile.countryCode )
            {
                await notificationCenterService.addNotification(
                    {
                        id: getRandomTuid(),
                        isRead: false,
                        message:
                            `Please ensure your country, city, and address information is complete by ((/en/dashboard)(clicking here)).`
                            + `¨fr:Veuillez vous assurer que les informations concernant votre pays, votre ville et votre adresse sont complètes en ((/fr/dashboard)(cliquant ici)).`
                            + `¨de:Bitte vergewissern Sie sich, dass Ihre Angaben zu Land, Stadt und Adresse vollständig sind, indem Sie ((/fr/dashboard)(hier klicken)).`,
                        notificationType: 'ads-partner',
                        userId: profile.userId
                    }
                    );
            }

            return reply.status( 200 ).send( profile );
        }
    }
    else
    {
        return reply.send( { error: 'auth-sign-in-token-failed' } );
    }
}

// ~~

async function signOut(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    await authentificationService.signOutUser();

    request.profileLogged = null;
    request.session = null;

    return reply.send( { profile: request.profileLogged } );
}

// ~~

async function checkPhoneNumberExists(
    request,
    reply
    )
{
    let data = JSON.parse( request.body );

    let phoneNumberProfile = await profileService.getProfileByPhonePrefixAndPhoneNumber( data.phonePrefix, data.phoneNumber );

    let isPhoneNumberRegistered =
        phoneNumberProfile !== null
        && phoneNumberProfile !== undefined
        && phoneNumberProfile.emailValidationStatusId === 'verified';

    if ( isPhoneNumberRegistered )
    {
        return reply.send( { error: 'auth-sign-up-phone-in-use', step: 0 } );
    }
    else
    {
        return reply.send( { message: 'phone-not-in-use', step: 1 } );
    }
}

// ~~

async function signUp(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let data = JSON.parse( request.body );
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
            redirectTo = 'https://www.moien.com/'
        }
    }
    else
    {
        redirectTo = request.headers.origin;
    }
    let phoneNumberProfile = await profileService.getProfileByPhonePrefixAndPhoneNumber( data.phonePrefix, data.phoneNumber );

    let isPhoneNumberRegistered =
        phoneNumberProfile !== null
        && phoneNumberProfile !== undefined
        && phoneNumberProfile.emailValidationStatusId === 'verified';

    if ( isPhoneNumberRegistered )
    {
        return reply.send( { error: 'auth-sign-up-phone-in-use', step: 0 } );
    }

    let emailProfile = await profileService.getProfileByEmail( data.email );
    let isEmailRegistered = emailProfile && emailProfile.emailValidationStatusId === 'verified';

    if ( isEmailRegistered )
    {
        return reply.send( { error: 'auth-sign-up-email-in-use', step: 1 } );
    }

    let profile =
        {
            id: getRandomUuid(),
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            phonePrefix: data.phonePrefix,
            email: data.email,
            phoneNumberValidationStatusId: 'pending',
            governmentIdValidationStatusId: 'pending',
            emailValidationStatusId: 'pending',
            roleSlugArray: [ 'guest' ],
            statusId: 'active',
            currencyCode: 'EUR'
        };

    if ( !phoneNumberProfile && !emailProfile )
    {
        await profileService.addProfile( profile );
        await hubspotService.addContact(
            {
                email: profile.email,
                firstname: profile.firstName,
                lastname: profile.lastName,
                lifecyclestage: 'customer'
            }
            );

        let result = await authentificationService.signUpUser( data.email, data.password, redirectTo );

        if ( result.error )
        {
            return reply.send( { error: 'auth-sign-up-failed', step: 1 } );
        }
    }
    else
    {
        delete profile.id;
        await profileService.setProfileById( profile, emailProfile.id );
        await hubspotService.setContactByEmail(
            profile.email,
            {
                email: profile.email,
                firstname: profile.firstName,
                lastname: profile.lastName,
                lifecyclestage: 'customer'
            }
            );
    }

    return reply.send( { message: 'auth-sign-up-successful', step: 2 } );
}

// ~~

async function verifySignUp(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let { token_hash, type } = request.query;

    if ( token_hash && type )
    {
        let { session } = await authentificationService.verifyUserSignUp( token_hash );
        let user = session?.user;

        if ( !user )
        {
            return reply.code( 500 ).send( 'something went wrong when verifying your sign up' );
        }

        await profileService.verifyProfileEmail( user.email, user.id );
        let profile = await profileService.getProfileByUserId( user.id );
        await notificationService.setDefaultNotificationPermissionByUserId( user.id );

        return reply.send( profile );
    }
}

// ~~

async function confirmEmailChange(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let tokenHash = request.query.token_hash;
    let type = request.query.type;
    let { user } = await userService.confirmUserEmailChange( tokenHash, type );

    if ( user )
    {
        let profile = profileService.setProfileByUserId( { email: user.email }, user.id );

        if ( profile.addressLine1
             && profile.cityName
             && profile.countryCode
             && profile.birthDate
             && profile.phonePrefix
             && profile.phoneNumber
             && profile.mangopayUserId )
        {
            let mangopayUser = await mangopayService.setUserFromProfile( profile );
        }

        return reply.status( 200 ).send( { email: profile.email } );
    }
    else
    {
        return reply.status( 500 ).send( { error: 'Something went wrong' } );
    }
}

// ~~

async function signInWithPassword(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let connectionExists = await connectionService.getConnectionByBrowserAddress( request.ip );

    try
    {
        const { email, password } = getJsonObject( request.body );

        // if ( shouldRetryAdminConnection( connectionExists ) )
        // {
        //     await updateAdminFailedConnection( connectionExists );

        //     return reply.code( 400 ).send( { error: 'admin-auth-sign-in-failed' } );
        // }

        if ( !email || !password )
        {
            await updateAdminFailedConnection( connectionExists );

            return reply.code( 400 ).send( { error: 'admin-auth-sign-in-failed' } );
        }

        let authUser = await authentificationService.signInWithPassword( email, password );

        if ( !authUser || !authUser.user )
        {
            await updateAdminFailedConnection( connectionExists );

            return reply.code( 400 ).send( { error: 'admin-auth-sign-in-failed' } );
        }

        let profile = await profileService.getProfileByUserId( authUser.user.id );

        let isUserAdmin = await hasAnyUserRole(
            [
                'administrator',
                'backoffice',
                'backoffice-senior',
                'agency'
            ],
            profile.roleSlugArray
            );

        // if ( !isUserAdmin )
        // {
        //     updateAdminFailedConnection( connectionExists );

        //     return reply.code( 400 ).send( { error: 'admin-auth-sign-in-failed' } );
        // }

        // await connectionService.deleteConnection( request.ip );

        await updateAdminSuccessConnection( connectionExists );

        let { access_token, refresh_token } = authUser;

        await supabaseService.getClient().auth.setSession( { access_token, refresh_token } );

        return reply.send(
            {
                profile
            }
            );
    }
    catch ( error )
    {
        updateAdminFailedConnection( connectionExists );

        return reply.code( 500 ).send( { error } );
    }
}

// ~~

async function sendResetPasswordLink(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = getJsonObject( request.body );
    let { email } = body;
    let redirectTo = request.headers.origin + '/admin/reset-password';

    const { data, error } = await databaseService.getClient()
        .auth
        .resetPasswordForEmail(
            email,
            {
                redirectTo
            }
            );

    return reply.send( data );
}

// ~~

async function resetPassword(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = getJsonObject( request.body );
    let { password, confirmPassword } = body;
    let { code } = request.query;

    if ( code === null || code === undefined )
    {
        throw new AppError( 'missing-code' );
    }

    if ( password !== confirmPassword )
    {
        throw new AppError( 'does-not-match-password' );
    }

    let client = await databaseService.getClient();
    await client
        .auth
        .exchangeCodeForSession( code );

    let { data, error } = await client
        .auth
        .updateUser(
            {
                password
            }
            );

    if ( error !== null )
    {
        throw new AppError( error.message, error.status );
    }

    let profile = await profileService.getCachedProfileByUserId( data.user.id );
    let hasPermissionToLogin = await hasAnyUserRole(
        [
            'agency',
            'administrator',
            'backoffice',
            'backoffice-senior'
        ],
        profile.roleSlugArray
        );

    if ( !hasPermissionToLogin )
    {
        await authentificationService.signOutUser();
        request.profileLogged = null;
        request.session = null;

        throw new AppError( 'unauthorized-error-message', 403 );
    }

    request.profileLogged = profile;
    client.auth.getUser();
    return reply.send( { profile } );
}

// ~~

function shouldRetryAdminConnection(
    connection
    )
{
    let backoffSecondCount =
        getBackoffSecondCount( connection.attemptCount, 3, 8 ) -
        ( getCurrentTimestamp() - getTimestampFromDateTime( connection.dateTime ) );

    return backoffSecondCount > 0;
}

// ~~

async function updateAdminFailedConnection(
    connection
    )
{
     await connectionService.setConnection(
        {
            ...connection,
            isFailed: true,
            attemptCount: connection.attemptCount + 1,
            dateTime: getCurrentLocalDateTime()
        }
        );
}

// ~~

async function updateAdminSuccessConnection(
    connection
    )
{
     await connectionService.setConnection(
        {
            ...connection,
            isFailed: false,
            attemptCount: 0,
            dateTime: getCurrentLocalDateTime()
        }
        );
}

// -- EXPORT

export
{
    betaApply,
    signIn,
    checkPhoneNumberExists,
    signUp,
    signOut,
    requestToken,
    openAuth,
    authCallback,
    verifySignUp,
    confirmEmailChange,
    signInWithPassword,
    shouldRetryAdminConnection,
    updateAdminFailedConnection,
    updateAdminSuccessConnection,
    sendResetPasswordLink,
    resetPassword
}
