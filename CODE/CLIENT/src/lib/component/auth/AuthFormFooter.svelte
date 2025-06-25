<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug, getInteger } from 'senselogic-gist';
    import { onMount } from 'svelte';
    import { languageTagStore } from '$lib/store/languageTagStore';
    import { platform, device, fetchData } from '$lib/base';
    import Loading from '$component/element/Loading.svelte';

    // -- VARIABLES

    let appleLoginEnabled = false;
    let isLoading = true;

    // -- FUNCTIONS

    async function signInWithOAuth(
        provider
        )
    {
        let errorText = provider === 'google' ? 'Google OAuth rejected' : 'Apple OAuth rejected';

        try
        {
            let redirectionToUrl;

            switch ( platform )
            {
                case 'android':
                    redirectionToUrl = 'com.moien://auth';
                    break;
                case 'ios':
                    redirectionToUrl = 'com.moien://auth';
                    break;
                default:
                    redirectionToUrl = 'http://localhost:5173/auth';
            }

            let data = await fetchData(
                '/api/auth/open-auth',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( { provider, redirectionToUrl } )
                }
                );

            if ( data.error )
            {
                console.error( 'Server sign-in error:', data.error );
            }
            else
            {
                if ( data.url )
                {
                    window.location.href = data.url;
                }
                else
                {
                    console.error( 'Server sign-in error:', data );
                }
            }
        }
        catch ( error )
        {
            console.error( errorText, error );
        }
    }

    // ~~

    async function isAppleLoginEnabled(
        )
    {
        let deviceInfo = await device;
        let iosVersion =
            platform === 'ios' && device
            ? deviceInfo.osVersion.split( '.' )[ 0 ]
            : "0";

        return getInteger( iosVersion ) >= 13;
    }

    // -- STATEMENTS

    onMount(
        async function()
        {
            appleLoginEnabled = await isAppleLoginEnabled();
            isLoading = false;
        }
        )
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .auth-modal-sepator
    {
        display: flex;
        justify-content: center;
        align-items: center;

        white-space: nowrap;
    }

    .auth-modal-sepator::before,
    .auth-modal-sepator::after
    {
        height: 1px;

        flex-grow: 1;

        content: '';
        background-color: lightGrayBorderColor;
    }

    .auth-modal-sepator::before
    {
        margin-right: 0.75rem;
    }

    .auth-modal-sepator::after
    {
        margin-left: 0.75rem;
    }

    .auth-modal-socials
    {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem
    }

    .auth-modal-socials-item
    {
        border: 1px solid grayColor700;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }
</style>

{#if isLoading}
    <Loading />
{:else}
    <div class="font-size-100 font-weight-500 color-black  auth-modal-sepator">
        { getLocalizedTextBySlug('auth-or-label', $languageTagStore ) }
    </div>
    <div class="auth-modal-socials">
        <div
            class="auth-modal-socials-item"
            on:click={() => signInWithOAuth( 'google' )}>
            <span class="google-logo-icon size-150"></span>
        </div>
        {#if appleLoginEnabled}
            <div
                class="auth-modal-socials-item"
                on:click={() => signInWithOAuth( 'apple' )}
            >
                <span class="apple-logo-icon size-150"></span>
            </div>
        {/if}
    </div>
{/if}
