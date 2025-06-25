<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { slide } from 'svelte/transition';
    import ArticleCard from './ArticleCard.svelte';
    import ArticleLoading from './ArticleLoading.svelte';
    // import { selectArticleArray } from '$store/selectArticleArray';
    import { blogArrayStore, isBlogLoading } from '$store/blogStore';
    import { get } from 'svelte/store';
    import { useIntersectionObserver } from '$lib/intersection_observer';
    import { createEventDispatcher, onMount } from 'svelte';
    import Loading from '$component/element/Loading.svelte';
    import Skeleton from '$component/element/Skeleton.svelte';
    import ArticleCardSkeletons from './ArticleCardSkeletons.svelte';

    // -- VARIABLES

    /** @type {{isLoading: any}} */
    let { isLoading } = $props();
    let dispatch = createEventDispatcher();
    let
    {
        handleObserver,
        bottomElement,
        page,
        handleStopObserving,
        setBottomElement
    } = $state(useIntersectionObserver( () => dispatch( 'nearBottom', { page : $page } ) ));

    // $selectArticleArray = [];

    // -- STATEMENTS

    onMount(
        () =>
        {
            setBottomElement( bottomElement );

            handleObserver();

            return () => handleStopObserving();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .articles-list
    {
        height: auto;
        width: 100%;
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

        +media( tablet )
        {
            display: grid;
            grid-template-columns: repeat( auto-fill, minmax( 35%, 1fr ) );
            grid-auto-rows: min-content;
        }

        +media( desktop )
        {
            display: grid;
            grid-template-columns: repeat( auto-fill, minmax( 25%, 1fr ) );
            grid-auto-rows: min-content;
        }
    }
</style>

<div
    class="articles-list"
    transition:slide
>
    <div class="articles-list-container">
        {#if $blogArrayStore }
            {#if $blogArrayStore.length > 0 }
                {#each $blogArrayStore as article }
                    <ArticleCard
                        article={ article }
                    />
                {/each}
                {#if $isBlogLoading }
                    <ArticleCardSkeletons/>
                {/if}
                <div bind:this={ bottomElement }  style="height: 2em;border: 1px solid transparent;"></div>
            {/if}
        {:else}
            <div class="articles-list-message">
                <div class="font-size-125 font-weight-700 color-gray">
                    { getLocalizedTextBySlug( 'blog-article-list-no-results-label', $languageTagStore ) }
                </div>
            </div>
        {/if}
        {#if isLoading }
            <ArticleLoading/>
        {/if}
    </div>
</div>
