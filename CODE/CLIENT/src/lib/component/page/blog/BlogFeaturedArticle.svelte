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

    // -- VARIABLES

    export let article;
    export let authorName = false;
    let isLoading = true;

    // -- STATEMENTS

    onMount(
        async () =>
        {
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
        height: auto;
        border-radius: 1.5rem;
        padding: 2rem;

        display: flex;
        flex-direction: column-reverse;
        gap: 4vw;
        align-items: center;

        background-color: white;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        +media( tablet )
        {
            padding: 2.5rem;

            flex-direction: row;
            gap: 0;
            justify-content: space-between;
        }

        +media( desktop )
        {
            height: 32rem;
        }
    }

    .blog-featured-article-info
    {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 2vw;
        justify-content: space-between;

        +media( tablet )
        {
            width: 50%;
            min-width: 300px;
            padding-right: 5vh;

            gap: 0;
        }
    }

    .article-info-container
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        justify-content: var( --article-info-container-justify, space-between );
    }

    .article-info-header
    {
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
        font-size: 1rem;
        color: grayColor500;

        +media( tablet )
        {
            font-size: 1rem;
        }
    }

    .category
    {
        overflow: hidden;
        max-width: 100%;

        font-size: 0.9rem;
        font-weight: 700;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: greenColor300;

        +media( tablet )
        {
            font-size: 0.875rem;
        }
    }

    .blog-featured-article-info h1
    {
        font-size: 1.5rem;
        font-weight: 700;
        color: blueColor100;

        +media( tablet )
        {
            font-size: 2.5rem;
        }
    }

    .blog-featured-article-info h2
    {
        max-width: 92%;

        line-height: 2rem;
        font-size: 1.5rem;
        font-weight: 600;

        +media( tablet )
        {
            font-size: 1.5rem;
        }
    }

    .blog-featured-article-button
    {
        height: 3.25rem;
        border: 0.1vw solid blueColor100;
        border-radius: 0.75rem;
        padding: 0.75vw 3.5vw;

        background-color: blueColor100;

        font-size: 1rem;
        font-weight: 700;
        color: grayColor900;

        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
        &:hover
        {
            border: 0.1rem solid blueColor100;

            background-color: white;

            color: blueColor100;
        }

        +media( tablet )
        {
            padding: 0.75vw 2.5vw;

            font-size: 1rem;
        }
    }

    .blog-featured-article-image-container
    {
        width: 100%;

        flex: 1 0 0;
        align-self: stretch;

        +media( desktop )
        {
            max-width: 50%;
        }
    }

    :global( .blog-featured-article-image )
    {
        overflow: hidden;
        height: 100%;
        width: 100%;
        border-radius: 0.875rem;

        object-fit: cover;
    }
</style>

<section class="blog-featured-article">
    {#if isLoading }
        <Loading />
    {:else if article }
        <div class="blog-featured-article-info">
            <div class="article-info-container">
                <div class="article-info-header">
                    <div class="category">
                        {#if article.categoryIdArray }
                            { getLocalizedText( getCategoryName( article.categoryIdArray ), $languageTagStore ) }
                        {:else if article.category }
                            { getLocalizedText( article.category, $languageTagStore ) }
                        {/if}
                    </div>
                </div>
                <div class="blog-featured-article-info-content">
                    {#if article.title }
                        <h1>{ getLocalizedText( article.title, $languageTagStore ) }</h1>
                    {/if}

                    {#if article.description }
                        <h2>{ getLocalizedText( article.description, $languageTagStore ) }</h2>
                    {/if}

                    {#if article.teaser }
                        <p>{@html getProcessedMultilineText(getLocalizedText( article.teaser, $languageTagStore )) }</p>
                    {/if}
                </div>
                <div class="article-info-footer">
                    {#if authorName }
                        <div class="category">
                            { getLocalizedTextBySlug( 'article-by-label', $languageTagStore) + ' ' + authorName }
                        </div>
                    {:else if article.slug && !(article.categoryIdArray && article.categoryIdArray.includes('info-page')) }
                        <Link to={ `/blog/article/${ article.id }/${ article.slug }` }>
                            <button
                                class="blog-featured-article-button"
                            >
                                { getLocalizedTextBySlug( 'blog-read-article-label', $languageTagStore ) }
                            </button>
                        </Link>
                    {:else}
                        <div></div>
                    {/if}
                </div>
            </div>
        </div>
        <div class="blog-featured-article-image-container">
            <Image
                class="blog-featured-article-image"
                imagePath={ article.imagePath }
                imageSize={ 1920 }
                alt={ getLocalizedText( article.title || article.description, $languageTagStore ) }
            />
        </div>
    {/if}
</section>
