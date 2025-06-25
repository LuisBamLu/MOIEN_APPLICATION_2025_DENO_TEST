<script>
    // -- IMPORTS

    import { authModalStore } from '$src/lib/store/authModalStore';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    export let activeStep = 0;

    // -- FUNCTIONS

    function toggleMode(
        )
    {
        if ( $authModalStore === 'sign-in' )
        {
            $authModalStore = 'sign-up';
        }
        else
        {
            $authModalStore = 'sign-in';
        }

        activeStep = 0;
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .auth-modal-account
    {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
</style>

<div class="auth-modal-welcome-account">
    <div class="font-size-125 font-weight-600 color-black auth-modal-welcome-label">
        { getLocalizedTextBySlug( 'auth-welcome-message-label', $languageTagStore ) }
    </div>
    <div class="auth-modal-account">
        <div class="font-size-90 font-weight-500 color-gray auth-modal-banking-information-account-modal-account-label">
            {#if $authModalStore === 'sign-in' }
                { getLocalizedTextBySlug( 'auth-sign-in-question-account-message-label', $languageTagStore ) }
            {:else if $authModalStore === 'sign-up' }
                { getLocalizedTextBySlug( 'auth-sign-up-question-account-message-label', $languageTagStore ) }
            {/if}
        </div>
        <button
            class="font-size-90 font-weight-700 color-blue auth-modal-account-link"
            on:click={ toggleMode }
        >
            {#if $authModalStore === 'sign-in' }
                { getLocalizedTextBySlug( 'auth-sign-up-button', $languageTagStore ) }
            {:else if $authModalStore === 'sign-up' }
                { getLocalizedTextBySlug( 'auth-sign-in-button', $languageTagStore ) }
            { /if}
        </button>
    </div>
</div>
