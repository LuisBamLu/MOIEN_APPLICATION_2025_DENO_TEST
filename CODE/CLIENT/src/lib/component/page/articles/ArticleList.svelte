<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { slide } from 'svelte/transition';
    import ArticleCard from '$src/lib/component/page/articles/ArticleCard.svelte';
    import ArticleLoading from './ArticleLoading.svelte';
    import { selectArticleArray } from '$src/lib/store/selectArticleArray';
    import { articleArrayStore } from '$src/lib/store/articleArrayStore';

    // -- VARIABLES

    export let isLoading;
    export let loadMore;
    export let hasMoreArticlePage;

    $selectArticleArray = [];

    // -- FUNCTIONS
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .articles-list
    {
        height: auto;
        padding-bottom: 1.5rem;

        display: block;
    }

    .articles-list-message
    {
        padding: 0.5rem 1.5rem;

        text-align: center;
    }

    .articles-list-container
    {
        overflow-y: auto;
        height: 100%;
        padding-bottom: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( larger-40em )
        {
            display: grid;
            grid-template-columns: repeat( auto-fill, minmax( 33%, 1fr ) );
            grid-auto-rows: min-content;
        }

        +media( desktop )
        {
            display: grid;
            grid-template-columns: repeat( auto-fill, minmax( 25%, 1fr ) );
            grid-auto-rows: min-content;
        }
    }

    .pagination
    {
        margin-top: 1rem;

        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .load-more-button
    {
        border: 1px solid white;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;

        background-color: white;

        font-size: 1rem;
        font-weight: 700;
        color: blueColor100;
        &:hover
        {
            color: blueColor500;
        }

        &:active
        {
            color: blueColor300;
        }

        &:disabled
        {
            color: grayColor500;
        }
    }
</style>

<div
    class="articles-list"
    transition:slide
>
    {#if $selectArticleArray.length > 0 }
        <div class="articles-list-container">
            {#each $selectArticleArray as article }
                <ArticleCard
                    article={ article }
                />
            {/each}
        </div>
    {:else}
        {#if $articleArrayStore.length < 1 }
            <div class="articles-list-message">
                <div class="font-size-125 font-weight-700 color-gray">
                    { getLocalizedTextBySlug( 'blog-article-list-no-results-label', $languageTagStore ) }
                </div>
            </div>
        {/if}
        <div class="articles-list-container">
            {#if $articleArrayStore && $articleArrayStore.length > 0 }
                {#each $articleArrayStore as article }
                    <ArticleCard
                        article={ article }
                    />
                {/each}
            {/if}
            {#if isLoading }
                <ArticleLoading/>
            {/if}
        </div>
    {/if}
    {#if hasMoreArticlePage }
        <div class="pagination">
            <button class="font-size-125 font-weight-700 load-more-button"
                on:click={ loadMore }
                disabled={ !hasMoreArticlePage }
            >
                { getLocalizedTextBySlug( 'load-more-label', $languageTagStore ) }
            </button>
        </div>
    {/if}
</div>
