<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import ValuePicker from 'senselogic-flow/ValuePicker.svelte';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import Counter from '$component/element/Counter.svelte';

    // -- VARIABLES

    export let featureType;
    export let featureTypeSubCategoryId;
    export let termType;

    // -- FUNCTIONS

    function handleFeatureTypeRangeChange(
        featureType,
        value
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters }

                if ( value[ 1 ] > 0 )
                {
                    updatedParameters.featureParameters[ featureType.id ] = value.join( ',' );
                }
                else
                {
                    delete updatedParameters.featureParameters[ featureType.id ];
                }

                return updatedParameters;
            }
            );
    }

    // ~~

    function handleFeatureTypeIntegerChange(
        featureType,
        counterDirection
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let currentValue = Number( currentParameters.featureParameters[ featureType.id ] ) || Number( featureType.defaultValue );

                let newValue;

                if ( counterDirection === 'increase' )
                {
                    newValue = Math.min( currentValue + 1, featureType.maximumValue );
                }
                else
                {
                    newValue = Math.max( currentValue - 1, featureType.minimumValue );
                }

                let updatedFeatureParameters = { ...currentParameters.featureParameters };

                if ( newValue > 0 )
                {
                    updatedFeatureParameters[ featureType.id ] = newValue;
                }
                else
                {
                    delete updatedFeatureParameters[ featureType.id ];
                }

                return (
                    {
                        ...currentParameters,
                        featureParameters: updatedFeatureParameters
                    }
                    );
            }
            );
    }
</script>

<style lang="stylus">
   // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-filter-feature-type-popup-item-integer
    {
        border-bottom: 1px solid grayColor700;
        padding: 0.75rem 0;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

{#if termType==="long-term" && featureType.id === 'property-area' }
    <div class="range-input-container">
        <div class="font-size-70 font-weight-500 color-gray">
            { getLocalizedText( featureType.name ) }
        </div>
        <ValuePicker
            onChange={ value => handleFeatureTypeRangeChange( featureType, value ) }
            limitArray={ [ 0, 300 ] }
            valueSuffix="m²"
            valuePrecision={ 0.5 }
            valueArray=
                {
                    $filterParameterByKeyMapStore.featureParameters[ featureType.id ]
                    ? $filterParameterByKeyMapStore.featureParameters[ featureType.id ].split( ',' )
                    : [ 0, 0 ]
                }
        />
    </div>
{:else if featureType.valueTypeId === 'integer' }
    {#if termType==='long-term'
        && ( featureTypeSubCategoryId === 'composition' || featureTypeSubCategoryId === 'guest-entrance-and-parking' )
    }
        {#if featureType.id === 'room-count' || featureType.id === 'bedroom-count'|| featureType.id === 'floor-count' }
            <div class="range-input-container">
                <div class="font-size-70 font-weight-500 color-gray">
                    { getLocalizedText( featureType.name ) }
                </div>
                <ValuePicker
                    onChange={ value => handleFeatureTypeRangeChange( featureType, value ) }
                    limitArray={ [ 0, 6 ] }
                    valueArray=
                        {
                            $filterParameterByKeyMapStore.featureParameters[ featureType.id ]
                            ? $filterParameterByKeyMapStore.featureParameters[ featureType.id ].split( ',' )
                            : [ 0, 0 ]
                        }
                />
            </div>
        {/if}
    {:else if featureType.id === 'bedroom-count' || featureType.id === 'bathroom-count'}
            <div class="properties-filter-feature-type-popup-item-integer">
                <div class="properties-filter-feature-type-popup-item-integer-content">
                    <div class="font-size-75 font-weight-500 color-gray">
                        { getLocalizedText( featureType.name ) }
                    </div>
                </div>
                <div class="properties-filter-feature-type-popup-item-integer-counter">
                    <Counter
                        count=
                            {
                                $filterParameterByKeyMapStore.featureParameters[ featureType.id ]
                                || featureType.defaultValue
                            }
                        minCount={ featureType.minimumValue }
                        maxCount={ featureType.maximumValue }
                        on:change={ e => handleFeatureTypeIntegerChange( featureType, e.detail ) }
                    >
                        {
                            $filterParameterByKeyMapStore.featureParameters[ featureType.id ]
                            || featureType.defaultValue
                        }
                    </Counter>
                </div>
            </div>
    {/if}
{/if}
