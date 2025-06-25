<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getProcessedMultilineText } from 'senselogic-gist';
    import { useLocation } from 'svelte-routing';
    import ArticleOptions from './ArticleOptions.svelte';
    import { onMount } from 'svelte';
    import ArticleContactUs from './ArticleContactUs.svelte';
    import ImageBackground from '../../element/ImageBackground.svelte';
    import MobileArticleOptions from './MobileArticleOptions.svelte';
    import { getProcessedMultilineTranslatedText } from '$src/lib/textProcessor';

    // -- CONSTANTS

    const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 80em)' );

    // -- VARIABLES

    export let articleText = '';
    export let blockArray;
    export let relatedArticleArray;
    export let url;
    export let isInfoPage = false;
    export let location = useLocation();
    export let articleCategory = ''

    let isMobileScreen = maxWidthInEmMediaScreen.matches;

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;
    }

    // -- STATEMENT

    onMount(
        () =>
        {
            if ( articleCategory === 'info-page' )
            {
                isInfoPage = true;
            }

            if ( window.location.hash.length > 1
                 && document.getElementById( window.location.hash.slice( 1 ) ) !== null )
            {
                setTimeout(
                    () =>
                    {
                        document.getElementById( window.location.hash.slice( 1 ) )
                            .scrollIntoView(
                                {
                                    behavior: 'smooth',
                                    block: 'start',
                                }
                                );
                    },
                    1000 // roughly waits for BlogFeaturedArticle to finish loading before scrolling down.
                    )
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .article-body
    {
        margin-top: 2rem;
        width: auto;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        text-align: justify;

        +media( tablet )
        {
            margin-top: 4rem;

            flex-direction: row;

            text-align: left;
        }
    }

    .article-content
    {
        width: 100%;

        +media( desktop-large )
        {
            width: 60%;
        }
    }

    .article-content h2
    {
        padding: 1rem 0;

        font-size: 2rem;
        font-weight: bold;
        text-align: left;
        color: grayColor100;
    }

    .article-content h2:first-child
    {
        padding-top: 0;
    }

    :global( .article-content-image )
    {
        height: auto;
        width: 90%;
        aspect-ratio: 16 / 9;
        border: 1px solid transparent;
        border-radius: 0.5rem;
        padding: 2rem;

        +media( desktop )
        {
            width: 75%;
        }
    }

    .article-content-text
    {
        width: 100%;

        font-size: 1rem;
        hyphens: auto;
        text-align: justify;
        color: grayColor;
    }

    .article-content-text h3
    {
        padding: 1rem 0;

        font-size: 1.75rem;
        font-weight: bold;
        text-align: left;
        color: grayColor100;
    }

    .article-content-text h4
    {
        padding: 1rem 0;

        font-size: 1.5rem;
        font-weight: bold;
        text-align: left;
        color: grayColor100;
    }

    .article-content-text h5
    {
        padding: 1rem 0;

        font-size: 1.25rem;
        font-weight: bold;
        text-align: left;
        color: grayColor100;
    }

    .aside
    {
        position: sticky;
        top: 2rem;
        right: 0;

        width: 100%;

        +media( tablet )
        {
            width: 24%;
        }
    }

    .separator
    {
        margin: 1rem 0;
        height: 1px;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: grayColor700;
    }

    .article-share-mobile
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
    }
</style>

<svelte:window on:resize={ handleResizeEvent }/>
{#if isMobileScreen }
    <div class="article-share-mobile">
        <MobileArticleOptions { url }/>
        <div class="separator"></div>
    </div>
{/if}
<section class="article-body">
    <div class="article-content">
        {#if articleText }
            <div id="block-text" class="article-content-text">
                {@html getProcessedMultilineText( getLocalizedText( articleText, $languageTagStore ) ) }
            </div>
        {/if}
        {#each blockArray as block }
            {#if block.title }
                <h2 id={ block.number ?? '' }>
                    { getLocalizedText( block.title, $languageTagStore ) }
                </h2>
            {/if}
            {#if block.typeId === 'image-and-text' }
                {#if block.imagePath }
                    <ImageBackground
                        isGlobal={ true }
                        isArticle={ true }
                        imagePath={ block.imagePath }
                        lowRes={ 360 }
                        highRes={ 1280 }
                    />
                {/if}
                {#if block.text }
                    <div id="block-text" class="article-content-text">
                        {@html getProcessedMultilineTranslatedText( getLocalizedText( block.text, $languageTagStore ) ) }
                    </div>
                {/if}
            {:else}
                {#if block.text }
                    <div id="block-text" class="article-content-text">
                        {@html getProcessedMultilineTranslatedText( getLocalizedText( block.text, $languageTagStore ) ) }
                    </div>
                {/if}
                {#if block.type === 'text-and-image' }
                    <ImageBackground
                        isGlobal={ true }
                        isArticle={ true }
                        imagePath={ block.imagePath }
                        lowRes={ 360 }
                        highRes={ 1280 }
                    />
                {/if}
            {/if}
        {/each}
    </div>
    {#if !isMobileScreen}
        <div class="aside">
            {#if isInfoPage }
                <ArticleContactUs />
            {:else}
                <ArticleOptions { url }/>
            {/if}
        </div>
    {/if}
</section>
<div class="separator" />
