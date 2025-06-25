<script>
    // -- IMPORTS

    import { documentStatusByIdMapStore } from '$store/documentStatusStore';
    import { documentTypeByIdMapStore } from '$store/documentTypeStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { slide } from 'svelte/transition';
    import FileInput from '$component/backoffice/FileInput.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { fetchData } from '$lib/base';
    import Image from '$component/element/Image.svelte';
    import { toast } from '$lib/toast';

    // -- VARIABLES

    export let document;
    export let documentArray = [];
    let fileArray = [ document.filePath ]
    let form;
    let isEditing = false;
    let isDeleting = false;
    let isOpen = false;

    // -- FUNCTIONS

    async function handleUpdateDocument(
        )
    {
        isEditing = true;

        let response
            = await fetchData(
                '/api/document/update-image/'+ document.id,
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            document:
                                {
                                    ...document,
                                    filePath: fileArray[ 0 ]
                                }
                        }
                        ),
                    credentials: 'include'
                }
                );

        if ( response.error )
        {
            toast.error( response.error );
        }
        else
        {
            isEditing = false;
            isOpen = false;
        }
    }

    // ~~

    async function handleDeleteDocument(
        )
    {
        isDeleting = true;

        let result
            = await fetchData(
                '/api/document/delete/'+ document.id,
                {
                    method: 'POST',
                    credentials: 'include'
                }
                );

        if ( result )
        {
            documentArray = documentArray.filter( _document => _document.id !== document.id );
        }

        isDeleting = false;
        isOpen = false;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'

    // -- CLASSES

    .supporting-document-accordion
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor
        padding: 0.75rem 0;

        display: flex;
        gap: 0.75rem;
        align-items: flex-start;

        text-align: unset;
    }

    .supporting-document-accordion.is-accordion-open
    {
        border-bottom: none;
    }

    .supporting-document-accordion-text-group
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.375rem;
    }

    .icon
    {
        transition: transform 0.2s ease-in;
    }

    .is-open
    {
        transform: rotate( 90deg );
    }

    .document-container
    {
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem 0;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    :global( .supporting-document-accordion-document-image )
    {
        min-height: 18rem;
        width: 400px;
        max-width: 100%;
        border-radius: 0.75rem;
    }
</style>

<button
    class="supporting-document-accordion"
    class:is-accordion-open={ isOpen }
    type="button"
    on:click={ () => isOpen = !isOpen }
>
    {#if document.validationStatusId === 'declined' }
        <div class="declined-icon size-150" />
    {:else if document.validationStatusId === 'pending' }
        <div class="pending-icon size-150" />
    {:else}
        <div class="accepted-icon size-150" />
    {/if}
    <div class="supporting-document-accordion-text-group">
        <div class="font-size-90 font-weight-500 color-gray-300">
            { getLocalizedText( $documentTypeByIdMapStore[ document.typeId ].name, $languageTagStore ) }
        </div>
        <div class="font-size-75 font-weight-500 color-gray">
            { getLocalizedText( $documentStatusByIdMapStore[ document.validationStatusId ].name, $languageTagStore ) }
        </div>
    </div>
    <div class="gray-right-caret-icon size-150 icon" class:is-open={ isOpen }/>
</button>
{#if isOpen }
    <form
        class="document-container"
        transition:slide
        bind:this={ form }
        on:submit|preventDefault={ handleUpdateDocument }
    >
        {#if document.validationStatusId === 'accepted' }
            <Image
                class="supporting-document-accordion-document-image largerWidth"
                imagePath={ document.filePath }
                imageSize={ 1920 }
                alt="document"
            />
        {:else}
            <FileInput
                maxFileCount={ 1 }
                fileInputName="file-path"
                acceptedType="image/*,application/pdf"
                imageSizeArray={ [ 512, 360 ] }
                bind:fileArray={ fileArray }
            />
        {/if}
        <div class="display-flex gap-50">
            <ModalButton
                type="button"
                variant="light"
                text={ getLocalizedTextBySlug( 'delete-label', $languageTagStore ) }
                fullWidth={ false }
                isLoading={ isDeleting }
                on:click={ handleDeleteDocument }
            />
            {#if document.validationStatusId !== 'accepted' }
                <ModalButton
                    variant="contained"
                    text={ getLocalizedTextBySlug( 'edit-label', $languageTagStore ) }
                    fullWidth={ false }
                    isLoading={ isEditing }
                />
            {/if}
        </div>
    </form>
{/if}
