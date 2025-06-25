<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { updateBookingParameters } from '$store/filterParameterByKeyMapStore.js';
    import FilterGuest from '$component/filter/FilterGuest.svelte';
    import OnboardingAction from '$component/onboarding/OnboardingAction.svelte';
    import { fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';

    // -- VARIABLES

    export let goToNextStep;

    // -- FUNCTIONS

    function handleGuestCounter(
        event
        )
    {
        if ( event.detail.adult > 0 )
        {
            updateBookingParameters( { 'adultCount': event.detail.adult } );
        }
        if ( event.detail.children > 0 )
        {
            updateBookingParameters( { 'childrenCount': event.detail.children } );
        }
        if ( event.detail.infant > 0 )
        {
            updateBookingParameters( { 'infantCount': event.detail.infant } );
        }
        if ( event.detail.pet > 0 )
        {
            updateBookingParameters( { 'petCount': event.detail.pet } );
        }
    }
</script>

<style>
    .onboarding-guest::before
    {
        background: url( '/image/onboarding/onboarding_guest.avif' ) no-repeat center center;
    }
</style>

<div class="onboarding-guest">
    <div>
        <div out:fly={ { x: -1000, duration: 500, easing: cubicInOut } }>
            <div class="font-size-150 font-weight-600 color-gray-100 onboarding-guest-title">
                { getLocalizedTextBySlug( 'guest-title' ) }
            </div>
            <FilterGuest
                on:guestCounter={ handleGuestCounter }
            />
        </div>
    </div>
    <OnboardingAction
        goToNextStep={ goToNextStep }
    />
</div>
