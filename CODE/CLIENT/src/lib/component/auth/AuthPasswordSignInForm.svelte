<script>
    // -- IMPORTS

    import AuthFormInput from "./AuthFormInput.svelte";
    import { languageTagStore } from "$src/lib/store/languageTagStore";
    import { getLocalizedTextBySlug } from "senselogic-gist";

    // -- VARIABLES

    export let signUpFormData;
    export let passwordSignInStepArray;
    export let activeStep;
    export let authMessage;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .auth-modal-form-container
    {
        border: 1px solid grayColor700;
        border-radius: 1rem;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }
</style>

<div class="auth-modal-form-container">
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
        bind:value={ signUpFormData.password }
    />
</div>
