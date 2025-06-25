<script>
    // -- IMPORTS

    import { fade } from 'svelte/transition';
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .articles-article-card
    {
        position: relative;

        height: 100%;
        max-width: 100%;
        border: 1px solid transparent;
        border-radius: 1rem;
        padding: 0.5rem;

        display: flex;
        flex-direction: column;

        background: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        cursor: pointer;
        transition: border 400ms ease-in-out;
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

    .articles-article-card-image
    {
        width: 100%;
        aspect-ratio: 16/9;

        object-fit: cover;

        background: linear-gradient( -45deg, #eee 40%, #fafafa 50%, #eee 60% );
        background-size: 300%;
        background-position-x: 100%
        animation: shimmer 1s infinite linear;
    }

    .articles-article-card-details
    {
        padding: 0 0.5rem 0.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
        align-self: stretch;
        .text
        {
            background: linear-gradient( -45deg, #eee 40%, #fafafa 50%, #eee 60% );
            background-size: 300%;
            background-position-x: 100%
            height: 2rem;
            width: 100%;
            border-radius: 0.75vw;

            animation: shimmer 1s infinite linear;
        }
    }

    .articles-article-card-details > div
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .articles-article-card-categories
    {
        z-index: 2;
        position: relative;
        top: -1.5vw;

        height: 2rem;
        width: 30%;
        border-radius: 0.75vw;
        padding: 0.5vw 0.75vw;

        background: linear-gradient( -45deg, #eee 40%, #fafafa 50%, #eee 60% );
        background-color: white;
        background-size: 300%;
        box-shadow: 0px 1px 5px 0px grayColor800;

        font-size: 0.75rem;
        font-weight: 700;
        color: greenColor300;
        background-position-x: 100%
        animation: shimmer 1s infinite linear;
    }

    .articles-article-card-data
    {
        width: 100%;
    }

    @keyframes shimmer
    {
        to
        {
            background-position-x: 0%
        }
    }
</style>

<div class="articles-article-card" transition:fade>
    <div class="articles-article-card-image-container">
        <div class="articles-article-card-image-wrapper">
            <div class="articles-article-card-image"></div>
        </div>
    </div>
    <div class="articles-article-card-details">
        <div class="articles-article-card-data">
            <p class="articles-article-card-categories"></p>
            <p class="text"></p>
        </div>
    </div>
</div>
