<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import RentalBookingMiniCard from './RentalBookingMiniCard.svelte';

    // -- VARIABLES

    export let rentalBookingArray = [];
    export let profileByUserIdMap = {};
    export let selectedRentalBooking = {};
    export let isRentalBookingModalOpen;
    export let propertyByIdMap = {};

    // -- FUNCTIONS

    function getFormattedDateString(
        dateString
        )
    {
        return new Date( dateString ).toLocaleString( $languageTagStore, { timeZone: 'UTC', day: '2-digit', month: 'short' } );
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .rental-booking-list
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

<div class="rental-booking-list">
    {#each rentalBookingArray as rentalBooking ( rentalBooking.id ) }
        <RentalBookingMiniCard
            propertyName={ getLocalizedText( propertyByIdMap[ rentalBooking.propertyId ].title, $languageTagStore ) }
            profile={ profileByUserIdMap[ rentalBooking.userId ] }
            text=
                "
                    { getFormattedDateString( rentalBooking.arrivalDate ) }
                    - { getFormattedDateString( rentalBooking.departureDate ) }
                    { rentalBooking.guestCount }
                    { getLocalizedTextBySlug( 'booking-checkout-page-people', $languageTagStore ) }
                "
            on:click={ () => { selectedRentalBooking = rentalBooking; isRentalBookingModalOpen = true } }
        />
    {/each}
</div>
