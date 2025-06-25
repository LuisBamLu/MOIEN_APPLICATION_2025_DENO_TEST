<script>
    // -- IMPORTS

    import { toast } from '$lib/toast';
    import { languageTagStore } from '$store/languageTagStore';
    import FileInputImageContainer from './FileInputImageContainer.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import SortableList from '$component/element/SortableList.svelte';

    // -- VARIABLES

    export let fileInputName = 'files';
    export let maxFileCount = 1;
    export let fileArray = [];
    export let fileCount = 0;
    export let acceptedType = 'image/*';
    export let fullWidth = false;
    export let maximumFileSize = 4.5 * 1024 * 1024;
    export let imageSizeArray = [ 1920, 640, 360 ];
    export let minimumHeight = 0;
    export let minimumWidth = 0;
    export let uploadingImageArray = [];
    let minimumResolution = minimumHeight * minimumWidth;
    let fileInput = null;
    let filesContainer = null;
    let fileResolution = 0;
    export let isSubmitting = false;

    // -- FUNCTIONS

    async function getFileResolution(
        imageFile
        )
    {
        return new Promise(
            ( resolve, reject ) =>
            {
                let image = new Image();
                let imageObjectUrl = URL.createObjectURL( imageFile );

                image.src = imageObjectUrl;

                image.onload = function(
                    )
                {
                    fileResolution = image.width * image.height;

                    URL.revokeObjectURL( imageObjectUrl );

                    resolve( fileResolution );
                }

                image.onerror = function(
                    )
                {
                    URL.revokeObjectURL( imageObjectUrl );

                    reject( 0 );
                }
            }
            );
    }

    // ~~

    async function handleInput(
        event
        )
    {
        let files = event.target.files;

        for ( let file of Array.from( files ) )
        {
            await getFileResolution( file );

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
            else if ( minimumResolution !== 0 && fileResolution < minimumResolution )
            {
                toast.error(
                    getLocalizedTextBySlug(
                        'file-input-does-not-meet-minimum-resolution-label',
                        { minimumWidth, minimumHeight },
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

    // ~~

    function handleSubmitEvent(
        fileIndex,
        event
        )
    {
        uploadingImageArray[ fileIndex ] = event.detail.isSubmitting;
    }

    // -- STATEMENTS

    $: isSubmitting = uploadingImageArray.some( Boolean );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    .file-input
    {
        width: 100%;

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

    :global( .file-input-item-image )
    {
        height: 100%;
        width: 100%;
        border-radius: 1rem;

        object-fit: cover;
    }

    .file-input-add-new-button
    {
        height: var( --file-input-image-height, 10rem );
        width: var( --file-input-image-width, 10rem );
        border: 2px solid blueColor900;
        border-radius: 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: blueColor950;

        cursor: pointer;
    }

    .file-input-add-new-button.full-width
    {
        width: 100%;
    }
</style>

<div class="file-input">
    {#if fileArray.length > 0 }
        <SortableList
            class="file-input-list"
            onEndDrag={ handleSort }
            bind:this={ filesContainer }
        >
            {#each fileArray as file, fileIndex ( file ) }
                <FileInputImageContainer
                    imageSizeArray={ imageSizeArray }
                    bind:src={ file }
                    bind:fileArray={ fileArray }
                    on:uploading={ ( event ) => handleSubmitEvent( fileIndex, event ) }
                />
            {/each}
        </SortableList>
    {/if}
    <input
        name={ fileInputName }
        type="file"
        accept={ acceptedType }
        multiple={ maxFileCount > 1 }
        style="display:none"
        bind:this={ fileInput }
        on:change={ handleInput }
    />
    {#if ( fileArray.length ) < maxFileCount }
        <button
            class="file-input-add-new-button"
            class:full-width={ fullWidth }
            on:click|preventDefault={ handleClickEvent }
        >
            <div class="blue-plus-circle-icon size-150"/>
        </button>
    {/if}
</div>
