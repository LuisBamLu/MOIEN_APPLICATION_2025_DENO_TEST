<script>
    // -- VARIABLES

    /** @type {{isSmall?: boolean}} */
    let { isSmall = false } = $props();
</script>

<style lang="stylus">
    // -- CLASSES

    .outter
    {
        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading
    {
        height: 4rem;
        width: 4rem;
    }

    .is-small
    {
        height: 2rem;
        width: 2rem;
    }

    svg
    {
        transform-origin: center;

        width: 3.25em;

        animation: rotate 2s linear infinite;
    }

    circle
    {
        fill: none;
        stroke: hsl(160, 97%, 59%);
        stroke-width: 2;
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes rotate
    {
        100%
        {
            transform: rotate( 360deg );
        }
    }

    @keyframes dash
    {
        0%
        {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }

        50%
        {
            stroke-dasharray: 90, 200;
            stroke-dashoffset: -35px;
        }

        100%
        {
            stroke-dashoffset: -125px;
        }
    }
</style>

<div class="outter">
    <div class="loading" class:is-small={ isSmall }>
        <svg viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
        </svg>
    </div>
</div>
