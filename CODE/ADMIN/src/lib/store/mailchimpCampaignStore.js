// -- IMPORTS

import { writable, get } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, formatPercentage, formatDate } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { urlParamsStore } from '$store/urlParamsStore';
import { getInteger, getJsonText } from 'senselogic-gist';
import Status from '$component/element/Status.svelte';
import md5 from 'md5';
import { navigate } from 'svelte5-router';

// -- CONTANTS

const url = '/api/admin/page/mailchimp/campaign';
export const campaignStatusSendingMapByStatus =
    {
        sent: { name: 'Sent', color: 'green' },
        save: { name: 'Draft', color: 'gray' },
        paused: { name: 'Paused', color: 'red' },
        schedule: { name: 'Scheduled', color: 'green' },
        sending: { name: 'Sending', color: 'orange' },
        canceled: { name: 'Canceled', color: 'red' },
        canceling: { name: 'Canceling', color: 'orange' },
        archived: { name: 'Archived', color: 'gray' }
    };

// -- VARIABLES

export let mailchimpCampaignArrayStore = writable( [] );
export let hasMoreCampaignPage = writable( false );
export let isCampaignLoading = writable( true );
export let selectedMailchimpCampaignStore = writable( {} );
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

// -- FUNCTIONS

export async function loadMailchimpCampaignArray(
    count = 10,
    offset = 0
    )
{
    isCampaignLoading.set( true );

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

        let mailchimpCampaignArray = [];

        for ( let mailchimpCampaign of response.campaignArray )
        {
            mailchimpCampaignArray.push(
                {
                    ...mailchimpCampaign,
                    name: mailchimpCampaign.settingMap.title
                         || mailchimpCampaign.settingMap.subjectLine
                         || 'Untitled',
                    status:
                        {
                            component: Status,
                            propMap: campaignStatusSendingMapByStatus[ mailchimpCampaign.status ]
                        },
                    audience: mailchimpCampaign.recipientMap.listName,
                    recipentCount: mailchimpCampaign.recipientMap.recipientCount + ' recipients' || null,
                    openCount: mailchimpCampaign.reportSummaryMap ? ( mailchimpCampaign.reportSummaryMap.openCount + ' opens - ' + formatPercentage( mailchimpCampaign.reportSummaryMap.openRate ) ) : null,
                    clickCount: mailchimpCampaign.reportSummaryMap ? ( mailchimpCampaign.reportSummaryMap.clickCount + ' clicks - ' + formatPercentage( mailchimpCampaign.reportSummaryMap.clickRate ) ): null,
                    lastChanged: mailchimpCampaign.recipientMap.recipientCount || null,
                    sendTime: formatDate( mailchimpCampaign.sendTime, { dateStyle: 'medium', timeStyle: 'short' } )
                }
                );
        }

        if ( offset === 0 )
        {
            mailchimpCampaignArrayStore.set( mailchimpCampaignArray );
        }
        else
        {
            mailchimpCampaignArrayStore.update(
                ( _mailchimpCampaignArray ) => _mailchimpCampaignArray.concat( mailchimpCampaignArray )
                );
        }

        hasMoreCampaignPage.set( response.hasMorePage );
    }
    catch ( error )
    {
        console.error( error );
    }
    finally
    {
        isCampaignLoading.set( false );
    }
}

// ~~

export async function handleEditMailchimpCampaign(
    selectedMailchimpCampaign
    )
{
    selectedMailchimpCampaignStore.set( selectedMailchimpCampaign );
    navigate( '/admin/settings/mailchimp/campaigns/' + selectedMailchimpCampaign.id );
}

// ~~

export async function handleDeleteMailchimpCampaign(
    finallyFunction = () => {}
    )
{
    let selectedMailchimpCampaign = get( selectedMailchimpCampaignStore);

    await handleDeleteObject(
        selectedMailchimpCampaignStore,
        url + '/remove/',
        finallyFunction,
        () => {},
        loadMailchimpCampaignArray,
        'add-user-right',
        isSubmitting,
        'email'
        );
}
