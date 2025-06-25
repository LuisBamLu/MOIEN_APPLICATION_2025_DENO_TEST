// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { leaseContractService } from '../../../service/lease_contract_service';
import { leaseStatusService } from '../../../service/lease_status_service';
import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';
import { getUniqueValues, hasAllUserPermissions, hasUserPermission, isNullOrUndefined } from '../../../base';
import { leaseSignatoryService } from '../../../service/lease_signatory_service';

// -- FUNCTIONS

async function getLeaseContractManager(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { page = 1, limit = 15 } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let { leaseContractArray, leaseContractCount } =
        await leaseContractService.getLeaseContractArray( page, limit, filterArray );
    let leaseStatusArray = await leaseStatusService.getCachedLeaseStatusArray();

    let
        [
            tenantUserProfileIdArray,
            lessorUserProfileIdArray,
            userIdArray,
            propertyIdArray
        ] =
        [
            'tenantUserProfileId',
            'lessorUserProfileId',
            'userId',
            'propertyId'
        ].map( ( key ) => getUniqueValues( leaseContractArray, key ) );

    let userIdSet = new Set(
        [
            ...tenantUserProfileIdArray,
            ...lessorUserProfileIdArray,
            ...userIdArray,
        ]
        );
    let propertyIdSet = new Set( propertyIdArray );

    let profileArray = await profileService.getProfileArrayByUserIdArray( Array.from( userIdSet ) );
    let propertyArray = await propertyService.getPropertyArrayByIdArray( Array.from( propertyIdSet ) );

    return reply.send( { leaseContractArray, leaseStatusArray, profileArray, propertyArray } );
}

// ~~

async function setLeaseContractManager(
    request,
    reply
    )
{
    let { leaseContractId } = request.params;
    let body = getJsonObject( request.body );
    let { leaseContractData } = body;

    if ( !leaseContractId || !leaseContractData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetLeaseContractPermission = await hasUserPermission( 'set-lease-contract', profile.roleSlugArray );

    if ( !hasSetLeaseContractPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await leaseContractService.setLeaseContractById(
        {
            adultCount: leaseContractData.adultCount,
            agencyFee: leaseContractData.agencyFee,
            childrenCount: leaseContractData.childrenCount,
            currencyCode: leaseContractData.currencyCode,
            description: leaseContractData.description,
            endingDate: leaseContractData.endingDate,
            guaranteeAmount: leaseContractData.guaranteeAmount,
            hasBankGuarantee: leaseContractData.hasBankGuarantee,
            hasPet: leaseContractData.hasPet,
            infantCount: leaseContractData.infantCount,
            lessorNoticePeriod: leaseContractData.lessorNoticePeriod,
            lessorUserProfileId: leaseContractData.lessorUserProfileId,
            monthlyFee: leaseContractData.monthlyFee,
            monthlyRent: leaseContractData.monthlyRent,
            propertyId: leaseContractData.propertyId,
            requiresRepaint: leaseContractData.requiresRepaint,
            startingDate: leaseContractData.startingDate,
            status: leaseContractData.status,
            tenantNoticePeriod: leaseContractData.tenantNoticePeriod,
            tenantUserProfileId: leaseContractData.tenantUserProfileId,
            userId: leaseContractData.userId,
            yearlyTax: leaseContractData.yearlyTax
        },
        leaseContractId,
        );

    return reply.send( { message: 'lease-contract-updated-message' } );
}

// ~~

async function deleteLeaseContractManager(
    request,
    reply
    )
{
    let { leaseContractId } = request.params;

    if ( !leaseContractId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveLeaseContractAndSignatoryPermission = await hasAllUserPermissions(
        [
            'remove-lease-contract',
            'remove-lease-signatory'
        ],
        profile.roleSlugArray
        );

    if ( !hasRemoveLeaseContractAndSignatoryPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await leaseSignatoryService.removeLeaseSignatoryByContractId( leaseContractId );
    await leaseContractService.removeLeaseContractById( leaseContractId );

    return reply.send( { message: 'lease-contract-deleted-message' } );
}

// -- VARIABLES

export
{
    getLeaseContractManager,
    setLeaseContractManager,
    deleteLeaseContractManager
}
