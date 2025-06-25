<script>
    // -- VARIABLES

    /** @type {{className?: string, wait?: boolean, children?: import('svelte').Snippet}} */
    let { className = 'modal-content', wait = false, children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .modal-content
    {
        overflow: hidden;
        overflow-y: auto
        padding: 2rem 1.5rem;

        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        align-self: stretch;

        background: grayColor900;

        scroll-snap-type: y mandatory;
    }

    .modal-content::-webkit-scrollbar-track
    {
        background-color: #F4F4F4;
    }

    .modal-content::-webkit-scrollbar
    {
        width: 0.625em;

        background: #F4F4F4;
    }

    .modal-content::-webkit-scrollbar-thumb
    {
        border-radius: 1em;

        background: #dad7d7;
    }

    .modal-content.wait
    {
        cursor: wait;
    }
</style>

<div class={ className } class:wait={ wait } >
    {@render children?.()}
</div>
