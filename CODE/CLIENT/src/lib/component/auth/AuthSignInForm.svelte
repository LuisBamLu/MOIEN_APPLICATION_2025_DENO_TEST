<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { hostUrl } from '$src/lib/base';
    import { authModalStore } from '$src/lib/store/authModalStore';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalButton from '../modal/ModalButton.svelte';
    import AuthTokenSignInForm from './AuthTokenSignInForm.svelte';
    import AuthPasswordSignInForm from './AuthPasswordSignInForm.svelte';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let activeStep = 0;
    export let isSubmitting = false;
    let authError = null;
    let authMessage = null;
    let signInMode = 'password';
    let passwordSignInStepArray = [ 'enter-credentials' ];
    let tokenSignInStepArray = [ 'request-token', 'request-token-message', 'sign-in' ];
    let signUpFormData = { email: null, password: null };

    // -- FUNCTIONS

    async function handleSignIn(
        event
        )
    {
        let formData = new FormData( event.target );
        authError = null;

        if ( signInMode === 'password' )
        {
            signInWithPassword( formData );
        }
        else
        {
            signInWithToken( formData );
        }
    }

    // ~~

    function toggleSignInMode(
        )
    {
        if ( signInMode === 'password' )
        {
            signInMode = 'token';
        }
        else
        {
            signInMode = 'password';
        }

        activeStep = 0;
    }

    async function signInWithToken(
        formData
        )
    {
        if ( tokenSignInStepArray[ activeStep ] === 'request-token' )
        {
            isSubmitting = true;

            let response = await fetch(
                hostUrl + '/api/request-token',
                {
                    method: 'POST',
                    body: JSON.stringify( Object.fromEntries( formData ) )
                }
                );

            if ( response.ok )
            {
                ++activeStep;
            }

            let res = await response.json();

            authMessage = res.message;
            authError = res.error;

            isSubmitting = false;
        }
        else if ( tokenSignInStepArray[ activeStep ] === 'request-token-message' )
        {
            ++activeStep;
        }
        else
        {
            isSubmitting = true;

            let response
                = await fetch(
                    hostUrl + '/api/sign-in',
                    {
                        method: 'POST',
                        body: JSON.stringify( { ...Object.fromEntries( formData ), email: signUpFormData.email } ),
                        credentials: 'include'
                    }
                    );

            if ( response.ok )
            {
                $profileSignedInStore = await response.json();
                $authModalStore = null;
            }
            else
            {
                let res = await response.json();

                authMessage = res.message;
                authError = res.error;
            }

            if ( authError !== null )
            {
                toast.error( authError );
            }

            isSubmitting = false;
        }
    }

    // ~~

    async function signInWithPassword(
        formData
        )
    {
        isSubmitting = true

        try
        {
            let response
                = await fetch(
                    hostUrl + '/api/admin/sign-in',
                    {
                        method: 'POST',
                        body: JSON.stringify( Object.fromEntries( formData ) ),
                        credentials: 'include'
                    }
                    );

            if ( response.ok )
            {
                let result = await response.json();
                $profileSignedInStore = result.profile;
                $authModalStore = null;
            }
            else
            {
                let result = await response.json();
                toast.error( result.error );
            }
        }
        catch ( error )
        {
            console.error( error );
        }
        finally
        {
            isSubmitting = false;
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    form
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    // -- CLASSES

    .auth-modal-form-container
    {
        border: 1px solid grayColor700;
        border-radius: 1rem;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .auth-modal-form-warning
    {
        margin-bottom: 1rem;
        width: 100%;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
    }
</style>

<form on:submit|preventDefault={ handleSignIn }>
    {#if signInMode === 'password' }
        <AuthPasswordSignInForm
            passwordSignInStepArray={ passwordSignInStepArray }
            activeStep={ activeStep }
            authMessage={ authMessage }
            bind:signUpFormData={ signUpFormData }
        />
    {:else}
        <AuthTokenSignInForm
            tokenSignInStepArray={ tokenSignInStepArray }
            bind:activeStep={ activeStep }
            bind:authMessage={ authMessage }
            bind:signUpFormData={ signUpFormData }
        />
    {/if}
    <div class="font-size-75 font-weight-500 color-gray auth-modal-form-warning">
        <button on:click={ toggleSignInMode } type="button">
            <div class="font-size-75 font-weight-700 color-blue">
                {#if signInMode === 'password' }
                    { getLocalizedTextBySlug( 'auth-sign-in-with-token', $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'auth-sign-in-with-password', $languageTagStore ) }
                {/if}
            </div>
        </button>
    </div>
    <div class="font-size-75 font-weight-500 color-gray auth-modal-form-warning">
        <a href="/terms" target="_blank" rel="noopener noreferrer">
            <div class="font-size-75 font-weight-700 color-blue">
                { getLocalizedTextBySlug( 'blog-terms-label', $languageTagStore ) }
            </div>
        </a>
    </div>
    <ModalButton
        type="submit"
        text={ getLocalizedTextBySlug( 'auth-continue-button', $languageTagStore ) }
        isLoading={ isSubmitting }
    />
</form>
