<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import Switch from 'senselogic-flow/Switch.svelte';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';

    // -- VARIABLES

    export let featureType;

    // -- FUNCTIONS

    function handleFeatureTypeBookingOptionChange(
        featureType,
        value
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };
                if ( value === true )
                {
                    updatedParameters.featureParameters[ featureType.id ] = value;
                }
                else
                {
                    delete updatedParameters.featureParameters[ featureType.id ];
                }

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

    .properties-filter-feature-type-popup-item-booking-option
    {
        border-bottom: 1px solid grayColor700;
    }

    .properties-filter-feature-type-popup-item-booking-option:last-child
    {
        border-bottom: unset;
    }

    .properties-filter-feature-type-popup-item-booking-option-switch
    {
        width: 100%;
        padding: 1rem 0;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

{#if featureType.valueTypeId === 'booking-option' }
    <div class="properties-filter-feature-type-popup-item-booking-option">
        <div class="properties-filter-feature-type-popup-item-booking-option-switch">
            <div class="font-size-75 font-weight-700 color-gray">
                { getLocalizedText( featureType.name ) }
            </div>
            <Switch
                value=
                    {
                        $filterParameterByKeyMapStore.featureParameters[ featureType.id ]
                        ? $filterParameterByKeyMapStore.featureParameters[ featureType.id ]
                        : false
                    }
                onChange={ ( value ) => handleFeatureTypeBookingOptionChange( featureType, value ) }
            />
        </div>
    </div>
{/if}
