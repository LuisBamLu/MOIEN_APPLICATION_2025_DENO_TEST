<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Switch from 'senselogic-flow/Switch.svelte';
    import ValuePicker from 'senselogic-flow/ValuePicker.svelte';
    import { getFormattedPrice, getTruncatedValue } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';

    // -- VARIABLES

    export let termType = 'short-term';
    export let minimumValue = 0;
    export let maximumValue = 2000;
    let values = [ minimumValue, maximumValue ];
    let step = 1;

    // -- FUNCTIONS

    function handleBudgetChange(
        valueArray
        )
    {
        if ( termType === 'short-term' )
        {
            $filterParameterByKeyMapStore.bookingParameters.minimumDailyBudget = valueArray[ 0 ];
            $filterParameterByKeyMapStore.bookingParameters.maximumDailyBudget = valueArray[ 1 ];
        }
        else if ( termType === 'long-term' )
        {
            $filterParameterByKeyMapStore.bookingParameters.minimumMonthlyBudget = valueArray[ 0 ];
            $filterParameterByKeyMapStore.bookingParameters.maximumMonthlyBudget = valueArray[ 1 ];
        }
    }

    // ~~

    function handleAvaiabilityChange(
        value
        )
    {
        $filterParameterByKeyMapStore.propertyParameters.immediateAvailability = value;
    }

    // -- STATEMENTS

    if ( termType === 'short-term' )
    {
        if ( $filterParameterByKeyMapStore.bookingParameters.minimumDailyBudget != null
             && $filterParameterByKeyMapStore.bookingParameters.maximumDailyBudget != null )
        {
            values =
                [
                    $filterParameterByKeyMapStore.bookingParameters.minimumDailyBudget,
                    $filterParameterByKeyMapStore.bookingParameters.maximumDailyBudget
                ];
        }
    }
    else if ( termType === 'long-term' )
    {
        if ( $filterParameterByKeyMapStore.bookingParameters.minimumMonthlyBudget != null
             && $filterParameterByKeyMapStore.bookingParameters.maximumMonthlyBudget != null )
        {
            values =
                [
                    $filterParameterByKeyMapStore.bookingParameters.minimumMonthlyBudget,
                    $filterParameterByKeyMapStore.bookingParameters.maximumMonthlyBudget
                ];
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-filter-price-popup
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .properties-filter-price-popup-price
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .properties-filter-price-popup-price-values
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .properties-filter-price-popup-avaiability
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>

<div class="properties-filter-price-popup">
    <div class="font-size-100 font-weight-700 color-gray">
        {#if termType === 'short-term' }
            { getLocalizedTextBySlug( 'filter-price-label', $languageTagStore ) }
        {:else if termType === 'long-term' }
            { getLocalizedTextBySlug( 'filter-price-availability-label', $languageTagStore ) }
        {/if}
    </div>
    <div class="properties-filter-price-popup-price">
        <div class="properties-filter-price-popup-price-values">
            <div class="font-size-90 font-weight-500 color-gray">
                {#if termType === 'short-term' }
                    { getLocalizedTextBySlug( 'filter-price-per-night-label', $languageTagStore ) }
                {:else if termType === 'long-term' }
                    { getLocalizedTextBySlug( 'filter-price-per-month-label', $languageTagStore ) }
                {/if}
            </div>
            <div class="font-size-75 font-weight-700 color-green">
                { getLocalizedTextBySlug( 'filter-price-from-label', $languageTagStore ) }
                { getFormattedPrice( getTruncatedValue( values[ 0 ] ), $languageTagStore ) }
                { getLocalizedTextBySlug( 'filter-price-to-label', $languageTagStore ) }
                { getFormattedPrice( getTruncatedValue( values[ 1 ] ), $languageTagStore ) }
            </div>
        </div>
        <ValuePicker
            limitArray={ [ minimumValue, maximumValue ] }
            bind:valueArray={ values }
            valuePrecision={ step }
            hasText={ false }
            onChange={ handleBudgetChange }
        />
        <div class="properties-filter-price-popup-price-values">
            <div class="font-size-75 font-weight-700 color-gray-550">
                { getFormattedPrice( minimumValue, $languageTagStore ) }
            </div>
            <div class="font-size-75 font-weight-700 color-gray-550">
                { getFormattedPrice( maximumValue, $languageTagStore ) }+
            </div>
        </div>
    </div>
    {#if termType === 'long-term' }
        <div class="properties-filter-price-popup-avaiability">
            <div class="font-size-75 font-weight-700 color-gray">
                { getLocalizedTextBySlug( 'filter-immediate-availability-label', $languageTagStore ) }
            </div>
            <Switch
                onChange={ ( value ) => handleAvaiabilityChange( value ) }
            />
        </div>
    {/if}
</div>
