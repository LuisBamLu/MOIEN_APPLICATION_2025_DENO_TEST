<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .accordion-list
    {
        width: 100%;
        padding: 0.625rem;

        display: flex;
        flex-direction: column;
        gap: 0.12rem;
        align-items: flex-start;

        background: var( --accordion-list-background, transparent );
    }
</style>

<div class="accordion-list">
    {@render children?.()}
</div>
