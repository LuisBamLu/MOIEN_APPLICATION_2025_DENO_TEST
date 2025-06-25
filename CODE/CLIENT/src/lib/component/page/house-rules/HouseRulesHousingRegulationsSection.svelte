<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let featureTypeArray = [];
    export let featureByTypeIdMap = {};
    export let propertyId;
    let featureValueByTypeIdMap = {};

    // -- FUNCTIONS

    function handleFeatureChange(
        featureTypeId
        )
    {
        if ( !featureByTypeIdMap[ featureTypeId ] )
        {
            featureByTypeIdMap[ featureTypeId ] =
                {
                    propertyId: propertyId,
                    typeId: featureTypeId
                };
        }

        featureByTypeIdMap[ featureTypeId ].value = featureValueByTypeIdMap[ featureTypeId ];
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            for ( let [ featureTypeId, feature ] of Object.entries( featureByTypeIdMap ) )
            {
                if ( featureTypeId !== 'check-in-time' )
                {
                    featureValueByTypeIdMap[ featureTypeId ] = feature.value === 'true';
                }
            }
        }
        );
</script>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'house-rules-page-housing-regulations-label', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'house-rules-page-housing-regulations-helper', $languageTagStore ) }
>
    {#each featureTypeArray as featureType }
        {#if featureType.id !== 'check-in-time' }
            <LabelledSwitch
                label={ getLocalizedText( featureType.name, $languageTagStore ) }
                onChange={ () => handleFeatureChange( featureType.id ) }
                bind:value={ featureValueByTypeIdMap[ featureType.id ] }
            />
        {/if}
    {/each}
</EditLeaseContractPageSection>
