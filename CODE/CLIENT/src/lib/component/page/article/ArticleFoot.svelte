<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ArticleCard from '../articles/ArticleCard.svelte';
    import { link } from 'svelte-routing';

    // -- VARIABLES

    export let relatedArticleArray;
    export let url;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .article-foot
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .article-share
    {
        width: 90%;
        padding: 2rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .article-share-line
    {
        width: 0%;

        +media( desktop )
        {
            height: 1px;
            width: 20%;

            background-color: grayColor500;
        }
    }

    .article-share-content
    {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;

        +media( desktop )
        {
            min-width: 30%;
            max-width: 100%

            display: flex;
            flex-direction: row;
            gap: 2rem;
            align-items: center;
        }
    }

    .article-share-content h3
    {
        font-size: 1.5rem;
        color: black;
    }

    .article-share-icons
    {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        img
        {
            height: 2rem;
            width: 2rem;
        }
    }

    .article-share-button
    {
        background-color: transparent;
    }

    .article-related
    {
        width: 90%;
        padding: 2rem;

        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;

        +media( desktop )
        {
            align-items: flex-start;
        }
    }

    .article-related h3
    {
        font-size: 1.5rem;
        font-weight: bold;
        color: black;
    }

    .article-related-articles
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;
        align-items: top;

        +media( desktop )
        {
            flex-direction: row;
        }
    }

    .article-card-link
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;

        +media( desktop )
        {
            width: 40%;
        }
    }
</style>

<section class="article-foot">
    <div class="article-share">
        <div class="article-share-line">
        </div>
        <div class="article-share-content">
            <h3>{ getLocalizedTextBySlug( "article-share-post", $languageTagStore ) }</h3>
            <div class="article-share-icons">
                <a
                    href={ `https://www.facebook.com/sharer/sharer.php?u=${ url }` }
                    target="_blank"
                >
                    <img src="/image/icon/facebook_logo.svg" alt="Facebook" />
                </a>
                <a
                    href={ `https://twitter.com/intent/tweet?url=${ url }` }
                    target="_blank"
                >
                    <img src="/image/icon/twitter_logo.svg" alt="Twitter" />
                </a>
                <a
                    href={ `https://www.linkedin.com/shareArticle?url=${ url }` }
                    target="_blank"
                >
                    <img src="/image/icon/linkedin_logo.svg" alt="LinkedIn" />
                </a>
                <div
                    class="article-share-button"
                    on:click={ () => navigator.clipboard.writeText( url ) }
                >
                    <img src="/image/icon/copy_link.svg" alt="Link" />
                </div>
            </div>
        </div>
        <div class="article-share-line">
        </div>
    </div>
    <div class="article-related">
        <h3>{ getLocalizedTextBySlug( 'article-on-the-same-subject', $languageTagStore ) }</h3>
        <div class="article-related-articles">
            {#each relatedArticleArray as relatedArticle}
                <a
                    class="article-card-link"
                    href="/{ $languageTagStore }/blog/article/{ relatedArticle.id }/{ relatedArticle.slug }"
                    use:link
                >
                    <ArticleCard
                        article={ relatedArticle }
                    />
                </a>
            {/each}
        </div>
</section>
