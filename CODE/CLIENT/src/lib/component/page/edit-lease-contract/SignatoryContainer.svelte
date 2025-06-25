<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import LabelledInput from '$component/element/LabelledInput.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import CountryInputAccordion from '$component/page/edit-lease-contract/CountryInputAccordion.svelte';
    import CityInputAccordion from '$component/page/edit-lease-contract/CityInputAccordion.svelte';

    // -- VARIABLES

    export let signatory;
    let signatoryCountryName = '';
    let signatoryPostalCode;
    let city = {};

    // -- FUNCTIONS

    function handleCityChange(
        )
    {
        if ( Object.keys( city ).length && city.countryCode !== signatory.countryCode )
        {
            signatory.countryCode = city.countryCode;
        }
    }

    // -- STATEMENTS

    $:
    {
        city;
        handleCityChange()
    }
</script>

<EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'personal-information-page-title', $languageTagStore ) } >
    <div class="input-group-container">
        <LabelledInput
            variant=""
            type="text"
            label={ getLocalizedTextBySlug( 'personal-information-last-name', $languageTagStore ) }
            bind:value={ signatory.lastName }
        />
        <LabelledInput
            variant=""
            type="text"
            label={ getLocalizedTextBySlug( 'personal-information-first-name', $languageTagStore ) }
            bind:value={ signatory.firstName }
        />
        <LabelledInput
            variant=""
            type="date"
            label={ getLocalizedTextBySlug( 'personal-information-date-of-birth', $languageTagStore ) }
            bind:value={ signatory.birthDate }
        />
        <CountryInputAccordion
            label={ getLocalizedTextBySlug( 'edit-lease-contract-page-nationality-label', $languageTagStore ) }
            bind:countryCode={ signatory.countryCode }
            bind:countryName={ signatoryCountryName }
        />
    </div>
</EditLeaseContractPageSection>
{#if !signatory.isMandated }
    <EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'personal-information-address', $languageTagStore ) } >
        <div class="input-group-container">
            <CountryInputAccordion
                label={ getLocalizedTextBySlug( 'personal-information-country', $languageTagStore ) }
                bind:countryCode={ signatory.cityCode }
                bind:countryName={ signatoryCountryName }
            />
            <LabelledInput
                variant=""
                type="text"
                label={ getLocalizedTextBySlug( 'edit-lease-contract-page-postal-address-label', $languageTagStore ) }
                bind:value={ signatory.addressLine1 }
            />
            <LabelledInput
                variant=""
                type="text"
                label={ getLocalizedTextBySlug( 'personal-information-zip', $languageTagStore ) }
                bind:value={ signatoryPostalCode }
            />
            <CityInputAccordion
                bind:city={ city }
                bind:cityId={ signatory.cityCode }
                bind:cityName={ signatory.cityName }
            />
        </div>
    </EditLeaseContractPageSection>
{/if}
