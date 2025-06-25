<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .modal-actions
    {
        height: 5rem;
        border-top: 1px solid grayColor800;
        padding: 1rem;

        display: flex;
        gap: 1rem;
        align-items: center;
        align-self: stretch;

        background: grayColor900;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }
</style>

<div class="modal-actions">
    {@render children?.()}
</div>
