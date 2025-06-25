<script>
    /** @type {{icon?: import('svelte').Snippet, text?: import('svelte').Snippet, action?: import('svelte').Snippet}} */
    let { icon, text, action } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-action-type
    {
        border-radius: 0.75rem;
        padding: 0.75rem;

        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
        align-self: stretch;

        background: grayColor800;
    }

    .conversation-action-type-detail
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 4px;
        align-items: flex-start;
    }
</style>

<div class="conversation-action-type">
    {@render icon?.()}
    <div class="conversation-action-type-detail">
        {@render text?.()}
        {@render action?.()}
    </div>
</div>
