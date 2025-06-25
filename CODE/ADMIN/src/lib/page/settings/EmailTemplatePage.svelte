<script>
    import { run, preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { AceEditor } from 'svelte-ace';
    import { fetchData } from '$lib/base';
    import { getJsonText, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import { TemplateEngine } from '$lib/template_engine';
    import { toast } from '$lib/toast';
    import Alert from '$component/element/Alert.svelte';
    import Button from '$component/element/Button.svelte';
    import ExampleModal from '$component/page/email_template/ExampleModal.svelte';
    import IconButton from '$component/element/IconButton.svelte';
    import Input from '$component/element/Input.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import Tooltip from '$component/element/Tooltip.svelte';
    import 'brace/mode/html';
    import 'brace/mode/json';
    import 'brace/theme/chrome';
    import { profileSignedInStore } from '$store/profileStore';

    // -- FUNCTIONS

    let { format : formatDate } = new Intl.DateTimeFormat( $languageTagStore, { dateStyle : 'medium' } );

    // ~~

    let { format : formatAmount } = new Intl.NumberFormat( $languageTagStore, { style: 'currency', currency: 'EUR' } );

    // ~~

    async function getEmailTemplate(
        )
    {
        isLoading = true;

        try
        {
            let response = await fetchData(
                '/api/email/template/' + id,
                {
                    method: 'POST',
                    credentials : 'include'
                }
                );

            emailTemplate = response.emailTemplate;
            errorMessage = null;
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

    async function handleSubmit(
        )
    {
        try
        {
            if ( !emailTemplate.name
                 || !emailTemplate.subject
                 || !emailTemplate.content )
            {
                toast(
                {
                    text : 'Name, subject and content are required',
                    variant : 'error',
                }
                );

                return;
            }

            await fetchData(
                '/api/email/template/update/' + emailTemplate.id,
                {
                    method : 'POST',
                    credentials : 'include',
                    body : getJsonText(
                        {
                            template : emailTemplate
                        }
                        )
                }
                );

            toast(
                {
                    text : 'Template updated successfully',
                    variant : 'success',
                }
                );
        }
        catch ( error )
        {
            toast(
                {
                    text : 'Something went wrong',
                    variant : 'error',
                }
                );
        }
        finally
        {
            handleDisableEditableInputName();
        }
    }

    // ~~

    function handleEnableEditableInputName(
        )
    {
        isEditableInputNameEnabled = true;
    }

    // ~~

    async function handleDisableEditableInputName(
        )
    {
        isEditableInputNameEnabled = false;
    }

    // ~~

    function getInitialEmailTemplateState(
        )
    {
        return (
            {
                creationTimestamp : '',
                content : '',
                description : '',
                id : '',
                name : '',
                subject : '',
                recipient : '',
                updateTimestamp : ''
            }
            );
    }

    // ~~

    function toggleExampleModal(
        )
    {
        isExampleModalOpen = !isExampleModalOpen;
    }

    // -- CONSTANTS

    const previewModeToPixelMap =
        {
            desktop : '100%',
            tablet : '60%',
            mobile : '35%'
        };

    // -- VARIABLES

    /** @type {{id: any}} */
    let { id } = $props();
    let isExampleModalOpen = $state(false);
    let isEditableInputNameEnabled = $state(false);
    let emailTemplate = $state(getInitialEmailTemplateState());
    let isLoading = $state(true);
    let errorMessage = $state(null);
    let previewMode = $state('desktop');
    let jsonData =
        $state({
            profile : $profileSignedInStore,
            guestName : 'John Doe',
            hostName : 'Jane Doe',
            reviewerName : 'janedoe',
            userName : 'johndoe',
            propertyName : 'Lorem ipsum dolor sit amet',
            updateDetails : '',
            senderName : 'John Doe',
            messageLink : '/',
            amount : formatAmount( 20 ),
            checkOutDate : formatDate( Date.now() ),
            checkInDate : formatDate( Date.now() ),
            reviewLink : '/',
            propertyAddress : ' Av. de la Motte-Picquet, 56 - Paris France',
            securityLink : '/',
            newsletterContent : '',
            offerLink : '/',
            termsLink : '/',
            privacyLink : '/',
            holiday : `Father's Day`,
            ReviewerName: 'John Doe',
            propertyPreloadImagePath: 'https://cjspwqqhdpkjmqycwxys.supabase.co/storage/v1/object/public/global/user/91241ae7-ac72-44b0-808a-33f1808de739/image/3678fa10-80f2-49ba-bff4-657eecf0cbc5_20241105115751587000.360.avif',
            propertyFullWidthImagePath: 'https://cjspwqqhdpkjmqycwxys.supabase.co/storage/v1/object/public/global/user/91241ae7-ac72-44b0-808a-33f1808de739/image/3678fa10-80f2-49ba-bff4-657eecf0cbc5_20241105115751587000.1280.avif',
            sendAMessageLink : '/',
            propertyDescription : `
Consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet.

Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. `,
            rentalBooking:
            {
                id: 'vbh1OnHQ1HobAlxS0fh3mQ',
                propertyId: 'HNiS8KJQFjaU3ObDm1H8TQ',
                guestCount: 1,
                arrivalDate: '2024-12-01',
                arrivalTime: null,
                departureDate: '2024-12-13',
                departureTime: null,
                dayCount: 12,
                cleaningFee: 10,
                sheetsFee: 10,
                towelsFee: 10,
                otherFee: 0,
                donation: 197,
                carbonCompensationDonation: 3,
                totalPrice: 350,
                cancellationPolicyId: 'flexible',
                isNonRefundable: null,
                status: 'confirmed',
                userId: 'f33752a9-ae12-4805-8a58-474035984459',
                creationTimestamp: '2024-11-22T15:02:42.382065',
                updateTimestamp: '2024-11-22T16:08:58.819'
            }
        });
    let template = $state();
    let subject = $state();
    let recipient = $state();

    // -- STATEMENTS

    run(() => {
        if ( !isLoading )
        {
            subject = new TemplateEngine( emailTemplate[ 'subject' ], jsonData, $languageTagStore ).render();
            template = new TemplateEngine( emailTemplate[ 'content' ], jsonData, $languageTagStore ).render();
            recipient = new TemplateEngine( emailTemplate[ 'recipient' ], jsonData, $languageTagStore ).render();
        }
    });

    // ~~

    onMount(
        async () =>
        {
            await getEmailTemplate();
        }
        );

    function handleUpdateLocalizedInput(
        event
        )
    {
        emailTemplate[ event.detail.name ] = '__' + event.detail.text + '__';
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    label > input[type="radio"]
    {
        display: none;
    }

    label
    {
        cursor: pointer;
    }

    label > div:hover
    {
        background-color: greenColor100;
    }

    // -- CLASSES

    .page-section
    {
        min-height: calc( 100dvh - 7vh );
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

    .page-header
    {
        margin: 1.25rem 0 2rem;
        margin-top: 0.25rem;
        border-bottom: 1px solid
        margin-bottom: 1.25rem;
        border-bottom: 1px solid grayColor700;
        padding-bottom: 0.5rem;
    }

    .email-template-name-form
    {
        margin: 0 0 1.25rem;
    }

    .email-template-name
    {
        border: 2px dashed grayColor700;
        border-radius: 4px;
        padding: 0.5rem;

        display: inline-block;

        line-height: 2.5rem;
        font-size: 1.5rem;

        cursor: text;
    }

    .email-template-name.is-hidden
    {
        display: none;
    }

    .email-template-content
    {
        overflow: auto;
    }

    .email-template-form-header
    {
        margin: 0 0 1.25rem;
        min-height: 1.25rem;
        border: 1px solid grayColor700;
        border-radius: 4px;
        padding: 1.25rem;

        background: grayColor900;
        -webkit-box-shadow: inset 0 1px 1px rgba( 0, 0, 0, 0.05 );
        -moz-box-shadow: inset 0 1px 1px rgba( 0, 0, 0, 0.05 );
        display: grid;
        gap: 0.5rem;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .editor-container
    {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        +media( desktop )
        {
            flex-direction: row;
        }
    }

    .editor-content
    {
        position: relative;
    }

    .ace-editor
    {
        outline: 1px solid grayColor700;
    }

    .editor-content.html
    {
        +media( desktop )
        {
            width: 65%;
        }
    }

    .editor-content.json
    {
        +media( desktop )
        {
            width: 31%;
        }
    }

    .email-template-preview-sizes
    {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .email-template-preview
    {
        position: relative;

        margin: 1.25rem 0;
        min-height: 1.25rem;
        border: 1px solid grayColor800;
        border-radius: 4px;
        padding: 1.25rem;

        background-color: grayColor900;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .email-template-preview-title
    {
        font-size: 0.65rem;
        color: grayColor500;
    }

    .email-template-preview-title-row
    {
        margin-bottom: 0.25rem;
    }

    .email-template-preview-header
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .preview-title::after
    {
        position: absolute;
        top: -1px;
        right: -1px;

        border: 1px solid grayColor800;
        padding: 3px 7px;

        content: "Preview";
        background-color: grayColor900;

        font-size: 12px;
        font-weight: bold;
        color: grayColor600;
        -webkit-border-radius: 0 4px 0 4px;
        -moz-border-radius: 0 4px 0 4px;
        border-radius: 0 4px 0 4px;
    }

    .email-template-preview-title-row-subject,
    .email-template-preview-title-row-to
    {
        margin-left: 0.25rem;

        color: grayColor100;
    }

    .preview-iframe-container
    {
        margin: 0 auto;

        display: flex;
        justify-content: center;

        text-align: center;
    }

    .preview-content
    {
        margin: 0.25rem 0;
        outline: 1px solid grayColor700;
        border: 0;

        background-color: whiteColor;

        transition: width 300ms ease-in-out;
    }

    .form-actions
    {
        z-index: 10;
        position: fixed;
        bottom: 0;
        left: 0;

        margin: 0;
        margin-bottom: 0;
        width: 100%;
        border-top: 1px solid grayColor800;
        padding: 1rem;
        padding-left: 0;

        display: flex;
        justify-content: flex-end;

        background-color: grayColor900;
    }

    .json-example-text
    {
        height: 2.5rem;
    }
</style>

<ExampleModal
    isOpen={ isExampleModalOpen }
    onToggle={ toggleExampleModal }
/>

{#if isLoading }
    <div class="text-align-center">
        { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
    </div>
{:else}
    <div class="page-section">
        <Sidebar/>

        <main class="padding-150 main-section">
            <div class="template-list padding-50">
                <form class="email-template-name-form" onsubmit={preventDefault(handleSubmit)}>
                    <div class="page-header">
                        <button
                            type="button"
                            class="email-template-name"
                            class:is-hidden={ isEditableInputNameEnabled }
                            onclick={handleEnableEditableInputName}
                        >
                            { emailTemplate[ 'name' ] }
                        </button>
                        {#if isEditableInputNameEnabled }
                            <Input name="name" type="text" label={ getLocalizedTextBySlug( 'template-name-label', $languageTagStore ) } bind:value={ emailTemplate[ 'name' ] }>
                                <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <IconButton type="submit" slot="end-adornment">
                                    <div class="green-100-check-icon size-150"></div>
                                </IconButton>
                            </Input>
                        {/if}
                    </div>
                </form>
                <div class="email-template-content">
                    <form onsubmit={preventDefault(handleSubmit)} class="">
                        <div class="email-template-form-header">
                            <!-- <Input required fullWidth name="subject" type="text" label="Subject" bind:value={ emailTemplate[ 'subject' ] }/> -->
                            <InputLocalizedForm
                                name='subject'
                                itemsString={ emailTemplate[ 'subject' ].replace( /__/g, '' ) }
                                languageArray={ $languageArrayStore }
                                on:update={ handleUpdateLocalizedInput }
                                label={ getLocalizedTextBySlug( 'subject-label', $languageTagStore ) }
                            />
                            <Input required fullWidth name="description" type="text" label={ getLocalizedTextBySlug( 'description-label', $languageTagStore ) } bind:value={ emailTemplate[ 'description' ] }/>
                            <Input required fullWidth name="recipient" type="text" label={ getLocalizedTextBySlug( 'recipient-label', $languageTagStore ) } bind:value={ emailTemplate[ 'recipient' ] }/>
                        </div>

                        <div class="email-template-form-html">
                            <div class="editor-container">
                                <div class="editor-content html">
                                    <h5 class="font-size-90 font-weight-700">
                                        HTML
                                        <span class="color-red font-size-100">*</span>
                                        <Tooltip placement="right" title={ getLocalizedTextBySlug( 'click-here-to-see-an-example-title', $languageTagStore ) }>
                                            <IconButton type="button" on:click={ toggleExampleModal }>
                                                <div class="gray-question-mark-icon size-100"></div>
                                            </IconButton>
                                        </Tooltip>
                                    </h5>
                                    <div class="ace-editor">
                                        <AceEditor
                                            lang="html"
                                            theme="chrome"
                                            bind:value={ emailTemplate[ 'content' ] }
                                            height="340"
                                        />
                                    </div>
                                </div>
                                <div class="editor-content json">
                                    <h5 class="font-size-90 font-weight-700 json-example-text">
                                        { getLocalizedTextBySlug( 'json-data-example-text', $languageTagStore ) }
                                        <span class="color-red font-size-100">*</span>
                                    </h5>
                                    <div class="ace-editor">
                                        <AceEditor
                                            lang="json"
                                            theme="chrome"
                                            value={ JSON.stringify( jsonData, null, '\t' ) }
                                            height="340"
                                            options=
                                                {
                                                    {
                                                        tabSize : 4
                                                    }
                                                }
                                            on:input={
                                            ( event ) =>
                                            {
                                                try
                                                {
                                                    let parsedJsonData = JSON.parse( event.detail );
                                                    jsonData = parsedJsonData;
                                                }
                                                catch ( error )
                                                {
                                                    console.log( error );
                                                }
                                            }
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="email-template-preview">
                        <div class="preview-title"></div>
                            <div class="email-template-preview-header">
                                <div class="email-template-preview-title">
                                    <p class="email-template-preview-title-row">
                                        <span>{ getLocalizedTextBySlug( 'subject-text', $languageTagStore ) }:</span>
                                        <span class="email-template-preview-title-row-subject">{ subject }</span>
                                    </p>
                                    <p class="email-template-preview-title-row">
                                        <span>{ getLocalizedTextBySlug( 'recipient-text', $languageTagStore ) }:</span>
                                        <span class="email-template-preview-title-row-to">{ recipient }</span>
                                    </p>
                                </div>

                                <div class="email-template-preview-sizes">
                                    <label for="desktop">
                                        <div class="{ previewMode === 'desktop' ? 'green-100' : 'green' }-desktop-icon size-250"></div>
                                        <input type="radio" bind:group={ previewMode } name="previewMode" id="desktop" value="desktop">
                                    </label>

                                    <label for="tablet">
                                        <div class="{ previewMode === 'tablet' ? 'green-100' : 'green' }-device-tablet-icon size-200"></div>
                                        <input type="radio" bind:group={ previewMode } name="previewMode" id="tablet" value="tablet">
                                    </label>

                                    <label for="mobile">
                                        <div class="{ previewMode === 'mobile' ? 'green-100' : 'green' }-device-mobile-icon size-150"></div>
                                        <input type="radio" bind:group={ previewMode } name="previewMode" id="mobile" value="mobile">
                                    </label>
                                </div>
                            </div>

                            <div class="preview-iframe-container">
                                <div class="preview-content" style="width: { previewModeToPixelMap[ previewMode ] };height: { template ? 'auto' : '500px' };">
                                    {@html template }
                                </div>
                            </div>
                        </div>
                    </div>
                {#if errorMessage }
                    <Alert text={ errorMessage } type="error"/>
                {/if}
            </div>

            <div class="form-actions">
                <Button type="button" on:click={ handleSubmit }>Save</Button>
            </div>
        </main>
    </div>
{/if}
