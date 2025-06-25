<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug, getMap } from 'senselogic-gist';
    import ModalHeader from '../../modal/ModalHeader.svelte';
    import ModalRoot from '../../modal/ModalRoot.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import ModalContent from '../../modal/ModalContent.svelte';
    import ModalActions from '../../modal/ModalActions.svelte';
    import ModalButton from '../../modal/ModalButton.svelte';
    import { onMount } from 'svelte';
    import { fetchData } from '$src/lib/base';
    import Loading from '../../element/Loading.svelte';
    import HouseRulesCheckInSection from '../house-rules/HouseRulesCheckInSection.svelte';
    import HouseRulesCheckOutSection from '../house-rules/HouseRulesCheckOutSection.svelte';
    import HouseRulesHousingRegulationsSection from '../house-rules/HouseRulesHousingRegulationsSection.svelte';

    // -- VARIABLES

    export let id;
    export let isOpen = false;
    let featureTypeArray = [];
    let featureByTypeIdMap = {};
    let isLoading = true;
    let isSubmitting = false;

    // -- FUNCTIONS

    async function handleSubmit(
        )
    {
        isSubmitting = true;

        let result =
            await fetchData(
                '/api/feature/update',
                {
                    method: 'POST',
                    body: JSON.stringify( { featureArray: Object.values( featureByTypeIdMap ) } ),
                    credentials: 'include'
                }
                );

        let featureArray = result.featureArray;
        featureByTypeIdMap = getMap( featureArray, 'typeId' );

        isSubmitting = false;
        isOpen = false;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData(
                '/api/page/house-rules/' + id,
                {
                    method: 'POST',
                    credentials: 'include'
                }
                );

            featureTypeArray = result.featureTypeArray;
            featureByTypeIdMap = result.featureByTypeIdMap;
            isLoading = false;
        }
        );
</script>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'house-rules-label', $languageTagStore ) }
        onClose={ () => isOpen = false }
    />
    <ModalContent>
        {#if isLoading }
            <Loading />
        {:else}
            <HouseRulesCheckInSection bind:featureByTypeIdMap={ featureByTypeIdMap } propertyId={ id } />
            <HouseRulesCheckOutSection bind:featureByTypeIdMap={ featureByTypeIdMap } propertyId={ id } />
            <HouseRulesHousingRegulationsSection
                featureTypeArray={ featureTypeArray }
                propertyId={ id }
                bind:featureByTypeIdMap={ featureByTypeIdMap }
            />
        {/if}
    </ModalContent>
    <ModalActions>
        <ModalButton
            variant="light"
            text={ getLocalizedTextBySlug( 'cancel-label', $languageTagStore ) }
            on:click={ () => isOpen = false }
        />
        <ModalButton
            variant="contained"
            text={ getLocalizedTextBySlug( 'submit-label' ,$languageTagStore ) }
            bind:isLoading={ isSubmitting }
            on:click={ handleSubmit }
        />
    </ModalActions>
</ModalRoot>
