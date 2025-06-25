<script>
    // -- IMPORTS

    import DivBackground from '../../element/DivBackground.svelte';

    // -- CONSTANTS

    const imageFilePathArray =
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

    function getRandomImageArray()
    {
        let imageArray = imageFilePathArray;
        let randomImageArray = [];

        for ( let i = 0; i < 8; i++ )
        {
            const randomIndex = Math.floor( Math.random() * imageArray.length );
            randomImageArray.push( imageArray[ randomIndex ] );
            imageArray.splice( randomIndex, 1 );
        }

        return randomImageArray;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .home-main-banner-animated-images
    {
        position: absolute;

        margin-top: 20vh;
        height: 50vh;
        width: 100%;

        display: none;
        justify-content: center;
        align-items: flex-end;

        +media( tablet )
        {
            display: flex;
        }
    }

    .animated-image
    {
        position: absolute;

        overflow: hidden;
        aspect-ratio: 5/3;

        object-fit: cover;
        object-position: bottom;

        opacity: 0.9;

        animation: slide 1.5s cubic-bezier(0.85, 0, 0.15, 1), float 3s 1.7s ease-in-out infinite;
    }
    .image-1
    {
        top: 12%;
        left: 15%;

        width: calc( 100vw / 9 );
        border-radius: calc( 100vw / ( 9 * 10 ) );

        filter: blur( 0.8px );
    }

    .image-2
    {
        top: 10%;
        right: 15%;

        width: calc( 100vw / 8 );
        border-radius: calc( 100vw / ( 8 * 10 ) );

        filter: blur( 0.8px );
    }

    .image-3
    {
        top: 95%;
        left: -2%;

        width: calc( 100vw / 5.5 );
        border-radius: calc( 100vw / ( 5.5 * 10 ) );

        filter: blur( 0.7px );
    }

    .image-4
    {
        top: 105%;
        right: -2%;

        width: calc( 90vw / 5.2 );
        border-radius: calc( 100vw / ( 5.2 * 10 ) );

        filter: blur( 0.7px );
    }

    .image-5
    {
        bottom: 12%;
        left: 30%;

        width: calc( 100vw / 10);
        border-radius: calc( 100vw / ( 10 * 10 ) );

        filter: blur( 0.9px );
    }

    .image-6
    {
        bottom: 18%;
        right: 30%;

        width: calc( 100vw / 11 );
        border-radius: calc( 100vw / ( 11 * 10 ) );

        filter: blur( 0.9px );
    }

    .image-7
    {
        bottom: -65%;
        left: 25%;

        width: calc( 100vw / 12 );
        border-radius: calc( 100vw / ( 12 * 10 ) );

        filter: blur( 0.95px );
    }

    .image-8
    {
        bottom: -58%;
        right: 25%;

        width: calc( 100vw / 10 );
        border-radius: calc( 100vw / ( 10 * 10 ) );

        filter: blur( 0.95px );
    }

    @keyframes slide
    {
        0%
        {
            transform: translateY( 100vh );

            opacity: 0;
        }

        100%
        {
            transform: translateY( 0 );

            opacity: 0.9;
        }
    }

    @keyframes float
    {
        0%,
        100%
        {
            transform: translate( 0, 0px );
        }

        50%
        {
            transform: translate( 0, 15px );
        }
    }
</style>

<div class="home-main-banner-animated-images">
    {#each getRandomImageArray() as imagePath, imageIndex }
        {@const imageCounter = imageIndex + 1 }
        <div class={ `animated-image image-${ imageCounter }` }>
            <DivBackground
                isGlobal={ true }
                imagePath={ imagePath }
                preload={ true }
                lowRes={ 96 }
                highRes={ 384 }
            />
        </div>
    {/each}
</div>
