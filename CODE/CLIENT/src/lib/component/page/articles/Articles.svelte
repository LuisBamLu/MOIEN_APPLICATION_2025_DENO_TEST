<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { selectArticleCategoryArray } from '$src/lib/store/selectArticleCategoryArray';
    import ArticlesCategories from './ArticlesCategories.svelte';
    import ArticleList from './ArticleList.svelte';

    // -- VARIABLES

    export let isLoading = true;
    export let loadMore = () => {};
    export let hasMoreArticlePage = false;

    $selectArticleCategoryArray = [];
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .blog-articles
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .blog-articles-main
    {
        width: 100%;
    }

    .blog-articles-title
    {
        margin: 1.5rem 0;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        h1
        {
            margin: 0 0.5rem;

            font-size: 1.5rem;
            font-weight: 700;
            text-align: center;
            color: blueColor100;

            +media( tablet )
            {
                margin: 2.5rem 0;

                font-size: 3vw;
            }
        }
    }

    .blog-articles-container
    {
        padding: 0 1rem;
    }
</style>

<div class="blog-articles">
    <main class="blog-articles-main">
        <section class="blog-articles-head">
            <div class="blog-articles-title">
                <h1>{ getLocalizedTextBySlug('blog-discover-articles-label', $languageTagStore) }</h1>
            </div>
            <ArticlesCategories />
        </section>
        <section class="blog-articles-container">
            <ArticleList
                isLoading={ isLoading }
                loadMore={ loadMore }
                hasMoreArticlePage={ hasMoreArticlePage}
            />
        </section>
    </main>
</div>
