<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug, getLocalizedText, getJsonText } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { toast } from '$lib/toast';
    import { fade } from 'svelte/transition';
    import { linear } from 'svelte/easing';
    import { newsletterSubscriptionStore } from '$src/lib/store/newsletterSubscriptionStore';
    import { isMobileScreen } from '$src/lib/store/appDataStore';

    // -- VARIABLES

    let email;
    let isEmailValid = false;
    let showNewsletterForm = true;

    // -- FUNCTIONS

    function validateEmail(
        email
        )
    {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        return emailRegex.test( email );
    }

    // ~~

    async function subscribeToNewsletter(
        email,
        event = undefined
        )
    {
        event.preventDefault();

        try
        {
            let response = await fetchData(
                '/api/newsletter-subscription',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: getJsonText(
                        {
                            newsletterSubscription:
                                {
                                    isActive: true,
                                    email: email,
                                    languageCode: $languageTagStore
                                }
                        }
                        )
                }
                );

            toast.success( 'Subscribed to newsletter!' );
            showNewsletterForm = false;

            newsletterSubscriptionStore.set( response.newsletterSubscription );

            email = '';
            isEmailValid = false;
        }
        catch ( error )
        {
            console.error( 'Error :', error );
        }
    }

    // -- STATEMENTS

    $: isEmailValid = validateEmail( email );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .home-main-newsletter
    {
        position: fixed;
        bottom: 3rem;
        right: 50%;
        transform: translateX( 50% );

        border-radius: 0.75rem;
        padding: 0.75rem 1rem 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        justify-content: center;
        align-items: center;

        background-color: greenColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        +media( desktop )
        {
            right: 2rem;
            transform: translateX( 0 );

            padding: 1.5rem;

            gap: 1.5rem;
        }
    }

    .home-main-newsletter h2
    {
        line-height: 2rem;
        font-size: 1.5rem;
        font-weight: 600;
        color: blueColor100;
    }

    .home-main-newsletter p
    {
        line-height: 1.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: grayColor300;
    }

    .home-main-newsletter-form
    {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            flex-direction: column;
        }

        button
        {
            border: none;
        }
    }

    .home-main-newsletter-email:focus,
    .home-main-newsletter-email:active
    {
        border: 2px solid greenColor900;
    }

    .home-main-newsletter-email
    {
        outline: none;
        min-height: 3.25rem;
        width: 100%;
        min-width: 15rem;
        border: 2px solid grayColor800;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        line-height: 1.125rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: grayColor300;

        transition: border 0 400ms cubic-bezier( 0.76, 0, 0.27, 1 );

        +media( desktop )
        {
            min-width: 23rem;
        }
    }

    .home-newsletter-title-and-description
    {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-self: stretch;

        +media( desktop )
        {
            gap: 0.5rem;
        }
    }

    .home-main-newsletter-button
    {
        height: 3.25rem;
        width: 100%;
        border-radius: 0.75rem;
        padding: 0.75rem 1.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        background: blueColor100;

        color: whiteColor;

        cursor: pointer;
        transition: background 0 400ms cubic-bezier(  0.76, 0, 0.27, 1 );

        +media( desktop )
        {
            width: 100%;
        }
    }

    .home-main-newsletter-button:hover
    {
        background: blueColor500;
    }

    .home-main-newsletter-close
    {
        position: absolute
        top: 1rem
        right: 1rem
        background: transparent
        border: none
        cursor: pointer
    }
</style>

{#if showNewsletterForm && ( $newsletterSubscriptionStore === null || !$newsletterSubscriptionStore.isActive ) }
    <section
        class="home-main-newsletter"
        out:fade={ { duration: 350, easing: linear } }
        in:fade={ { delay: 350, duration: 350, easing: linear } }
    >
        <button
            class="home-main-newsletter-close"
            on:click={() => showNewsletterForm = false}
            aria-label="Close newsletter form"
        >
            <svg
                width="25"
                height="25"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M1 1L6 6M11 11L6 6M6 6L11 1L1 11"
                stroke="#010D3C"
                stroke-width="1"
            />
        </button>
        <div class="home-newsletter-title-and-description">
            <h2>
                { getLocalizedTextBySlug( 'home-newsletter-title', $languageTagStore ) }
            </h2>
            <p>
                { getLocalizedTextBySlug( 'home-newsletter-description', $languageTagStore ) }
            </p>
        </div>
        <form class="home-main-newsletter-form" on:submit={ ( event ) =>  subscribeToNewsletter( email, event ) }>
            <input
                class="home-main-newsletter-email"
                type="email"
                required
                placeholder={ getLocalizedTextBySlug( 'home-newsletter-email-placeholder', $languageTagStore ) }
                bind:value={ email }
            />
            <button
                type="submit"
                class="home-main-newsletter-button"
            >
                {#if $isMobileScreen}
                    <span class="white-right-arrow-icon size-150"/>
                {:else}
                    { getLocalizedTextBySlug( 'personal-information-email-address', $languageTagStore ) }
                    <span class="white-right-caret-icon size-150"/>
                {/if}
            </button>
        </form>
    </section>
{/if}
