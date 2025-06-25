<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .table-widget
    {
        overflow-x: auto;
        border: 2px solid grayColor700;
        border-radius: 1rem;
        padding: 1.5rem;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        text-align: left;
    }

    .table-widget table
    {
        width: 100%;
        border-collapse: collapse;
    }
</style>

<div class="table-widget">
    <table>
        {@render children?.()}
    </table>
</div>
