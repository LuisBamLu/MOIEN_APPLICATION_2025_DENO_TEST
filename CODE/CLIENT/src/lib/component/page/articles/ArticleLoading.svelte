<script>
    // -- IMPORTS

    import { fade } from 'svelte/transition';

    // -- VARIABLES

    let articleLoadingCardLength = [ 1, 2, 3, 4 ];
</script>
<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .article-loading
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: space-between;
    }

    .article-loading-image
    {
        aspect-ratio: 16 / 9;
        border: 1px solid transparent;
        border-radius: 0.5rem;

        background-color: whiteColor;
    }

    .article-loading-title
    {
        height: 1rem;
        border: 1px solid transparent;
        border-radius: 0.5rem;

        background-color: whiteColor;
    }

    .article-loading-details
    {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }

    .article-loading-first,
    .article-loading-second
    {
        height: 2.5rem;
        border-radius: 0.5rem;

        flex: 1;

        background-color: whiteColor;
    }
</style>

{#each articleLoadingCardLength as articleLoadingCard }
    <div class="article-loading" transition:fade>
        <div class="article-loading-image"/>
        <div class="article-loading-title"/>
        <div class="article-loading-details">
            <div class="article-loading-first"/>
            <div class="article-loading-second"/>
        </div>
    </div>
{/each}
