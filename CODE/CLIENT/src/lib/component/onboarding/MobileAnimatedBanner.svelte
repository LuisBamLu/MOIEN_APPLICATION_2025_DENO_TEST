<script>
    // -- IMPORTS

    import DivBackground from '$component/element/DivBackground.svelte';

    // -- CONSTANTS

    let imageFilePathArray =
        [
            '/global/home/banner/animated/cannes',
            '/global/home/banner/animated/eiffel_tower',
            '/global/home/banner/animated/palace_garden',
            '/global/home/banner/animated/river_city',
            '/global/home/banner/animated/austria',
            '/global/home/banner/animated/dinan',
            '/global/home/banner/animated/london',
            '/global/home/banner/animated/madrid',
            '/global/home/banner/animated/new_york',
            '/global/home/banner/animated/norway',
            '/global/home/banner/animated/porto',
            '/global/home/banner/animated/tokyo'
        ];

    // -- FUNCTIONS

    function getRandomImageArray(
        )
    {
        let imageArray = imageFilePathArray;
        let randomImageArray = [];

        for ( let index = 0; index < 6; index++ )
        {
            let randomIndex = Math.floor( Math.random() * imageArray.length );
            randomImageArray.push( imageArray[ randomIndex ] );
            imageArray.splice( randomIndex, 1 );
        }

        return randomImageArray;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .home-main-banner-animated-images
    {
        position: absolute;

        height: 100dvh;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    .animated-image
    {
        position: absolute;

        overflow: hidden;

        object-fit: cover;
        object-position: bottom;

        opacity: 0;

        animation: slide-in-right 3s cubic-bezier( 0.85, 0, 0.15, 1 );
        animation-fill-mode: forwards;
    }

    .animated-image.animate-from-left
    {
        animation: slide-in-left 3s cubic-bezier( 0.85, 0, 0.15, 1 );
        animation-fill-mode: forwards;
    }

    .image-1
    {
        top: 8%;
        left: 65%;

        height: 8.8125rem;
        width: 15.6875rem;
        border-radius: 1rem;

        filter: blur( 2px );
    }

    .image-2
    {
        top: 16%;
        right: 62%;

        height: 8.8125rem;
        width: 15.6875rem;
        border-radius: 1rem;

        filter: blur( 2px );
    }

    .image-3
    {
        top: 42%;
        left: 82%;

        height: 6.25rem;
        width: 11.125rem;
        border-radius: 1rem;

        filter: blur( 2px );
    }

    .image-4
    {
        top: 52%;
        right: 75%;

        height: 6.25rem;
        width: 11.125rem;
        border-radius: 1rem;

        filter: blur( 2px );
    }

    .image-5
    {
        top: 69%;
        left: 64%;

        height: 8.8125rem;
        width: 15.6875rem;
        border-radius: 1rem;

        filter: blur( 2px );
    }

    .image-6
    {
        top: 86%;
        right: 59.5%;

        height: 8.8125rem;
        width: 15.6875rem;
        border-radius: 1rem;

        filter: blur( 2px );
    }

    @keyframes slide-in-left
    {
        0%
        {
            transform: translateY( 50vh ) translateX( -100vw ) scale( 0.25 );

            opacity: 0;
            filter: blur( 6px );
        }

        75%
        {
            transform: translateY( 0 ) translateX( 0 );
        }

        100%
        {
            transform: scale( 1 );

            opacity: 1;
            filter: blur( 2px );
        }
    }

    @keyframes slide-in-right
    {
        0%
        {
            transform: translateY( 50vh ) translateX( 100vw ) scale( 0.25 );

            opacity: 0;
            filter: blur( 6px );
        }

        75%
        {
            transform: translateY( 0 ) translateX( 0 );
        }

        100%
        {
            transform: scale( 1 );

            opacity: 1;
            filter: blur( 2px );
        }
    }
</style>

<div class="home-main-banner-animated-images">
    {#each getRandomImageArray() as imagePath, imageIndex }
        {@const imageCounter = imageIndex + 1 }
        <div
            class={ `animated-image image-${ imageCounter }` }
            class:animate-from-left={ imageIndex % 2 }
        >
            <DivBackground
                isGlobal={ true }
                imagePath={ imagePath }
                lowRes={ 96 }
                highRes={ 384 }
            />
        </div>
    {/each}
</div>
