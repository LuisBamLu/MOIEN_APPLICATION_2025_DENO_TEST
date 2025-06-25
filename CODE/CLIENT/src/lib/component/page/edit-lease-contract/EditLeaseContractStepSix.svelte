<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';

    // -- VARAIBLES

    export let leaseContract = {};
    let isLoading = true;
    let documentTypeArray = [];
    let requiredDocumentTypeSet = new Set( leaseContract.requiredDocumentTypeIdArray );

    // -- FUNCTIONS

    function handleChange(
        documentTypeId
        )
    {
        if ( requiredDocumentTypeSet.has( documentTypeId ) )
        {
            requiredDocumentTypeSet.delete( documentTypeId );
        }
        else
        {
            requiredDocumentTypeSet.add( documentTypeId );
        }

        leaseContract.requiredDocumentTypeIdArray = Array.from( requiredDocumentTypeSet );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result
                = await fetchData(
                    '/api/document-type/list',
                    {
                        method: 'POST'
                    }
                    );

            documentTypeArray = result.documentTypeArray;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .text-container
    {
        border-radius: 0.75rem;
        padding: 0.75rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        background-color: grayColor800;
    }
</style>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-supporting-documents-requested-label', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'edit-lease-contract-page-supporting-documents-requested-helper', $languageTagStore ) }
>
    {#if isLoading }
        <Loading />
    {:else}
        {#each documentTypeArray as documentType }
            <LabelledSwitch
                label={ getLocalizedText( documentType.name, $languageTagStore ) }
                value={ requiredDocumentTypeSet.has( documentType.id ) }
                onChange={ () => handleChange( documentType.id ) }
                borderBottom={ true }
            />
        {/each}
    {/if}
</EditLeaseContractPageSection>
<div class="text-container">
    <div class="font-size-75 font-weight-500 color-gray-300">
        { getLocalizedTextBySlug( 'edit-lease-contract-page-moien-document-alert-text', $languageTagStore ) }
    </div>
</div>
