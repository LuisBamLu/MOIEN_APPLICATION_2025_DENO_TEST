<script>
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
    // -- IMPORTS
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .card
    {
        margin-bottom: 0.5rem;
        max-width: calc(var(--viewport-width) - 2rem - 0.5px);
        border: 2px solid blueColor900;
        border-radius: 0.5rem;
        padding: 1rem;

        background: blueColor950;
    }

    .form-container
    {
        position: relative;

        width: 100%;

        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
        justify-content: center;
        align-items: start;
    }
</style>

<div class="card">
    <div class="form-container" data-is-row="TEXT">
        {@render children?.()}
    </div>
</div>
