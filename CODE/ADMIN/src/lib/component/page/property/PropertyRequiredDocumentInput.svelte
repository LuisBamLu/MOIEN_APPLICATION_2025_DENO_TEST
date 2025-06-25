<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';

    // -- VARIABLES

    /** @type {{requiredDocumentTypeIdArray?: any}} */
    let { requiredDocumentTypeIdArray = $bindable([]) } = $props();
    let documentTypeArray = $state([]);
    let isLoading = $state(true);

    // -- FUNCTIONS

    function handleToggle(
        documentTypeId
        )
    {
        let indexOfDocumentTypeId = requiredDocumentTypeIdArray.indexOf( documentTypeId )

        if ( indexOfDocumentTypeId === -1 )
        {
            requiredDocumentTypeIdArray.push( documentTypeId );
        }
        else
        {
            requiredDocumentTypeIdArray.splice( indexOfDocumentTypeId, 1 );
        }

        requiredDocumentTypeIdArray = requiredDocumentTypeIdArray;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/document-type/list', { method: 'POST' } );
            documentTypeArray = result.documentTypeArray;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .property-required-document-input
    {
        border-bottom: 1px solid grayColor700
        padding: 0.75rem 0;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>

<div class="property-required-document-input">
    <div class="font-size-90 font-weight-700 color-gray-100">
        { getLocalizedTextBySlug( 'ad-required-documents-label', $languageTagStore ) }
    </div>
    {#if isLoading }
        { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
    {:else}
        {#each documentTypeArray as documentType }
            <LabelledSwitch
                label={ getLocalizedText( documentType.name, $languageTagStore ) }
                value={ requiredDocumentTypeIdArray.indexOf( documentType.id  ) !== -1 }
                onChange={ () => { handleToggle( documentType.id ) } }
            />
        {/each}
    {/if}
</div>
