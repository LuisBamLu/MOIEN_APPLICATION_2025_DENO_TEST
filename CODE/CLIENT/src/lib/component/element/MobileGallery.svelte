<script>
    // -- IMPORTS

    import { clickOutside } from '$lib/base';
    import { getStorageImagePath } from '$lib/storage';
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import StoryViewer from './StoryViewer.svelte';
    import { cubicInOut } from 'svelte/easing';

    // -- VARIABLES

    export let propertyTitle;
    export let imageArray;
    let isStoryViewerOpen = false;
    let isOpen;
    let activeImageIndex = 0;

    // -- FUNCTIONS

    function handleCloseModal(
        )
    {
        isOpen = false;
    }

    // ~~

    function openGallery(
        imageClass
        )
    {
        let galleryImage = document.querySelectorAll( imageClass );

        for ( let image of galleryImage )
        {
            image.addEventListener(
                'click',
                () =>
                {
                    isOpen = true;
                }
                );
        }
    }

    // ~~

    function handleOpenStoryViewer(
        imageIndex
        )
    {
        activeImageIndex = imageIndex;
        isStoryViewerOpen = true;
    }

    // -- STATEMENTS

    onMount(
        () =>
        openGallery( '.gallery-image' )
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .modal-overlay
    {
        z-index: 1000;
        position: fixed;

        inset: 0 0 0 0;
        height: 100vh;
        width: 100vw;

        display: flex;
        justify-content: center;
        align-items: flex-end;

        background-color: rgba( 0, 0, 0, 0.5 );
    }

    .modal-root
    {
        z-index: 1001;
        position: relative;

        height: 90%;
        width: 100%;
        border-radius: 1.5rem 1.5rem 0px 0px;
        padding: 1rem 1rem 2.5rem;

        display: inline-flex;
        flex-direction: column;
        align-items: center;

        background: grayColor950;
    }

    .modal-header
    {
        position: absolute;
        position: absolute;
        top: 0;

        width: 100dvw;
        border-radius: 1.5rem 1.5rem 0 0;
        padding: 1rem 1rem 2.5rem;

        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;

        background: linear-gradient( 0deg, rgba( 0, 0, 0, 0.00 ) 0.45%, rgba( 0, 0, 0, 0.80 ) 100% );
    }

    .modal-header-title
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
    }

    .modal-header-title span,
    .modal-header-title button
    {
        height: 2.25rem;
        width: 2.25rem;
        border-radius: 0.75rem;
        padding: 0.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }

    .modal-header-title button
    {
        height: 2.75rem;
        width: 2.75rem;
        border-radius: 0.75rem;
        padding: 0.375rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background: whiteColor;
    }

    .modal-header-title h1
    {
        flex: 1 0 0;

        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 700;
        text-align: center;
        color: grayColor900;
    }

    .modal-content
    {
        overflow-y: auto;

        display: grid;
        flex: 1 0 0;
        flex-direction: column;
        grid-template-columns: repeat(9, 1fr);
        gap: 0.25rem;
        align-items: center;
        align-self: stretch;
    }

    .gallery-image
    {
        height: 13.75rem;
        width: 100%;
        border-radius: 0.5rem;

        object-fit: cover;

        color: transparent;
    }

    .gallery-image:nth-child( 6n + 1 )
    {
        grid-column: span 9;
    }

    .gallery-image:nth-child( 6n + 2 )
    {
        grid-column: span 4;
    }

    .gallery-image:nth-child( 6n + 3 )
    {
        grid-column: span 5;
    }

    .gallery-image:nth-child( 6n + 4 )
    {
        grid-column: span 9;
    }

    .gallery-image:nth-child( 6n + 5 )
    {
        grid-column: span 5;
    }

    .gallery-image:nth-child( 6n + 6 )
    {
        grid-column: span 4;
    }
</style>

{#if isOpen}
    <div class="modal-overlay" transition:fade={ { duration: 300, easing: cubicInOut } }>
        <div
            class="modal-root"
            transition:slide={ { duration: 600, axis: 'y', easing: cubicInOut } }
            use:clickOutside
            on:clickOutside={ isStoryViewerOpen ? null : handleCloseModal }
            role="dialog"
        >
            <main class="modal-content">
                {#each imageArray as imagePath, imageIndex}
                    <div
                        class="gallery-image"
                        style=
                            "
                                background:
                                    url( { getStorageImagePath( imagePath, 1280 ) } ) no-repeat center center / cover,
                                    url( { getStorageImagePath( imagePath, 360 ) } ) no-repeat center center / cover,
                                    url(/image/icon/moien_happy.svg) no-repeat center center / 50%;
                            "
                        on:click={ () => handleOpenStoryViewer( imageIndex ) }
                        role="button"
                        tabindex="0"
                        on:keydown={ () => handleOpenStoryViewer( imageIndex ) }
                    />
                {/each}
            </main>

            <header class="modal-header">
                <div class="modal-header-title">
                    <span></span>

                    <h1>{ propertyTitle }</h1>

                    <button on:click={ handleCloseModal }>
                        <div class="green-thin-close-icon size-200"/>
                    </button>
                </div>
            </header>
        </div>
    </div>
{/if}

<StoryViewer
    storyTitle={ propertyTitle }
    imageArray={ imageArray }
    activeIndex={ activeImageIndex }
    bind:showGallery={ isStoryViewerOpen }
/>
