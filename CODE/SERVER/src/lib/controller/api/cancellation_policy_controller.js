// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { cancellationPolicyService } from '../../service/cancellation_policy_service';
import { AppError } from '../../app_error';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../base';

// -- FUNCTIONS

export async function getCancellationPolicyById(
    request,
    reply
    )
{
    return (
        {
            cancellationPolicy : await cancellationPolicyService.getCancellationPolicyById( request.params.id )
        }
        );
}

// ~~

export async function getAllCancellationPolicy(
    request,
    reply
    )
{
    return (
        {
            cancellationPolicyArray : await cancellationPolicyService.getCachedCancellationPolicyArray()
        }
        );
}

// ~~

export async function setCancellationPolicy(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let cancellationPolicyData = body;
    let cancellationPolicyId = request.params.id;

    if ( !cancellationPolicyData || !cancellationPolicyId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetCancellationPolicyPermission = await hasUserPermission( 'set-cancellation-policy', profile.roleSlugArray );

    if ( !hasSetCancellationPolicyPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let cancellationPolicyAlreadyExists =
        await cancellationPolicyService.getCancellationPolicyById( cancellationPolicyId );

    if ( !cancellationPolicyAlreadyExists )
    {
        throw new AppError( 'not-found', 404 );
    }

    await cancellationPolicyService.setCancellationPolicy(
        {
            number: cancellationPolicyData.number,
            name: cancellationPolicyData.name,
            partialRefundMinimumDayCount: cancellationPolicyData.partialRefundMinimumDayCount,
            partialRefundRatio: cancellationPolicyData.partialRefundRatio,
            fullRefundMinimumDayCount: cancellationPolicyData.fullRefundMinimumDayCount,
            penaltyDayCount: cancellationPolicyData.penaltyDayCount
        },
        cancellationPolicyId
    );

    return reply.send( { message: 'cancellation-policy-updated-message' } );
}

// ~~

export async function removeCancellationPolicy(
    request,
    reply
    )
{
    let cancellationPolicyId = request.params.id;

    if ( !cancellationPolicyId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveCancellationPolicyPermission = await hasUserPermission( 'remove-cancellation-policy', profile.roleSlugArray );

    if ( !hasRemoveCancellationPolicyPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let cancellationPolicyAlreadyExists =
        await cancellationPolicyService.getCancellationPolicyById( cancellationPolicyId );

    if ( !cancellationPolicyAlreadyExists )
    {
        throw new AppError( 'not-found', 404 );
    }

    await cancellationPolicyService.removeCancellationPolicy( cancellationPolicyId );

    return reply.send( { message: 'cancellation-policy-deleted-message' } );
}

// ~~

export async function addCancellationPolicy(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let cancellationPolicyData = body;

    if ( !cancellationPolicyData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddCancellationPolicyPermission = await hasUserPermission( 'add-cancellation-policy', profile.roleSlugArray );

    if ( !hasAddCancellationPolicyPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let cancellationPolicyId = getTextSlug( cancellationPolicyData.name );

    await cancellationPolicyService.addCancellationPolicy(
        {
            id: cancellationPolicyId,
            number: cancellationPolicyData.number,
            name: cancellationPolicyData.name,
            partialRefundMinimumDayCount: cancellationPolicyData.partialRefundMinimumDayCount,
            partialRefundRatio: cancellationPolicyData.partialRefundRatio,
            fullRefundMinimumDayCount: cancellationPolicyData.fullRefundMinimumDayCount,
            penaltyDayCount: cancellationPolicyData.penaltyDayCount,
        }
        );

    return reply.send( { message: 'cancellation-policy-created-message' } );
}
