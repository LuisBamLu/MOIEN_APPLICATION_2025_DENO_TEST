<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import PersonalDetailInput from './PersonalDetailInput.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import LabelledInput from '$component/element/LabelledInput.svelte';
    import { genderArrayStore, genderByIdMapStore } from '$store/genderStore';
    import LabelledSelect from '$component/element/LabelledSelect.svelte';
    import PhoneNumberInputs from './PhoneNumberInputs.svelte';

    // -- VARIABLES

    export let profile;
    let minimumAllowedBirthDate = new Date();

    // -- STATEMENTS

    minimumAllowedBirthDate.setFullYear( minimumAllowedBirthDate.getFullYear() - 13 );
</script>

<div class="font-size-100 font-weight-700 color-black">
    { getLocalizedTextBySlug( 'personal-information-page-title', $languageTagStore ) }
</div>
<PersonalDetailInput
    label={ getLocalizedTextBySlug( 'personal-information-legal-name', $languageTagStore ) }
    initialValue={ profile.legalName ?? profile.firstName + ' ' + profile.lastName }
    editable={ true }
    helper={ getLocalizedTextBySlug( 'personal-information-legal-name-helper', $languageTagStore ) }
>
    <LabelledInput
        label={ getLocalizedTextBySlug( 'personal-information-first-name', $languageTagStore ) }
        name="first-name"
        placeholder={ getLocalizedTextBySlug( 'personal-information-first-name', $languageTagStore ) }
        value={ profile.firstName }
        maxlength="50"
        required
    />
    <LabelledInput
        label={ getLocalizedTextBySlug( 'personal-information-last-name', $languageTagStore ) }
        name="last-name"
        placeholder={ getLocalizedTextBySlug( 'personal-information-last-name', $languageTagStore ) }
        value={ profile.lastName }
        maxlength="50"
        required
    />
</PersonalDetailInput>
<PersonalDetailInput
    label={ getLocalizedTextBySlug( 'personal-information-email-address', $languageTagStore ) }
    initialValue={ profile.email }
    helper={ getLocalizedTextBySlug( 'personal-information-email-address-helper', $languageTagStore ) }
    editable={ true }
>
    <LabelledInput
        label={ getLocalizedTextBySlug( 'personal-information-email', $languageTagStore ) }
        placeholder={ getLocalizedTextBySlug( 'personal-information-email', $languageTagStore ) }
        name="email"
        type="email"
        value={ profile.email }
        required
    />
</PersonalDetailInput>
<PersonalDetailInput
    label={ getLocalizedTextBySlug( 'gender-label', $languageTagStore ) }
    initialValue=
        {
            profile.genderId
                ? getLocalizedText( $genderByIdMapStore[profile.genderId ].name, $languageTagStore )
                : ''
        }
    editable={ true }
>
    <LabelledSelect
        name="gender-id"
        label={ getLocalizedTextBySlug( 'gender-label' ) }
        value={ profile.genderId }
        variant="contained"
    >
       {#each $genderArrayStore as gender }
            <option value={ gender.id }>
                { getLocalizedText( gender.name, $languageTagStore ) }
            </option>
       {/each}
    </LabelledSelect>
</PersonalDetailInput>
<PersonalDetailInput
    label={ getLocalizedTextBySlug( 'auth-phone-number-placeholder', $languageTagStore ) }
    initialValue=
        "
            { profile.phonePrefix ? profile.phonePrefix : '' }
            { profile.phoneNumber ? profile.phoneNumber : '' }
        "
    editable={ true }
    helper={ getLocalizedTextBySlug( 'personal-information-email-address-helper', $languageTagStore ) }
>
    <PhoneNumberInputs profile={ profile }/>
</PersonalDetailInput>
<PersonalDetailInput
    label={ getLocalizedTextBySlug( 'personal-information-date-of-birth', $languageTagStore ) }
    initialValue={ profile.birthDate }
    editable={ true }
    validationVariant="birth-date"
>
    <LabelledInput
        label={ getLocalizedTextBySlug( 'personal-information-date-of-birth', $languageTagStore ) }
        placeholder={ getLocalizedTextBySlug( 'personal-information-date-of-birth', $languageTagStore ) }
        name="birthDate"
        type="date"
        min="1900-01-01"
        max={ minimumAllowedBirthDate.toISOString().split( 'T' )[ 0 ] }
        value={ profile.birthDate }
        onChange={ ( event ) => profile.birthDate = event.target.value }
    />
</PersonalDetailInput>
