<script>
    // -- IMPORTS

    import { authModalStore } from '$store/authModalStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalRoot from '../modal/ModalRoot.svelte';
    import ModalHeader from '../modal/ModalHeader.svelte';
    import AuthFormHeader from './AuthFormHeader.svelte';
    import AuthSignInForm from './AuthSignInForm.svelte';
    import AuthSignUpForm from './AuthSignUpForm.svelte';
    import AuthFormFooter from './AuthFormFooter.svelte';
    import AuthBetaApplicantForm from './AuthBetaApplicantForm.svelte';

    // -- VARIABLES

    let activeStep = 0;
    let isSubmitting = false;

    // -- FUNCTIONS

    function isBetaApplicant(
        )
    {
        if ( $authModalStore === 'sign-up' )
        {
            return getLocalizedTextBySlug( 'auth-sign-up-button', $languageTagStore );
        }
        else
        {
            return getLocalizedTextBySlug( 'auth-beta-applicant-button', $languageTagStore );
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .auth-modal-head-image-container
    {
        height: calc( var( --viewport-height ) / 4 );
        max-height: 15rem;

        display: flex;
        align-items: flex-end;

        background-color: grayColor700;
    }

    .auth-modal-head-image
    {
        height: 100%;
        width: 100%;

        object-fit: cover;
        object-position: top;
    }

    .auth-modal-container
    {
        overflow-y: auto;
        max-height: calc( var( --viewport-height ) - 5rem );

        display: flex;
        flex-direction: column;
        -ms-overflow-style: none;
        scrollbar-width: none;
        width: 100%;

        background-color: grayColor900;
    }

    .auth-modal-wrap
    {
        padding: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
</style>

<ModalRoot isOpen={ $authModalStore != null }>
    <ModalHeader
        title=
            {
                $authModalStore === 'sign-in'
                ? getLocalizedTextBySlug( 'auth-sign-in-button', $languageTagStore )
                : isBetaApplicant()
            }
        onClose={ () => $authModalStore = null }
    />
    <div class="auth-modal-container">
        <div class="auth-modal-head-image-container">
            <img
                class="auth-modal-head-image"
                src="/image/auth/heading.svg"
                alt=""
            />
        </div>
        <div class="auth-modal-wrap">
            <AuthFormHeader bind:activeStep={ activeStep } />
            {#if $authModalStore === 'sign-in' }
                <AuthSignInForm
                    bind:activeStep={ activeStep }
                    bind:isSubmitting={ isSubmitting }
                />
            {:else if $authModalStore === 'sign-up' }
                <AuthSignUpForm
                    bind:activeStep={ activeStep }
                    bind:isSubmitting={ isSubmitting }
                />
            {:else if $authModalStore === 'beta-applicant' }
                <AuthBetaApplicantForm
                    bind:activeStep={ activeStep }
                    bind:isSubmitting={ isSubmitting }
                />
            {/if}
            <!-- {#if $authModalStore !== 'beta-applicant' }
                <AuthFormFooter />
            {/if} -->
        </div>
    </div>
</ModalRoot>
