<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getRandomTuid } from 'senselogic-gist';
    import Input from '$component/element/Input.svelte';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import TimeRangeInput from './TimeRangeInput.svelte';
    import CancellationPolicyInput from './CancellationPolicyInput.svelte';
    import CurrencyInput from './CurrencyInput.svelte';

    // -- VARIABLES

    /** @type {{featureType: any, propertyFeatureByTypeIdMap?: any, property?: any}} */
    let { featureType, propertyFeatureByTypeIdMap = $bindable({}), property = null } = $props();
    let value = $state(getDefaultValue( featureType ));

    // -- FUNCTIONS

    function getDefaultValue(
        featureType
        )
    {
        if ( propertyFeatureByTypeIdMap[ featureType.id ] !== undefined )
        {
            return propertyFeatureByTypeIdMap[ featureType.id ].value;
        }
        else
        {
            switch ( featureType.valueTypeId )
            {
                case 'integer':
                case 'real':
                    return Number( featureType.defaultValue );
                case 'boolean':
                case 'booking-option':
                    return featureType.defaultValue === 'true';
                case 'time-range':
                    return featureType.defaultValue.replaceAll( '[', '' ).replaceAll( ']', '' ).trim().split( ',' );
                default:
                    return featureType.defaultValue;
            }
        }
    }

    // ~~

    function handleFeatureChange(
        value
        )
    {
        if ( propertyFeatureByTypeIdMap[ featureType.id ] === undefined )
        {
            propertyFeatureByTypeIdMap[ featureType.id ] =
                {
                    id: getRandomTuid(),
                    propertyId: property.id,
                    typeId: featureType.id,
                    value: value
                };
        }
        else
        {
            propertyFeatureByTypeIdMap[ featureType.id ].value = value;
        }
    }
</script>

{#if featureType.valueTypeId === 'integer' || featureType.valueTypeId === 'real' }
    <Input
        label={ getLocalizedText( featureType.name, $languageTagStore ) }
        type="number"
        value={ getDefaultValue( featureType ) }
        on:change={ ( e ) => handleFeatureChange( e.detail ) }
    />
{:else if featureType.valueTypeId === 'date' }
    <Input
        label={ getLocalizedText( featureType.name, $languageTagStore ) }
        type="date"
        value={ getDefaultValue( featureType ) }
        on:change={ ( e ) => handleFeatureChange( e.detail ) }
    />
{:else if featureType.valueTypeId === 'time-range' }
    <TimeRangeInput
        value={ getDefaultValue( featureType ) }
        on:change={ ( e ) => handleFeatureChange( e.detail ) }
    />
{:else if featureType.valueTypeId === 'boolean' || featureType.valueTypeId === 'booking-option' }
    <LabelledSwitch
        label={ getLocalizedText( featureType.name, $languageTagStore ) }
        bind:value={ value }
        onChange={ () => handleFeatureChange( value ) }
    />
{:else if featureType.valueTypeId === 'cancellation-policy' }
    <CancellationPolicyInput
        label={ getLocalizedText( featureType.name, $languageTagStore ) }
        bind:value={ value }
        onChange={ () => handleFeatureChange( value ) }
    />
{:else if featureType.valueTypeId === 'currency-code' }
    <CurrencyInput
        label={ getLocalizedText( featureType.name, $languageTagStore ) }
        bind:value={ value }
        onChange={ () => handleFeatureChange( value ) }
    />
{/if}
