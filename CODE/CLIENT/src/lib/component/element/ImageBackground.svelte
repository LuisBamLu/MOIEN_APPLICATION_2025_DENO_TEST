<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$lib/storage.js';
    import { addFileExtensionPrefix } from 'senselogic-gist';

    // -- VARIABLES

    export let isGlobal = false;
    export let isArticle = false;
    export let imagePath = '';
    export let preload = false;
    export let lazyLoading = false;
    export let altText = '';
    export let lowRes = 360;
    export let highRes = 1920;
    let lowResImage = '';
    let highResImage = '';

    // -- STATEMENTS

    if ( isArticle === false )
    {
        lowResImage =
            isGlobal === true
            ? getStorageImagePath( `${ imagePath }.${ lowRes }.avif` )
            : getStorageImagePath( `${ imagePath }.avif` );
        highResImage =
            isGlobal === true
            ? getStorageImagePath( `${ imagePath }.${ highRes }.avif` )
            : getStorageImagePath( `${ imagePath }.avif` );
    }
    else
    {
        lowResImage = getStorageImagePath( addFileExtensionPrefix( imagePath, '.' + lowRes ) );
        highResImage = getStorageImagePath( addFileExtensionPrefix( imagePath, '.' + highRes ) );
    }
</script>

<style lang="stylus">
    // -- ELEMENTS

    img
    {
        height: 100%;
        width: 100%;

        object-fit: cover;
        object-position: center;
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

<img
    loading={ lazyLoading ? 'lazy' : 'eager' }
    src={ highResImage }
    alt={ altText }
    style="background-image: url({ lowResImage });"
/>
