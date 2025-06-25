<script>

    // -- IMPORTS

    import { filterParameterByKeyMapStore, updateBookingParameters } from '$store/filterParameterByKeyMapStore.js';
    import FilterBudget from '$component/filter/FilterBudget.svelte';
    import OnboardingAction from '$component/onboarding/OnboardingAction.svelte';
    import { fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';

    // -- VARIABLES

    export let goToNextStep;

    let termType;

    // -- STATEMENTS

    if ( $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForShortTerm' ] )
    {
        termType = 'short-term';
    }
    else if ( $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForLongTerm' ] )
    {
        termType = 'long-term';
    }

    // -- FUNCTIONS

    function handleBudgetSelected(
        event
        )
    {
        if ( termType === 'short-term' )
        {
            updateBookingParameters( { 'minimumDailyBudget': event.detail.minimumDailyBudget } );
            updateBookingParameters( { 'maximumDailyBudget': event.detail.maximumDailyBudget } );
        }
        else if ( termType === 'long-term' )
        {
            updateBookingParameters( { 'minimumMonthlyBudget': event.detail.minimumMonthlyBudget } );
            updateBookingParameters( { 'maximumMonthlyBudget': event.detail.maximumMonthlyBudget } );
        }
    }
</script>

<style>
    .onboarding-budget::before
    {
        background: url( '/image/onboarding/onboarding_budget.avif' ) no-repeat center center;
    }
</style>

<div class="onboarding-budget">
    <div>
        <div out:fly={ { x: -1000, duration: 500, easing: cubicInOut } }>
            <FilterBudget
                termType= { termType }
                on:budgetSelected={ handleBudgetSelected }
            />
        </div>
    </div>
    <OnboardingAction
        goToNextStep={ goToNextStep }
    />
</div>
