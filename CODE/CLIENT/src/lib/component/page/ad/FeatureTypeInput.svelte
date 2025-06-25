<script>
    // -- IMPORTS

    import { createEventDispatcher, onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug, isArray, isNaN, isString } from 'senselogic-gist';
    import CounterInput from '$component/element/CounterInput.svelte';
    import Tag from '$component/element/Tag.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';

    // -- VARIABLES

    export let featureType;
    export let propertyFeatureByTypeIdMap;

    let dispatch = createEventDispatcher();
    let isLoading = true;

    // -- FUNCTIONS

    function handleFeatureChange(
        value,
        start = false,
        end = false
        )
    {
        if ( start || end )
        {
            let timeArray;

            if ( propertyFeatureByTypeIdMap[ featureType.id ] === undefined
                 || !isArray( propertyFeatureByTypeIdMap[ featureType.id ]?.value ) )
            {
                timeArray = new Array( 2 );
            }
            else
            {
                timeArray = propertyFeatureByTypeIdMap[ featureType.id ].value;
            }

            if ( start )
            {
                timeArray[ 0 ] = value;
            }
            else if ( end )
            {
                timeArray[ 1 ] = value;
            }

            value = timeArray;
        }

        dispatch( 'change', { value } );
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( featureType.valueTypeId === 'time-range' )
            {
                if ( propertyFeatureByTypeIdMap[ featureType.id ] === undefined )
                {
                    propertyFeatureByTypeIdMap[ featureType.id ] =
                        {
                            typeId: featureType.id,
                            value: [ '00:00', '23:59' ],
                            isPromoted: false
                        };
                }
                else
                {
                    if ( isString( propertyFeatureByTypeIdMap[ featureType.id ].value ) )
                    {
                        let timeArray;

                        try
                        {
                           timeArray = JSON.parse( propertyFeatureByTypeIdMap[ featureType.id ].value );
                        }
                        catch( error )
                        {
                            console.error( error );
                            timeArray = [ '00:00', '23:59' ];
                        }

                        if ( isArray( timeArray ) )
                        {
                            propertyFeatureByTypeIdMap[ featureType.id ].value = timeArray;
                        }
                        else
                        {
                            propertyFeatureByTypeIdMap[ featureType.id ].value = [ '00:00', '23:59' ];
                        }
                    }
                }
            }

            isLoading = false;
        }
    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .feature-type-item-integer
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .feature-type-real-input
    {
        max-width: 6rem;

        text-align: right;
        -moz-appearance: textfield;
    }

    .feature-type-real-input:focus,
    .feature-type-date-text-input:focus
    {
        outline: none;
        border: none;
    }

    .feature-type-real-input::-webkit-outer-spin-button,
    .feature-type-real-input::-webkit-inner-spin-button
    {
        -webkit-appearance: none;
        margin: 0;
    }

    .feature-type-item-real-input-container
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .feature-type-date-text-input
    {
        max-width: 12rem;
        border: none;

        background-color: transparent;

        text-align: right
        -moz-appearance: textfield;
    }

    .feature-type-item-time-range
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .feature-type-item-time-range-content
    {
        width: 100%;

        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;
    }

    .feature-type-item-time-range-values
    {
        display: flex;
        gap: 0.5rem;
    }
</style>

{#if featureType.valueTypeId === 'integer' }
    <div class="feature-type-item-integer">
        <div class="feature-type-item-integer-content">
            <div class="font-size-90 font-weight-500 color-black feature-type-item-integer-label">
                { getLocalizedText( featureType.name, $languageTagStore ) }
            </div>
        </div>
        <div class="feature-type-item-integer-counter">
            <CounterInput
                name="feature-{ featureType.id }"
                count=
                    {
                        isNaN( Number( propertyFeatureByTypeIdMap[ featureType.id ]?.value ) )
                        ? featureType.defaultValue
                        : Number( propertyFeatureByTypeIdMap[ featureType.id ].value )
                    }
                minCount={ featureType.minimumValue }
                maxCount={ featureType.maximumValue }
                on:change={ ( event ) => handleFeatureChange( event.detail ) }
            />
        </div>
    </div>
{:else if featureType.valueTypeId === 'date' }
    <div class="feature-type-item-integer">
        <div class="feature-type-item-integer-content">
            <div class="font-size-90 font-weight-500 color-black feature-type-item-integer-label">
                { getLocalizedText( featureType.name, $languageTagStore ) }
            </div>
        </div>
        <input
            type="text"
            name="feature-{ featureType.id }"
            class="font-size-90 font-weight-700 feature-type-date-text-input"
            value={ propertyFeatureByTypeIdMap[ featureType.id ]?.value ?? new Date().toISOString().split( 'T' )[ 0 ] }
            placeholder="YYYY-MM-DD"
            on:change={ ( event ) => handleFeatureChange( event.target.value ) }
        />
    </div>
{:else if
    featureType.valueTypeId === 'real'
    && featureType.id !== 'long-term-monthly-rent'
    && featureType.id !== 'long-term-monthly-total'
    && featureType.id !== 'long-term-profit-sharing'
    && featureType.id !== 'property-area'
    && featureType.id !== 'long-term-monthly-charges'
    && featureType.id !== 'long-term-annual-taxes'
    && featureType.id !== 'long-term-agency-fee'
}
    <div class="feature-type-item-integer">
        <div class="feature-type-item-integer-content">
            <div class="font-size-90 font-weight-500 color-black feature-type-item-integer-label">
                { getLocalizedText( featureType.name, $languageTagStore ) }
            </div>
        </div>
        <div class="feature-type-item-real-input-container">
            <input
                name="feature-{ featureType.id }"
                type="number"
                class="font-size-90 font-weight-700 feature-type-real-input"
                step=".01"
                value=
                    {
                        isNaN( Number( propertyFeatureByTypeIdMap[ featureType.id ]?.value ) )
                        ? featureType.defaultValue
                        : Number( propertyFeatureByTypeIdMap[ featureType.id ]?.value )
                    }
                on:change={ ( event ) => handleFeatureChange( event.target.valueAsNumber ) }
            />
            {#if featureType.id.includes( 'area' ) }
                <div class="font-size-90 font-weight-700 color-black">
                    m²
                </div>
            {/if}
        </div>
    </div>
{:else if featureType.valueTypeId === 'boolean' || featureType.valueTypeId === 'booking-option' }
    <div class="feature-type-item-boolean">
        <Tag
            name="feature-{ featureType.id }"
            label={ getLocalizedText( featureType.text, $languageTagStore ) }
            isSelected={ propertyFeatureByTypeIdMap[ featureType.id ]?.value }
            on:change={ ( event ) => handleFeatureChange( event.detail ) }
        />
    </div>
{:else if featureType.valueTypeId === 'time-range' }
    {#if isLoading }
        <div class="font-size-100 font-weight-700 color-black">
            { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
        </div>
    {:else}
        <div class="feature-type-item-time-range">
            <div class="feature-type-item-time-range-content">
                <div class="font-size-90 font-weight-500 color-black feature-type-item-time-range-label">
                    { getLocalizedText( featureType.name, $languageTagStore ) }
                </div>
                <div class="feature-type-item-time-range-values">
                    <input
                        type="time"
                        name="feature-{ featureType.id }-start"
                        class="feature-type-time-range-input"
                        value={ propertyFeatureByTypeIdMap[ featureType.id ].value[ 0 ] }
                        on:change={ ( event ) => handleFeatureChange( event.target.value, true, false ) }
                    >
                    <input
                        type="time"
                        name="feature-{ featureType.id }-end"
                        class="
                        feature-type-time-range-input"
                        value={ propertyFeatureByTypeIdMap[ featureType.id ].value[ 1 ] }
                        on:change={ ( event ) => handleFeatureChange( event.target.value, false, true ) }
                    >
                </div>
            </div>
        </div>
    {/if}
{/if}
