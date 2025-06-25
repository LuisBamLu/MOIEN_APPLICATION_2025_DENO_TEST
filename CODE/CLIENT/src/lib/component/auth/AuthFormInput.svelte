<script>
    // -- VARIABLES

    export let type = 'text';
    export let name = '';
    export let placeholder = '';
    export let required = false;
    export let value = null;
    export let showPasswordButton = false;

    let isPasswordVisible = false;
    let phonePatternRegex = '(?:\\(?\\d{2,5}\\)?[ \\-]?){0,1}\\d{3,5}(?:[ \\-]?\\d{2,5}){1,3}';
    let allowedPhoneCharactersRegex = /[^\d\s\-\(\)]/g;

    // -- FUNCTIONS

    function handleIsPasswordVisible(
        )
    {
        isPasswordVisible = !isPasswordVisible;

        if( type === 'password' && isPasswordVisible )
        {
            type = 'text';
        }
        else
        {
            type = 'password';
        }
    }

    // ~~

    function handleTelephoneInput(event)
    {
        if (type === 'tel')
        {
            event.target.value = event.target.value.replace(allowedPhoneCharactersRegex, '');
            value = event.target.value;
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .auth-form-input
    {
        padding: 1rem 1.25rem;

        display: flex;
    }

    .auth-form-input input,
    .auth-form-input input:-internal-autofill-selected,
    .auth-form-input input:-webkit-autofill,
    .auth-form-input input:-webkit-autofill:hover,
    .auth-form-input input:-webkit-autofill:focus,
    .auth-form-input input:-webkit-autofill:active
    {
        width: 100%;

        background-color: grayColor950 !important;
        -webkit-background-clip: text;
        -webkit-text-fill-color: grayColor100;
        box-shadow: inset 0 0 20px 20px grayColor950;

        color: blackColor !important;

        transition: background-color 5000s ease-in-out 0s;
    }

    .auth-form-input input:focus-visible
    {
        outline: unset;
    }
</style>

<div class="auth-form-input">
    <input
        { ...{ type } }
        name={ name }
        placeholder={ placeholder }
        required={ required }
        bind:value={ value }
        pattern={ type === 'tel' ? phonePatternRegex : undefined }
        on:input={ handleTelephoneInput }
    />

    {#if showPasswordButton }
        <button type="button" on:click={ handleIsPasswordVisible }>
            {#if isPasswordVisible }
                <div class="green-eye-icon size-100"/>
            {:else}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            {/if}
        </button>
    {/if}
</div>
