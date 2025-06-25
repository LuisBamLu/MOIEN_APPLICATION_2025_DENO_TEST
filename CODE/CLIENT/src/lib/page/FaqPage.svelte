<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import Seo from '../component/element/Seo.svelte';
    import Loading from '../component/element/Loading.svelte';
    import BlogFeaturedArticle from '../component/page/blog/BlogFeaturedArticle.svelte';
    import ArticleContent from '../component/page/article/ArticleContent.svelte';
    import DiscoverMoien from '../component/page/blog/DiscoverMoien.svelte';
    import BlogFooter from '../component/layout/BlogFooter.svelte';
    import BlogFeaturedArticleMobile from '../component/page/blog/BlogFeaturedArticleMobile.svelte';
    import { fetchData } from '../base';
    import { getJsonText } from 'senselogic-gist';

    // -- CONSTANTS

    const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 64em)' );

    // -- VARIABLES

    let page;
    let pageBlocks = [];
    let isMobileScreen = maxWidthInEmMediaScreen.matches;
    let isLoading = true;
    let url = window.location.href;

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;
    }

    // ~~

    async function loadFaqData(
        )
        {
            try
            {
                let { infoPage } = await fetchData('/api/get-info-page',
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: getJsonText(
                        {
                            slug: 'faq-page'
                        }
                        )
                }
                );

                if (!infoPage)
                {
                    console.error("FAQ page data not found");
                    return;
                }

                page = infoPage;

                let { id, slug, blockIdArray } = infoPage;

                let articleData = await fetchData(`/api/page/article/${id}/${slug}`,
                {
                    method: 'POST'
                }
                );

                pageBlocks = articleData.blockArray;

                let orderedBlockArray = [];

                for ( let blockId of blockIdArray )
                {
                    let block = pageBlocks.find( block => block.id === blockId );

                    if ( block )
                    {
                        orderedBlockArray.push( block );
                    }
                }

                pageBlocks = orderedBlockArray;
            }
            catch (error)
            {
                console.error("Error loading FAQ data:", error);
            }
}

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await loadFaqData();
            isLoading = false
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .article
    {
        margin: auto;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: grayColor900;

        +media( tablet )
        {
            padding: 0 10vw;
        }

        +media( desktop )
        {
            margin: 3vw 0;
            padding: 0 10vw;
        }
    }

    main
    {
        width: 100%;
    }
</style>

<svelte:window on:resize={ handleResizeEvent } />

{#if page }
    <Seo
        title={ page.title }
        metaTitle={ page.metaTitle }
        metaDescription={ page.metaDescription }
        imagePath={ page.imagePath }
        url={ `https://moien.com/` }
        path={ `faq` }
    />
{/if}

{#if isLoading }
    <Loading />
{:else if page }
    <article class="article">
        <main>
            {#if isMobileScreen }
                <BlogFeaturedArticleMobile
                    article={ page }
                />
            {:else}
                <BlogFeaturedArticle
                    article={ page }
                />
            {/if}
            <ArticleContent
                articleText={ page.text }
                url={ url }
                blockArray={ pageBlocks }
                relatedArticleArray={ [] }
                articleCategory={ 'info-page' }
            />
        </main>
        <DiscoverMoien />
    </article>
    <BlogFooter />
{/if}
