<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '../store/languageTagStore';
    import Loading from '../component/element/Loading.svelte';
    import { onMount } from 'svelte';
    import { isLoadingProfile, profileSignedInStore } from '../store/profileStore';
    import { navigate } from 'svelte-routing';
    import { fetchData } from '../base';
    import PropertyRatingCard from '../component/page/properties/PropertyRatingCard.svelte';
    import { fade } from 'svelte/transition';
    import { userRentalsStore } from '../store/rentalStore';

    // -- VARIABLES

    let isLoading = true
    let rentalArray = [];
    let pendingRentalArray = [];
    let finishedRentalArray = [];
    let upcomingRentalArray = [];
    let pendingRentalsCount = 3;
    let finishedRentalsCount = 3;
    let upcomingRentalsCount = 3;

    // -- FUNCTIONS

    function loadAllBookings(
        type
        )
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
            if ( !isLoadingProfile && !$profileSignedInStore )
            {
                navigate( '/' );
            }

            let data = $userRentalsStore;

            if ( !data )
            {
                data = await fetchData( '/api/page/user-rentals', { method: 'POST', credentials: 'include' } );
                userRentalsStore.set( data );
            }

            if ( data )
            {
                rentalArray = data.userRentalsArray;

                for ( let rental of rentalArray )
                {
                    if ( rental.status === 'confirmed' || rental.status === 'paid' )
                    {
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

    .rentals
    {
        height: 100vh;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
    }

    .rentals-type
    {
        align-self: flex-start;
    }

    .rentals-list
    {
        height: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .rentals-list-container
    {
        border-bottom: grayColor800;
        padding-bottom: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        align-self: stretch;
    }

    .rentals-list::-webkit-scrollbar
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

    .rental-list-container-empty
    {
        height: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            width: 43rem;
        }
    }

    .rental-list-container-empty-text
    {
        padding: 1.5rem 0;

        text-align: center;
    }

    .moien-icon
    {
        height: 5rem;
        width: 5rem;

        background: url( '/image/icon/moien.svg' ) no-repeat;
        background-position: center;
        background-size: cover;
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'users-rentals-label', $languageTagStore ) }
    </title>
</svelte:head>

{#if isLoading }
    <Loading />
{:else}
    <div class="rentals">
        <div class="rentals-list">
            {#if rentalArray.length > 0 }
                {#if upcomingRentalArray.length > 0 }
                    <div class="rentals-list-container">
                        <div class="font-size-100 font-weight-700 color-black rentals-type">
                            { getLocalizedTextBySlug( 'upcoming-bookings-label', $languageTagStore ) }
                        </div>
                        {#each upcomingRentalArray.slice( 0, upcomingRentalsCount ) as upcomingRental }
                            <div transition:fade>
                                <PropertyRatingCard
                                    propertyRating=
                                        {
                                            typeof upcomingRental.property.averageRating === 'number'
                                            ? upcomingRental.property.averageRating
                                            : 0
                                        }
                                    rentalData={ upcomingRental }
                                    isRatingAvailable={ false }
                                    userType="host"
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
                    <div class="rentals-list-container">
                        <div  class="font-size-100 font-weight-700 color-black rentals-type">
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
                                    userType="host"
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
                    <div class="rentals-list-container">
                        <div  class="font-size-100 font-weight-700 color-black rentals-type">
                            { getLocalizedTextBySlug( 'pending-bookings-label', $languageTagStore ) }
                        </div>
                        {#each pendingRentalArray.slice( 0, pendingRentalsCount ) as pendingRental }
                            <div transition:fade>
                                <PropertyRatingCard
                                    propertyRating=
                                        {
                                            typeof pendingRental.property.averageRating === 'number'
                                            ? pendingRental.property.averageRating
                                            : 0
                                        }
                                    rentalData={ pendingRental }
                                    isRatingAvailable={ false }
                                    userType="host"
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
                <div class="rental-list-container-empty">
                    <div class="moien-icon"/>
                    <div class="rental-list-container-empty-text font-size-100 font-weight-700 color-gray-300">
                        { getLocalizedTextBySlug( 'no-bookings-label', $languageTagStore ) }
                    </div>
                </div>
            { /if}
        </div>
    </div>
{/if}
