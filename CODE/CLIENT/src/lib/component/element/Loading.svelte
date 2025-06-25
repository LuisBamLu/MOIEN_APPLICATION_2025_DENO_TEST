<script>
    // -- VARIABLES

    export let isSmall = false;
</script>

<style lang="stylus">
    // -- CLASSES

    .outter
    {
        height: var( --outter-height, calc( 100dvh - 4.5rem ) );
        width: var( --outter-width, 100% );

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

    .loading > img
    {
        height: 100%;
        width: 100%;
    }
</style>

<div class="outter">
    <div
        class="loading"
        class:is-small={ isSmall }
    >
        <img
            src="/image/icon/loading.svg"
            alt="loading"
        >
    </div>
</div>
