<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base.js';
    import { languageTagStore } from '$store/languageTagStore';
    import { isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import Loading from '$component/element/Loading.svelte';
    import PropertyRatingCard from '../component/page/properties/PropertyRatingCard.svelte';
    import { fade } from 'svelte/transition';
    import { userBookingsStore } from '../store/rentalStore';

    // -- VARIABLES

    let isLoading = true;
    let rentalArray = [];
    let pendingRentalArray = [];
    let confirmedRentalArray = [];
    let finishedRentalArray = [];
    let upcomingRentalArray = [];
    let upcomingRentalsCount = 3;
    let finishedRentalsCount = 3;
    let pendingRentalsCount = 3;

    // -- FUNCTIONS

    function loadAllBookings( type )
    {
        switch ( type )
        {
            case 'upcoming':
                upcomingRentalsCount += upcomingRentalArray.length;
                break;
            case 'finished':
                finishedRentalsCount += finishedRentalArray.length;
                break;
            case 'pending':
                pendingRentalsCount += pendingRentalArray.length;
                break;
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( !$isLoadingProfile && !$profileSignedInStore )
            {
                navigate( '/' );
            }

            let data = $userBookingsStore;

            if ( !data )
            {
                data = await fetchData( '/api/page/bookings', { method: 'POST', credentials: 'include' } );
                userBookingsStore.set( data );
            }

            if ( data )
            {
                rentalArray = data.propertyArrayByRentalBooking.map( rental => rental.rentalBooking );

                for ( let rental of rentalArray )
                {
                    if ( rental.status === 'confirmed' || rental.status === 'paid' )
                    {
                        confirmedRentalArray.push( rental );

                        if ( new Date( rental.departureDate ).getTime() < Date.now() )
                        {
                            finishedRentalArray.push( rental );
                        }
                        else
                        {
                            upcomingRentalArray.push( rental );
                        }
                    }
                    else if ( rental.status === 'requested' )
                    {
                        pendingRentalArray.push( rental );
                    }
                }

                finishedRentalArray.sort(
                    ( a, b ) =>
                    new Date( b.departureDate ).getTime() - new Date( a.departureDate ).getTime()
                    );
            }

            isLoading = false;
        }
    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl'
    @import '../../mixin.styl'

    // -- CLASSES

    .bookings
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
    }

    .bookings-type
    {
        align-self: flex-start;
    }

    .booking-list-container
    {
        border-bottom: grayColor800;
        padding-bottom: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        align-self: stretch;
    }

    .bookings-list
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .bookings-list::-webkit-scrollbar
    {
        display: none;
    }

    .view-all-button
    {
        height: 3.25rem;
        width: 80%;
        border-radius: .75rem;
        padding: 0.8rem 2.5rem;

        display: flex;
        gap: .5rem;
        justify-content: center;
        align-items: center;

        background: grayColor950;

        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 700;
        font-style: normal;
        text-align: center;
        color: blueColor100;

        +media( desktop )
        {
            width: 34%;
        }
    }

    .view-all-button:hover
    {
        color: blueColor500;
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'bookings-page-title', $languageTagStore ) }
    </title>
</svelte:head>
{#if isLoading }
    <Loading />
{:else}
<div class="bookings">
    <div class="bookings-list">
        {#if rentalArray.length > 0 }
            {#if upcomingRentalArray.length > 0 }
                <div class="booking-list-container">
                    <div  class="font-size-100 font-weight-700 color-black bookings-type">
                        { getLocalizedTextBySlug( 'upcoming-bookings-label', $languageTagStore ) }
                    </div>
                    {#each upcomingRentalArray.slice( 0, upcomingRentalsCount ) as upcomingRental }
                        <div transition:fade>
                            <PropertyRatingCard
                                rentalData={ upcomingRental }
                                propertyRating=
                                    {
                                        typeof upcomingRental.property.averageRating === 'number'
                                        ? upcomingRental.property.averageRating
                                        : 0
                                    }
                                isRatingAvailable={ false }
                                userType="guest"
                                rentalId={ upcomingRental.id }
                            />
                        </div>
                    {/each}
                    {#if upcomingRentalArray.length > 3 && upcomingRentalsCount < upcomingRentalArray.length }
                        <button
                            class="view-all-button"
                            on:click={ () => loadAllBookings( 'upcoming' ) }
                        >
                            { getLocalizedTextBySlug( 'property-rental-review-view-all-button', $languageTagStore ) }
                        </button>
                    {/if}
                </div>
            {/if}
            {#if finishedRentalArray.length > 0 }
                <div class="booking-list-container">
                    <div class="font-size-100 font-weight-700 color-black bookings-type">
                        { getLocalizedTextBySlug( 'recent-bookings-label', $languageTagStore ) }
                    </div>
                    {#each finishedRentalArray.slice( 0, finishedRentalsCount ) as finishedRental }
                        <div transition:fade>
                            <PropertyRatingCard
                                rentalData={ finishedRental }
                                propertyRating=
                                    {
                                        typeof finishedRental.property.averageRating === 'number'
                                        ? finishedRental.property.averageRating
                                        : 0
                                    }
                                isRatingAvailable={ true }
                                userType="guest"
                                rentalId={ finishedRental.id }
                            />
                        </div>
                    {/each}
                    {#if finishedRentalArray.length > 3 && finishedRentalsCount < finishedRentalArray.length }
                        <button
                            class="view-all-button"
                            on:click={ () => loadAllBookings( 'finished' ) }
                        >
                            { getLocalizedTextBySlug( 'property-rental-review-view-all-button', $languageTagStore ) }
                        </button>
                    {/if}
                </div>
            {/if}
            {#if pendingRentalArray.length > 0 }
                <div class="booking-list-container">
                    <div  class="font-size-100 font-weight-700 color-black bookings-type">
                        { getLocalizedTextBySlug( 'pending-bookings-label', $languageTagStore ) }
                    </div>
                    {#each pendingRentalArray.slice( 0, pendingRentalsCount ) as pendingRental }
                        <div transition:fade>
                            <PropertyRatingCard
                                rentalData={ pendingRental }
                                propertyRating=
                                    {
                                        typeof pendingRental.property.averageRating === 'number'
                                        ? pendingRental.property.averageRating
                                        : 0
                                    }
                                isRatingAvailable={ false }
                                userType="guest"
                                rentalId={ pendingRental.id }
                            />
                        </div>
                    {/each}
                    {#if pendingRentalArray.length > 3 && pendingRentalsCount < pendingRentalArray.length }
                        <button
                            class="view-all-button"
                            on:click={ () => loadAllBookings( 'pending' ) }
                        >
                            { getLocalizedTextBySlug( 'property-rental-review-view-all-button', $languageTagStore ) }
                        </button>
                    {/if}
                </div>
            {/if}
        {:else}
            <div class="font-size-100 font-weight-700 color-black">
                { getLocalizedTextBySlug( 'location-search-no-results-label', $languageTagStore ) }
            </div>
        {/if}
    </div>
</div>
{/if}
