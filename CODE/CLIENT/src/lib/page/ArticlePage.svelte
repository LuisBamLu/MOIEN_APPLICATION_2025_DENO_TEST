<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import Loading from '$component/element/Loading.svelte';
    import BlogFooter from '$component/layout/BlogFooter.svelte';
    import ArticleContent from '$component/page/article/ArticleContent.svelte';
    import DiscoverMoien from '$component/page/blog/DiscoverMoien.svelte';
    import BlogFeaturedArticle from '$component/page/blog/BlogFeaturedArticle.svelte';
    import Seo from '$component/element/Seo.svelte';
    import { getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import RelatedArticles from '$component/page/articles/RelatedArticles.svelte';
    import { navigate } from 'svelte-routing';
    import { currentPathname } from '../router';
    import BlogFeaturedArticleMobile from '../component/page/blog/BlogFeaturedArticleMobile.svelte';

    // -- CONSTANTS

    const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 80em)' );

    // -- VARIABLES

    export let id;
    export let slug = null;

    let isMobileScreen = maxWidthInEmMediaScreen.matches;
    let url = window.location.href;
    let isLoading = true;
    let article;
    let author;
    let authorRole;
    let categoryArray;
    let blockIdArray = [];
    let blockArray;
    let relatedArticleArray;
    let authorName;

    // -- FUNCTIONS

    async function loadPageData(
        )
    {
        isLoading = true;

        let idAndSlugString = $currentPathname.split( 'article/' );
        [ id, slug ] = idAndSlugString[ 1 ].split( '/' );

        try
        {
            let data;

            if ( slug === null || slug === undefined || slug === '' )
            {
                data = await fetchData( '/api/page/article/' + id + '/get-slug', { method: 'POST' } );

                navigate( `/${ $languageTagStore }/blog/article/${ id }/${ data.article.slug }` );

                return;
            }

            data = await fetchData( '/api/page/article/' + id + '/' + slug , { method: 'POST' } );
            article = data.article;
            author = data.profile;
            authorName = author.firstName + ' ' + author.lastName;
            authorRole = data.profileRole;
            categoryArray = data.categoryArray;
            blockIdArray = article.blockIdArray;
            blockArray = data.blockArray;
            relatedArticleArray = data.relatedArticleArray;

            let orderedBlockArray = [];

            for ( let blockId of blockIdArray )
            {
                let block = blockArray.find( block => block.id === blockId );

                if ( block )
                {
                    orderedBlockArray.push( block );
                }
            }

            blockArray = orderedBlockArray;

            if ( relatedArticleArray )
            {
                relatedArticleArray = relatedArticleArray.filter( relatedArticle => relatedArticle.id !== article.id );
            }

            if ( relatedArticleArray.length > 2 )
            {
                relatedArticleArray = relatedArticleArray.slice( 0, 3 );
            }
        }
        catch ( error )
        {
            console.error( 'Error :', error );
        }
        finally
        {
            isLoading = false;
        }
    }

    // ~~

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            loadPageData();
        }
        );

    // ~~

    $:
    {
        $currentPathname;
        loadPageData();
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .article
    {
        margin: auto;
        width: 90%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: grayColor900;

        +media( desktop-large )
        {
            margin: 3vw auto;
            width: 80%;
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
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: space-between;
    }
</style>

<svelte:window on:resize={ handleResizeEvent }/>

{#if article }
    <Seo
        title={ getLocalizedText( article.metaTitle, $languageTagStore ) }
        metaTitle={ article.metaTitle }
        metaDescription={ article.metaDescription }
        imagePath={ article.imagePath }
        url="https://moien.com/"
        path={ `article/${ slug }` }
    />
{/if}

{#if isLoading }
    <div class="loading">
        <Loading />
    </div>
{:else if article }
    <article class="article">
        <main>
            {#if isMobileScreen }
                <BlogFeaturedArticleMobile
                    article={ article }
                    authorName={ authorName }
                />
            {:else}
                <BlogFeaturedArticle
                    article={ article }
                    authorName={ authorName }
                />
            {/if}
            <ArticleContent
                articleText={ article.text }
                { blockArray }
                { relatedArticleArray }
                { url }
            />
        </main>
        <RelatedArticles relatedArticleArray={ relatedArticleArray } />
        <DiscoverMoien />
    </article>
    <BlogFooter />
{/if}
