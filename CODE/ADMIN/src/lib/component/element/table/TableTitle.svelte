<script>
    // -- VARIABLES

    /** @type {{tableRowCount?: any, title: any}} */
    let { tableRowCount = null, title } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .table-title
    {
        margin: 0.5rem 0;

        font-size: 1.12rem;
        font-weight: 700;
        text-align: left;
    }

    .table-row-count
    {
        margin-left: 1rem;
        border-radius: 8px;
        padding: 0.5rem;

        display: inline-flex;

        background-color: blueColor950;

        font-size: 0.8rem;
        font-weight: 700;
    }
</style>

<caption class="table-title">
    { title }
    {#if tableRowCount }
        <span class="table-row-count">({ tableRowCount })</span>
    {/if}
</caption>
