<script>
    // -- VARIABLES

    /** @type {{title?: string, subtitle?: any, children?: import('svelte').Snippet}} */
    let { title = '', subtitle = null, children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .monitor-performance
    {
        margin: 0 auto;
        width: 100%;
        max-width: 74.5rem;
        border: 1px solid grayColor800;
        border-radius: 1rem;

        background: whiteColor;
    }

    .monitor-performance-header
    {
        width: 100%;
        padding: 1.5rem 1.5rem 1rem;
    }

    .monitor-performance-section
    {
        width: 100%;
        padding: 0 1.5rem 1.5rem;
    }

    .monitor-performance-section-content
    {
        border-top: var( --border-top-width, 1px )
                    var( --border-top-style, solid )
                    var( --border-top-color, grayColor800 );
        padding-top: 1.5rem;
    }
</style>

<div class="monitor-performance">
    <header class="monitor-performance-header">
        <h1 class="font-size-100 font-weight-600 line-height-150">{ title }</h1>
        {#if subtitle !== null }
            <p class="font-size-75">{ subtitle }</p>
        {/if}
    </header>

    <section class="monitor-performance-section">
        <div class="monitor-performance-section-content">
            {@render children?.()}
        </div>
    </section>
</div>
