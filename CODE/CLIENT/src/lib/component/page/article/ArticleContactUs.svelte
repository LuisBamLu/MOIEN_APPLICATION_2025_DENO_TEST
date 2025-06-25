<script>
    // -- IMPORTS

    import { profileSignedInStore } from '$store/profileStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { authModalStore } from '$src/lib/store/authModalStore';
    import Button from '../../element/Button.svelte';
    import { get } from 'svelte/store';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .article-contact-us
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .article-contact-us-container
    {
        height: 100%;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;
        align-self: stretch;

        background: greenColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        justify-content: center;
        align-items: flex-start;
    }

    .content-container h1
    {
        line-height: 1.625rem;
        font-size: 1.25rem;
        font-weight: 600;
        font-style: normal;
        color: grayColor100;
    }

    .content-container h2
    {
        line-height: 1.375rem;
        font-size: 0.875rem;
        font-weight: 700;
        font-style: normal;
        color: grayColor100;
    }

    .content-container p
    {
        line-height: 1.125rem;
        font-size: 0.75rem;
        font-weight: 700;
        font-style: normal;
        color: grayColor100;
    }

    .title-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
    }

    .button-text
    {
        line-height: 1.125rem;
        font-size: 1rem;
        font-weight: 700;
    }

    @media (max-width: 767px)
    {
        .article-contact-us
        {
            margin-top: 2rem;
        }
    }
</style>

<aside>
    <div class="article-contact-us">
        <div class="article-contact-us-container">
            {#if !get( profileSignedInStore ) }
                <div class="content-container">
                    <h2>
                        { getLocalizedTextBySlug( 'help-with-reservations-label', $languageTagStore ) }
                    </h2>
                        <Button
                            fullWidth={ true }
                            on:click={ () => ( $authModalStore = 'sign-in' ) }
                        >
                            <span class="button-text">
                                { getLocalizedTextBySlug( 'auth-sign-in-button', $languageTagStore ) }
                            </span>
                        </Button>
                </div>
            {:else}
                <div class="content-container">
                    <div class="title-container">
                        <h1>
                            { getLocalizedTextBySlug( 'get-in-touch-label', $languageTagStore ) }
                        </h1>
                        <p>
                            { getLocalizedTextBySlug( 'few-questions-label', $languageTagStore ) }
                        </p>
                    </div>
                    <Button
                        fullWidth={ true }
                        href="/{ $languageTagStore }/contact-us"
                    >
                        <span class="button-text">
                            { getLocalizedTextBySlug( 'contact-us-button-label', $languageTagStore ) }
                        </span>
                    </Button>
                    <p>
                        { getLocalizedTextBySlug( 'give-feedback-label', $languageTagStore ) }
                    </p>
                </div>
            {/if}
        </div>
    </div>
</aside>
