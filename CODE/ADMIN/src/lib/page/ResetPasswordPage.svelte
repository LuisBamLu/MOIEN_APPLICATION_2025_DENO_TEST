<script>
    import { preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { connectionStore  } from '$store/connectionStore';
    import { fetchData, getBackoffSecondCount, getCurrentTimestamp, getTimestampFromDateTime } from '$lib/base';
    import { getJsonText, getLocalizedText, getLocalizedTextBySlug, getTextBySlug } from 'senselogic-gist';
    import { isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import { Link, navigate } from 'svelte5-router';
    import { onDestroy, onMount } from 'svelte';
    import Input from '$component/element/Input.svelte';
    import IconButton from '$component/element/IconButton.svelte';
    import Button from '$component/element/Button.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import { toast } from '../toast';
    import { urlParamsStore } from '../store/urlParamsStore';

    // -- VARIABLES

    let password = $state('');
    let confirmPassword = $state('');
    let errorMap = $state({});
    let showPassword = $state(false);
    let isLoading = $state(false);
    let showSuccessMessage = false;

    let updateCountdownInterval;

    // -- FUNCTIONS

    function handleTogglePasswordShow(
        )
    {
        showPassword = !showPassword;
    }

    // ~~

    function clearFormField(
        )
    {
        password = '';
        confirmPassword = '';
    }

    // ~~

    async function handleSendResetPassword(
        )
    {
        isLoading = true;
        errorMap[ 'password' ] = false;
        errorMap[ 'confirmPassword' ] = false;

        try
        {
            if ( password !== confirmPassword )
            {
                toast.error( `The password doesn't match` );

                throw new Error( `The password doesn't match` );
            }

            let response = await fetchData(
                '/api/admin/reset-password?' + $urlParamsStore.toString(),
                {
                    method: 'POST',
                    body: getJsonText(
                        {
                            password,
                            confirmPassword
                        }
                        ),
                    credentials: 'include'
                }
                );

            profileSignedInStore.set( response.profile );
            navigate( '/admin/home' );
        }
        catch ( error )
        {
            errorMap[ 'password' ] = true;
            errorMap[ 'confirmPassword' ] = true;
            toast.error( error ?? 'Something went wrong!' );
        }
        finally
        {
            isLoading = false;
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( $profileSignedInStore )
            {
                navigate( '/admin/home' );
            }

            let error = $urlParamsStore.get( 'error' );
            let errorDescription = $urlParamsStore.get( 'error_description' );

            if ( error === 'access_denied' && errorDescription.includes( 'expired' ) )
            {
                toast.error( 'The password reset request has expired. Please try again.' );

                navigate( '/admin/login' );
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';
''
    // -- CLASSES

    .page-section
    {
        min-height: 100dvh;
        padding-top: 4.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;

        background: pageBackgroundColor;
    }

    .login-container
    {
        width: 25em;
        border: 1px solid grayColor600;
        border-radius: 0.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        +media( desktop )
        {
            width: 30rem;
        }
    }

    .logo-image
    {
        width: 100%;
    }

    .icon
    {
        flex-shrink: 0;

        user-select: none;
    }

    .reset-password-text
    {
        font-size: 0.9rem;
        text-align: right;
        color: blueColor;

        cursor: pointer;
    }

    .reset-password-text:hover
    {
        color: blueColor500;
    }
</style>

{#if $isLoadingProfile }
    <div class="hourglass">{ getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }</div>
{:else}
    <div class="page-section">
        <form onsubmit={preventDefault(handleSendResetPassword)}>
            <img class="logo-image height-550" src="/admin/image/icon/moien_logo.svg" alt="Moin logo">

            <div class="login-container padding-vertical-300 padding-lateral-200 margin-top-300">
                <Input min="6" name="password" type={ showPassword ? 'text' : 'password' } bind:value={ password } error={ !!errorMap[ 'password' ] } label="Enter your new password" fullWidth required>
                    <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <IconButton on:click={ handleTogglePasswordShow } slot="end-adornment">
                        <div class="{ showPassword ? 'gray-eye-slash' : 'gray-eye' }-icon size-150 icon"></div>
                    </IconButton>
                </Input>

                <Input min="6" name="confirmPassword" type={ showPassword ? 'text' : 'password' } bind:value={ confirmPassword } error={ !!errorMap[ 'confirmPassword' ] } label="Confirm your new password" fullWidth required>
                    <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <IconButton on:click={ handleTogglePasswordShow } slot="end-adornment">
                        <div class="{ showPassword ? 'gray-eye-slash' : 'gray-eye' }-icon size-150 icon"></div>
                    </IconButton>
                </Input>

                {#if showSuccessMessage }
                    <p class="font-size-90 color-green">Success! Check your e-mail to reset your password.</p>
                {/if}

                <a class="reset-password-text" href="/">
                    Login
                </a>

                <Button type="submit" loading={ isLoading } fullWidth>
                    Confirm
                </Button>
            </div>
        </form>
    </div>
{/if}
