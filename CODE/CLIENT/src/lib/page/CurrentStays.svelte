<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import PropertyTabList from '$component/page/current-stays/PropertyTabList.svelte';
    import RentalBookingList from '$component/page/current-stays/RentalBookingList.svelte';
    import RentalBookingModal from '$component/page/current-stays/RentalBookingModal.svelte';

    // -- VARIABLES

    let isLoading = true;

    // -- FUNCTIONS

    export let id = null;
    let propertyArray = [];
    let rentalBookingArray = [];
    let selectedPropertyId = null;
    let rentalBookingArrayByPropertyIdMap = {};
    let propertyByIdMap = {};
    let profileByUserIdMap = {};
    let rentalBookingByIdMap = {};
    let rentalDayArrayByRentalBookingIdMap = {};
    let isRentalBookingModalOpen = false;
    let selectedRentalBooking = null;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/page/current-stays', { method: 'POST', credentials: 'include' } );
            propertyArray = result.propertyArray;
            rentalBookingArray = result.rentalBookingArray;
            rentalBookingArrayByPropertyIdMap = result.rentalBookingArrayByPropertyIdMap;
            propertyByIdMap = result.propertyByIdMap;
            profileByUserIdMap = result.profileByUserIdMap;
            rentalBookingByIdMap = result.rentalBookingByIdMap;
            rentalDayArrayByRentalBookingIdMap = result.rentalDayArrayByRentalBookingIdMap;

            if ( id !== null )
            {
                selectedRentalBooking = rentalBookingByIdMap[ id ];
                isRentalBookingModalOpen = true;

                if ( !selectedRentalBooking )
                {
                    isRentalBookingModalOpen = false;
                }
            }

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .current-and-upcoming-stays-page
    {
        position: relative;

        margin-bottom: 4rem;
        padding: 0rem 1rem;
        padding-bottom: 6.75rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            margin-bottom: unset;
        }
    }

    .current-and-upcoming-stays-page-content-container
    {
        width: 100%;
        padding-top: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 76.875rem;
        }
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'my-ads-page-current-and-upcoming-stays', $languageTagStore ) }
    </title>
</svelte:head>

<div class="current-and-upcoming-stays-page">
    <div class="current-and-upcoming-stays-page-content-container">
        <div class="current-and-upcoming-stays-page-heading">
            <div class="font-size-150 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'my-ads-page-current-and-upcoming-stays', $languageTagStore ) }
            </div>
        </div>
        {#if isLoading }
            <Loading />
        {:else}
            <PropertyTabList propertyArray={ propertyArray } bind:selectedPropertyId={ selectedPropertyId } />
            <RentalBookingList
                rentalBookingArray={ selectedPropertyId ? rentalBookingArrayByPropertyIdMap[ selectedPropertyId ] : rentalBookingArray }
                propertyByIdMap={ propertyByIdMap }
                profileByUserIdMap={ profileByUserIdMap }
                bind:selectedRentalBooking={ selectedRentalBooking }
                bind:isRentalBookingModalOpen={ isRentalBookingModalOpen }
            />
        {/if}
    </div>
</div>
<RentalBookingModal
    profileByUserIdMap={ profileByUserIdMap }
    propertyByIdMap={ propertyByIdMap }
    rentalDayArray={ selectedRentalBooking ? rentalDayArrayByRentalBookingIdMap[ selectedRentalBooking.id ] : null }
    bind:rentalBookingArray={ rentalBookingArray }
    bind:rentalBookingArrayByPropertyIdMap={ rentalBookingArrayByPropertyIdMap }
    bind:rentalBookingByIdMap={ rentalBookingByIdMap }
    bind:isOpen={ isRentalBookingModalOpen }
    bind:rentalBooking={ selectedRentalBooking }
/>
