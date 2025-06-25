<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';

    // -- FUNCTIONS

    function getFormattedDateString(
        dateString
        )
    {
        return new Date( dateString )
            .toLocaleString(
                $languageTagStore,
                {
                    timeZone: 'UTC',
                    weekday: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long'
                }
                );
    }

    // -- VARIABLES

    export let guestCount;
    export let arrivalDate;
    export let departureDate;
    export let creationTimestamp;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .container
    {
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'current-stays-page-booking-details-label', $languageTagStore ) }
>
    <div>
        <div class="container">
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedTextBySlug( 'booking-checkout-page-travelers', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-700 color-gray-300">
                { guestCount }
            </div>
        </div>
        <div class="container">
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedTextBySlug( 'events-page-check-in-label', $languageTagStore ) }
            </div>
            <div class="font-size, -90 font-weight-700 color-gray-300">
                { getFormattedDateString( arrivalDate ) }
            </div>
        </div>
        <div class="container">
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedTextBySlug( 'events-page-check-out-label', $languageTagStore ) }
            </div>
            <div class="font-size, -90 font-weight-700 color-gray-300">
                { getFormattedDateString( departureDate ) }
            </div>
        </div>
        <div class="container">
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedTextBySlug( 'current-stays-page-booking-date-label', $languageTagStore ) }
            </div>
            <div class="font-size, -90 font-weight-700 color-gray-300">
                { getFormattedDateString( creationTimestamp ) }
            </div>
        </div>
    </div>
</EditLeaseContractPageSection>
