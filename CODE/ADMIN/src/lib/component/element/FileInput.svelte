<script>
    import { preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { toast } from '$lib/toast';
    import { languageTagStore } from '$store/languageTagStore';
    import FileInputImageContainer from './FileInputImageContainer.svelte';
    import { getLocalizedTextBySlug, isArray } from 'senselogic-gist';
    import SortableList from './SortableList.svelte';

    // -- VARIABLES

    /** @type {{fileInputName?: string, maxFileCount?: number, fileArray?: any, acceptedType?: string, maximumFileSize?: any, imageSizeArray?: any, isUploadingImage?: boolean}} */
    let {
        fileInputName = 'files',
        maxFileCount = 1,
        fileArray = $bindable([]),
        acceptedType = 'image/*',
        maximumFileSize = 4.5 * 1024 * 1024,
        imageSizeArray = [ 1920, 640, 360 ],
        isUploadingImage = $bindable(false)
    } = $props();
    let fileInput = $state(null);
    let filesContainer = $state(null);

    // -- FUNCTIONS

    async function handleInput(
        event
        )
    {
        let files = event.target.files;

        for ( let file of Array.from( files ) )
        {
            if ( file.size > maximumFileSize )
            {
                toast.error(
                    getLocalizedTextBySlug(
                        'file-size-error-label',
                        { fileName: file.name, maxSize: maximumFileSize / 1024 / 1024 },
                        $languageTagStore
                        )
                    );
            }
            else if ( fileArray.length > maxFileCount )
            {
                toast.error( 'File limit reached. ' + file.name + ' could not be added' );
            }
            else
            {
                fileArray.push( file );
            }
        }

        fileArray = fileArray;
    }

    // ~~

    function handleSort(
        event
        )
    {
        let item = fileArray[ event.oldIndex ];
        fileArray.splice( event.oldIndex, 1 );
        fileArray.splice( event.newIndex, 0, item );

        fileArray = fileArray;
    }

    // ~~

    function handleClickEvent(
        )
    {
        fileInput.click();
    };
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    .file-input
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    :global( .file-input >div )
    {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .file-input-item
    {
        position: relative;

        min-height: 10rem;
        width: var( --file-input-add-new-button-width, 10rem );

        cursor: grab;
    }

    .file-input-item:active
    {
        cursor: grabbing;
    }

    :global( .file-input-item-image )
    {
        height: 100%;
        width: 100%;
        border-radius: 1rem;

        object-fit: cover;
    }

    .file-input-remove-button
    {
        position: absolute;
        top: -0.75rem;
        right: -0.75rem;

        height: 1.5rem;
        width: 1.5rem;
        border-radius: 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: redColor;
    }

    .file-input-add-new-button
    {
        height: 10rem;
        width: var( --file-input-add-new-button-width, 10rem );
        border: 2px solid blueColor900;
        border-radius: 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: blueColor950;

        cursor: pointer;
    }
</style>

<div class="file-input">
    {#if isArray( fileArray ) && fileArray.length > 0 }
        <SortableList
            class="file-input-list"
            onEnd={ handleSort }
            bind:this={ filesContainer }
        >
            {#each fileArray as file, i }
                <FileInputImageContainer
                    imageSizeArray={ imageSizeArray }
                    bind:src={ file[ i ] }
                    bind:fileArray={ fileArray }
                    bind:isSubmitting={ isUploadingImage }
                />
            {/each}
        </SortableList>
    {/if}
    <input
        name={ fileInputName }
        type="file"
        accept={ acceptedType }
        multiple={ maxFileCount > 1 }
        hidden
        bind:this={ fileInput }
        onchange={handleInput}
    />
    {#if isArray( fileArray ) && ( fileArray.length ) < maxFileCount }
        <button
            class="file-input-add-new-button"
            onclick={preventDefault(handleClickEvent)}
        >
            <div class="blue-plus-circle-icon size-150"></div>
        </button>
    {/if}
</div>
