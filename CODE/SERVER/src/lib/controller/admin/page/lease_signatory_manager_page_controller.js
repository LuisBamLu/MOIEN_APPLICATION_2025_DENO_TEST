// -- IMPORTS

import { leaseSignatoryService } from '../../../service/lease_signatory_service';
import { employmentStatusService } from '../../../service/employment_status_service';
import { profileService } from '../../../service/profile_service';
import { companyTypeService } from '../../../service/company_type_service';
import { getJsonObject } from 'senselogic-gist';
import { AppError } from '../../../utils/app_error';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { leaseContractService } from '../../../service/lease_contract_service';

// -- FUNCTIONS

async function getLeaseSignatoryManager(
    request,
    reply
    )
{
    let body = request.body;
    let { page = 1, limit = 15 } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let [ { leaseSignatoryArray, totalCount }, employmentStatusArray, companyTypeArray ] = await Promise.all(
        [
            leaseSignatoryService.getLeaseSignatoryArray( page, limit, filterArray ),
            employmentStatusService.getCachedEmploymentStatusArray(),
            companyTypeService.getCachedCompanyTypeArray()
        ]
        );
    let [ userIdArray, contractIdArray ] = [ 'userId', 'contractId' ].map( ( key ) => getUniqueValues( leaseSignatoryArray, key ) );
    let { hasMorePage } = getHasMorePage( totalCount, page, limit );

    let profileArray = await profileService.getProfileArrayByUserIdArray( userIdArray );
    let contractArray = await leaseContractService.getContractArrayByContractIdArray( contractIdArray );

    return reply.status( 200 ).send(
        {
            leaseSignatoryArray,
            employmentStatusArray,
            companyTypeArray,
            profileArray,
            contractArray,
            hasMorePage
        }
        );
}

async function setLeaseSignatoryManager(
    request,
    reply
    )
{
    let { leaseSignatoryId } = request.params;
    let body = getJsonObject( request.body );
    let { leaseSignatoryData } = body;

    if ( !leaseSignatoryId || !leaseSignatoryData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetLeaseSignatoryPermission = await hasUserPermission( 'set-lease-signatory', profile.roleSlugArray );

    if ( !hasSetLeaseSignatoryPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await leaseSignatoryService.setLeaseSignatoryById(
        {
            id: leaseSignatoryData.id,
            contractId: leaseSignatoryData.contractId,
            genderId: leaseSignatoryData.userProfile.genderId,
            firstName: leaseSignatoryData.userProfile.firstName,
            lastName: leaseSignatoryData.userProfile.lastName,
            birthDate: leaseSignatoryData.birthDate,
            addressLine1: leaseSignatoryData.addressLine1,
            addressLine2: leaseSignatoryData.addressLine2,
            cityCode: leaseSignatoryData.cityCode,
            cityName: leaseSignatoryData.cityName,
            countryCode: leaseSignatoryData.countryCode,
            monthlyIncome: leaseSignatoryData.monthlyIncome,
            employmentStatus: leaseSignatoryData.employmentStatus,
            hasDeposit: leaseSignatoryData.hasDeposit,
            depositAmount: leaseSignatoryData.depositAmount,
            hasGuarantor: leaseSignatoryData.hasGuarantor,
            isMandated: leaseSignatoryData.isMandated,
            companyName: leaseSignatoryData.companyName,
            companyTypeId: leaseSignatoryData.companyTypeId,
            companyRegistrationNumber: leaseSignatoryData.companyRegistrationNumber,
            userId: leaseSignatoryData.userId
        },
        leaseSignatoryId
        );

    return reply.send( { message: 'lease-signatory-updated-message' } );
}

async function deleteLeaseSignatoryManager(
    request,
    reply
    )
{
    let { leaseSignatoryId } = request.params;

    if ( !leaseSignatoryId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveLeaseSignatoryPermission = await hasUserPermission( 'remove-lease-signatory', profile.roleSlugArray );

    if ( !hasRemoveLeaseSignatoryPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await leaseSignatoryService.removeLeaseSignatoryById( leaseSignatoryId );

    return reply.send( { message: 'lease-signatory-deleted-message' } );
}

export
{
    getLeaseSignatoryManager,
    setLeaseSignatoryManager,
    deleteLeaseSignatoryManager
}
