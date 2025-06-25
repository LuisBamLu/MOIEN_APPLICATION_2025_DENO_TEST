<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$src/lib/storage';

    // -- VARIABLES

    /** @type {{imagePath: any, imageSize: any, alt?: string, class?: string}} */
    let {
        imagePath,
        imageSize,
        alt = '',
        class: className = ''
    } = $props();

    // -- STATEMENTS

</script>

<style lang="stylus">
    // -- CLASSES

    .image-container
    {
        overflow: clip;

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
</style>

<div
    class="image-container { className }"
    style=
        "
            background:
                url( { getStorageImagePath( imagePath, imageSize ) } ) no-repeat center center / cover,
                url( { getStorageImagePath( imagePath, 360 ) } ) no-repeat center center / cover,
                url(/image/icon/moien_happy.svg) no-repeat center center / 50%,
                #ddd;
        "
>
    <!-- <img
        class="image"
        loading="lazy"
        src={ getStorageImagePath( imagePath, imageSize ) }
        alt={ alt }
        on:error={ ( event ) => event.target.style.display = 'none' }
    /> -->
</div>
