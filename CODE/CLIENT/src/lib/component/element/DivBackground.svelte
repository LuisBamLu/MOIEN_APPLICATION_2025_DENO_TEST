<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$lib/storage.js';
    import { addFileExtensionPrefix } from 'senselogic-gist';

    // -- VARIABLES

    export let isGlobal = false;
    export let isArticle = false;
    export let imagePath = '';
    export let preload = false;
    export let lowRes = 360;
    export let highRes = 1920;
    let lowResImage = '';
    let highResImage = '';

    if ( isArticle === false )
    {
        lowResImage = getStorageImagePath( imagePath, lowRes )
        highResImage = getStorageImagePath( imagePath, highRes )
    }
    else
    {
        lowResImage = getStorageImagePath( addFileExtensionPrefix( imagePath, '.' + lowRes ) );
        highResImage = getStorageImagePath( addFileExtensionPrefix( imagePath, '.' + highRes ) );
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .image-backgound
    {
        height: 100%;
        width: 100%;

        background-position: center;
        background-size: cover;
    }
</style>

<svelte:head>
    {#if preload}
        <link
            rel="preload"
            as="image"
            fetchpriority=high
            href={ lowResImage }
            type="image/avif"
        >
    {/if}

</svelte:head>

<div
    class="image-backgound"
    style="background-image: url({ highResImage }),
                             url({ lowResImage });"
/>
