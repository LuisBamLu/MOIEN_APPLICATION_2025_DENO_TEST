<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { updatePropertyParameters } from '$store/filterParameterByKeyMapStore.js';
    import FilterLocation from '$component/filter/FilterLocation.svelte';
    import OnboardingAction from './OnboardingAction.svelte';
    import { fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';

    // -- VARIABLES

    export let goToNextStep;

    // -- FUNCTIONS

    function handleCityIdSelected(
        event
        )
    {
        updatePropertyParameters( { 'cityId': event.detail } );
    }

    // ~~

    function handleCountryCodeSelected(
        event
        )
    {
        updatePropertyParameters( { 'countryCode': event.detail } );
    }

    // ~~

    function handleCurrentCoordinatesSelected(
        event
        )
    {
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .onboarding-location::before
    {
        background: url( '/image/onboarding/onboarding_location.avif' ) no-repeat center center;
    }

    .onboarding-location-content
    {
        transform: translateY( 100vh );

        animation: slide-in-bottom 500ms ease-in-out;
        animation-delay: 250ms;
        animation-fill-mode: forwards;

        +media( desktop )
        {
            transform: none;

            animation: none;
        }
    }

    .onboarding-location-content > div
    {
        transform: none;

        animation: none;
        animation-delay: none;

        +media( desktop )
        {
            transform: 100vw;

            animation: slide-in-right 500ms ease-in-out;
            animation-delay: 250ms;
        }
    }

    @keyframes slide-in-bottom
    {
        0%
        {
            transform: translateY( 100vh );
        }

        100%
        {
            z-index: inherit;
            transform: translateY( 0 );
        }
    }

    @keyframes slide-in-right
    {
        0%
        {
            transform: translateX( 100vw );

            opacity: 0;
            filter: blur( 6px );
        }

        75%
        {
            transform: translateX( 0 );
        }

        100%
        {
            opacity: 1;
            filter: blur( 0px );
        }
    }
</style>

<div class="onboarding-location">
    <div class="onboarding-location-content">
        <div out:fly={ { x: -1000, duration: 500, easing: cubicInOut } }>
            <div class="font-size-150 font-weight-600 color-gray-100 onboarding-location-title">
                { getLocalizedTextBySlug( 'location-title' ) }
            </div>
            <FilterLocation
                on:cityIdSelected={ handleCityIdSelected }
                on:countryCodeSelected={ handleCountryCodeSelected }
                on:currentCoordinatesSelected={ handleCurrentCoordinatesSelected }
            />
        </div>
    </div>
    <OnboardingAction goToNextStep={ goToNextStep } />
</div>
