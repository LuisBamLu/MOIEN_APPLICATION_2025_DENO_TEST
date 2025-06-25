<script>
    // -- IMPORTS

    import BlogFooter from '$component/layout/BlogFooter.svelte';
    import HomeBanner from '$component/page/home/HomeBanner.svelte';
    import HomeContent from '$component/page/home/HomeContent.svelte';
    import HomeNewsletter from '$component/page/home/HomeNewsletter.svelte';
    import { getLocalizedText } from 'senselogic-gist';

    // -- VARIABLES

    let metaTitle = `Moïen: Innovative Platform for Rental and Subletting Solutions
                        ¨fr:Moïen : Plateforme Innovante pour la Location et Sous-Location Immobilière`;

    let metaDescription = `Explore Moïen, the platform revolutionizing rentals and subletting. Find a home, maximize your rental income, and access sustainable solutions for landlords, tenants, and travelers.
                              ¨fr:Découvrez Moïen, la plateforme qui révolutionne la location et la sous-location immobilière. Trouvez un logement, optimisez vos revenus locatifs et accédez à des solutions responsables pour propriétaires, locataires et voyageurs.`;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .home
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }

    .home-main
    {
        width: 100%;
        padding: 0;
        padding: 1.5rem 1.5rem 2rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<svelte:head>
    <meta name="title" content={ getLocalizedText( metaTitle ) }/>
    <meta name="description" content={ getLocalizedText( metaDescription ) }/>
</svelte:head>

<div class="home">
    <main class="home-main">
        <HomeBanner/>
    </main>
    <BlogFooter/>
</div>

<HomeNewsletter/>
