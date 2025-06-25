<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { countryArrayStore } from '$store/countryArrayStore';
    import AuthModalSelectCountry from '$component/auth/AuthModalSelectCountry.svelte';
    import LabelledInput from '../../element/LabelledInput.svelte';

    // -- VARIABLES

    export let profile;
    let selected = $countryArrayStore.filter( country => country.phonePrefix === profile.phonePrefix )[ 0 ];
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    :global( .phone-prefix-input-container div )
    {
        border: none;
        padding: unset;

        background-color: none;
    }

    // -- CLASSES

    .phone-number-inputs-container
    {
        width: 100%;
        border: none;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        background-color: unset;

        +media( desktop )
        {
            flex-direction: row;
        }
    }
</style>

<div class="phone-number-inputs-container">
    <div class="phone-prefix-input-container label-and-input-container" >
        <AuthModalSelectCountry selected={ selected } />
    </div>
    <LabelledInput
        label={ getLocalizedTextBySlug( 'auth-phone-number-placeholder', $languageTagStore ) }
        name="phone-number"
        placeholder={ getLocalizedTextBySlug( 'auth-phone-number-placeholder', $languageTagStore ) }
        value={ profile.phoneNumber }
        type="phone"
    />
</div>
