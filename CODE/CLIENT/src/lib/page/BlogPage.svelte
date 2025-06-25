<script>
    // -- IMPORTS

    import BlogFooter from '$component/layout/BlogFooter.svelte';
    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import { urlParamsStore } from '$store/urlParamsStore';
    import { articleArrayStore } from '$store/articleArrayStore';
    import { categoryArrayStore } from '$store/categoryArrayStore';
    import BlogHome from '$component/page/blog/BlogHome.svelte';
    import Seo from '../component/element/Seo.svelte';
    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '../store/languageTagStore';

    // -- VARIABLES

    let isLoading = true;
    let currentPage = 1;
    let hasMoreArticlePage = true;
    let totalPages = 1;

    // -- FUNCTIONS

    async function loadData(
        articlePage = 1
        )
    {
        if ( articlePage === 1 )
        {
            isLoading = true;
        }

        let data = await fetchData(
            '/admin/page/blog/list',
            {
                method: 'POST',
                body: getJsonText(
                    {
                        articlePage,
                        articleLimit: 12,
                    }
                    ),
                headers: { 'Content-Type': 'application/json' }
            }
            );

        if ( data && data.articles )
        {
            if ( $articleArrayStore && $articleArrayStore.length > 0 )
            {
                let newArticles
                    = data.articles.articleArray.filter(
                        article =>
                        !$articleArrayStore.some( existingArticle => existingArticle.id === article.id )
                        );

                articleArrayStore.set(
                    [ ...$articleArrayStore, ...newArticles ].sort( ( a, b ) => b.number - a.number )
                    );

                hasMoreArticlePage = data.articles.hasMoreArticlePage;
            }
            else
            {
                articleArrayStore.set(
                    data.articles.articleArray.sort( ( a, b ) => b.number - a.number )
                    );

                hasMoreArticlePage = data.articles.hasMoreArticlePage;
            }
        }
        else
        {
            articleArrayStore.set( [] );
        }

        if ( data && data.categories )
        {
            categoryArrayStore.set( data.categories.categoryArray );
        }
        else
        {
            categoryArrayStore.set( [] );
        }

        isLoading = false;
    }

    // ~~

    async function loadMore(
        )
    {
        if ( !isLoading && hasMoreArticlePage )
        {
            currentPage++;
            await loadData( currentPage );
        }
    }

    // ~~

    async function handlePopState(
        )
    {
        await loadData( 1 );
        currentPage = 1;
    }

    // -- STATEMENTS

    $: $urlParamsStore, loadData( 1 );
    $: $urlParamsStore, currentPage = 1;

    // ~~

    onMount(
        () =>
        {
            $articleArrayStore = [];
            window.addEventListener( 'popstate', handlePopState );

            return () =>
            {
                window.removeEventListener( 'popstate', handlePopState );
            };
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS
    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES
    .blog-page-container
    {
        margin: auto;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        +media( desktop-large )
        {
            width: 80%;
        }
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'blog-page-head-title', $languageTagStore ) }
    </title>
</svelte:head>

<Seo
    metaTitle="Moïen Blog - Discover Rental Experiences"
    metaDescription="Moïen Blog shares insights on rental experiences, real estate tips, and how to make the most out of renting and subletting your property."
    imagePath="https://rvmaltqvxnmtvljlghlx.supabase.co/storage/v1/object/public/upload/article/Paris_20240606201816704000.jpg.640.jpg"
    url="https://moien.com/"
    path="blog"
/>

<div class="blog-page-container">
    <BlogHome
        isLoading={ isLoading }
        loadMore={ loadMore }
        hasMoreArticlePage={ hasMoreArticlePage }
    />
</div>

<BlogFooter />
