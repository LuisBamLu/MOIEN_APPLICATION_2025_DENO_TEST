<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$lib/storage';
    import { getClassName } from '$src/lib/base';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let imagePath;
    export let imageSize;
    let isImageSquareOrPortrait;

    // -- FUNCTIONS

    async function checkImageDimension(
        )
    {
        return new Promise(
            ( resolve ) =>
            {
                let imageElement = new Image();
                imageElement.src = getStorageImagePath( imagePath, imageSize );
                imageElement.onload = () =>
                    {
                        let { naturalWidth: width, naturalHeight: height } = imageElement;
                        resolve( height >= width );
                    };
                imageElement.onerror = () => resolve( false );
            }
            );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            isImageSquareOrPortrait = await checkImageDimension();
        }
        );
</script>

<style lang="stylus">
    // -- CLASSES

    .image-wrapper
    {
        position: relative;
    }

    .image-container
    {
        z-index: 2;
        position: absolute;

        overflow: clip;
        height: 100%;
        width: 100%;

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    // ~~

    .image
    {
        height: 100%;
        width: 100%;

        object-fit: cover;

        color: transparent;
    }

    .image-blur-overlay
    {
        z-index: 1;
        position: absolute;

        height: 100%;
        width: 100%;

        filter: blur( 5px );
    }
</style>

<div class="image-wrapper { getClassName( $$props.class ) }">
    {#if isImageSquareOrPortrait}
        <div
            class="image-blur-overlay { getClassName( $$props.class ) }"
            style=
                "
                    background:
                        url( { getStorageImagePath( imagePath, 360 ) } ) no-repeat center center / cover;
                "
        >
        </div>
    {/if}
    <div
        class="image-container { getClassName( $$props.class ) }"
        style=
            "
                background:
                    url( { getStorageImagePath( imagePath, imageSize ) } ) no-repeat center center / { isImageSquareOrPortrait ? 'contain' : 'cover' },
                    url( { getStorageImagePath( imagePath, 360 ) } ) no-repeat center center / { isImageSquareOrPortrait ? 'contain' : 'cover' }
                    { !isImageSquareOrPortrait ? ', url(/image/icon/moien_happy.svg) no-repeat center center / 50%,  #ddd' : '' };
            "
    >
    </div>
</div>
