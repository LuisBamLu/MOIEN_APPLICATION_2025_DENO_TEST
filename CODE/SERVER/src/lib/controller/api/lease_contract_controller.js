// -- IMPORTS

import { getLocalizedText, getRandomTuid, isArray } from 'senselogic-gist';
import { leaseContractService } from '../../service/lease_contract_service';
import { leaseSignatoryService } from '../../service/lease_signatory_service';
import { documentService } from '../../service/document_service';
import { notificationService } from '../../service/notification_service';
import { propertyService } from '../../service/property_service';
import { profileService } from '../../service/profile_service';
import { notificationCenterService } from '../../service/notification_center_service';

// -- FUNCTIONS

export async function updateLeaseContract(
    request,
    reply
    )
{
    let leaseContractId = request.params.id;
    let body = JSON.parse( request.body );
    let leaseContract = body.leaseContract;
    let leaseSignatoryArray = [];
    let currentLeaseContract = await leaseContractService.getLeaseContractById( leaseContractId );

    if ( body.type === 'propose lease contract'
         && currentLeaseContract.propertyId
         && currentLeaseContract.propertyId !== leaseContract.propertyId )
    {
        leaseContract.id = getRandomTuid();
        leaseContract.userId = leaseContract.tenantUserProfileId;
        await leaseContractService.addLeaseContract( leaseContract );
        let leaseSignatoryArray
            = await leaseSignatoryService.getLeaseSignatoryArrayByUserIdAndContractId(
                leaseContract.tenantUserProfileId,
                leaseContractId
                );

        for ( let leaseSignatory of leaseSignatoryArray )
        {
            leaseSignatory.id = getRandomTuid();
            leaseSignatory.contractId = leaseContract.id;
            leaseSignatory.depositAmount = null;
        }

        leaseSignatoryArray = await leaseSignatoryService.addLeaseSignatory( leaseSignatoryArray );
        let [ property, profile ]
            = await Promise.all(
                [
                    propertyService.getPropertyById( leaseContract.propertyId ),
                    profileService.getProfileByUserId( leaseContract.tenantUserProfileId )
                ]
                );
        notificationService.sendTemplateNotification(
            'host-proposed-lease',
            {
                profile: profile,
                propertyName: getLocalizedText( property.title, profile.languageTag ),
                leaseContractPageLink:
                    request.headers.origin
                    + '/dashboard/edit-lease-contract/'
                    + leaseContract.id
            }
            );

        return reply.status( 200 ).send( { leaseContract, leaseSignatoryArray } );
    }

    if ( request.profileLogged.userId === leaseContract.tenantUserProfileId )
    {
        let documentArray
            = await documentService.getDocumentArrayByUserIdAndTypeIdArray(
                request.profileLogged.userId,
                leaseContract.requiredDocumentTypeIdArray ?? [ 'id-card' ]
                );
        let documentIdSet = new Set();

        for ( let document of documentArray )
        {
            documentIdSet.add( document.id );
        }

        if ( isArray( leaseContract.documentIdArray ) )
        {
            for ( let currentDocumentId of leaseContract.documentIdArray )
            {
                if ( documentIdSet.has( currentDocumentId ) )
                {
                    documentIdSet.delete( currentDocumentId );
                }
            }

            leaseContract.documentIdArray.push( ...Array.from( documentIdSet ) );
        }
        else
        {
            leaseContract.documentIdArray = Array.from( documentIdSet );
        }
    }

    leaseContract = await leaseContractService.setLeaseContractById( leaseContract, leaseContractId );
    let currentSignatoryArray
        = await leaseSignatoryService.getLeaseSignatoryArrayByUserIdAndContractId(
            request.profileLogged.userId,
            leaseContractId
            );
    let deprecatedSignatoryIdSet = new Set();

    for ( let currentSignatory of currentSignatoryArray )
    {
        deprecatedSignatoryIdSet.add( currentSignatory.id );
    }

    if ( body.signatoryArray )
    {
        for ( let signatory of body.signatoryArray )
        {
            if ( !signatory.id )
            {
                signatory.id = getRandomTuid();
            }

            signatory.userId = request.profileLogged.userId;
            signatory.contractId = leaseContractId;
            delete signatory.currency;

            if ( deprecatedSignatoryIdSet.has( signatory.id ) )
            {
                deprecatedSignatoryIdSet.delete( signatory.id );
            }
        }

        await leaseSignatoryService.removeLeaseSignatoryByIdArray( Array.from( deprecatedSignatoryIdSet ) );
        await leaseSignatoryService.upsertLeaseSignatoryArray( body.signatoryArray );

        if ( body.otherSignatoryArray )
        {
            await leaseSignatoryService.upsertLeaseSignatoryArray( body.otherSignatoryArray );
        }
    }

    leaseSignatoryArray = await leaseSignatoryService.getLeaseSignatoryArrayByContractId( leaseContract.id );

    if ( leaseContract.status === 'signed' )
    {
        notificationCenterService.addNotification(
            {
                id: getRandomTuid(),
                notificationType: 'appointment-reminder',
                message:
                    'The tenant has signed the lease contract '
                    + `<a href="/dashboard/ads/lease-contract/${ leaseContract.id }">Click Here</a> `
                    + 'for details',
                userId: leaseContract.lessorUserProfileId,
                isRead: false
            }
            );
    }

    return reply.status( 200 ).send( { leaseContract, leaseSignatoryArray } );
}
