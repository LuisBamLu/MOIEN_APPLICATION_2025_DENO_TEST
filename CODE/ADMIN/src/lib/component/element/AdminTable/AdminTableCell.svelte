<script>
    /** @type {{colspan?: number, handleClick?: any, title?: string, children?: import('svelte').Snippet}} */
    let {
        colspan = 1,
        handleClick = () => {},
        title = '',
        children
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .table-cell
    {
        overflow: hidden;
        max-width: var( --table-cell-max-width, 12rem );
        padding: 0.5rem;

        font-weight: 500;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: grayColor500;

        +media( smaller-48em )
        {
            max-width: 97dvw;
            border-bottom: 1px solid greenColor950;

            display: block;

            vertical-align: middle;
            text-align: right;
            text-wrap: wrap;
        }
    }

    .table-cell:before
    {
        +media( smaller-48em )
        {
            float: left;
            float: left;

            content: attr( data-title );

            font-size: inherit;
            font-weight: 400;
            color: grayColor500;
        }
    }
</style>

<td
    class="table-cell font-size-80"
    colspan={ +colspan }
    onclick={handleClick}
    data-title={ title }
>
    {@render children?.()}
</td>
