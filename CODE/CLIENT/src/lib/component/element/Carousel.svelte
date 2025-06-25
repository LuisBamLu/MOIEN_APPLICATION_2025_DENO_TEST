<script>
    // -- IMPORTS

    import { onMount, onDestroy } from 'svelte';

    // -- VARIABLES

    export let columnCount = 1;
    export let hasCount = true;
    export let hasDots = true;
    export let hasButtons = true;
    export let isAutomatic = true;
    export let isDraggable = true;
    export let stayDuration = 2000;
    export let transitionDuration = 700;
    export let resumeDuration = 3000;
    export let onChange = () => {};
    export let getDotComponent = undefined;
    export let slideIndex = 0;
    export let slideCount = 0;
    export let carouselContainerStyle = '';

    let previousSlideIndex = 0
    let carouselElement;
    let stripElement;
    let resizeObserver;
    let nextSlideInterval;
    let resumeTimeout;
    let isTransitioning = false;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // -- FUNCTIONS

    function getColumnGapWidth(
        )
    {
        return parseFloat( getComputedStyle( stripElement ).columnGap ) || 0;
    }

    // ~~

    function getSlideWidth(
        columnGapWidth
        )
    {
        return ( carouselElement.offsetWidth - ( columnCount - 1 ) * columnGapWidth ) / columnCount;
    }

    // ~~

    function setSlideIndex(
        newSlideIndex,
        isImmediate = false
        )
    {
        previousSlideIndex = slideIndex;
        slideIndex = newSlideIndex;

        if ( stripElement )
        {
            stripElement.style.transitionDuration = isImmediate ? '0ms' : transitionDuration + 'ms';

            let columnGapWidth = getColumnGapWidth();
            let slideWidth = getSlideWidth( columnGapWidth );

            stripElement.style.transform = 'translateX(' + -( slideIndex * ( slideWidth + columnGapWidth ) ) + 'px)';

            if ( !isImmediate )
            {
                onChange( { previousSlideIndex, slideIndex, slideCount } );
            }
        }
    }

    // ~~

    function initialize()
    {
        slideCount = stripElement.children.length / 2;

        let columnGapWidth = getColumnGapWidth();
        let slideWidth = getSlideWidth( columnGapWidth );
        stripElement.style.width = ( slideCount * slideWidth + ( slideCount - 1 ) * columnGapWidth ) + 'px';

        for ( let slideElement of stripElement.children )
        {
            slideElement.style.flex = '0 0 ' + slideWidth + 'px';
        }

        setSlideIndex( slideIndex );

        if ( slideCount < columnCount )
        {
            for ( let slideIndex = slideCount;
                  slideIndex < slideCount * 2;
                  ++slideIndex )
            {
                stripElement.children[ slideIndex ].style.display = 'none';
            }
        }
    }

    // ~~

    function showPriorSlide(
        )
    {
        if ( slideCount > columnCount
             && !isTransitioning )
        {
            isTransitioning = true;

            if ( slideIndex === 0 )
            {
                setSlideIndex( slideCount, true );

                window.requestAnimationFrame(
                    () =>
                    {
                        setSlideIndex( slideCount - 1 );
                    }
                    );
            }
            else
            {
                setSlideIndex( slideIndex - 1 );
            }

            setTimeout(
                () =>
                {
                    isTransitioning = false;
                },
                transitionDuration
                );
        }
    }

    // ~~

    function showNextSlide(
        )
    {
        if ( slideCount > columnCount
             && !isTransitioning )
        {
            isTransitioning = true;
            setSlideIndex( slideIndex + 1 );

            setTimeout(
                () =>
                {
                    if ( slideIndex === slideCount )
                    {
                        setSlideIndex( 0, true );
                    }

                    isTransitioning = false;
                },
                transitionDuration
                );
        }
    }

    // ~~

    function resume(
        action
        )
    {
        if ( slideCount > columnCount )
        {
            pause();
            action();

            if ( resumeTimeout )
            {
                clearTimeout( resumeTimeout );
            }

            resumeTimeout = setTimeout( start, resumeDuration );
        }
    }

    // ~~

    function handleKeydown( event )
    {
        if ( event.key === 'ArrowLeft' )
        {
            resume( showPriorSlide );
        }
        else if ( event.key === 'ArrowRight' )
        {
            resume( showNextSlide );
        }
    }

    // ~~

    function setSlideIndexByDot( dotIndex )
    {
        isTransitioning = true;
        setSlideIndex( dotIndex );

        setTimeout(
            () =>
            {
                if ( slideIndex === slideCount )
                {
                    setSlideIndex( 0, true );
                }

                isTransitioning = false;
            },
            transitionDuration
            );
    }

    // ~~

    function start()
    {
        if ( slideCount > columnCount
             && isAutomatic )
        {
            nextSlideInterval = setInterval( showNextSlide, stayDuration + transitionDuration );
        }
    }

    // ~~

    function pause()
    {
        if ( nextSlideInterval )
        {
            clearInterval( nextSlideInterval );
        }
    }

    function handleTouchStart( event )
    {
        if( !isDraggable )
        {
            return null;
        }

        startX = event.touches ? event.touches[0].clientX : event.clientX;
        currentX = startX;
        isDragging = true;

        if ( stripElement )
        {
            stripElement.style.transitionDuration = '0ms';
        }
    }

    function handleTouchMove(event)
    {
        if ( !isDragging  || !isDraggable )
        {
            return;
        }

        let newX = event.touches ? event.touches[ 0 ].clientX : event.clientX;
        let deltaX = newX - startX;
        currentX = newX;

        if ( stripElement )
        {
            let columnGapWidth = getColumnGapWidth();
            let slideWidth = getSlideWidth( columnGapWidth );
            let offset = - ( slideIndex * ( slideWidth + columnGapWidth ) ) + deltaX;
            stripElement.style.transform = `translateX( ${ offset }px )`;
        }
    }

    function handleTouchEnd()
    {
        if ( !isDragging || !isDraggable )
        {
            return;
        }

        isDragging = false;

        let deltaX = currentX - startX;
        let threshold = 50;

        if ( Math.abs( deltaX ) > threshold )
        {
            if ( deltaX < 0 )
            {
                showNextSlide();
            }
            else
            {
                showPriorSlide();
            }
        }
        else
        {
            setSlideIndex( slideIndex, true );
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            initialize();

            resizeObserver =
                new ResizeObserver(
                    () =>
                    {
                        initialize();
                    }
                );

            resizeObserver.observe( carouselElement );

            start();

            return (
                () =>
                {
                    if ( resizeObserver )
                    {
                        resizeObserver.disconnect();
                    }

                    pause();
                }
                );
        }
        );

    onDestroy(
        () =>
        {
            pause();

            if ( resumeTimeout )
            {
                clearTimeout( resumeTimeout );
            }
        }
        );

    $: {
        if ( isAutomatic )
        {
            start();
        }
        else
        {
            pause();
        }
    }
</script>

<style lang="stylus">
    .carousel
    {
        position: relative;

        overflow: hidden;
        height: 100%;
        width: 100%;

        display: flex;
    }

    .carousel:focus
    {
        outline: none;
    }

    .carousel-strip
    {
        height: 100%;
        width: 100%;

        display: flex;
        column-gap: 0.76rem;

        transition: transform 0.5s ease-in-out;
    }

    .carousel-slide
    {
        box-sizing: border-box;
        height: 100%;
        width: 100%;

        flex: 0 0 1;
    }

    .carousel-count
    {
        position: absolute;
        bottom: 1rem;
        right: 1rem;

        border-radius: 0.25rem;
        padding: 0 0.25rem;

        background-color: rgba( 0, 0, 0, 0.5 );

        font-size: 1rem;
        color: whiteColor;
    }

    .carousel-button
    {
        position: absolute;
        top: 50%;
        transform: translateY( -50% );

        border: none;
        padding: 0 0.25rem;

        background-color: rgba( 0, 0, 0, 0.5 );

        font-size: 1.5rem;
        color: whiteColor;

        cursor: pointer;
    }

    .carousel-button.carousel-prior-slide-button
    {
        left: 1rem;
    }

    .carousel-button.carousel-next-slide-button
    {
        right: 1rem;
    }

    .carousel-dot-list
    {
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        gap: 8px;
        justify-content: center;
        align-items: center;
    }

    .carousel-dot
    {
        height: 8px;
        width: 8px;
        border-radius: 50%;

        background-color: rgba(255, 255, 255, 0.5);

        transition: all 0.3s ease-in-out;
    }

    .carousel-dot.active
    {
        height: 12px;
        width: 12px;

        background-color: rgba(255, 255, 255, 1);
    }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
    class="carousel"
    bind:this={ carouselElement }
    on:keydown={ handleKeydown }
    on:touchstart={ handleTouchStart }
    on:touchmove={ handleTouchMove }
    on:touchend={ handleTouchEnd }
    on:mousedown={ handleTouchStart }
    on:mousemove={ handleTouchMove }
    on:mouseup={ handleTouchEnd }
    tabindex="0"
    style={`width: 100%; height: 100%; ${ carouselContainerStyle }`}
>
    <div bind:this={ stripElement } class="carousel-strip" style="transition-duration: { transitionDuration }ms;">
        <slot></slot>
        <slot></slot>
    </div>

    {#if hasCount && slideCount }
        <div class="carousel-count">{ ( slideIndex % slideCount ) + 1 }/{ slideCount }</div>
    {/if}

    {#if hasDots && slideCount }
        {#if getDotComponent !== undefined }
            <svelte:component
                this={ getDotComponent( slideCount, slideIndex ) }
                { slideCount }
                { slideIndex }
            />
        {:else}
            <div class="carousel-dot-list">
                {#each { length: slideCount } as _, dotIndex }
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            on:click={ () => setSlideIndexByDot( dotIndex ) }
                            class="carousel-dot { dotIndex === ( slideIndex % slideCount ) ? 'active' : '' }"
                            style="
                                    width: {8 - Math.abs(dotIndex - slideIndex) * 1.5}px;
                                    height: {8 - Math.abs(dotIndex - slideIndex) * 1.5}px;
                                    opacity: {1 - Math.abs(dotIndex - slideIndex) * 0.2};
                                "
                        />
                {/each}
            </div>
        {/if}
    {/if}

    {#if hasButtons }
        <button class="carousel-button carousel-prior-slide-button" on:click={ () => resume( showPriorSlide ) }>&#x276E;</button>
        <button class="carousel-button carousel-next-slide-button" on:click={ () => resume( showNextSlide ) }>&#x276F;</button>
    {/if}
</div>
