<script>
    // -- IMPORTS

    import Checkbox from '../Checkbox.svelte';

    // -- VARIABLES

    /** @type {{headerColumnArray: any, handleSort: any}} */
    let { headerColumnArray, handleSort } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .table-head
    {
        z-index: 1;
        position: sticky;
        top: 0;

        background-color: white;

        +media( smaller-48em )
        {
            display: none;
        }
    }
    .table-head th
    {
        overflow: hidden;
        max-width: 12rem;
        padding: 0.5rem;

        cursor: pointer;
    }

    .th-container
    {
        overflow: hidden;
        min-width: 8vw;

        font-size: 0.875rem;
        font-weight: 700;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: grayColor100;
    }
</style>

<thead class="table-head">
    <tr>
        <th>
            <Checkbox name="select-row"/>
        </th>
        {#each headerColumnArray as headerColumn }
            <th onclick={handleSort} title={ headerColumn }>
                <div class="th-container">
                    { headerColumn }
                </div>
            </th>
        {/each}
    </tr>
</thead>
