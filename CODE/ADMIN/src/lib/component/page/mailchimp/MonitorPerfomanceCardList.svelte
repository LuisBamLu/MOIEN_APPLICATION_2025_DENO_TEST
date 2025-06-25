<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style lang="stylus">
    // -- CLASSES

    .monitor-performance-section-content-cards
    {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        align-items: stretch;
    }
</style>

<div class="monitor-performance-section-content-cards">
    {@render children?.()}
</div>
