<script>
    // -- IMPORTS

    import { listModeStore } from '$store/listModeStore';
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .card-list
    {
        display: grid;
        grid-template-columns: 1f;
        grid-gap: 1rem;
    }

    .card-list-grid
    {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
        grid-gap: 1rem;
    }
</style>

<div class="card-list{ $listModeStore == 'grid' ? '-grid' : '' }">
    {@render children?.()}
</div>
