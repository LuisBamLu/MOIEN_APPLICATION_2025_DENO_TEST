<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Alert from '$component/element/Alert.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';

    // -- VARIABLES

    export let visit;
    export let isScheduleVisitModalOpen = false;
    export let propertyTimeZone;
    let [ hour, minute ] = visit.time.split( ':' );
    let date = new Date( new Date( visit.date ).setUTCHours( hour, minute, 0, 0 ) );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'

    // -- CLASSES

    .property-rental-visit
    {
        width: 100%;
        border-top: 1px solid lightGrayBorderColor;
        padding: 1.5rem 0;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .property-rental-visit-date-container
    {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .property-rental-visit-reschedule-button-container
    {
        margin-top: 1rem;
    }
</style>

<div class="property-rental-visit">
    <div class="font-size-125 font-weight-600 color-gray-100">
        { getLocalizedTextBySlug( 'property-rental-visit-request-information-label', $languageTagStore ) }
    </div>
    <div class="property-rental-visit-date-container">
        <div class="green-clock-icon size-150" />
        <div class="font-size-90 font-weight-500 color-gray-300">
            {
                date.toLocaleString(
                    $languageTagStore,
                    {
                        timeZone: propertyTimeZone,
                        dateStyle: 'full',
                        timeStyle: 'full'
                    }
                    )
            }
        </div>
    </div>
    {#if visit.status === 'booked' }
        <Alert
            type="success"
            text={ getLocalizedTextBySlug( 'property-rental-visit-request-booked-alert-text', $languageTagStore ) }
        />
    {:else if visit.status === 'pending' }
        <Alert
            type="informative"
            text={ getLocalizedTextBySlug( 'property-rental-visit-request-pending-alert-text', $languageTagStore ) }
        />
    {:else if visit.status === 'rescheduled-by-host' }
        <Alert
            type="warning"
            text={ getLocalizedTextBySlug( 'property-rental-visit-request-rescheduled-alert-text', $languageTagStore ) }
        />
    {/if}
    <div class="property-rental-visit-reschedule-button-container">
        {#if visit.status !== 'booked' }
            <ModalButton
                fullWidth={ false }
                variant="outlined"
                text={ getLocalizedTextBySlug( 'visit-request-modify-visit-schedule-label', $languageTagStore ) }
                on:click={ () => isScheduleVisitModalOpen = true }
            />
        {/if}
    </div>
</div>
