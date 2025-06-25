<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { cubicInOut, linear } from 'svelte/easing';
    import { slide, fade } from 'svelte/transition';
    import { getStorageImagePath } from '$lib/storage';
    import { IntervalTimer } from '$lib/intervalTimer';

    // -- CONSTANTS

    const requiredHoldTimeMsCount = 1000;

    // -- VARIABLES

    export let storyTitle = 'Search';
    export let imageArray = [];
    export let showGallery = false;
    export let activeIndex = 0;
    let activeProgress = 0;
    let progressIntervalInMilliseconds = 100;
    let activeInterval;
    let gallery;
    let isPaused = false;
    let holdPauseTimeout;

    // -- FUNCTIONS

    function openGallery(
        imageIndex
        )
    {
        activeIndex = imageIndex;
        showGallery = true;
    }

    // ~~

    function closeGallery(
        )
    {
        activeIndex = 0;
        activeProgress = 0;
        showGallery = false;
    }

    // ~~

    function nextImage(
        )
    {
        activeProgress = 0;

        if ( activeIndex < imageArray.length - 1 )
        {
            activeIndex = activeIndex + 1;
        }
        else
        {
            closeGallery();
        }
    }

    // ~~

    function prevImage(
        )
    {
        activeProgress = 0;

        if ( activeIndex > 0 )
        {
            activeIndex = activeIndex - 1;
        }
        else
        {
            closeGallery();
        }
    }

    // ~~

    function startActiveProgress(
        )
    {
        if ( activeInterval ) activeInterval.clear();

        activeInterval.start();
    }

    // ~~

     function toggleSlideAnimationPauseResume(
        )
    {
        if ( activeInterval.paused )
        {
            activeInterval.resume();
        }
        else
        {
            activeInterval.pause();
        }
    }

    // ~~

    function getThumbProgressWidth(
        imageIndex
        )
    {
        if ( imageIndex === activeIndex )
        {
            return activeProgress;
        }

        if ( imageIndex < activeIndex )
        {
            return 100;
        }

        return 0;
    }

    // ~~

    function handleTouchStartEvent(
        )
    {
        holdPauseTimeout = setTimeout(
            handlePause,
            requiredHoldTimeMsCount
            );
    }

    // ~~

    function handleTouchEndEvent(
        )
    {
        clearTimeout( holdPauseTimeout );
        handleResume();
    }

    // ~~

    function handlePause(
        )
    {
        isPaused = true;
        activeInterval.pause();
    }

    // ~~

    function handleResume(
        )
    {
        isPaused = false;
        activeInterval.resume();
    }

    // ~~

    onMount(
        () =>
        {
            activeInterval = new IntervalTimer(
            () =>
            {
                let smoothProgressIncrement = 0.83;
                activeProgress += smoothProgressIncrement;

                if ( activeIndex === imageArray.length )
                {
                    nextImage();

                    return;
                }

                if ( activeProgress > 100 )
                {
                    activeIndex += 1;
                    activeProgress = 0;

                    return;
                }
            },
            progressIntervalInMilliseconds
            );

            startActiveProgress();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .overlay
    {
        z-index: overlayZIndex;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        height: 100%;
        width: 100%;

        background: grayColorTransparent60;
    }

    .gallery
    {
        z-index: 1;
        position: absolute;
        bottom: 0;

        overflow: hidden;
        max-height: 90%;
        max-width: 100%;
        border-radius: 1.5rem 1.5rem 0 0;

        display: grid;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        +media( desktop )
        {
            max-height: 100%;
            border-radius: 0;
        }
    }

    .thumbs
    {
        grid-area: 1 / 1;

        display: flex;
        justify-content: center;
    }

    .gallery-items
    {
        grid-area: 1 / 1;

        height: 100%;
        width: 100%;
    }

    .gallery-items img
    {
        grid-area: 1 / 1;
        z-index: 2;

        height: 100dvh;
        width: 100vw;

        display: none;
        object-fit: cover;

        cursor: pointer;

        +media( desktop )
        {
            margin-top: 2rem;

            object-fit: none;
        }
    }

    .gallery-items img.active
    {
        display: initial;
    }

    .gallery-nav
    {
        grid-area: 1 / 1;
        z-index: 3;

        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr 1fr;
    }

    .thumbs
    {
        display: flex;
    }

    .gallery-nav-header
    {
        grid-column: 1 / 3;

        padding: 1.25rem 1.5rem;

        background: linear-gradient( 0deg, rgba( 0, 0, 0, 0.00 ) 8.41%, rgba( 0, 0, 0, 0.30 ) 100% );
    }

    .thumb,
    .thumb-progress
    {
        height: 0.125rem;
        border-radius: 0.625rem;

        background: whiteColorTransparent40;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    img
    {
        max-width: 100%;
        overflow-clip-margin: content-box;
        overflow: clip;
    }

    .thumb
    {
        overflow: hidden;
        margin: 0.25rem 0.3125rem;

        display: flex;
        flex: 1;
        align-items: center;
    }

    .thumb-progress
    {
        width: 0;

        background: whiteColor;
    }

    .gallery-button
    {
        -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba( 0,0,0,0 );
        opacity: 0;
    }

    .gallery-nav-header-title
    {
        margin-bottom: 0.5rem;

        display: flex;
        gap: 0.8em;
    }

    .gallery-nav-header-title button
    {
        height: 36px;
        width: 36px;
        border-radius: 0.75rem;
        padding: 0.375rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background: whiteColor;
    }

    .title
    {
        flex: 1;

        text-align: center;
        text-shadow: 0px 0px 8px 0px rgba( 23,23,23,0.04 );
    }

    .gallery-counter
    {
        position: absolute;
        bottom: 1rem;
        right: 1rem;

        border-radius: 0.75rem;
        padding: 0.5rem 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background: grayColorTransparent60;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }
</style>

{#if showGallery }
    <div class="overlay" transition:fade={ { duration: 500, easing: cubicInOut } }>
        <div class="gallery" transition:slide={ { duration: 600, axis: 'y', easing: cubicInOut } } bind:this={ gallery }>
            {#key activeIndex }
                <div class="gallery-items" transition:fade={ { duration: 400, easing: linear } }>
                    {#each imageArray as imagePath, imageIndex }
                        <img
                            src={ getStorageImagePath( imagePath, 1280 ) }
                            alt=""
                            class:active={ activeIndex === imageIndex }
                        />
                    {/each}
                </div>
            {/key}

            <nav class="gallery-nav">
                <header class="gallery-nav-header">
                    <div class="gallery-nav-header-title">
                        <span class="font-size-150 font-weight-700 color-white title">{ storyTitle }</span>
                        <button type="button" on:click={ closeGallery }>
                            <div class="green-close-icon size-150"></div>
                        </button>
                    </div>
                    <div class="thumbs">
                        {#each imageArray as _, imageIndex }
                            <div class="thumb">
                                {#key activeProgress }
                                    <div
                                        class="thumb-progress"
                                        style="width: { getThumbProgressWidth( imageIndex ) }%"
                                    />
                                {/key}
                            </div>
                        {/each}
                    </div>
                </header>
                <button class="gallery-button" on:touchstart={ handleTouchStartEvent } on:touchend={ handleTouchEndEvent } on:click={ prevImage }>Previous</button>
                <button class="gallery-button" on:touchstart={ handleTouchStartEvent } on:touchend={ handleTouchEndEvent } on:click={ nextImage }>Next</button>
            </nav>

            <div class="gallery-counter font-size-90 font-weight-700 color-white">
                { activeIndex + 1 } / { imageArray.length }
            </div>
        </div>
    </div>
{/if}
