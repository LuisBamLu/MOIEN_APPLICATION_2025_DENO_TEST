<script>
    // -- IMPORTS

    import BlogDotList from './../../carousel/BlogDotList.svelte';
    import Carousel from '$component/element/Carousel.svelte';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let dots = false;
    export let controls = false;
    export let hasCounter = true;
    export let slideIndex = 0;
    export let slideCount = 0;

    let isCardBeingHovered = false;

    // -- FUNCTIONS

    function toggleIsBeingHovered(
        )
    {
        isCardBeingHovered = !isCardBeingHovered;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .carousel
    {
        position: relative;

        margin-top: 3vh;
        height: 100%;
        width: 100%;
        border-radius: 5rem;

        justify-content: center;
        align-items: center;
    }

    .carousel-slides
    {
        height: 100%;
        max-height: 37rem;
        border-radius: 1.5rem;

        +media( desktop )
        {
            box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        }
    }

    .carousel-controls
    {
        z-index: 3;
        position: absolute;
        bottom: 1rem;
        right: 1rem;
    }

    .carousel-counter
    {
        border-radius: 0.75rem;
        padding: 0.5rem 1rem;

        background-color: rgba( 23, 23, 23, 0.60 );
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .divider
    {
        margin-top: 1rem;
        height: 1px;
        width: 100%;

        background-color: grayColor700;
    }

    ul
    {
        margin-top: 1rem;
        width: 100%;
        padding: 0;

        display: flex;
        justify-content: center;

        list-style-type: none;
    }

    ul button
    {
        margin: 0.5rem 0.25rem;
        height: 0.75rem;
        width: 0.75rem;
        border-radius: 100%;

        background-color: rgba( 212, 212, 212, 0.5 );
    }

    ul button:hover
    {
        +media( desktop )
        {
            background-color: rgba( 64, 220, 182, 0.85 );
        }
    }

    ul button.active
    {
        background-color: rgba( 64, 220, 182, 1 );
    }
</style>

<div
    class="carousel"
    on:mouseenter={ toggleIsBeingHovered }
    on:mouseleave={ toggleIsBeingHovered }
>
    <Carousel
        hasDots={ false }
        hasButtons={ controls }
        hasCount={ hasCounter }
        isAutomatic={ !isCardBeingHovered }
        bind:slideIndex={ slideIndex }
        bind:slideCount={ slideCount }
        carouselContainerStyle="border-radius: 1.5rem;"
    >
        <slot></slot>
    </Carousel>

    <BlogDotList
        slideIndex={ slideIndex }
        slideCount={ slideCount }
    />

    <div class="divider"/>
</div>
