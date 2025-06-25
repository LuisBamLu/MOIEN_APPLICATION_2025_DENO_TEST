<script>
    // -- IMPORTS

    import { getFileExtension, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import EditLeaseContractPageSection from '../edit-lease-contract/EditLeaseContractPageSection.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import Accordion from '../../element/Accordion.svelte';
    import { documentTypeArrayStore, documentTypeByIdMapStore } from '$src/lib/store/documentTypeStore';
    import { getStorageFilePath } from '$src/lib/storage';
    import { onMount } from 'svelte';
    import { fetchData } from '$src/lib/base';
    import Loading from '../../element/Loading.svelte';
    import Image from '../../element/Image.svelte';

    // -- VARIABLES

    export let documentArray;
    let isLoading = true;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( $documentTypeByIdMapStore === null )
            {
                let result = await fetchData( '/api/document-type/list', { method: 'POST' } );

                $documentTypeArrayStore = result.documentTypeArray;
                $documentTypeByIdMapStore = result.documentTypeMap;
            }

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- CLASSES

    :global( .document-image )
    {
        min-height: 18rem;
        max-width: 20rem;
        border-radius: 0.75rem;
    }
</style>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'admin-menu-documents-label', $languageTagStore ) }
>
    {#if isLoading }
        <Loading />
    {:else}
        <div class="document-list-container">
            {#each documentArray as document }
                <Accordion
                    label={ getLocalizedText( $documentTypeByIdMapStore[ document.typeId ].name, $languageTagStore ) }
                >
                    {#if getFileExtension( document.filePath ?? '' ) !== '.pdf' }
                        <Image
                            class="document-image"
                            imagePath={ document.filePath ?? '' }
                            imageSize={ 640 }
                        />
                    {:else}
                        <embed
                            width="200px"
                            height="200px"
                            src={ getStorageFilePath( document.filePath ) }
                            type="application/pdf"
                        />
                    {/if}
                </Accordion>
            {/each}
        </div>
    {/if}
</EditLeaseContractPageSection>
