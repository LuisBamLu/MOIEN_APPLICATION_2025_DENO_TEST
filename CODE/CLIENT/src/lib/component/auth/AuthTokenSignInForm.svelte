<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from "senselogic-gist";
    import AuthFormInput from "./AuthFormInput.svelte";
    import { languageTagStore } from "$src/lib/store/languageTagStore";

    // -- VARIABLES

    export let tokenSignInStepArray;
    export let activeStep;
    export let signUpFormData;
    export let authMessage;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

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

{#if tokenSignInStepArray[ activeStep ] === 'request-token' }
    <div class="auth-modal-form-container">
        <AuthFormInput
            name="email"
            type="email"
            placeholder={ getLocalizedTextBySlug( 'personal-information-email-address', $languageTagStore ) }
            required={ true }
            bind:value={ signUpFormData.email }
        />
    </div>
{:else if tokenSignInStepArray[ activeStep ] === 'request-token-message' }
    {#if authMessage }
        <div class="font-size-90 font-weight-500 color-green">
            { getLocalizedTextBySlug( authMessage, $languageTagStore ) }
        </div>
    {/if}
{:else if tokenSignInStepArray[ activeStep ] === 'sign-in' }
    <div class="auth-modal-form-container">
        <AuthFormInput
            name="token"
            placeholder={ getLocalizedTextBySlug( 'auth-enter-token-placeholder', $languageTagStore ) }
            required={ true }
        />
    </div>
{/if}
