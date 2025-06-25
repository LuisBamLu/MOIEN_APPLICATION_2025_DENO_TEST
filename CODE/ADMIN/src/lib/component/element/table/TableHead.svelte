<script>
    // -- VARIABLES

    /** @type {{headerColumnArray?: any}} */
    let { headerColumnArray = [] } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .table-head
    {
        border-top: 2px solid grayColor700;
    }

    .table-head th
    {
        overflow: hidden;
        max-width: 5rem;
        padding: 1.25rem 1rem;

        font-size: 0.875rem;
        text-overflow: ellipsis;
        color: grayColor500;
    }
</style>

<thead class="table-head">
    <tr>
        {#each headerColumnArray as headerColumn }
            <th>{ headerColumn.name }</th>
        {/each}
    </tr>
</thead>
