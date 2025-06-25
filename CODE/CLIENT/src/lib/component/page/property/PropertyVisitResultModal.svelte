<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';

    // -- VARIABLES

    export let documentTypeMap;
    export let requiredDocumentTypeIdArray;
    export let profileDocumentByTypeIdMap;
    export let isOpen = false;
    export let visitResult;

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( visitResult === 'sent' )
            {
                setTimeout(
                    () =>
                    {
                        isOpen = false;
                    },
                    5000
                    );
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .rental-visit-result-modal-content-container
    {
        width: 100%;
        padding: 2rem 1.5rem 2.5rem;

        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        justify-content: center;
        align-items: center;

        background-color: blueColor950;

        +media( desktop )
        {
            min-height: 29rem;
        }
    }

    .rental-visit-result-modal-content-header
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }

    .rental-visit-result-modal-content-header-text-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;

        text-align: center;
    }

    .required-document-list
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .required-document-container
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    {#if visitResult === 'sent' }
        <div class="rental-visit-result-modal-content-container">
            <div class="rental-visit-result-modal-content-header">
                <img class="header-image" src='/image/supporting-documents/heading.svg' alt="placeholder" />
                <div class="rental-visit-result-modal-content-header-text-container">
                    <div class="font-size-150 font-weight-600 color-gray-100">
                        { getLocalizedTextBySlug( 'property-rental-visit-request-sent-label', $languageTagStore ) }
                    </div>
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getLocalizedTextBySlug( 'property-rental-visit-request-sent-text', $languageTagStore ) }
                    </div>
                </div>
                <div class="font-size-90 font-weight-700 color-blue-300">
                    { getLocalizedTextBySlug( 'visit-request-page-visit-notified-by-message-label', $languageTagStore ) }
                </div>
            </div>
        </div>
    {:else}
        <ModalHeader
            title={ getLocalizedTextBySlug( 'property-rental-upload-your-documents-label', $languageTagStore ) }
            onClose={ () => isOpen = false }
        />
            <div class="rental-visit-result-modal-content-container">
                <div class="rental-visit-result-modal-content-header">
                    <div class="plant-icon size-625" />
                    <div class="rental-visit-result-modal-content-header-text-container">
                        <div class="font-size-150 font-weight-600 color-gray-100">
                            { getLocalizedTextBySlug( 'profile-page-supporting-documents', $languageTagStore ) }
                        </div>
                        <div class="font-size-90 font-weight-500 color-gray-300">
                            { getLocalizedTextBySlug( 'property-rental-required-documents-text', $languageTagStore ) }
                        </div>
                    </div>
                    <div class="required-document-list">
                        {#each requiredDocumentTypeIdArray as requiredDocumentTypeId }
                            <div class="required-document-container">
                                {#if profileDocumentByTypeIdMap[ requiredDocumentTypeId ] }
                                    <div class="green-check-icon size-150" />
                                {:else}
                                    <div class="red-400-x-circle-icon size-150" />
                                {/if}
                                <div class="font-size-90 font-weight-500 color-gray-300">
                                    { getLocalizedText( documentTypeMap[ requiredDocumentTypeId ].name, $languageTagStore ) }
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        <ModalActions>
            <ModalButton
                variant="contained"
                text={ getLocalizedTextBySlug( 'property-rental-add-documents-label', $languageTagStore ) }
                on:click={ () => navigate( '/dashboard/supporting-document' )  }
            />
        </ModalActions>
    {/if}
</ModalRoot>
