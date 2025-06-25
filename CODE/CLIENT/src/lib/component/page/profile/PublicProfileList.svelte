<script>
    // -- VARIABLES

    export let label = '';

    let container;
    let isDown = false;
    let startX;
    let scrollLeft;

    // -- FUNCTIONS

    function startDrag(
        event
        )
    {
        isDown = true;
        let clientX = event.touches ? event.touches[ 0 ].clientX : event.clientX;

        startX = clientX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    }

    // ~~

    function moveDrag(
        event
        )
    {
        if ( !isDown ) return;

        event.preventDefault();

        let clientX = event.touches ? event.touches[ 0 ].clientX : event.clientX;
        let x = clientX - container.offsetLeft;
        let walk = ( x - startX ) * 2;
        container.scrollLeft = scrollLeft - walk;
    }

    // ~~

    function stopDrag(
        event
        )
    {
        isDown = false;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .profile-list-container
    {
        padding-bottom: 2rem;

        gap: 0.75rem;

        +media( desktop )
        {
            border-bottom: var( --border-bottom, 1px solid grayColor700 );
        }
    }

    .profile-list
    {
        overflow: hidden;
        width: 100%;

        display: flex;
        flex-wrap: nowrap;
        gap: 1rem;

        white-space: nowrap;

        scroll-behavior: smooth;
        scroll-snap-type: x mandatory;
        user-select: none;
        cursor: grab;

        +media( desktop )
        {
            max-width: min( 46rem, 38.33dvw );
        }
    }

    .is-active
    {
        cursor: grabbing;
    }

    .property-list-title
    {
        font-size: 0.9rem;

        +media( desktop )
        {
            font-size: 1.25rem;
        }
    }
</style>

<div class="profile-list-container full-width display-flex flex-direction-column justify-content-center">
    <h2 class="full-width property-list-title padding-top-75 color-gray-100 font-weight-700">
         { label }
    </h2>

    <div
        class="profile-list padding-vertical-100 display-flex gap-125"
        class:is-active={ isDown }
        bind:this={ container }
        on:mousedown={ startDrag }
        on:mousemove={ moveDrag }
        on:mouseup={ stopDrag }
        on:mouseleave={ stopDrag }
        on:touchstart={ startDrag }
        on:touchmove={ moveDrag }
        on:touchend={ stopDrag }
    >
        <slot/>
    </div>
</div>
