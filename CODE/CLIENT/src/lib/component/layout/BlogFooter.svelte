<script>

    // -- IMPORTS

    import { link } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    let currencySymbol = '$';
    let currencyCode = 'USD';
    let language = 'English (US)';
    let socialMediaArray =
        [
            { icon: 'facebook', link: 'https://www.facebook.com' },
            { icon: 'twitter', link: 'https://www.twitter.com' },
            { icon: 'instagram', link: 'https://www.instagram.com' }
        ];
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .blog-footer
    {
        height: 0%;
        width: 100%;

        display: none;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        background-color: grayColor900;

        +media( tablet )
        {
            height: auto;
            padding: 1rem 2rem;

            display: flex;
        }
    }

    .text,
    a
    {
        line-height: 1.125rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: grayColor300;
    }

    .blog-footer-text-wrapper
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .dot
    {
        font-size: 0.5rem;
    }
</style>

<footer class="blog-footer text">
    <span>© 2025 Crossfunding Sàrl</span>

    <div class="blog-footer-text-wrapper text">
        <a href="/{ $languageTagStore }/about" use:link>{ getLocalizedTextBySlug( 'auth-about-button', $languageTagStore ) }</a>
        <span class="text dot">•</span>
        <a href="/{ $languageTagStore }/privacy-policy" use:link>{ getLocalizedTextBySlug( 'auth-privacy-policy-button', $languageTagStore ) }</a>
        <span class="text dot">•</span>
        <a href="/{ $languageTagStore }/terms" use:link>{ getLocalizedTextBySlug( 'blog-terms-label', $languageTagStore ) }</a>
        <span class="text dot">•</span>
        <a href="/{ $languageTagStore }/faq" use:link>{ getLocalizedTextBySlug( 'blog-faq-label', $languageTagStore ) }</a>
    </div>

    <a href="/{$languageTagStore}/contact-us">{ getLocalizedTextBySlug( 'contact-us-button-label', $languageTagStore ) }</a>
</footer>
