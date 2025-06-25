<script>
    // -- IMPORTS

    import BlogFooter from "../component/layout/BlogFooter.svelte";
    import ContactHeroSection from "../component/page/contact-us/ContactHeroSection.svelte";
    import ContactInformation from "../component/page/contact-us/ContactInformation.svelte";
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .contact-us-page
    {
        width: 100%;
        padding: 0.75rem;

        display: flex;
        flex-direction: column;
        gap: 5rem;
        justify-content: center;

        +media( desktop )
        {
            padding: 0 7vw;
        }
    }
</style>

<div class="contact-us-page">
    <ContactHeroSection />
    <ContactInformation/>
    <BlogFooter />
</div>
