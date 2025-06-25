<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import DocumentAccordion from '$component/page/lease-contract-supporting-documents/DocumentAccordion.svelte';

    // -- VARIABLES

    export let id;
    let documentTypeByIdMap = {};
    let signatoryArray = [];
    let leaseContract = {};
    let documentArray = [];
    let tenantProfile = {};
    let isLoading = true;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData(
                '/api/page/lease-contract-supporting-documents/' + id,
                {
                    method: 'POST',
                    credentials: 'include'
                }
                );
            documentTypeByIdMap = result.documentTypeByIdMap;
            signatoryArray = result.signatoryArray;
            leaseContract = result.leaseContract;
            documentArray = result.documentArray;
            tenantProfile = result.tenantProfile;
            let missingDocumentTypeSet = new Set( leaseContract.requiredDocumentTypeIdArray );

            for ( let document of documentArray )
            {
                missingDocumentTypeSet.delete( document.typeId );
            }

            for ( let missingDocumentType of Array.from( missingDocumentTypeSet ) )
            {
                documentArray.push( { typeId: missingDocumentType } );
            }

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .lease-contract-supporting-documents-page
    {
        position: relative;

        margin-bottom: 4rem;
        padding: 0rem 1rem;
        padding-bottom: 6.75rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            margin-bottom: unset;
        }
    }

    .lease-contract-supporting-documents-page-content-container
    {
        width: 100%;
        padding-top: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 76.875rem;
        }
    }
</style>

<div class="lease-contract-supporting-documents-page">
    <div class="lease-contract-supporting-documents-page-content-container">
        <div class="lease-contract-supporting-documents-page-heading">
            <div class="font-size-150 font-weight-600 color-gray-100">
                { getLocalizedTextBySlug( 'profile-page-supporting-documents' , $languageTagStore ) }
            </div>
        </div>
        {#if isLoading }
            <Loading />
        {:else}
            <EditLeaseContractPageSection
                label=
                    "
                        { getLocalizedTextBySlug( 'lease-contract-supporting-documents-page-tenant-label', $languageTagStore ) }
                        { tenantProfile.firstName }
                    "
            >
                {#each documentArray as document }
                    <DocumentAccordion
                        documentTypeByIdMap={ documentTypeByIdMap }
                        document={ document }
                    />
                {/each}
            </EditLeaseContractPageSection>
        {  /if }
    </div>
</div>
