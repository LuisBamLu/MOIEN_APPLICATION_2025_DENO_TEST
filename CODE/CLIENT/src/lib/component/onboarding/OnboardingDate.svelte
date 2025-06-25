<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { updateBookingParameters } from '$store/filterParameterByKeyMapStore.js';
    import FilterDate from '$component/filter/FilterDate.svelte';
    import OnboardingAction from '$component/onboarding/OnboardingAction.svelte';
    import { cubicInOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    // -- VARIABLES

    export let goToNextStep;

    // -- FUNCTIONS

    function handleDateSelected(
        event
        )
    {
        updateBookingParameters( { 'arrivalDate': event.detail.arrivalDate } );
        updateBookingParameters( { 'departureDate': event.detail.departureDate } );
    }
</script>

<style>
    .onboarding-date::before
    {
        background: url( '/image/onboarding/onboarding_date.avif' ) no-repeat center center;
    }
</style>

<div class="onboarding-date">
    <div>
        <div out:fly={ { x: -1000, duration: 500, easing: cubicInOut } }>
            <div class="font-size-150 font-weight-600 color-gray-100 onboarding-date-title">
                { getLocalizedTextBySlug( 'date-title' ) }
            </div>
            <FilterDate on:dateSelected={ handleDateSelected }/>
        </div>
    </div>
    <OnboardingAction goToNextStep={ goToNextStep }/>
</div>
