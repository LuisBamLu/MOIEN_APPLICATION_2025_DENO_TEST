<script>
    // -- IMPORTS

    import { setLoading, setLoaded, increaseProgress, progress } from '$store/loadingStore';
    import { onMount } from 'svelte';

    // -- VARIABLES

    let progressInterval =
        setInterval(
            () =>
            {
                increaseProgress( 1 );
            },
            100
            );

    // -- FUNCTIONS

    setLoading();

    let loadComplete =
        () =>
        {
            clearInterval( progressInterval );

            setInterval(
                () =>
                {
                    increaseProgress( 20 );
                },
                100
                );

            setLoaded();
        };

    onMount(
        () =>
        {
            if ( document.readyState === 'complete' )
            {
                loadComplete();
            }
            else
            {
                window.onload = loadComplete;
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .loading
    {
        grid-area: middle;
        z-index: 9999999999 !important;
        position: fixed;

        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: loadingBackgroundColor;

        pointer-events: none;
    }

    .loading-animation-container
    {
        position: relative;

        margin-top: -4rem;
        height: 20%;
        width: 50%;

        +media( desktop )
        {
            width: 20%;
        }
    }

    .loading-animation
    {
        height: 100%;
        width: 100%;
    }

    .loading-progress-bar
    {
        overflow: hidden;
        height: 0.25rem;
        width: 100%;
        border-radius: 1rem;

        background-color: grayColor700;
    }

    .loading-progress-line
    {
        height: 0.25rem;
        border-radius: 1rem;

        background-color: greenColor;
    }

    .loading-assets-container >div::before
    {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;

        width: 100%;

        display: block;

        content: '';
        background-position: top !important;
        background-size: contain !important;
    }

    .loading-assets-container .loading-assets-one::before
    {
        top: 2rem;
        left: -10%;

        height: 10%;

        background: url( '/admin/image/loading/loading_clouds.png' ) no-repeat center center;
        background-position: left !important;

        +media( desktop )
        {
            left: -4rem;
        }
    }

    .loading-assets-container .loading-assets-two::before
    {
        bottom: 1rem;
        left: unset;
        right: -5%;

        height: 35%;

        background: url( '/admin/image/loading/loading_woman_chair.png' ) no-repeat center center;
        background-position: right !important;

        +media( desktop )
        {
            right: -4rem;
        }
    }

    .loading-assets-container .loading-assets-three::before
    {
        bottom: 0;
        left: -20%;
        right: unset;

        height: 20%;

        background: url( '/admin/image/loading/loading_vegetaux_1.png' ) no-repeat center center;
        background-position: left !important;

        +media( desktop )
        {
            left: -4rem;
        }
    }

    .loading-assets-container .loading-assets-four::before
    {
        bottom: 40%;
        left: unset;
        right: -30%;

        height: 40%;

        background: url( '/admin/image/loading/loading_vegetaux_2.png' ) no-repeat center center;
        background-position: right !important;

        +media( tablet )
        {
            right: -20%;
        }
        +media( desktop )
        {
            right: -4rem;
        }
    }
</style>

<div class="loading">
    <div class="loading-animation-container">
        <div class="moien-logo-icon loading-animation">
        </div>
        <div class="loading-progress-bar">
            <div class="loading-progress-line" style="width: { $progress }%;"></div>
        </div>
    </div>
    <div class="loading-assets-container">
        <div class="loading-assets-one"></div>
        <div class="loading-assets-two"></div>
        <div class="loading-assets-three"></div>
        <div class="loading-assets-four"></div>
    </div>
</div>
