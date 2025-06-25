<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { navigate } from 'svelte-routing';

    // -- FUNCTIONS

    function navigateToProperties(
        )
    {
        navigate( '/' );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .blog-discover
    {
        margin-top: 2rem;
        margin-bottom: 6rem;
        width: var( --blog-discover-width, 80% );
        border-radius: 0.5rem;
        padding: 1.5rem 1.5rem 2rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;

        background-color: #E6FAF3;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        h2
        {
            margin: 0;
            min-width: 50%;

            font-size: 2.6rem;
            font-weight: 700;
            text-align: center;
            color: blueColor100;
        }

        p
        {
            margin: 0;
            width: 100%;
            padding-bottom: 1rem;

            font-size: 1rem;
            text-align: center;
            color: grayColor500;
        }

        +media( tablet )
        {
            margin-top: 6rem;
            padding: 1rem 0 2rem;
        }
    }

    .blog-discover-button
    {
        border: 1px solid transparent;
        border-radius: 0.5rem;
        padding: 0.5rem 2rem;

        background-color: blueColor300;

        font-size: 1.2rem;
        font-weight: 500;
        color: white;

        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
        &:hover
        {
            border: 1px solid blueColor300;

            background-color: blueColor900;

            color: blueColor300;
        }
    }
</style>

<section class="blog-discover">
    <h2>
        { getLocalizedTextBySlug('blog-slogan-label', $languageTagStore) }
    </h2>
    <p>
        { getLocalizedTextBySlug('blog-discover-description-label', $languageTagStore) }
    </p>
    <button
        class="blog-discover-button"
        on:click={ navigateToProperties }
    >
        { getLocalizedTextBySlug('blog-discover-moien-label', $languageTagStore) }
    </button>
</section>
