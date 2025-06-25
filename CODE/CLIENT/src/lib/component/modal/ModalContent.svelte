<script>
    // -- VARIABLES

    export let className = 'modal-content';
    export let wait = false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .modal-content
    {
        overflow: auto;
        width: 100%;
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

    .modal-content.wait
    {
        cursor: wait;
    }
</style>

<div class={ className } class:wait={ wait } role="dialog">
    <slot/>
</div>
