// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, formatDate, getFormattedPrice, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { useConfirmationModal } from '../confirmation_modal';
import { getJsonText, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
import { toast } from '../toast';
import { hasUserPermission } from './profileStore';
import { urlParamsStore } from './urlParamsStore';
import { languageTagStore } from './languageTagStore';

// -- VARIABLES

export let errorMessage = writable( null );
export let isLeaseContractLoading = writable( true );
export let isLeaseContractModalOpen = writable( false );
export let profileArrayStore = writable( [] );
export let leaseContractArrayStore = writable( [] );
export let selectedLeaseContractStore = writable( getInitialState() );
export let propertyArrayStore = writable( [] );
export let leaseStatusArrayStore = writable( [] );
export let hasMorePage = writable( false );
export let
{
    addNavigationEventListener,
    finalizeNavigation,
    handleChange,
    interceptNavigation,
    isConfirmationModalOpen,
    isFormModified,
    pendingNavigation,
    removeNavigationEventListener,
    toggleConfirmModal
} = useConfirmationModal();
let url = '/api/admin/page/lease-contract';

// -- FUNCTIONS

export async function loadLeaseContractArray(
    page = 1,
    limit = 15
    )
{
    isLeaseContractLoading.set( true );
    let urlParam = get( urlParamsStore );

    try
    {
        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
        );

        let leaseContractArray = [];

        for ( let leaseContract of response.leaseContractArray )
        {
            let tenantProfile = response.profileArray.find( ( profile ) => profile.userId === leaseContract.tenantUserProfileId );
            let lessorProfile = response.profileArray.find( ( profile ) => profile.userId === leaseContract.lessorUserProfileId );
            let userProfile = response.profileArray.find( ( profile ) => profile.userId === leaseContract.userId );
            let property = response.propertyArray.find( ( property ) => property.id === leaseContract.propertyId );
            let status = response.leaseStatusArray.find( ( status ) => status.id === leaseContract.status );
            leaseContract.tenant = tenantProfile ? `${ tenantProfile.firstName } ${ tenantProfile.lastName }` : 'Unknown';
            leaseContract.lessor = lessorProfile ? `${ lessorProfile.firstName } ${ lessorProfile.lastName }` : 'None';
            leaseContract.propertyTitle = property ? getLocalizedText( property.title, get( languageTagStore ) ) : 'Unknown';
            leaseContract.statusName = getLocalizedText( status.name, get( languageTagStore ) );
            leaseContract.formattedStartingDate = formatDate( leaseContract.startingDate );
            leaseContract.formattedEndingDate = formatDate( leaseContract.endingDate );
            leaseContract.formattedMonthlyRent = leaseContract.monthlyRent ? getFormattedPrice( leaseContract.monthlyRent ) : 'Unknown';
            leaseContract.formattedGuaranteeAmount = getFormattedPrice( leaseContract.guaranteeAmount );
            leaseContract.property = property;
            leaseContract.tenantProfile = tenantProfile;
            leaseContract.lessorProfile = lessorProfile;
            leaseContract.userProfile = userProfile;
            leaseContract.hasPet = Boolean( leaseContract.hasPet );
            leaseContract.hasBankGuarantee = Boolean( leaseContract.hasBankGuarantee );
            leaseContract.requiresRepaint = Boolean( leaseContract.requiresRepaint );

            leaseContractArray.push( leaseContract );
        }

        if ( page === 1 )
        {
            leaseContractArrayStore.set(
                leaseContractArray
                );
        }
        else
        {
            leaseContractArrayStore.update(
                ( _leaseContractArray ) => _leaseContractArray.concat( leaseContractArray )
                );
        }

        hasMorePage.set(
            response.hasMorePage
            );

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );
        mergeStoreAndRemoveDuplicateById( propertyArrayStore, response.propertyArray );

        leaseStatusArrayStore.set(
            response.leaseStatusArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isLeaseContractLoading.set( false );
    }
}

// ~~

export async function handleCreateLeaseContract(
    finallyFunction = () => {}
    )
{
    leaseContractArrayStore.set(
        await handleCreateObject(
            leaseContractArrayStore,
            selectedLeaseContractStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleEditLeaseContract(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetLeaseContractPermission = hasUserPermission( 'set-lease-contract' );

        if ( !hasSetLeaseContractPermission )
        {
            return;
        }

        let leaseContractData = get( selectedLeaseContractStore );
        let { id : leaseContractId, ...updatedLeaseContract } = leaseContractData;

        let response = await fetchData(
            url + '/' + leaseContractId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText(
                    {
                        leaseContractData : updatedLeaseContract
                    }
                    )
            }
            );

        leaseContractArrayStore.update(
            ( leaseContractArray ) => leaseContractArray.map(
                ( leaseContract ) => leaseContract.id === leaseContractId
                    ? leaseContractData
                    : leaseContract
                )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleLeaseContractModal();
    }
}

// ~~

export async function handleDeleteLeaseContract(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasRemoveLeaseContractPermission = hasUserPermission( 'remove-lease-contract' );

        if ( !hasRemoveLeaseContractPermission )
        {
            return;
        }

        let leaseContractData = get( selectedLeaseContractStore );
        let { id : leaseContractId } = leaseContractData;

        let response = await fetchData(
            url + '/' + leaseContractId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        leaseContractArrayStore.update(
            ( leaseContractArray ) => leaseContractArray.filter(
                ( leaseContract ) => leaseContract.id !== leaseContractId
                )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleLeaseContractModal();
    }
}

export function toggleLeaseContractModal(
    )
{
    let isOpen = get( isLeaseContractModalOpen );
    isLeaseContractModalOpen.set( !isOpen );
    isOpen = get( isLeaseContractModalOpen );

    if ( !isOpen )
    {
        selectedLeaseContractStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    return (
        {
            id: null,
            propertyId: null,
            startingDate: '',
            endingDate: '',
            lessorUserProfileId: null,
            lessorNoticePeriod: null,
            tenantUserProfileId: null,
            tenantNoticePeriod: null,
            status: '',
            adultCount: 0,
            childrenCount: 0,
            infantCount: 0,
            hasPet: false,
            hasBankGuarantee: false,
            requiresRepaint: true,
            monthlyRent: 0,
            monthlyFee: null,
            yearlyTax: null,
            agencyFee: null,
            guaranteeAmount: 0,
            currencyCode: '',
            description: null,
            documentIdArray: [],
            requiredDocumentTypeIdArray: [],
            userId: null
        }
        );
}
