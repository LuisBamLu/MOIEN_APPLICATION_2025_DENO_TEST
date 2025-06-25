<script>
    // -- IMPORTS

    import DiscoverMoien from '$component/page/blog/DiscoverMoien.svelte';
    import BlogFooter from '$component/layout/BlogFooter.svelte';
    import Seo from '$component/element/Seo.svelte';
    import Loading from '$component/element/Loading.svelte';
    import { onMount } from 'svelte';
    import BlogFeaturedArticle from '$component/page/blog/BlogFeaturedArticle.svelte';
    import ArticleContent from '$component/page/article/ArticleContent.svelte';
    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { getProcessedMultilineTranslatedTextBySlug } from '../textProcessor';
    import BlogFeaturedArticleMobile from '../component/page/blog/BlogFeaturedArticleMobile.svelte';
    import { fetchData } from '../base';

    // -- CONSTANTS

    const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 64em)' );

    // -- VARIABLES

    let isMobileScreen = maxWidthInEmMediaScreen.matches;
    let url = window.location.href;
    let isLoading = true;
    let page;
    let pageBlocks = []

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;
    }

    // ~~

    async function loadPrivacyPolicyData(
        )
    {
        try
        {
            let { infoPage } = await fetchData( '/api/get-info-page',
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: getJsonText(
                        {
                            slug: 'privacy-policy-page'
                        }
                        )
                }
                );

            if ( !infoPage )
            {
                console.error( "Privacy policy page data not found" );
                return;
            }

            page = infoPage;

            let { id, slug, blockIdArray } = infoPage;

            let articleData = await fetchData( `/api/page/article/${id}/${slug}`,
                {
                    method: 'POST'
                }
                );

            pageBlocks = articleData.blockArray

            let orderedBlockArray = [];

            for ( let blockId of blockIdArray )
            {
                let block = pageBlocks.find( ( block ) => block.id === blockId );

                if ( block )
                {
                    orderedBlockArray.push( block );
                }
            }

            pageBlocks = orderedBlockArray;
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await loadPrivacyPolicyData();
            isLoading = false;
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

    .loading
    {
        display: flex;
        justify-content: center;
        align-items: center;
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
        metaTitle={ page.title }
        metaDescription={ page.teaser }
        imagePath={ page.imagePath }
        url={ `https://moien.com/` }
        path={ `privacy-policy` }
    />
{/if}

{#if isLoading }
    <div class="loading">
        <Loading />
    </div>
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
