<script>
    // -- IMPORTS

    import DiscoverMoien from '$component/page/blog/DiscoverMoien.svelte';
    import BlogFeaturedArticle from './BlogFeaturedArticle.svelte';
    import Articles from '../articles/Articles.svelte';
    import { articleArrayStore } from '$src/lib/store/articleArrayStore';
    import BlogCarousel from './BlogCarousel.svelte';
    import Loading from '../../element/Loading.svelte';
    import { getLocalizedText } from 'senselogic-gist';
    import { isMobileScreen, isTabletScreen } from '$src/lib/store/appDataStore';
    import BlogFeaturedArticleMobile from './BlogFeaturedArticleMobile.svelte';

    // -- VARIABLES

    export let isLoading = true;
    export let loadMore = () => {};
    export let hasMoreArticlePage = false;

    let metaTitle = `Moïen Blog: News, Tips, and Real Estate Trends
                        ¨fr:Blog Moïen : Actualités, Conseils et Tendances Immobilières`;

    let metaDescription = `Explore the Moïen blog for in-depth real estate analysis, practical advice for landlords and tenants, and the latest market trends to better understand the industry
                              ¨fr:Découvrez le blog Moïen : analyses immobilières, conseils pratiques pour propriétaires et locataires, et dernières tendances du marché pour mieux comprendre le secteur.`;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .blog-home
    {
        width: 90%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            max-width: 85%;
        }
    }
</style>

<svelte:head>
    <meta name="title" content={ getLocalizedText( metaTitle ) }/>
    <meta name="description" content={ getLocalizedText( metaDescription ) }/>
</svelte:head>

<div class="blog-home">
    {#if isLoading }
        <Loading/>
    {:else}
        <BlogCarousel
            totalItemsLength={ 2 }
            autoplay={ 4000 }
            dots={ true }
            draggable={ true }
            hasCounter={ false }
        >
            {#each $articleArrayStore.slice( 0, 3 ) as article }
                {#if $isMobileScreen || $isTabletScreen }
                    <BlogFeaturedArticleMobile
                        variant={ 'blog-page' }
                        { article }
                    />
                {:else}
                    <BlogFeaturedArticle { article }/>
                {/if}
            {/each}
        </BlogCarousel>
        <Articles
            isLoading={ isLoading }
            loadMore={ loadMore }
            hasMoreArticlePage={ hasMoreArticlePage }
        />

        <DiscoverMoien --blog-discover-width="100%" />
    {/if}
</div>
