<script>
    // -- IMPORTS

    import { Link, navigate } from 'svelte5-router';
    import { getStorageImagePath } from '$lib/storage';
    import { getLocalizedText} from 'senselogic-gist';
    import { fade } from 'svelte/transition';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{article: any}} */
    let { article } = $props();

    // -- FUNCTIONS

    function navigateToArticle(
        )
    {
        navigate( `/admin/settings/blog/article/${ article.id }` );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .articles-article-card
    {
        position: relative;

        height: 100%;
        max-width: 100%;
        border: 1px solid transparent;
        border-radius: 1rem;
        padding: 0.5rem;

        display: flex;
        flex-direction: column;

        background: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        cursor: pointer;
        transition: border 400ms ease-in-out;
    }

    :global( .articles-article-card.selected )
    {
        border: 1px solid greenColor !important;

        transition: border 400ms ease-in-out;
    }

    .articles-article-card-image-container
    {
        position: relative;

        display: block;

        cursor: pointer;
    }

    .articles-article-card-image-wrapper
    {
        overflow: hidden;
        border-radius: 0.75rem;
    }

    .articles-article-card-image
    {
        width: 100%;
        aspect-ratio: 16/9;

        object-fit: cover;
    }

    .articles-article-card-details
    {
        padding: 0 0.5rem 0.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
        align-self: stretch;
        h3
        {
            font-size: 1.25rem;
            font-weight: 700;
            color: grayColor100;

            cursor: text;

            +media( tablet )
            {
                font-size: 1.25vw;
            }
        }
    }

    .articles-article-card-details > div
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .articles-article-card-categories
    {
        z-index: 2;
        position: relative;
        top: -1.5vw;

        border-radius: 0.75vw;
        padding: 0.5vw 0.75vw;

        background-color: white;
        box-shadow: 0px 1px 5px 0px grayColor800;

        font-size: 0.75rem;
        font-weight: 700;
        color: greenColor300;

        +media( tablet )
        {
            font-size: 0.8vw;
        }
    }
</style>

<div class="articles-article-card" transition:fade>
    <Link to={`/admin/settings/blog/article/${ article.id }`}>
        <div class="articles-article-card-image-container">
                <div class="articles-article-card-image-wrapper">
                    <img class="articles-article-card-image" src={ getStorageImagePath( article.imagePath, 640 ) } alt=""/>
                </div>
        </div>
        <div class="articles-article-card-details">
            <div class="articles-article-card-data">
                <div class="articles-article-card-categories">
                    { article.categories }
                </div>
                <h3>{ getLocalizedText( article.title, $languageTagStore ) }</h3>
            </div>
        </div>
    </Link>
</div>
