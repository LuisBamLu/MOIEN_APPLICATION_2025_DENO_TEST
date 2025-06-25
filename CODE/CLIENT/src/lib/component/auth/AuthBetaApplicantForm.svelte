<script>
    // -- IMPORTS

    import { hostUrl } from '$src/lib/base';
    import { authModalStore } from '$src/lib/store/authModalStore';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalButton from '../modal/ModalButton.svelte';
    import AuthFormInput from './AuthFormInput.svelte';
    import { Browser } from '@capacitor/browser';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let activeStep = 0;
    export let isSubmitting = false;
    let authError = null;
    let authMessage = null;
    let betaApplyStepArray = [ 'info', 'success' ];
    let betaApplyFormData =
        {
            firstName: null,
            lastName: null,
            email: null,
            languageCode: $languageTagStore
        };
    let termsAccepted = false;

    // -- FUNCTIONS

    function validateBetaApplyInputs(
        )
    {
        authError = null;

        if ( betaApplyFormData.email === '' || betaApplyFormData.email === null )
        {
            authError = 'auth-beta-apply-email-failed';
            activeStep = 0;
            return;
        }

        if ( betaApplyFormData.firstName === '' || betaApplyFormData.firstName === null )
        {
           authError = 'auth-beta-apply-empty-first-name';
           activeStep = 0;
           return;
        }

        if ( betaApplyFormData.lastName === '' || betaApplyFormData.lastName === null )
        {
            authError = 'auth-beta-apply-empty-last-name';
            activeStep = 0;
            return;
        }

        authError = null;
    }

    // ~~

    async function handleBetaApply(
        )
    {
        if ( betaApplyStepArray[ activeStep ] === 'info' )
        {
            if ( !termsAccepted )
            {
                authError = getLocalizedTextBySlug( 'auth-terms-not-accepted', $languageTagStore );
                return;
            }
            else
            {
                validateBetaApplyInputs();
                betaApplyFormData.languageCode = $languageTagStore;

                if ( authError === null )
                {
                    isSubmitting = true

                    try
                    {
                        let response = await fetch(
                            hostUrl + '/api/beta-apply',
                            {
                                method: 'POST',
                                body: JSON.stringify( betaApplyFormData ),
                                credentials: 'include'
                            }
                            );

                        let res = await response.json();

                        authMessage = res.message;
                        authError = res.error;
                        activeStep = res.step;
                    }
                    catch ( error )
                    {
                        console.error( 'ERROR:' + error );
                    }

                    isSubmitting = false;
                }

                toast.error( authError );
            }
        }
        else if ( betaApplyStepArray[ activeStep ] === 'success' )
        {
            $authModalStore = null;
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

    .terms-checkbox
    {
        accent-color: blueColor;
    }

    .auth-modal-form-warning:hover
    {
        .terms-text
        {
            color: greenColor;
        }
    }
</style>

<form on:submit|preventDefault={ handleBetaApply }>
    {#if betaApplyStepArray[ activeStep ] === 'info' }
        <div class="auth-modal-form-container">
            <AuthFormInput
                name="first-name"
                placeholder="First Name"
                required={ true }
                bind:value={ betaApplyFormData.firstName }
            />
            <AuthFormInput
                name="last-name"
                placeholder="Last Name"
                required={ true }
                bind:value={ betaApplyFormData.lastName }
            />
            <AuthFormInput
                name="email"
                type="email"
                placeholder="Email"
                required={ true }
                bind:value={ betaApplyFormData.email }
            />
        </div>
    {:else}
        {#if authMessage }
            <div class="font-size-120 font-weight-700 color-green">
                { getLocalizedTextBySlug( authMessage, $languageTagStore ) }
            </div>
        {/if}
    {/if}
    {#if betaApplyStepArray[ activeStep ] === 'info' }
        <div class="font-size-75 font-weight-500 color-gray auth-modal-form-warning">
            <input class="terms-checkbox" type="checkbox" bind:checked={ termsAccepted }>
            <button
                type="button"
                on:click={ () => Browser.open( { url: '/terms', target: '_blank' } ) }
            >
                <div class="font-size-75 font-weight-700 color-blue terms-text">
                    { getLocalizedTextBySlug( 'accept-terms-label', $languageTagStore ) }
                </div>
            </button>
        </div>
    {/if}
    <ModalButton
        type="submit"
        text={ getLocalizedTextBySlug( 'auth-continue-button', $languageTagStore ) }
        isLoading={ isSubmitting }
    />
</form>
