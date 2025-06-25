<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .table-tfoot
    {
        margin-top: 1rem;
        border-top: 2px solid grayColor700;
    }
</style>

<tfoot class="table-tfoot">
    {@render children?.()}
</tfoot>
