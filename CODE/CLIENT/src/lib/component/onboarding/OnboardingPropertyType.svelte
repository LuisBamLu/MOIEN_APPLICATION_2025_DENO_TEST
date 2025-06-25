<script>
    // -- IMPORTS

    import { updatePropertyParameters } from '$store/filterParameterByKeyMapStore.js';
    import FilterPropertyType from '$component/filter/FilterPropertyType.svelte';
    import OnboardingAction from '$component/onboarding/OnboardingAction.svelte';
    import { fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';

    // -- VARIABLES

    export let goToNextStep;

    function handlePropertyTypeIdSelected(
        event
        )
    {
        updatePropertyParameters( { 'typeId': event.detail } );
    }
</script>

<style lang="stylus" >
    // -- CLASSES

    .onboarding-property-type::before
    {
        background: url( '/image/onboarding/onboarding_property_type.avif' ) no-repeat center center;
    }
</style>

<div class="onboarding-property-type">
    <div out:fly={ { x: -1000, duration: 500, easing: cubicInOut } }>
        <div class="onboarding-property-type-content">
            <FilterPropertyType on:propertyTypeIdSelected={ handlePropertyTypeIdSelected } />
        </div>
    </div>
    <OnboardingAction goToNextStep={ goToNextStep } />
</div>
