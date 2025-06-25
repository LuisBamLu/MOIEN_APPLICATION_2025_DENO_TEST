<script>
    // -- IMPORTS

    import { Link } from 'svelte-routing';
    import { getLocalizedText, getLocalizedTextBySlug, getProcessedMultilineText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { fetchData, getCategoryName } from '$lib/base';
    import { onMount } from 'svelte';
    import { categoryArrayStore } from '$store/categoryArrayStore';
    import Loading from '$component/element/Loading.svelte';
    import Image from '$component/element/ImageWithBlurredBackground.svelte';
    import Button from '../../element/Button.svelte';

    // -- VARIABLES

    export let article;
    export let authorName = false;
    export let variant = ''

    let isLoading = true;
    let heroBackground = ''
    let infoHeight = ''
    let imageRadius = ''

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( variant === 'blog-page' )
            {
                heroBackground = 'white'
                infoHeight = '17rem;'
            }
            else
            {
                imageRadius = '1rem'
            }

            if ( !$categoryArrayStore )
            {
                let data = await fetchData( '/api/blog/article-categories/get', { method: 'POST' } );
                $categoryArrayStore = data.categoryArray;
            }

            article.imagePath = article.imagePath.replace( '640', '1920' );

            isLoading = false;
        }
    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .blog-featured-article
    {
        height: 100%;
        width: 100%;
        border-radius: 1rem;

        display: flex;
        gap: 4vw;
        justify-content: space-between;
    }

    .blog-featured-article-info
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .article-info-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .article-info-header
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .blog-featured-article-info-content
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .blog-featured-article-info p
    {
        overflow: hidden;
        max-height: 3rem;
        width: 100%;

        font-size: 1rem;
        text-overflow: ellipsis;
        color: grayColor500;
    }

    .category
    {
        display: flex;
        gap: 0.25rem;
        justify-content: flex-start;

        font-size: 0.9rem;
        font-weight: 700;
        color: greenColor300;
    }

    .blog-featured-article-info h1
    {
        font-size: 1.5rem;
        font-weight: 700;
        color: blueColor100;
    }

    .blog-featured-article-image-container
    {
        z-index: 1;

        min-height: 11.5rem;
        width: 100%;
    }

    :global( .blog-featured-article-image-mobile )
    {
        height: 100%;
        width: 100%;
        border-radius: 1rem 1rem 0 0;

        object-fit: cover;
    }

    .author
    {
        overflow: hidden;
        max-width: 100%;

        font-size: 0.9rem;
        font-weight: 700;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: greenColor300;
    }

    .article-info-footer
    {
        height: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .article-info {
        border-radius: 0 0 1rem 1rem;
        padding: 1rem 1rem 1.5rem 1rem;

        display: flex;
    }
</style>

<section class="blog-featured-article">
    {#if isLoading }
        <Loading />
        {:else if article }
        <div class="blog-featured-article-info">
            <div class="article-info-header">
                <div class="blog-featured-article-image-container"
                    style=
                    {
                        `
                        border-radius: ${ imageRadius };
                        overflow: hidden;
                        `
                    }
                >
                    <Image
                        class="blog-featured-article-image-mobile"
                        imagePath={ article.imagePath }
                        imageSize={ 1920 }
                        alt={ getLocalizedText( article.title, $languageTagStore ) }
                    />
                </div>
            </div>
            <div class="article-info"
                style=
                {
                    `
                        background-color: ${ heroBackground };
                        height: ${ infoHeight };
                    `
                }
            >
                <div class="article-info-container">
                    <div class="article-info-footer">
                        {#if article.categoryIdArray && !(article.categoryIdArray && article.categoryIdArray.includes('info-page')) }
                            <div class="category">
                                { getLocalizedText( getCategoryName( article.categoryIdArray ), $languageTagStore ) }
                            </div>
                                {:else if article.category }
                            <div class="category">
                                { getLocalizedText( article.category, $languageTagStore ) }
                            </div>
                        {/if}
                            <div class="blog-featured-article-info-content">
                                <h1>{ getLocalizedText( article.title, $languageTagStore ) }</h1>
                                <p>{@html getProcessedMultilineText(getLocalizedText( article.teaser, $languageTagStore )) }</p>
                            </div>
                        </div>
                        {#if authorName }
                            <div class="author">
                                { getLocalizedTextBySlug( 'article-by-label', $languageTagStore) + ' ' + authorName }
                            </div>
                        {:else if article.slug && !(article.categoryIdArray && article.categoryIdArray.includes('info-page')) }
                            <Button
                                fullWidth={ true }
                                invertColor={ true}
                                href={ `/blog/article/${ article.id }/${ article.slug }` }
                            >
                                { getLocalizedTextBySlug( 'blog-read-article-label', $languageTagStore ) }
                            </Button>
                        {:else}
                            <div></div>
                        {/if}
                </div>
            </div>
        </div>
    {/if}
</section>
