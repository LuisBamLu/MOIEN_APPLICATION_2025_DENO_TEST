<script>
    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { getFileExtension, getJsonText, isString, logError } from 'senselogic-gist';
    import { createEventDispatcher, onMount } from 'svelte';
    import Image from '$component/element/Image.svelte';
    import Loading from '$component/element/Loading.svelte';
    import { toast } from '$lib/toast';

    // -- CONSTANTS

    const dispatch = createEventDispatcher();

    // -- VARIABLES

    export let src;
    export let isSubmitting = false;
    export let fileArray = [];
    export let imageSizeArray = [ 1920, 640, 360 ];
    let fileURL = null;
    let error = null;

    // -- FUNCTIONS

    async function handleUploadFile(
        )
    {
        try
        {
            isSubmitting = true;

            let formData = new FormData();
            formData.append( 'file', src );
            formData.append( 'imageSizeArray', getJsonText( imageSizeArray ) );

            let response
                = await fetchData(
                    '/api/add-file',
                    {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    }
                    );

            if ( response.error )
            {
                toast.error( response.error );
                setTimeout(
                    () =>
                    {
                        handleDeleteFile();
                    },
                    3000
                    );
            }
            else
            {
                src = response.filePath;
            }
        }
        catch ( error )
        {
            logError( error );
        }
        finally
        {
            isSubmitting = false;
        }
    }

    // ~~

    async function handleDeleteFile(
        )
    {
        error = null;

        if ( isString( src ) )
        {
            isSubmitting = true;

            let response
                = await fetchData(
                    '/api/remove-file',
                    {
                        method: 'POST',
                        body: getJsonText( { filePath: src } ),
                        credentials: 'include'
                    }
                    );

            if ( response.error )
            {
                toast.error( response.error );

                error = response.error;
            }

            isSubmitting = false;
        }

        if ( error === null )
        {
            let fileIndex = fileArray.indexOf( src );
            fileArray.splice( fileIndex, 1 );

            if ( fileURL !== null )
            {
                URL.revokeObjectURL( fileURL );
            }

            fileArray = fileArray;
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( src && !isString( src ) )
            {
                fileURL = URL.createObjectURL( src );
                await handleUploadFile();
            }
        }
        );

    // ~~

    $: isSubmitting, dispatch( 'uploading', { isSubmitting } );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .file-input-image-container
    {
        position: relative;

        height: var( --file-input-image-height, auto );
        min-height: 10rem;
        width: var( --file-input-image-width, 10rem );

        cursor: grab;
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
        z-index: 2;
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

    .loading-container
    {
        position: absolute;
        top: 0;
        left: 0;

        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba( 0, 0, 0, 0.3 );
    }
</style>

<div class="file-input-image-container">
    {#if isString( src ) }
        {#if getFileExtension( src ) === '.pdf' }
            <div class="file-icon-container">
                <div class="green-files-icon size-350"/>
            </div>
        {:else}
            <Image
                class="file-input-item-image"
                imagePath={ src }
                imageSize={ 640 }
            />
        {/if}
    {:else}
        <img
            class="file-input-item-image"
            src={ fileURL }
            alt={ src?.name }
        />
    {/if}
    {#if isSubmitting }
        <div class="loading-container">
            <Loading
                --outter-height="auto"
            />
        </div>
    {/if}
    <button
        class="file-input-remove-button"
        disabled={ isSubmitting }
        on:click|preventDefault={ handleDeleteFile }
    >
        <div class="white-close-icon size-90" />
    </button>
</div>
