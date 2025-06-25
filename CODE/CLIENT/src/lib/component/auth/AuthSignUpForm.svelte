<script>
    // -- IMPORTS

    import { fetchData } from '$src/lib/base';
    import { authModalStore } from '$src/lib/store/authModalStore';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import AuthModalSelectCountry from './AuthModalSelectCountry.svelte';
    import ModalButton from '../modal/ModalButton.svelte';
    import AuthFormInput from './AuthFormInput.svelte';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let activeStep = 0;
    export let isSubmitting = false;
    let authError = null;
    let authMessage = null;
    let signUpStepArray = [ 'phone', 'info', 'sign-in' ];
    let signUpFormData =
        {
            phonePrefix: null,
            phoneNumber: null,
            firstName: null,
            lastName: null,
            email: null,
            password: null
        };
    let confirmPassword = null;
    let termsAccepted = false;

    // -- FUNCTIONS

    function validateSignUpInputs(
        )
    {
        authError = null;

        if ( signUpFormData.email === '' || signUpFormData.email === null )
        {
            authError = 'auth-sign-up-email-failed';
            activeStep = 1;
            return;
        }

        if ( signUpFormData.firstName === '' || signUpFormData.firstName === null )
        {
           authError = 'auth-sign-up-empty-first-name';
           activeStep = 1;
           return;
        }

        if ( signUpFormData.lastName === '' || signUpFormData.lastName === null )
        {
            authError = 'auth-sign-up-empty-last-name';
            activeStep = 1;
            return;
        }

        if ( signUpFormData.phonePrefix === '' || signUpFormData.phonePrefix === null )
        {
            authError = 'auth-country-phone-prefix-error-message';
            activeStep = 0;
            return;
        }

        if ( signUpFormData.phoneNumber === '' || signUpFormData.phoneNumber === null )
        {
            authError = 'auth-phone-number-error-message';
            activeStep = 0;
            return;
        }

        if ( signUpFormData.password === '' || signUpFormData.password === null )
        {
            authError = 'auth-empty-password-error-message';
            activeStep = 1;
            return
        }

        if ( signUpFormData.password.length < 8 )
        {
            authError = 'auth-password-too-short-error-message';
            activeStep = 1;
            return
        }

        let passwordIncludesUpperCaseCharacter = signUpFormData.password.match( /[A-Z]+/ );

        if ( !passwordIncludesUpperCaseCharacter )
        {
            authError = 'auth-password-no-uppercase-characters-error-message';
            activeStep = 1;
            return;
        }

        let passwordIncludesLowerCaseCharacter = signUpFormData.password.match( /[a-z]+/ );

        if ( !passwordIncludesLowerCaseCharacter )
        {
            authError = 'auth-password-no-lowercase-characters-error-message';
            activeStep = 1;
            return;
        }

        let passwordIncludesSpecialCharacter = signUpFormData.password.match( /[!-\/:-@[-`{-~]/ );

        if ( !passwordIncludesSpecialCharacter )
        {
            authError = 'auth-password-no-special-characters-error-message';
            activeStep = 1;
            return;
        }

        let passwordIncludesNumber = signUpFormData.password.match( /[0-9]+/ );;

        if ( !passwordIncludesNumber )
        {
            authError = 'auth-password-no-numbers-error-message';
            activeStep = 1;
            return;
        }

        if ( signUpFormData.password !== confirmPassword )
        {
            authError = 'auth-passwords-do-not-match-error-message';
            activeStep = 1;
            return;
        }

        authError = null;
    }

    // ~~

    async function handleSignUp(
        )
    {
        if ( signUpStepArray[ activeStep ] === 'phone' )
        {
            try
            {
                let response
                    = await fetchData(
                        '/api/check-phone-number',
                        {
                            method: 'POST',
                            body: getJsonText( signUpFormData ),
                            credentials: 'include'
                        }
                        );

                authMessage = response.message;
                authError = response?.error || null;

                if ( !termsAccepted )
                {
                    authError = getLocalizedTextBySlug( 'auth-terms-not-accepted', $languageTagStore );
                }

                if( authError !== null )
                {
                    toast.error( authError );
                }
                else
                {
                    authError = null;
                    activeStep = response.step;
                }
            }
            catch ( error )
            {
                console.error( 'ERROR:' + error );
            }
        }
        else if ( signUpStepArray[ activeStep ] === 'sign-in' )
        {
            $authModalStore = null;
        }
        else
        {
            validateSignUpInputs();

            if ( authError === null )
            {
                isSubmitting = true

                try
                {
                    let response
                        = await fetchData(
                            '/api/sign-up',
                            {
                                method: 'POST',
                                body: getJsonText( signUpFormData ),
                                credentials: 'include'
                            }
                            );

                    authMessage = response.message;
                    authError = response.error;
                    activeStep = response.step;
                }
                catch ( error )
                {
                    console.error( 'ERROR:' + error );
                }

                isSubmitting = false;
            }

            if ( authError !== null && authError !== undefined )
            {
                toast.error( authError );
            }
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

    .auth-modal-form-select,
    {
        padding: 0.75rem 1.25rem;
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

    .terms-checkbox
    {
        accent-color: blueColor;
    }
</style>

<form on:submit|preventDefault={ handleSignUp }>
    {#if signUpStepArray[ activeStep ] === 'phone' }
        <div class="auth-modal-form-container">
            <div class="auth-modal-form-select">
                <AuthModalSelectCountry bind:phonePrefix={ signUpFormData.phonePrefix } />
            </div>
            <AuthFormInput
                name="phone-number"
                type="tel"
                placeholder={ getLocalizedTextBySlug( 'auth-phone-number-placeholder', $languageTagStore ) }
                required={ true }
                bind:value={ signUpFormData.phoneNumber }
            />
        </div>
    {:else if signUpStepArray[ activeStep ] === 'sign-in' }
        {#key authMessage }
            {#if authMessage }
                <div class="font-size-90 font-weight-500 color-green">
                    { getLocalizedTextBySlug( authMessage, $languageTagStore ) }
                </div>
            {/if}
        {/key}
    {:else}
        <div class="auth-modal-form-container">
            <AuthFormInput
                name="first-name"
                placeholder={ getLocalizedTextBySlug( 'personal-information-first-name', $languageTagStore ) }
                required={ true }
                bind:value={ signUpFormData.firstName }
            />
            <AuthFormInput
                name="last-name"
                placeholder={ getLocalizedTextBySlug( 'personal-information-last-name', $languageTagStore ) }
                required={ true }
                bind:value={ signUpFormData.lastName }
            />
            <AuthFormInput
                name="email"
                type="email"
                placeholder={ getLocalizedTextBySlug( 'personal-information-email-address', $languageTagStore ) }
                required={ true }
                bind:value={ signUpFormData.email }
            />
            <AuthFormInput
                name="password"
                type="password"
                placeholder={ getLocalizedTextBySlug( 'account-settings-password-label', $languageTagStore ) }
                required={ true }
                showPasswordButton={ true }
                bind:value={ signUpFormData.password }
            />
            <AuthFormInput
                name="confirm-password"
                type="password"
                placeholder={ getLocalizedTextBySlug( 'account-settings-confirm-password-label', $languageTagStore ) }
                required={ true }
                showPasswordButton={ true }
                bind:value={ confirmPassword }
            />
        </div>
    {/if}
    {#if signUpStepArray[ activeStep ] === 'phone' }
        <div class="font-size-75 font-weight-500 color-gray auth-modal-form-warning">
            <input class="terms-checkbox" type="checkbox" bind:checked={ termsAccepted }>
            <a href="/terms" target="_blank" rel="noopener noreferrer">
                <div class="font-size-75 font-weight-700 color-blue">
                    { getLocalizedTextBySlug( 'accept-terms-label', $languageTagStore ) }
                </div>
            </a>
        </div>
    {/if}
    <ModalButton
        type="submit"
        text={ getLocalizedTextBySlug( 'auth-continue-button', $languageTagStore ) }
        isLoading={ isSubmitting }
    />
</form>
