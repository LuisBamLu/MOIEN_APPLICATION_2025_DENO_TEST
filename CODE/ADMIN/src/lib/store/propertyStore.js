// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { hasUserPermission } from './profileStore';
import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let propertyArrayStore = writable( [] );
export let propertyTypeArrayStore = writable( [] );
export let propertyStatusArrayStore = writable( [] );
export let rentalTypeArrayStore = writable( [] );
export let heatingTypeArrayStore = writable( [] );
export let diagnosisArrayStore = writable( [] );
export let managerProfileArrayStore = writable( [] );
export let profileArrayStore = writable( [] );
export let selectedPropertyStore = writable( getInitialState() );
export let isPropertyLoading = writable( true );
export let errorMessage = writable( null );
export let isPropertyModalOpen = writable( false );
export let hasMorePropertyPagesStore = writable( true );
export let isSubmitting = writable( false );
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
let url = '/admin/api/property';

// -- FUNCTIONS

export async function loadPropertyArray(
    propertyPage = 1
    )
{
    isPropertyLoading.set( true );

    try
    {
        let urlParams = get( urlParamsStore );

        let response = await fetchData(
            url + '/list'  + '?' + urlParams.toString(),
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { propertyPage, propertyLimit: 15 } )
            }
        );

        hasMorePropertyPagesStore.set( response.hasMorePage );
        propertyTypeArrayStore.set( response.propertyTypeArray );
        rentalTypeArrayStore.set( response.rentalTypeArray );
        propertyStatusArrayStore.set( response.propertyStatusArray );
        heatingTypeArrayStore.set( response.heatingTypeArray );
        diagnosisArrayStore.set( response.diagnosisArray );

        mergeStoreAndRemoveDuplicateById( managerProfileArrayStore, response.managerProfileArray );
        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );

        let propertyArray = [];

        for ( let property of response.propertyArray )
        {
            let profile = response.profileArray.find( ( profile ) => profile.userId === property.userId );
            let manager = response.managerProfileArray.find( ( manager ) => manager.userId === property.managerUserId );
            let propertyType = response.propertyTypeArray.find( ( propertyType ) => propertyType.id === property.typeId );
            let propertyStatus = response.propertyStatusArray.find( ( propertyStatus ) => propertyStatus.id === property.statusId );
            let rentalType = response.rentalTypeArray.find( ( rentalType ) => {} );
            let heatingType = response.heatingTypeArray.find( ( heatingType ) => heatingType.id === property.heatingTypeId );
            let diagnosis = response.diagnosisArray.find( ( diagnosis ) => diagnosis.id === property.energyDiagnosisId );
            property.propertyType = property.propertyType ?? ( propertyType ? propertyType.name : 'Unknown' );
            property.propertyStatus = property.propertyStatus ?? ( propertyStatus ? propertyStatus.name : 'Unknown' );
            property.rentalType = property.rentalType ?? ( rentalType ? rentalType.name : 'Unknown' );
            property.heatingType = property.heatingType ?? ( heatingType ? heatingType.name : 'Unknown' );
            property.diagnosis = property.diagnosis ?? ( diagnosis ? diagnosis.name : 'Unknown' );
            property.managerProfile = manager;
            property.userProfile = profile;

            propertyArray.push( property );
        }

        if ( propertyPage === 1 )
        {
            propertyArrayStore.set( propertyArray );
        }
        else
        {
            propertyArrayStore.update( ( previousPropertyArray ) => previousPropertyArray.concat( propertyArray ) );
        }
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isPropertyLoading.set( false );
    }
}

// ~~

export async function handleCreateProperty(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedPropertyStore,
        url + '/add',
        finallyFunction,
        togglePropertyModal,
        loadPropertyArray,
        'add-property',
        isSubmitting
        );
}

// ~~

export async function handleEditProperty(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedPropertyStore,
        url + '/set/',
        finallyFunction,
        togglePropertyModal,
        loadPropertyArray,
        'set-property',
        isSubmitting
        );
}

// ~~

export async function handleDeleteProperty(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedPropertyStore,
        url + '/remove/',
        finallyFunction,
        togglePropertyModal,
        loadPropertyArray,
        'remove-property',
        isSubmitting
        );
}

export function togglePropertyModal(
    )
{
    let isOpen = get( isPropertyModalOpen );
    isPropertyModalOpen.set( !isOpen );
    isOpen = get( isPropertyModalOpen );

    if ( !isOpen )
    {
        selectedPropertyStore.set( getInitialState() );
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
            date: '',
            reference: '',
            typeId: null,
            rentalTypeId: null,
            statusId: null,
            imagePath: '',
            imagePathArray: [],
            title: '',
            description: '',
            heatingTypeId: null,
            energyDiagnosisId: null,
            streetName: '',
            buildingNumber: '',
            apartmentNumber: '',
            cityId: null,
            cityName: '',
            countryCode: '',
            countryName: '',
            showsPreciseLocation: false,
            latitude: null,
            longitude: null,
            isAvailableForShortTerm: false,
            isAvailableForLongTerm: false,
            isAvailableForSublet: false,
            shortTermDailyPrice: 0,
            hasShortTermExtendedStayDiscount: false,
            shortTermExtendedStayDayCount: 0,
            shortTermExtendedStayDailyPrice: 0,
            hasShortTermProlongedStayDiscount: false,
            shortTermProlongedStayDayCount: 0,
            shortTermProlongedStayDailyPrice: 0,
            longTermMonthlyPrice: 0,
            requiredLongTermMonthlyIncome: 0,
            requiredLongTermDocumentTypeIdList: [],
            requiresCompleteRequestForVisits: false,
            managesLongTermDocuments: false,
            averageRating: 0,
            averageCleanlinessRating: 0,
            averageCommunicationRating: 0,
            averageCheckInRating: 0,
            averageAccuracyRating: 0,
            averageLocationRating: 0,
            averageValueRating: 0,
            managerUserId: null,
            userId: null
        }
        );
}
