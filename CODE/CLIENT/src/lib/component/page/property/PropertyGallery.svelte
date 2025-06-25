<script>
    // -- IMPORTS

    import Tab from '$component/element/Tab.svelte';
    import Carousel from '$component/element/Carousel.svelte';
    import { fade } from 'svelte/transition';
    import { getLocalizedText, getRoundInteger } from 'senselogic-gist';
    import { getStorageImagePath } from '$lib/storage';
    import { isMobileScreen } from '$store/appDataStore';
    import { onMount, getContext } from 'svelte';

    // -- CONSTANTS

    const imageSlideSpacing = 16;
    const imageSlideWidth = 120;

    // -- VARIABLES

    export let isOpen = false;
    export let activeIndex = 0;

    let imagePathArray = getContext( 'imagePathArray' );
    let propertyTitle = getContext( 'propertyTitle' );
    let footerElement;
    let visibleSlidePerPageCount = 5;
    let carouselController;

    // -- FUNCTIONS

    function getVisibleImageSlideCount(
        footerElementWidth
        )
    {
        return footerElementWidth / ( imageSlideWidth + imageSlideSpacing );
    }

    // ~~

    function handleLeft(
        )
    {
        let newIndex = activeIndex - 1;

        if ( activeIndex <= 0 )
        {
            newIndex = imagePathArray.length - 1;
        }

        activeIndex = newIndex;
    }

    // ~~

    function handleRight(
        )
    {
        let newIndex = activeIndex + 1;

        if ( activeIndex >= imagePathArray.length - 1 )
        {
            newIndex = 0;
        }

        activeIndex = newIndex;
    }

    // ~~

    function handleResizeEvent(
        )
    {
        if ( footerElement )
        {
            visibleSlidePerPageCount = getVisibleImageSlideCount( footerElement.offsetWidth );
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            handleResizeEvent();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .overlay
    {
        z-index: 999;
        position: fixed;

        inset: 0 0 0 0;
        height: 100dvh;
        width: 100dvw;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        background: #15080E;
    }

    .gallery-header
    {
        padding: 1.5rem 6rem 2.5rem 6rem;

        display: flex;
        gap: 1rem;
        align-items: center;
        align-self: stretch;

        background: linear-gradient(
            0deg, rgba( 0, 0, 0, 0.00 ) 0.45%,
            rgba(   0, 0, 0, 0.60 ) 100% );

        +media( desktop-xlarge )
        {
            padding: 1.5rem 11rem 2.5rem 11rem;
        }
    }

    .close-button
    {
        border-radius: 0.75rem;
        padding: 0.5rem;

        display: flex;
        gap: 0.625rem;
        align-items: flex-start;

        background: whiteColor;
    }

    .gallery-content
    {
        padding: 0px 11rem;

        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 0.625rem;
        align-items: flex-start;
        align-self: stretch;

        +media( desktop-xlarge )
        {
            padding: 0px 21.5rem;
        }
    }

    .gallery-footer
    {
        padding: 2.5rem 11rem 3rem 11rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: flex-end;
        align-items: flex-start;
        align-self: stretch;

        background: linear-gradient(
            0deg, rgba( 0, 0, 0, 0.80 ) 0.45%,
            rgba( 0, 0, 0, 0.00 ) 100% );

        +media( desktop-xlarge )
        {
            padding: 2.5rem 21.5rem 3rem 21.5rem;
        }
    }

    .gallery-title
    {
        flex: 1 0 0;

        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 700;
        text-align: center;
        color: grayColor900;
    }

    .tab
    {
        position: absolute;
        bottom: 40%;

        padding: 0px 6rem;

        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        align-items: flex-start;

        +media( desktop-xlarge )
        {
            padding: 0px 11.5rem;
        }
    }

    .prev
    {
        left: 0px;
    }

    .next
    {
        right: 0px;
    }

    .tab-button
    {
        border: 1px solid whiteColor;
        border-radius: 1.5rem;
        padding: 0.75rem 1rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        opacity: 0.6;

        transition: all 200ms ease-out;
    }

    .tab-button:hover
    {
        opacity: 0.8;
        background: whiteColor;
    }

    .tab-button:hover span
    {
        background: grayColor500;
    }

    .rotate-180
    {
        transform: rotate( 0.5turn );
    }

    .gallery-footer-category-tab-list
    {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }

    .carousel-image-container
    {
        padding: 0 0.5rem;
    }

    .carousel-image
    {
        height: 5rem;
        min-width: 7.5rem;
        border-radius: 0.75rem;

        flex: 1 0 7.5rem;

        opacity: 0.8;
    }

    .is-active
    {
        border: 3px solid greenColor500;
    }

    .image-container
    {
        overflow: clip;

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .house-gallery-image
    {
        width: 100%;

        flex: 1;
        object-fit: cover;
        object-position: center;

        +media( desktop )
        {
            border-radius: 0.75rem;
        }
    }

    .carousel-container
    {
        width: 100%;

        display: inline-flex;
        gap: 1rem;
    }
</style>

<svelte:window on:resize={ handleResizeEvent }/>

{#if isOpen && !$isMobileScreen }
    <div class="overlay" transition:fade>
        <header class="gallery-header">
            <span/>

            <h1 class="gallery-title">{ getLocalizedText( propertyTitle ) }</h1>

            <button class="close-button" on:click={ () => isOpen = false }>
                <span class="green-close-icon size-75"/>
            </button>
        </header>

        <main class="gallery-content">
            <div
                class="image-container house-gallery-image"
                style=
                    "
                        background:
                            url( { getStorageImagePath( imagePathArray[ activeIndex ], 1280 ) } ) no-repeat center center / cover,
                            url( { getStorageImagePath( imagePathArray[ activeIndex ], 360 ) } ) no-repeat center center / cover,
                            url(/image/icon/moien_happy.svg) no-repeat center center / 50%;
                    "
            />
        </main>

        <footer class="gallery-footer">
            <div class="gallery-footer-category-tab-list">
                <Tab
                    label="Living Room"
                    isActive
                    on:click={ () => {} }
                    --tab-border-color="#FFF"
                    --tab-background-color="transparent"
                    --tab-color="#FFF"
                    --tab-hover-border-color="#FFF"
                    --tab-hover-background-color="#FFF"
                    --tab-hover-color="#737373"
                    --active-tab-background-color="#A6F4C5"
                    --active-tab-color="#00584A"
                />
                <Tab
                    label="Kitchen"
                    isActive={ false }
                    on:click={ () => {} }
                    --tab-border-color="#FFF"
                    --tab-background-color="transparent"
                    --tab-color="#FFF"
                    --tab-hover-border-color="#FFF"
                    --tab-hover-background-color="#FFF"
                    --tab-hover-color="#737373"
                    --active-tab-background-color="#A6F4C5"
                    --active-tab-color="#00584A"
                />
                <Tab
                    label="Bathroom"
                    isActive={ false }
                    on:click={ () => {} }
                    --tab-border-color="#FFF"
                    --tab-background-color="transparent"
                    --tab-color="#FFF"
                    --tab-hover-border-color="#FFF"
                    --tab-hover-background-color="#FFF"
                    --tab-hover-color="#737373"
                    --active-tab-background-color="#A6F4C5"
                    --active-tab-color="#00584A"
                />
                <Tab
                    label="Bedroom"
                    isActive={ false }
                    on:click={ () => {} }
                    --tab-border-color="#FFF"
                    --tab-background-color="transparent"
                    --tab-color="#FFF"
                    --tab-hover-border-color="#FFF"
                    --tab-hover-background-color="#FFF"
                    --tab-hover-color="#737373"
                    --active-tab-background-color="#A6F4C5"
                    --active-tab-color="#00584A"
                />
            </div>

            <div
                class="carousel-container"
                bind:this={ footerElement }
            >
                <Carousel
                    columnCount={ visibleSlidePerPageCount }
                    isDraggable={ true }
                    hasCount={ false }
                    hasButtons={ false }
                    isAutomatic={ false }
                >
                    {#each imagePathArray as imagePath, imageIndex }
                        <img
                            class="carousel-image"
                            class:is-active={ imageIndex === activeIndex }
                            src={ getStorageImagePath( imagePath, 360 ) }
                            alt=""
                            on:click={ () => activeIndex = imageIndex }
                        />
                    {/each}
                </Carousel>
            </div>
        </footer>

        <div class="tab prev">
            <button class="tab-button" on:click={ handleLeft }>
                <span class="white-right-caret-icon size-150 rotate-180"/>
            </button>
        </div>

        <div class="tab next">
            <button class="tab-button" on:click={ handleRight }>
                <span class="white-right-caret-icon size-150"/>
            </button>
        </div>
    </div>
{/if}
