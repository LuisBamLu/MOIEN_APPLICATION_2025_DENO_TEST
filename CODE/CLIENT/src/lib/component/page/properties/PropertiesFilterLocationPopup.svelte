<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ValuePicker from 'senselogic-flow/ValuePicker.svelte';
    import { getTruncatedValue } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import FilterLocation from '$component/filter/FilterLocation.svelte';

    // -- VARIABLES

    export let selectedCity = null;

    let minimumValue = 10;
    let maximumValue = 200;
    let value = maximumValue;
    let step = 1;

    // -- STATEMENTS

    if ( $filterParameterByKeyMapStore.locationParameters.rangeDistance )
    {
        value = $filterParameterByKeyMapStore.locationParameters.rangeDistance;
    }

    // -- FUNCTIONS

    function handleDistanceChange(
        value
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };
                updatedParameters.locationParameters.rangeDistance = value;

                return updatedParameters;
            }
            );
    }

    // ~~

    function handleCityIdSelected(
        event
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };
                updatedParameters.propertyParameters.cityId = event.detail;

                return updatedParameters;
            }
            );
    }

    // ~~

    function handleCountryCodeSelected(
        event
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };
                updatedParameters.propertyParameters.countryCode = event.detail;

                return updatedParameters;
            }
            );
    }

    // ~~

    function handleCurrentCoordinatesSelected(
        event
        )
    {
        let currentCoordinates = null;

        if ( event.detail )
        {
            currentCoordinates = event.detail.toString();
        }

        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };
                updatedParameters.locationParameters.currentCoordinates = currentCoordinates;

                return updatedParameters;
            }
            );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-filter-location-popup
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .properties-filter-location-popup-distance
    {
        border-bottom: 1px solid lightGrayBorderColor;
        padding-bottom: 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .properties-filter-location-popup-distance-values
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>

<div class="properties-filter-location-popup">
    <div class="font-size-100 font-weight-700 color-gray">
        { getLocalizedTextBySlug( 'filter-location-label', $languageTagStore ) }
    </div>
    <FilterLocation
        bind:selectedCity={ selectedCity }
        on:cityIdSelected={ handleCityIdSelected }
        on:countryCodeSelected={ handleCountryCodeSelected }
        on:currentCoordinatesSelected={ handleCurrentCoordinatesSelected }
    />
    {#if $filterParameterByKeyMapStore.propertyParameters.cityId || $filterParameterByKeyMapStore.propertyParameters.countryCode }
        <div class="properties-filter-location-popup-distance">
            <div class="properties-filter-location-popup-distance-values">
                <div class="font-size-90 font-weight-500 color-gray">
                    { getLocalizedTextBySlug( 'filter-location-radius-label', $languageTagStore ) }
                </div>
                <div class="font-size-75 font-weight-700 color-green">
                    { getTruncatedValue( value ) } km
                </div>
            </div>
            <ValuePicker
                limitArray={ [ minimumValue, maximumValue ] }
                valuePrecision={ step }
                hasText={ false }
                onChange={ handleDistanceChange }
                bind:value={ value }
            />
            <div class="properties-filter-location-popup-distance-values">
                <div class="font-size-75 font-weight-700 color-gray-550">
                    { minimumValue } km
                </div>
                <div class="font-size-75 font-weight-700 color-gray-550">
                    { maximumValue } + km
                </div>
            </div>
        </div>
    {/if}
</div>
