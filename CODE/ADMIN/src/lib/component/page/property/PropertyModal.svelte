<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalHeader from '$component/element/modal/ModalHeader.svelte';
    import AccordionItem from '$component/element/AccordionItem.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';
    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalActions from '$component/element/modal/ModalActions.svelte';
    import ModalButton from '$component/element/modal/ModalButton.svelte';
    import { onMount } from 'svelte';
    import { fetchData, getNormalCaseFromSnakeCaseString } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { getStorageImagePath } from '$src/lib/storage';
    import PropertyImageIterator from './PropertyImageIterator.svelte';
    import PropertyForm from './PropertyForm.svelte';
    import FeatureTypeInputIterator from './FeatureTypeInputIterator.svelte';
    import LocationSection from './LocationSection.svelte';

    // -- VARIABLES

    /** @type {{propertyId?: any, selectedPropertyIndex?: any, isOpen?: boolean}} */
    let { propertyId = null, selectedPropertyIndex = $bindable(null), isOpen = false } = $props();
    let property = $state(null);
    let propertyUserProfile = $state(null);
    let propertyManagerProfile = $state(null);
    let propertyFeatureByTypeIdMap = $state({});
    let featureTypeByIdMap = null;
    let propertyTypeArray = $state([]);
    let energyDiagnosisArray = $state([]);
    let propertyStatusArray = $state([]);
    let heatingTypeArray = $state([]);
    let rentalTypeArray = $state([]);
    let isLoading = $state(true);

    // -- FUNCTIONS

    function populatePropertyFeatureByTypeIdMap(
        featureArray
        )
    {
        for ( let feature of featureArray )
        {
            switch ( feature.type.valueTypeId )
            {
                case 'integer':
                case 'real':
                    propertyFeatureByTypeIdMap[ feature.typeId ] = { ...feature, value: Number( feature.value ) }
                    break;
                case 'boolean':
                    propertyFeatureByTypeIdMap[ feature.typeId ] = { ...feature, value: feature.value === 'true' };
                    break;
                case 'time-range':
                    propertyFeatureByTypeIdMap[ feature.typeId ] =
                        {
                            ...feature,
                            value: feature.value.replaceAll( '[', '' ).replaceAll( ']', '' ).trim().split( ',' )
                        };
                    break;
                default:
                    propertyFeatureByTypeIdMap[ feature.typeId ] = feature;
            }
        }
    }

    // ~~

    async function handleSubmit(
        )
    {
        let result =
            await fetchData(
                '/api/admin/property/update/' + propertyId,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify( { property: property, featureArray: Object.values( propertyFeatureByTypeIdMap ) } )
                }
                );

        if (  result.property )
        {
            property = result.property;
        }

        if ( result.featureArray )
        {
            populatePropertyFeatureByTypeIdMap( result.featureArray );
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result
                = await fetchData(
                    '/api/admin/property/' + propertyId,
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                    );
            property = result.property;
            propertyUserProfile = result.propertyUserProfile;
            propertyManagerProfile = result.propertyManagerProfile;
            featureTypeByIdMap = result.featureTypeByIdMap;
            propertyTypeArray = result.propertyTypeArray;
            energyDiagnosisArray = result.energyDiagnosisArray;
            propertyStatusArray = result.propertyStatusArray;
            heatingTypeArray = result.heatingTypeArray;
            rentalTypeArray = result.rentalTypeArray;
            populatePropertyFeatureByTypeIdMap( property.featureArray );
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .container
    {
        padding: 0.25rem 0;

        display: flex;
        gap: 0.5rem;
    }

    .profile-container
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .profile-image
    {
        width: 3.5rem;
        width: 3.5rem;
        border-radius: 50%;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'property-label' ) }
        onClose={ () => selectedPropertyIndex = null }
    />
    <ModalContent>
        <div class="content-container">
            {#if isLoading }
                { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
            {:else}
                <PropertyImageIterator bind:property={ property } />
                <LocationSection bind:property={ property } />
                <PropertyForm
                    bind:property={ property }
                    propertyTypeArray={ propertyTypeArray }
                    energyDiagnosisArray={ energyDiagnosisArray }
                    heatingTypeArray={ heatingTypeArray }
                    propertyStatusArray={ propertyStatusArray }
                    rentalTypeArray={ rentalTypeArray }
                />
                <AccordionItem displayName={ getLocalizedTextBySlug( 'ad-features-label', $languageTagStore ) } >
                    <FeatureTypeInputIterator
                        property={ property }
                        bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                    />
                </AccordionItem>
                <AccordionItem displayName={ getLocalizedTextBySlug( 'profile-label', $languageTagStore ) }>
                    <div class="profile-container">
                        <img
                            class="profile-image"
                            src={ getStorageImagePath( propertyUserProfile.imagePath, 640 ) }
                            alt='payer profile'
                        />
                        <div class="profile-text-container">
                            <div class="font-size-75 font-weight-600 color-gray-100">
                                { propertyUserProfile.firstName } { propertyUserProfile.lastName }
                            </div>
                        </div>
                    </div>
                    {#each Object.entries( propertyUserProfile ) as [ fieldName, fieldValue ] }
                        {#if !fieldName.includes( 'Id' ) && !fieldName.includes( 'Name' ) && fieldName !== 'imagePath' }
                            <div class="container">
                                <div class="font-size-75 font-weight-600 color-gray-100">
                                   { getNormalCaseFromSnakeCaseString( fieldName ) }:
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray-100">
                                    { fieldValue }
                                </div>
                            </div>
                        {/if}
                    {/each}
                </AccordionItem>
                <AccordionItem displayName={ getLocalizedTextBySlug( 'profile-label', $languageTagStore ) }>
                    <div class="profile-container">
                        <img
                            class="profile-image"
                            src={ getStorageImagePath( propertyManagerProfile.imagePath, 640 ) }
                            alt="payer profile"
                        />
                        <div class="profile-text-container">
                            <div class="font-size-75 font-weight-600 color-gray-100">
                                { propertyManagerProfile.firstName } { propertyManagerProfile.lastName }
                            </div>
                        </div>
                    </div>
                    {#each Object.entries( propertyManagerProfile ) as [ fieldName, fieldValue ] }
                        {#if !fieldName.includes( 'Id' ) && !fieldName.includes( 'Name' ) && fieldName !== 'imagePath' }
                            <div class="container">
                                <div class="font-size-75 font-weight-600 color-gray-100">
                                   { getNormalCaseFromSnakeCaseString( fieldName ) }:
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray-100">
                                    { fieldValue }
                                </div>
                            </div>
                        {/if}
                    {/each}
                </AccordionItem>
            {/if}
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton on:click={ handleSubmit }>
            { getLocalizedTextBySlug( 'admin-property-manager-page-update-property-label', $languageTagStore ) }
        </ModalButton>
    </ModalActions>
</ModalRoot>
