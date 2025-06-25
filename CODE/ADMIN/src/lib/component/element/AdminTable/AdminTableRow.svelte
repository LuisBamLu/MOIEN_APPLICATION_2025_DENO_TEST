<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .table-row
    {
        border-top: 1px solid grayColor700;

        cursor: pointer;
        animation: fadeIn 0.5s ease-in-out;

        +media( smaller-48em )
        {
            padding-top: 1em;

            display: block;
        }
    }

    .table-row:hover
    {
        background-color: grayColor900;
    }

    :global( .table-row:hover .edit-row )
    {
        opacity: 1;
    }

    @keyframes fadeIn
    {
        0%
        {
            opacity: 0;
        }

        100%
        {
            opacity: 1;
        }
    }
</style>

<tr class="table-row">
    {@render children?.()}
</tr>
