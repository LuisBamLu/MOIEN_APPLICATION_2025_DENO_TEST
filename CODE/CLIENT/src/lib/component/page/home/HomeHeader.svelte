<script>
    // -- IMPORTS

    import { Link } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import LanguageToggler from '$component/layout/LanguageToggler.svelte';
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .home-header
    {
        width: 100%;
        padding: 0 5rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .home-header-menu
    {
        height: 100%;
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .home-header-logo
    {
        height: 100%;
        width: 100px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .home-header-logo-image
    {
        height: auto;
        width: 100%;
    }

    .home-header-nav
    {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: flex-end;
        align-items: center;
    }
</style>

<header class="home-header">
    <menu class="home-header-menu">
        <button class="home-header-logo">
            <Link to="/">
                <img class="home-header-logo-image" src="/image/icon/moien_logo.svg" alt="Moien logo" height="42" width="128"/>
            </Link>
        </button>
        <nav class="home-header-nav">
            <div>
                <Link to="/blog">{ getLocalizedTextBySlug( 'blog-label', $languageTagStore ) }</Link>
                <Link to="#">{ getLocalizedTextBySlug( 'blog-faq-label', $languageTagStore ) }</Link>
                <LanguageToggler/>
            </div>
        </nav>
    </menu>
</header>
