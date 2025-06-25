<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { setLoading, setLoaded, increaseProgress } from '$store/loadingStore';
    import DivBackground from '../element/DivBackground.svelte';

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

    function loadComplete(
        )
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

    // -- STATEMENTS

    setLoading();

    // ~~

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
        top: 0;

        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: white;

        pointer-events: none;
    }

    .load-container
    {
        width: 50%;
        aspect-ratio: 1 / 1;

        display: flex;
        justify-content: center;
        align-items: center;

        +media( tablet )
        {
            width: 35%;
        }

        +media( desktop )
        {
            width: 20%;
        }
    }
</style>

<div class="loading">
    <div class="load-container">
        <DivBackground
            isGlobal={ true }
            imagePath="/global/loading/moien.avif"
            preload={ true }
            lowRes={ 360 }
            highRes={ 640 }
        />
    </div>
</div>
