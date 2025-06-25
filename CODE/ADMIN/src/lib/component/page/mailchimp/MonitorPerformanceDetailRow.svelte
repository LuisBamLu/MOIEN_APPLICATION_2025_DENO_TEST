<script>
    // -- VARIABLES

    /** @type {{text?: any, value?: any, children?: import('svelte').Snippet}} */
    let { text = null, value = null, children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import "../../../../constant.styl";

    // -- CLASSES

    .detail-row
    {
        border-bottom: var( --border-bottom, 1px ) solid grayColor800;
        padding-bottom: 0.25rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

<div class="detail-row">
    {#if text !== null }
        <div class="font-size-75">{ text }</div>
    {/if}
    {#if value !== null }
        <div class="font-size-75">{ value }</div>
    {/if}
    {@render children?.()}
</div>
