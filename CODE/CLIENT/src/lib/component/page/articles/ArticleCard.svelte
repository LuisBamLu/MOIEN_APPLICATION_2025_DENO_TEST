<script>
    // -- IMPORTS

    import { getLocalizedText} from 'senselogic-gist';
    import { fade } from 'svelte/transition';
    import { languageTagStore } from '$store/languageTagStore';
    import Image from '../../element/ImageWithBlurredBackground.svelte';
    import { getLocalizedMonthName } from '$src/lib/base';
    import { onMount } from 'svelte';
    import Loading from '../../element/Loading.svelte';
    import { link } from 'svelte-routing';

    // -- VARIABLES

    export let article;
    let day;
    let month;
    let year;
    let loading = true;

    onMount(
        () =>
        {
            day = article.date.slice( 8, 10 );
            month = Number( article.date.slice( 5, 7 ) );
            month = getLocalizedMonthName( month - 1 );
            year = article.date.slice( 0, 4 );
            loading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .articles-article-card
    {
        position: relative;

        max-width: 100%;
        border: 1px solid transparent;
        border-radius: 1rem;
        padding: 0.5vw;

        display: flex;
        flex-direction: column;
        gap: -1rem;

        cursor: pointer;
        transition: border 400ms ease-in-out;

        +media( tablet )
        {
            border-radius: 1vw;
            padding: 0.5vw;
        }
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

    :global( .articles-article-card-image )
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
            height: 4rem;

            font-size: 1.25rem;
            font-weight: 700;
            color: grayColor100;

            cursor: text;

            +media( tablet )
            {
                height: 6vw;

                font-size: 1.25vw;
            }

            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;

            text-overflow: ellipsis;
        }

        p
        {
            margin-top: 0.5rem;

            font-size: 0.75rem;
            font-weight: 400;
            color: grayColor300;

            cursor: text;

            +media( tablet )
            {
                font-size: 1vw;
            }
        }
    }

    .articles-article-card-details > div
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .articles-article-card-category-tag
    {
        z-index: 2;
        position: relative;
        top: -1.5vw;

        border-radius: 7.5px;
        padding: 5px 7.5px;

        background-color: white;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        font-size: 0.75rem;
        font-weight: 700;
        text-transform: capitalize;
        color: greenColor300;

        +media( tablet )
        {
            border-radius: 0.75vw;
            padding: 0.5vw 0.75vw;

            font-size: 0.8vw;
        }
    }
</style>

<div class="articles-article-card" transition:fade>
    {#if loading}
        <Loading/>
    {:else}
        <a href={ `/${ $languageTagStore }/blog/article/${ article.id }/${ article.slug }` } use:link>
            <div class="articles-article-card-image-container">
                <div class="articles-article-card-image-wrapper">
                    <Image
                        class="articles-article-card-image"
                        imagePath={ article.imagePath }
                        imageSize={ 640 }
                    />
                </div>
            </div>
            <div class="articles-article-card-details">
                <div>
                    <div class="articles-article-card-category-tag">
                        { getLocalizedText( article.categoryIdArray[ 0 ], $languageTagStore ) }
                    </div>
                    <h3>{ getLocalizedText( article.title, $languageTagStore ) }</h3>
                    <p>{ `${ month } ${ day }, ${ year }` }</p>
                </div>
            </div>
        </a>
    {/if}
</div>
