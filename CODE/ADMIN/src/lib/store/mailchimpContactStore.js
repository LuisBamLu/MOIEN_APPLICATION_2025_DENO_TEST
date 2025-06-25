// -- IMPORTS

import { writable, get } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { urlParamsStore } from '$store/urlParamsStore';
import { getJsonText } from 'senselogic-gist';
import Status from '$component/element/Status.svelte';
import md5 from 'md5';
import { toast } from '$lib/toast';

// -- CONTANTS

let url = '/api/admin/page/mailchimp/contact';

// -- VARIABLES

export let mailchimpContactArrayStore = writable( [] );
export let hasMoreContactPage = writable( false );
export let isContactLoading = writable( true );
export let selectedMailchimpContactStore = writable( {} );
export let isSubmitting = writable( false );
export let isMailchimpContactModalOpen = writable( false );
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

// -- FUNCTIONS

export async function loadMailchimpContactArray(
    count = 10,
    offset = 0,
    searchTerm = ''
    )
{
    isContactLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );
        let response = await fetchData(
            url + '/list' + '?' + urlParam.toString(),
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText(
                    {
                        count,
                        offset
                    }
                    )
            }
            );

        let mailchimpContactArray = [];
        const mailchimpStatusMap =
            {
                subscribed: { name: 'Subscribed', color: 'green' },
                unsubscribed: { name: 'Subscriptions canceled', color: 'red' },
                pending: { name: 'Pending', color: 'orange' }
            };
        const mailchimpSourceMap =
            {
                'Admin Add': 'Admin Add',
                'Import': 'Copy/paste file list import'
            };

        for ( let mailchimpContact of response.contactArray )
        {
            mailchimpContactArray.push(
                {
                    ...mailchimpContact,
                    firstName: mailchimpContact.mergeFieldMap.firstName,
                    lastName: mailchimpContact.mergeFieldMap.lastName,
                    phoneNumber: mailchimpContact.mergeFieldMap.phoneNumber,
                    birthday: mailchimpContact.mergeFieldMap.birthday,
                    addressLine1: mailchimpContact.mergeFieldMap.address.addressLine1,
                    addressLine2: mailchimpContact.mergeFieldMap.address.addressLine2,
                    city: mailchimpContact.mergeFieldMap.address.city,
                    state: mailchimpContact.mergeFieldMap.address.state,
                    zipCode: mailchimpContact.mergeFieldMap.address.zipCode,
                    countryCode: mailchimpContact.mergeFieldMap.address.countryCode,
                    formattedStatus:
                        {
                            component: Status,
                            propMap: mailchimpStatusMap[ mailchimpContact.status ]
                        },
                    formattedSource: mailchimpSourceMap[ mailchimpContact.source ] || mailchimpContact.source
                }
                );
        }

        if ( offset === 0 )
        {
            mailchimpContactArrayStore.set( mailchimpContactArray );
        }
        else
        {
            mailchimpContactArrayStore.update(
                ( _mailchimpContactArray ) => _mailchimpContactArray.concat( mailchimpContactArray )
                );
        }

        hasMoreContactPage.set( response.hasMorePage );
    }
    catch ( error )
    {
        console.error( error );
    }
    finally
    {
        isContactLoading.set( false );
    }
}

// ~~

export function toggleMailchimpContactModal(
    )
{
    let isOpen = get( isMailchimpContactModalOpen );
    isMailchimpContactModalOpen.set( !isOpen );
    isOpen = get( isMailchimpContactModalOpen );

    if ( !isOpen )
    {
        selectedMailchimpContactStore.set( {} );
        isFormModified.set( false );
    }
}

// ~~

export async function handleCreateMailchimpContact(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedMailchimpContactStore,
        url + '/add',
        finallyFunction,
        toggleMailchimpContactModal,
        loadMailchimpContactArray,
        'add-mailchimp-contact',
        isSubmitting
        );
}

// ~~

export async function handleEditMailchimpContact(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedMailchimpContactStore,
        url + '/set/',
        finallyFunction,
        toggleMailchimpContactModal,
        loadMailchimpContactArray,
        'add-user-right',
        isSubmitting
        );
}

// ~~

export async function handleDeleteMailchimpContact(
    finallyFunction = () => {}
    )
{
    let selectedMailchimpContact = get( selectedMailchimpContactStore);
    let restrictedStatusArray = [ 'bounced', 'pending', 'archived' ];

    if ( ( restrictedStatusArray.includes( selectedMailchimpContact?.status ) ) )
    {
        toast.error( 'This list member cannot be removed. Cannot archive a contact that is bounced, pending or archived' );

        return;
    }

    await handleDeleteObject(
        selectedMailchimpContactStore,
        url + '/remove/',
        finallyFunction,
        toggleMailchimpContactModal,
        loadMailchimpContactArray,
        'add-user-right',
        isSubmitting,
        'email'
        );
}
