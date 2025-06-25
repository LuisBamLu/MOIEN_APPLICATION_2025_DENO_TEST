<script>
    import { run, preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { connectionStore  } from '$store/connectionStore';
    import { fetchData, getBackoffSecondCount, getCurrentTimestamp, getTimestampFromDateTime } from '$lib/base';
    import { getJsonText, getLocalizedText, getLocalizedTextBySlug, getTextBySlug } from 'senselogic-gist';
    import { getProfilePermission, isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import { Link, navigate } from 'svelte5-router';
    import { onDestroy, onMount } from 'svelte';
    import Input from '$component/element/Input.svelte';
    import IconButton from '$component/element/IconButton.svelte';
    import Button from '$component/element/Button.svelte';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    let secondAmountCount = $state(0);

    let minuteCount = $derived(Math.floor( secondAmountCount / 60 ) % 60);
    let secondCount = $derived(secondAmountCount % 60);
    let hourCount = $derived(Math.floor( secondAmountCount / 3600 ) % 24);
    let initialSecondCount = getCurrentTimeSecondCount();
    let email = $state('');
    let password = $state('');
    let errorMap = $state({});
    let showPassword = $state(false);
    let isLoading = $state(false);
    let isResetPassword = $state(false);
    let showSuccessMessage = $state(false);

    let updateCountdownInterval;

    // -- FUNCTIONS

    function handleTogglePasswordShow(
        )
    {
        showPassword = !showPassword;
    }

    async function getConnection(
        )
    {
        let response = await fetchData(
            '/api/connection',
            {
                method : 'POST',
                body :
                    JSON.stringify(
                        {
                            type: 'getConnectionByBrowserAddress'
                        }
                        )
            }
            );

        connectionStore.set( response.connection );
    }

    // ~~

    async function handleSignIn(
        )
    {
        isLoading = true;

        try
        {
            let profileSigned = await fetchData(
                '/api/admin/sign-in',
                {
                    method: 'POST',
                    body: getJsonText(
                        {
                            email,
                            password
                        }
                        ),
                    credentials: 'include'
                }
                );

            $profileSignedInStore = profileSigned.profile;

            await getProfilePermission();

            navigate( '/admin/home' );
        }
        catch
        {
            clearFormField();
            errorMap[ 'email' ] = true;
            errorMap[ 'password' ] = true;

            await getConnection();
        }
        finally
        {
            isLoading = false;
        }
    }

    // ~~

    function clearFormField(
        )
    {
        email = '';
        password = '';
    }

    // ~~

    function updateTime()
        {
            updateCountdownInterval = setInterval(
                () =>
                {
                    if ( secondAmountCount <= 0 )
                    {
                        clearInterval( updateCountdownInterval );
                        return;
                    }

                    secondAmountCount = getBackoffSecondCount( $connectionStore?.attemptCount, 60 ) -
                    ( getCurrentTimestamp() - getTimestampFromDateTime( $connectionStore?.dateTime ) );
                },
                1000
                );
        }

    // ~~

    function getCurrentTimeSecondCount(
        )
    {
        return new Date().getTime() / 1000;
    }

    // ~~

    async function handleSendLink(
        )
    {
        isLoading = true;

        try
        {
            let response = await fetchData(
                '/api/admin/send-reset-link',
                {
                    method: 'POST',
                    body: getJsonText(
                        {
                            email
                        }
                        ),
                    credentials: 'include'
                }
                );

            showSuccessMessage = true;
        }
        catch
        {
            clearFormField();
            errorMap[ 'email' ] = true;

            await getConnection();
        }
        finally
        {
            isLoading = false;
        }
    }

    // ~~

    function toggleResetPassword(
        )
    {
        isResetPassword = !isResetPassword;
        showSuccessMessage = false;
        clearFormField();
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            secondAmountCount = Math.ceil( $connectionStore?.backoffSecondCount - ( getCurrentTimeSecondCount() - initialSecondCount ) );

            updateTime();
        }
        );

    // ~~

    onMount(
        () =>
        {
            if ( $profileSignedInStore )
            {
                navigate( '/admin/home' );
            }
        }
        );

    // ~~

    onDestroy(
        () =>
        {
            clearInterval( updateCountdownInterval );
        }
        );

    // ~~

    run(() => {
        secondAmountCount = Math.ceil( $connectionStore?.backoffSecondCount - ( getCurrentTimeSecondCount() - initialSecondCount ) );
        updateTime();
    });
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

    .backoff-message
    {
        margin-top: 4rem;
        max-width: 32rem;

        text-align: center;
    }

    .backoff-duration
    {
        margin-top: 2rem;

        display: flex;
        gap: 2rem;
        justify-content: center;
    }

    .backoff-count
    {
        height: 7rem;
        width: 7rem;
        border-radius: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: blueColor;

        color: grayColor900;
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
        <form onsubmit={preventDefault(isResetPassword ? handleSendLink : handleSignIn)}>
            <img class="logo-image height-550" src="/admin/image/icon/moien_logo.svg" alt="Moin logo">

            {#if secondAmountCount > 0 && $connectionStore.attemptCount >= 3 }
                <div class="backoff-message font-size-150 color-blue">
                    There have been { $connectionStore.attemptCount } successive failed connection attempts from this IP address.<br/>
                    Please wait a moment before trying again.
                </div>
                <div class="backoff-duration">
                    <div class="backoff-count">
                        <div id="hour-count-text" class="backoff-count-text font-size-200">
                            { String( hourCount ).padStart( 2, '0' ) }
                        </div>
                        <div class="backoff-count-unit font-size-100">
                            Hours
                        </div>
                    </div>
                    <div class="backoff-count">
                        <div id="minute-count-text" class="backoff-count-text font-size-200">
                            { String( minuteCount ).padStart( 2, '0' ) }
                        </div>
                        <div class="backoff-count-unit font-size-100">
                            Minutes
                        </div>
                    </div>
                    <div class="backoff-count">
                        <div id="second-count-text" class="backoff-count-text font-size-200">
                            { String( secondCount ).padStart( 2, '0' ) }
                        </div>
                        <div class="backoff-count-unit font-size-100">
                            Seconds
                        </div>
                    </div>
                </div>
            {:else}
                <div class="login-container padding-vertical-300 padding-lateral-200 margin-top-300">
                    <Input name="email" type="email" label="E-mail" bind:value={ email } error={ !!errorMap[ 'email' ] } fullWidth required disabled={ showSuccessMessage }/>

                    {#if !isResetPassword }
                        <Input name="password" type={ showPassword ? 'text' : 'password' } bind:value={ password } error={ !!errorMap[ 'password' ] } label="Password" fullWidth required>
                            <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <IconButton on:click={ handleTogglePasswordShow } slot="end-adornment">
                                <div class="{ showPassword ? 'gray-eye-slash' : 'gray-eye' }-icon size-150 icon"></div>
                            </IconButton>
                        </Input>
                    {/if}

                    {#if showSuccessMessage }
                        <p class="font-size-75 color-green-500 text-align-center">Success! If this email is registered, you will receive a reset link.</p>
                    {/if}

                    <p class="reset-password-text" onclick={toggleResetPassword}>
                        {#if isResetPassword }
                            Login
                        {:else}
                            Reset Password
                        {/if}
                    </p>

                    <Button type="submit" loading={ isLoading } fullWidth disabled={ showSuccessMessage }>
                        {#if isResetPassword }
                            Send link
                        {:else}
                            Sign in
                        {/if}
                    </Button>
                </div>
            {/if}
        </form>
    </div>
{/if}
