<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let isOpen = false;
    export let scheduleResult;

    // -- STATEMENTS

    onMount(
        () =>
        {
            setTimeout(
                () =>
                {
                    isOpen = false;
                },
                10000
                );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'

    // -- CLASSES

    .visit-schedule-result-modal-content-container
    {
        width: 100%;
        padding: 5rem 2rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }

    .visit-schedule-result-modal-content-container.booked
    {
        background-color: blueColor950;
    }

    .visit-schedule-result-modal-content-container.declined,
    .visit-schedule-result-modal-content-container.error
    {
        background-color: redColor900;
    }

    .header-image
    {
        height: 9rem;
        width: 9.5rem;
    }

    .visit-schedule-result-modal-text-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;

        text-align: center;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <div class="visit-schedule-result-modal-content-container { scheduleResult }">
        <img class="header-image" src='/image/supporting-documents/heading.svg' alt="placeholder" />
        <div class="visit-schedule-result-modal-text-container">
            <div class="font-size-150 font-weight-600 color-gray-100">
                { getLocalizedTextBySlug( `visit-request-page-visit-${ scheduleResult }-label`, $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-500 color-gray-300">
                {#if scheduleResult === 'booked' }
                    { getLocalizedTextBySlug( 'visit-request-page-visit-booked-text', $languageTagStore ) }
                {/if}
            </div>
        </div>
        <div class="font-size-90 font-weight-700 color-blue-300">
            {#if scheduleResult === 'booked' }
                { getLocalizedTextBySlug( 'visit-request-page-visit-notified-by-message-label', $languageTagStore ) }
            {/if}
        </div>
    </div>
</ModalRoot>
