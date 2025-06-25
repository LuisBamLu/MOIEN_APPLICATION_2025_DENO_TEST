<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$lib/storage';
    import { getClassName } from '$lib/base';

    // -- VARIABLES

    export let imagePath;
    export let imageSize;
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
    class="image-container { getClassName( $$props.class ) }"
    style=
        "
            background:
                url( { getStorageImagePath( imagePath, imageSize ) } ) no-repeat center center / cover,
                url( { getStorageImagePath( imagePath, 360 ) } ) no-repeat center center / cover,
                url(/image/icon/moien_happy.svg) no-repeat center center / 50%;
        "
>
</div>
