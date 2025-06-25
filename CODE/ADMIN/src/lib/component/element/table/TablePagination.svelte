<script>
    // -- VARIABLES

    // export let limit = 10;
    /** @type {{page?: number, pageCount?: number, maxVisiblePageCount?: number, onPageChange?: any}} */
    let {
        page = 1,
        pageCount = 10,
        maxVisiblePageCount = 3,
        onPageChange = () => {}
    } = $props();

    // -- FUNCTIONS

    function getPageRange(
        current,
        total,
        max
        )
    {
        let maxHalf = Math.floor( max / 2 );
        let start = Math.max( 1, current - maxHalf );
        let end = Math.min( total, current + maxHalf );
        let pageArray = [];

        if ( end - start + 1 < max )
        {
            if ( start === 1 )
            {
                end = Math.min( total, start + max - 1 );
            }
            else if ( end === total )
            {
             start = Math.max( 1, end - max + 1 );
            }
        }

        for (let index = start; index <= end; index += 1 )
        {
            pageArray.push( index );
        }

        if ( start > 1 )
        {
            pageArray.unshift( '...' );
            pageArray.unshift( 1 );
        }

        if ( end < total )
        {
            pageArray.push( '...' );
            pageArray.push( total );
        }

        return pageArray;
    }

    // ~~

    function handlePageClick(
        pageNumber
        )
    {
        if ( typeof pageNumber === 'number' )
        {
            onPageChange( pageNumber );
        }
    }

    // -- STATEMENTS

    let pageNumberArray = $derived(getPageRange( page, pageCount, maxVisiblePageCount ));
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .pagination
    {
        overflow-x: hidden;
        max-width: 100%;
        padding: 0.5rem 0;

        display: flex;
        gap: 1rem;
    }

    .pagination button
    {
        border-radius: 8px;
        padding: 0.5rem 0.75rem;

        display: block;

        font-weight: 700;
        text-decoration: none;
        color: grayColor100;

        cursor: pointer;
    }

    .active
    {
        background-color: blueColor950;

        text-decoration: underline;

        pointer-events: none;
    }
</style>

<tr>
    <td colspan="4">
        <ul class="pagination">
            {#each pageNumberArray as pageNumber }
                <li>
                    <button class:active={ pageNumber === page } onclick={() => handlePageClick( pageNumber )}>
                        { pageNumber }
                    </button>
                </li>
            {/each}
        </ul>
    </td>
</tr>
