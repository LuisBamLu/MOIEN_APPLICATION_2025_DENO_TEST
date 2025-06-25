<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { toast } from '$lib/toast';

    // -- VARIABLES

    export let url;
    let articleUrl = globalThis.location.href;
    let facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${ articleUrl }`;
    let twitterShareUrl = `https://x.com/intent/tweet?url=${ articleUrl }`;
    let linkedinShareUrl = `https://www.linkedin.com/shareArticle?url=${ articleUrl }`;

    // -- FUNCTIONS

    function handleCopyUrlToClipboard()
    {
        navigator.clipboard.writeText( url );
        toast.success(
            getLocalizedTextBySlug( 'copied-article-url-label', $languageTagStore )
            );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .article-options
    {
        width: 100%;
        padding: 1rem 0 0;

        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .article-options-title
    {
        padding: 0 0 1rem;

        font-size: 1.5rem;
        font-weight: bold;
        color: blueColor100;
    }

    .article-share-options
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .article-share-options-item
    {
        height: 3.25rem;
        width: 100%;

        display: flex;
        flex-direction: row;
    }

    .share-button
    {
        width: 100%;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: center;
        align-items: center;

        background-color: white;

        font-size: 1rem;
        font-weight: bold;
        color: blueColor100;

        transition: background-color 0.3s;
        &:hover
        {
            .normal
            {
                display: none;
            }
            .hover
            {
                display: block;
            }

            color: blueColor500;
        }

        .normal
        {
            display: block;
        }
        .hover
        {
            display: none;
        }
    }
</style>

<aside>
    <div class="article-options">
        <div class="article-options-title">
            { getLocalizedTextBySlug( "article-share-post", $languageTagStore ) }
        </div>
        <div class="article-share-options">
            <div class="article-share-options-item">
                <a
                    class="share-button"
                    href={ facebookShareUrl }
                    target="_blank"
                >
                    <div class="blue-100-facebook-icon normal size-200"/>
                    <div class="blue-500-facebook-icon hover size-200"/>
                </a>
            </div>
            <div class="article-share-options-item">
                <a
                    class="share-button"
                    href={ twitterShareUrl }
                    target="_blank"
                >
                    <div class="blue-100-twitter-icon normal size-200"/>
                    <div class="blue-500-twitter-icon hover size-200"/>
                </a>
            </div>
            <div class="article-share-options-item">
                <a
                    class="share-button"
                    href={ linkedinShareUrl }
                    target="_blank"
                >
                    <div class="blue-100-linkedin-icon normal size-200"/>
                    <div class="blue-500-linkedin-icon hover size-200"/>
                </a>
            </div>
            <div class="article-share-options-item">
                <button
                    class="share-button"
                    on:click={ handleCopyUrlToClipboard }
                >
                    <div class="blue-100-link-icon normal size-200"/>
                    <div class="blue-500-link-icon hover size-200"/>
                </button>
            </div>
        </div>
    </div>
</aside>
