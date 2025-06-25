<script>
    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { onMount } from 'svelte';
    import Alert from '$component/element/Alert.svelte';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import ToolContainer from '$component/element/ToolContainer.svelte';
    import { languageTagStore } from '$store/languageTagStore';

    // -- CONSTANTS

    const notificationTypeMap =
        {
            'optional-services' : 'Optional Services',
            'appointment-reminder' : 'Appointment Reminder',
            'partner-ads' : 'Partner Ads',
        };

    // -- VARIABLES

    let filteredEmailTemplateArray = $state([]);

    let emailTemplateArray = $state([]);
    let errorMessage = $state(null);
    let isLoading = $state(true);
    let searchTerm = $state('');

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await loadEmailTemplateArray();
        }
        );

    // -- FUNCTIONS

    async function loadEmailTemplateArray()
    {
        isLoading = true;
        errorMessage = null;

        try
        {
            let response = await fetchData(
                '/api/email/template',
                {
                    method: 'POST',
                    credentials : 'include'
                }
                );

            emailTemplateArray = response.emailTemplateArray;
        }
        catch ( error )
        {
            errorMessage = error.message;
        }
        finally
        {
            isLoading = false;
        }
    }

    // ~~

    function handleSearchByTerm(
        event
        )
    {
        event.preventDefault();

        filteredEmailTemplateArray = emailTemplateArray.filter(
            ( emailTemplate ) => emailTemplate.name.toLowerCase().trim().includes( searchTerm.toLowerCase().trim() )
                || emailTemplate.subject.toLowerCase().trim().includes( searchTerm.toLowerCase().trim() )
                || emailTemplate.description.toLowerCase().trim().includes( searchTerm.toLowerCase().trim() )
            );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .page-section
    {
        max-height: calc( 100dvh - 7vh );
        padding-top: 7vh;

        display: grid;
        grid-template-columns: 1fr;

        background: pageBackgroundColor;

        +media( desktop )
        {
            grid-template-columns: min-content 1fr;
        }
    }

    .main-section
    {
        overflow-y: auto;
        max-height: calc( 100dvh - 7vh - 5rem );

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .page-title
    {
        width: 100%;

        font-size: 1.5rem;
        text-align: center;
        text-transform: uppercase;
        color: blueColor;
    }

    .template-list
    {
        +media( desktop )
        {
            display: grid;
            grid-template-rows: minmax( 200px, fit-content );
            grid-template-columns: repeat( auto-fill, minmax( 300px, 1fr ) );
            column-gap: 2rem;
        }
    }

    .template-list-item:focus,
    .template-list-item:active,
    .template-list-item:hover
    {
        background-color: blueColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        text-decoration: none;
        -webkit-transform: scale(1.05) translateY(-4px);
        -moz-transform: scale(1.05) translateY(-4px);
        transform: scale(1.05) translateY(-4px);
    }

    .template-list-item
    {
        position: relative;

        overflow: hidden;
        margin-bottom: 2rem;
        border-radius: 1px;
        padding: 1rem 0 0.25rem;

        background-color: #fff;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: blueColor;

        cursor: pointer;
        -webkit-transition: all 0.2s ease-in-out;
        -moz-transition: all 0.2s ease-in-out;
        display: block;

        opacity: 0.8;
        background-color: blueColor950;

        transition: all 0.2s ease-in-out;
    }

    .template-list-item-header
    {
        margin-top: -1rem;
        margin-bottom: 0.75rem;
        width: 100%;
        padding: 1rem 0.75rem;

        opacity: 0.9;
        background-color: greenColor900;

        font-size: 1.5rem;
        font-weight: 700;
        text-transform uppercase;
        color: greenColor500;
    }

    .template-list-item-description
    {
        min-height: 2.5rem;
        padding: 0 0.75rem;

        font-size: 0.75rem;
        word-wrap: break-word;
        word-break: normal;
    }

    .template-list-item-tags
    {
        margin: 0.25rem 0.625rem 0.25rem -0.25rem;
        padding: 0 0.75rem;
    }

    .tag
    {
        margin-left: 0.25rem;
        border-radius: 3px;
        padding: 0.05rem 0.25rem;

        display: inline-block;

        background-color: greenColor500;

        line-height: 0.875rem;
        font-size: 0.625rem;
        font-weight: 600;
        white-space: nowrap;
        vertical-align: baseline;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
        color: whiteColor;
    }
</style>

{#if false }
    <div class="hourglass">{ getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }</div>
{:else}
    <div class="page-section">
        <Sidebar/>

        <main class="padding-150 main-section">
                <div class="page-title">
                    TEMPLATES
                </div>

                <ToolContainer
                    bind:value={ searchTerm }
                    on:submit={ handleSearchByTerm }
                />

                <div class="template-list padding-50">
                    {#if isLoading }
                        <div class="text-align-center">
                            { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
                        </div>
                    {:else}
                        {#if filteredEmailTemplateArray.length > 0 }
                            {#each filteredEmailTemplateArray as emailTemplate }
                                <a class="template-list-item" href="/admin/settings/email-templates/{ emailTemplate.id }">
                                    <div class="template-list-item-header">{ emailTemplate.name }</div>
                                    <div class="template-list-item-tags">
                                        <span class="tag">
                                            { notificationTypeMap[ emailTemplate.notificationType ] }
                                        </span>
                                    </div>
                                    <div class="template-list-item-description">{ emailTemplate.description }</div>
                                </a>
                            {/each}
                        {:else}
                            {#each emailTemplateArray as emailTemplate }
                                <a class="template-list-item" href="/admin/settings/email-templates/{ emailTemplate.id }">
                                    <div class="template-list-item-header">{ emailTemplate.name }</div>
                                    <div class="template-list-item-tags">
                                        <span class="tag">
                                            { notificationTypeMap[ emailTemplate.notificationType ] }
                                        </span>
                                    </div>
                                    <div class="template-list-item-description">{ emailTemplate.description }</div>
                                </a>
                            {/each}
                        {/if}

                        {#if errorMessage }
                            <Alert text={ errorMessage } type="error"/>
                        {/if}
                    {/if}
                </div>
        </main>
    </div>
{/if}
