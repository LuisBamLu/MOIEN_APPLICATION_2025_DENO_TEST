// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { getJsonText, getLocalDate, getLocalizedText, getLocalizedTextBySlug, getLocalTime } from 'senselogic-gist';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { toast } from '../toast';
import { hasUserPermission } from './profileStore';
import { urlParamsStore } from './urlParamsStore';
import { languageTagStore } from './languageTagStore';

// -- VARIABLES

export let errorMessage = writable( null );
export let isVisitLoading = writable( true );
export let isVisitModalOpen = writable( false );
export let profileArrayStore = writable( [] );
export let visitArrayStore = writable( [] );
export let selectedVisitStore = writable( getInitialState() );
export let propertyArrayStore = writable( [] );
export let visitStatusArrayStore = writable( [] );
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
let url = '/api/admin/page/visit';

// -- FUNCTIONS

export async function loadVisitArray(
    page = 1,
    limit = 15
    )
{
    isVisitLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
        );

        let visitArray = [];

        for ( let visit of response.visitArray )
        {
            let profile = response.profileArray.find( ( profile ) => profile.userId === visit.userId );
            let visitorProfile = response.profileArray.find( ( visitorProfile ) => visitorProfile.userId === visit.visitorUserId );
            let property = response.propertyArray.find( ( property ) => property.id === visit.propertyId );
            let status = response.visitStatusArray.find( ( status ) => status.id === visit.status );
            visit.userName = profile ? `${ profile.firstName } ${ profile.lastName }` : 'Unknown';
            visit.visitorUserName = visitorProfile ? `${ visitorProfile.firstName } ${ visitorProfile.lastName }` : 'None';
            visit.propertyTitle = property ? getLocalizedText( property.title, get( languageTagStore ) ) : 'Unknown';
            visit.statusName = status ? getLocalizedText( status.name, get( languageTagStore ) ) : 'Unknown';
            visit.profile = profile;
            visit.property = property;
            visit.visitorProfile = visitorProfile;

            visitArray.push( visit );
        }

        if ( page === 1 )
        {
            visitArrayStore.set(
                response.visitArray
                );
        }
        else
        {
            visitArrayStore.update(
                ( visitArray ) => visitArray.concat( response.visitArray )
                );
        }

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );
        mergeStoreAndRemoveDuplicateById( propertyArrayStore, response.propertyArray );

        hasMorePage.set(
            response.hasMorePage
            );
        visitStatusArrayStore.set(
            response.visitStatusArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isVisitLoading.set( false );
    }
}

// ~~

export async function handleCreateVisit(
    finallyFunction = () => {}
    )
{
    visitArrayStore.set(
        await handleCreateObject(
            visitArrayStore,
            selectedVisitStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleEditVisit(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetVisitPermission = hasUserPermission( 'set-visit' );

        if ( !hasSetVisitPermission )
        {
            return;
        }

        let visitData = get( selectedVisitStore )
        let { id : visitId, ...updatedVisit } = visitData;

        let response = await fetchData(
            url + '/' + visitId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { visitData : updatedVisit } )
            }
            );

        visitArrayStore.update(
            visitArray =>
                visitArray.map( visit => visit.id === visitId
                    ? visitData
                    : visit
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
        toggleVisitModal();
    }
}

// ~~

export async function handleDeleteVisit(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasRemoveVisitPermission = hasUserPermission( 'remove-visit' );

        if ( !hasRemoveVisitPermission )
        {
            return;
        }

        let visitData = get( selectedVisitStore )
        let { id : visitId } = visitData;

        let response = await fetchData(
            url + '/' + visitId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        visitArrayStore.update(
            visitArray => visitArray.filter( visit => visit.id !== visitId )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleVisitModal();
    }
}

export function toggleVisitModal(
    )
{
    let isOpen = get( isVisitModalOpen );
    isVisitModalOpen.set( !isOpen );
    isOpen = get( isVisitModalOpen );

    if ( !isOpen )
    {
        selectedVisitStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let systemDate = new Date();

    return (
        {
            id : null,
            propertyId: null,
            date: getLocalDate( systemDate ),
            time: getLocalTime( systemDate ),
            duration: null,
            status: '',
            visitorUserId: null,
            userId: null
        }
        );
}
