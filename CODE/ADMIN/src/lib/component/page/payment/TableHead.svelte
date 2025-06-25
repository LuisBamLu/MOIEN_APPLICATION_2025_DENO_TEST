<script>
    // -- VARIABLES

    /** @type {{headerColumnArray?: any, handleSort?: any}} */
    let { headerColumnArray = [], handleSort = ( columnName ) => {} } = $props();
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
        max-width: 12rem;
        padding: 1.25rem 1rem;

        font-size: 0.875rem;
        text-overflow: ellipsis;
        color: grayColor500;

        cursor: pointer;
    }
</style>

<thead class="table-head">
    <tr>
        {#each headerColumnArray as headerColumn }
            <th onclick={() => handleSort( headerColumn.name )}>{ headerColumn.name }</th>
        {/each}
    </tr>
</thead>
