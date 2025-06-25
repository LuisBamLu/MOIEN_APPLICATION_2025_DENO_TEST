<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { getStorageFilePath } from '$lib/storage';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { fetchData } from '$src/lib/base';
    import Image from '../../element/Image.svelte';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let isOpen = false;
    export let document = {};
    export let documentTypeByIdMap = {};
    let isSubmitting = false;

    // -- FUNCTIONS

    async function handleValidateDocument(
        )
    {
        isSubmitting = true;

        let result
            = await fetchData(
                '/api/document/update',
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            document: { ...document, validationStatusId: 'accepted' },
                            id: document.id
                        }
                        ),
                }
                );

        if ( result.error )
        {
            toast.error( result.error );
        }
        else
        {
            document = { ...document, validationStatusId: 'accepted' };
            toast.success( 'update-profile-update-successful' );
        }

        isSubmitting = false;
        isOpen = false;
    }

    // ~~

    async function handleRejectDocument(
        )
    {
        isSubmitting = true;

        let result
            = await fetchData(
                '/api/document/update',
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            document: { ...document, validationStatusId: 'declined' },
                            id: document.id
                        }
                        ),
                }
                );

        if ( result.error )
        {
            toast.error( result.error );
        }
        else
        {
            document = { ...document, validationStatusId: 'accepted' };
            toast.success( 'update-profile-update-successful' );
        }

        isSubmitting = false;
        isOpen = false;
    }
</script>

<style lang="stylus">
    // -- CLASSES

    :global( .lease-contract-supporting-documents-document-image )
    {
        min-height: 18rem;
        width: 100%;
        max-width: 20rem;
        border-radius: 0.75rem;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader
        title={ getLocalizedText( documentTypeByIdMap[ document.typeId ]?.name ?? '', $languageTagStore ) }
        onClose={ () => isOpen = false }
    />
    <ModalContent wait={ isSubmitting }>
        {#if document.filePath?.includes( '.pdf' ) }
            <embed src={ getStorageFilePath( document.filePath ) } />
        {:else}
            <Image
                class="lease-contract-supporting-documents-document-image"
                imagePath={ document.filePath }
                imageSize={ 512 }
                alt={ document.name }
            />
        {/if}
    </ModalContent>
    {#if document.validationStatusId === 'pending' }
        <ModalActions>
            <ModalButton
                text={ getLocalizedTextBySlug( 'lease-contract-supporting-documents-page-validate-document-label', $languageTagStore ) }
                isLoading={ isSubmitting }
                on:click={ handleValidateDocument }
            />
            <ModalButton
                variant="light"
                text={ getLocalizedTextBySlug( 'lease-contract-supporting-documents-page-reject-document-label', $languageTagStore ) }
                disabled={ isSubmitting }
                on:click={ handleRejectDocument }
            />
        </ModalActions>
    {/if}
</ModalRoot>
