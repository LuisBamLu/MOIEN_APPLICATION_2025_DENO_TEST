<script>
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
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
        cursor: pointer;
        animation: fadeIn 0.5s ease-in-out;
    }

    .table-row:nth-child( odd )
    {
        background-color: blueColor950;
    }

    .table-row:hover
    {
        background-color: blueColor900;
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

<tr class="table-row" onclick={bubble('click')}>
    {@render children?.()}
</tr>
