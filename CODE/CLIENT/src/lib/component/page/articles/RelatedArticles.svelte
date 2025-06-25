<script>
    import Carousel from '$component/element/Carousel.svelte';
    // -- IMPORTS

    import ArticleCard from './ArticleCard.svelte';
    import { articleArrayStore } from '$src/lib/store/articleArrayStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { slide } from 'svelte/transition';
    import { onMount } from 'svelte';

    // -- CONSTANTS

    const cardWidth = 400;
    const cardSpacing = 30;
    const mobileCardWidth = 300;
    const mobileScreenWidth = 768;

    // -- VARIABLES

    export let relatedArticleArray
    let cardListElement;

    // -- FUNCTIONS

    $articleArrayStore = [];

    // ~~

    $: $articleArrayStore = relatedArticleArray;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    h1
    {
        max-width: 80%;

        font-size: 3rem;
        font-weight: 700;
        text-align: center;
        color: blueColor100;
    }

    // -- CLASSES

    .related-articles-container
    {
        overflow-y: auto;
        height: auto;
        width: 100;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 3.75rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;
    }

    .related-articles
    {
        width: 100%;
    }

    .related-articles-card-list
    {
        width: 100%;
    }
</style>

<div
    class="related-articles-container"
    transition:slide
>
    <h1>{ getLocalizedTextBySlug( 'article-on-the-same-subject', $languageTagStore ) }</h1>
    {#if $articleArrayStore.length < 1 }
        <div class="articles-list-message">
            <div class="font-size-125 font-weight-700 color-gray">
                { getLocalizedTextBySlug( 'blog-article-list-no-results-label', $languageTagStore ) }
            </div>
        </div>
    {/if}
    <div class="related-articles">
        {#if $articleArrayStore }
            {#if $articleArrayStore.length > 0 }
                <Carousel
                    isAutomatic={ false }
                    hasCount={ false }
                    hasButtons={ false }
                    hasDots={ false }
                    columnCount={ 3 }
                >
                    {#each $articleArrayStore as article }
                        <ArticleCard
                            article={ article }
                        />
                    {/each}
                </Carousel>
            {/if}
        {/if}
    </div>
</div>
