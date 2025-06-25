<script>
    // -- IMPORTS

    import
        {
            isSubmitting,
            loadMailchimpCampaignArray,
            mailchimpCampaignArrayStore,
            selectedMailchimpCampaignStore,
            isFormModified as isMailchimpCampaignFormModified,
            handleChange,
            hasMoreCampaignPage,
            isCampaignLoading,
            handleEditMailchimpCampaign,
            handleDeleteMailchimpCampaign
        } from '$store/mailchimpCampaignStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import Status from '$component/element/Status.svelte';
    import Input from '$component/element/Input.svelte';
    import { countryArrayStore } from '$store/countryArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug, logError } from 'senselogic-gist';
    import Select from '$component/element/Select.svelte';
    import { fetchData, formatPercentage, isNullOrUndefined } from '$lib/base';
    import { navigate } from 'svelte5-router';

    // -- CONTANTS

    const titleSlugMap =
        {
            editTitle: 'edit-mailchimp-campaign-label',
            addTitle: 'add-mailchimp-campaign-label'
        };

    // -- VARIABLES

    let errorMap = {};
    let filterParameterByKeyMap =
        {
            name:
                {
                    type: 'text',
                    name: 'Name',
                    value: ''
                },
            status:
                {
                    type: 'element',
                    name: 'Status',
                    value: ''
                },
            sendTime:
                {
                    type: 'text',
                    name: 'Sent Time',
                    value: ''
                },
            audience:
                {
                    type: 'text',
                    name: 'Audience',
                    value: ''
                },
            recipentCount:
                {
                    type: 'text',
                    name: 'Recipients',
                    value: ''
                },
            openCount:
                {
                    type: 'text',
                    name: 'Opens',
                    value: ''
                },
            clickCount:
                {
                    type: 'text',
                    name: 'Clicks',
                    value: ''
                }
        };

    // -- FUNCTIONS

    function arrayProcessing(
        )
    {
    }

    // ~~

    async function handleNearBottom(
        )
    {
        if ( $hasMoreCampaignPage && !$isCampaignLoading )
        {
            await loadMailchimpCampaignArray( 10, $mailchimpCampaignArrayStore.length );
            arrayProcessing();
        }
    }

    // ~~

    function getFormattedBirthday(
        birthday
        )
    {
        return birthday
            .replace( /\D/g, '' )
            .replace( /^(\d{2})(\d{2})$/g, '$1/$2' );
    }

    // ~~

    async function handleCreateCampaign(
        )
    {
        try
        {
            let response = await fetchData(
                '/api/admin/page/mailchimp/campaign/add',
                { method: 'POST' }
                );

            navigate( '/admin/settings/mailchimp/campaigns/' + response.campaignId );
        }
        catch ( error )
        {
            logError( error );
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES
</style>

<AdminPage
    pageTitle="admin-menu-mailchimp-campaign-manager-label"
    selectedObject={ selectedMailchimpCampaignStore }
    objectArrayStore={ mailchimpCampaignArrayStore }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadMailchimpCampaignArray }
    arrayProcessing={ arrayProcessing }
    toggleObjectModal={ handleCreateCampaign }
    handleEditObject={ handleEditMailchimpCampaign }
    handleDeleteObject={ () => handleDeleteMailchimpCampaign( arrayProcessing ) }
    showButton={ hasUserPermission( 'add-user-right' ) }
    isFormModified={ $isMailchimpCampaignFormModified }
    search={ false }
    isSubmitting={ $isSubmitting }
    handleNearBottom={ handleNearBottom }
    useModal={ false }
/>
