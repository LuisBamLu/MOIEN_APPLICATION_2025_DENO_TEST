<script>
    /** @type {{colspan?: number, children?: import('svelte').Snippet}} */
    let { colspan = 1, children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .table-cell
    {
        overflow: hidden;
        max-width: 5rem;
        padding: 0.5rem 1rem;

        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>

<td class="table-cell font-size-80" colspan={ +colspan }>
    {@render children?.()}
</td>
