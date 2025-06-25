// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getFormattedPrice, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { hasUserPermission } from './profileStore';
import { toast } from '$lib/toast';
import { getJsonText, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
import { cityArrayStore } from './cityArrayStore';
import { countryArrayStore } from './countryArrayStore';
import { urlParamsStore } from './urlParamsStore';
import { languageTagStore } from './languageTagStore';

// -- VARIABLES

export let errorMessage = writable( null );
export let isLeaseSignatoryLoading = writable( true );
export let isLeaseSignatoryModalOpen = writable( false );
export let profileArrayStore = writable( [] );
export let leaseSignatoryArrayStore = writable( [] );
export let selectedLeaseSignatoryStore = writable( getInitialState() );
export let employmentStatusArrayStore = writable( null );
export let companyTypeArrayStore = writable( [] );
export let contractArrayStore = writable( [] );
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
let url = '/api/admin/page/lease-signatory';

// -- FUNCTIONS

export async function loadLeaseSignatoryArray(
    page = 1,
    limit = 15
    )
{
    isLeaseSignatoryLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
            );

        let leaseSignatoryArray = [];

        for ( let leaseSignatory of response.leaseSignatoryArray )
        {
            let profile = response.profileArray.find( ( profile ) => profile.userId === leaseSignatory.userId );
            let employmentStatus = response.employmentStatusArray.find( ( status ) => status.id === leaseSignatory.employmentStatus );
            let companyType = response.companyTypeArray.find( ( companyType ) => companyType.id === leaseSignatory.companyTypeId );
            let country = response.contractArray.find( ( country ) => country.code === leaseSignatory.countryCode );
            let contract = response.contractArray.find( ( contract ) => contract.id === leaseSignatory.contractId );
            leaseSignatory.user = profile ? `${ profile.firstName } ${ profile.lastName }` : 'Unknown';
            leaseSignatory.employmentStatusId = employmentStatus ? getLocalizedText( employmentStatus.name, get( languageTagStore ) ) : 'Unknown';
            leaseSignatory.companyType = companyType ? getLocalizedText( companyType.name, get( languageTagStore ) ) : 'Unknown';
            leaseSignatory.country = country ? getLocalizedText( country.name ) : 'Unknown';
            leaseSignatory.city = getLocalizedText( ( leaseSignatory.cityName ?? '' ), get( languageTagStore ) );
            leaseSignatory.birthDate
                = leaseSignatory.birthDate
                ? new Date( leaseSignatory.birthDate ).toLocaleDateString( get( languageTagStore ), { dateStyle: 'short' } )
                : null;
            leaseSignatory.formattedMonthlyIncome = getFormattedPrice( leaseSignatory.monthlyIncome || 0 );
            leaseSignatory.formattedDepositAmount = getFormattedPrice( leaseSignatory.depositAmount || 0 );
            leaseSignatory.name = ( leaseSignatory.firstName ?? '' ) + ' ' + ( leaseSignatory.lastName ?? '' );
            leaseSignatory.isMandated = Boolean( leaseSignatory.isMandated );
            leaseSignatory.hasGuarantor = Boolean( leaseSignatory.hasGuarantor );
            leaseSignatory.hasDeposit = Boolean( leaseSignatory.hasDeposit );
            leaseSignatory.userProfile = profile;
            leaseSignatory.contract = contract;

            leaseSignatoryArray.push( leaseSignatory );
        }

        if ( page === 1 )
        {
            leaseSignatoryArrayStore.set(
                leaseSignatoryArray
                );
        }
        else
        {
            leaseSignatoryArrayStore.update(
                ( _leaseSignatoryArray ) => _leaseSignatoryArray.concat( leaseSignatoryArray )
                );
        }

        profileArrayStore.set(
            response.profileArray
            );

        employmentStatusArrayStore.set(
            response.employmentStatusArray
            );

        companyTypeArrayStore.set(
            response.companyTypeArray
            );

        contractArrayStore.set(
            response.contractArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isLeaseSignatoryLoading.set( false );
    }
}

// ~~

export async function handleCreateLeaseSignatory(
    finallyFunction = () => {}
    )
{
    leaseSignatoryArrayStore.set(
        await handleCreateObject(
            leaseSignatoryArrayStore,
            selectedLeaseSignatoryStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleEditLeaseSignatory(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetLeaseSignatoryPermission = hasUserPermission( 'set-lease-signatory' );

        if ( !hasSetLeaseSignatoryPermission )
        {
            return;
        }

        let leaseSignatoryData = get( selectedLeaseSignatoryStore );
        let { id : leaseSignatoryId, ...updatedLeaseSignatory } = leaseSignatoryData;

        let cityArray = get( cityArrayStore );
        let countryArray = get( countryArrayStore );
        let city = cityArray.find( ( city ) => city.id === updatedLeaseSignatory.countryCode );
        let country = countryArray.find( ( country ) => country.code === updatedLeaseSignatory.countryCode );

        selectedLeaseSignatoryStore.update(
            ( leaseSignatory ) =>
            (
            {
                ...leaseSignatory,
                countryName: country?.name,
                cityName: city?.name
            }
            )
            );

        let response = await fetchData(
            url + '/' + leaseSignatoryId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText(
                    {
                        leaseSignatoryData : updatedLeaseSignatory
                    }
                    )
            }
            );

        leaseSignatoryArrayStore.update(
            ( leaseSignatoryArray ) => leaseSignatoryArray.map(
                ( leaseSignatory ) => leaseSignatory.id === leaseSignatoryId
                    ? leaseSignatoryData
                    : leaseSignatory
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
        toggleLeaseSignatoryModal();
    }
}

// ~~

export async function handleDeleteLeaseSignatory(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasRemoveLeaseSignatoryPermission = hasUserPermission( 'remove-lease-signatory' );

        if ( !hasRemoveLeaseSignatoryPermission )
        {
            return;
        }

        let leaseSignatoryData = get( selectedLeaseSignatoryStore );
        let { id : leaseSignatoryId } = leaseSignatoryData;

        let response = await fetchData(
            url + '/' + leaseSignatoryId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        leaseSignatoryArrayStore.update(
            ( leaseSignatoryArray ) => leaseSignatoryArray.filter(
                ( leaseSignatory ) => leaseSignatory.id !== leaseSignatoryId
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
        toggleLeaseSignatoryModal();
    }
}

export function toggleLeaseSignatoryModal(
    )
{
    let isOpen = get( isLeaseSignatoryModalOpen );
    isLeaseSignatoryModalOpen.set( !isOpen );
    isOpen = get( isLeaseSignatoryModalOpen );

    if ( !isOpen )
    {
        selectedLeaseSignatoryStore.set( getInitialState() );
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
            contractId: null,
            genderId: null,
            firstName: '',
            lastName: '',
            birthDate: null,
            addressLine1: '',
            addressLine2: '',
            cityCode: '',
            cityName: '',
            countryCode: '',
            monthlyIncome: 0,
            employmentStatus: '',
            hasDeposit: null,
            depositAmount: 0,
            hasGuarantor: null,
            isMandated: null,
            companyName: '',
            companyTypeId: null,
            companyRegistrationNumber: '',
            userId: null
        }
        );
}
