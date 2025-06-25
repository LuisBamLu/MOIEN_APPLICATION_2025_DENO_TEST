<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getJsonText, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData, hostUrl } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import LabelledInput from '$component/element/LabelledInput.svelte';
    import LabelledSelect from '$component/element/LabelledSelect.svelte';
    import Loading from '$component/element/Loading.svelte';
    import FileInput from '$src/lib/component/backoffice/FileInput.svelte';
    import CountryInputAccordion from '$component/page/edit-lease-contract/CountryInputAccordion.svelte';
    import CityInputAccordion from '$component/page/edit-lease-contract/CityInputAccordion.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let signatory;
    export let leaseContract;
    export let companyExtractForm;
    export let hasCompanyExtract = false;
    let fileArray = [];
    let errorArray = [];
    let companyCountryName = '';
    let companyPostalCode = '';
    let companyTypeArray = [];
    let city = {};
    let isLoading = true;

    // -- FUNCTIONS

    function handleCityChange(
        )
    {
        if ( Object.keys( city ).length && city.countryCode !== signatory.countryCode )
        {
            signatory.countryCode = city.countryCode;
        }
    }

    // ~~

    async function handleSubmit(
        )
    {
        let documentIdArray = [];

        let document =
            {
                typeId: 'company-extract',
                validationStatusId: 'pending',
                name: signatory.companyName + 'Company Extract',
                countryCode: signatory.countryCode,
            }

        let response
            = await fetch(
                hostUrl + '/api/document/new',
                {
                    method: 'POST',
                    body: getJsonText( { documentData: { ...document, filePath: fileArray[ 0 ] } } ),
                    credentials: 'include'
                }
                );

        if ( response.ok )
        {
            let result = await response.json();

            if ( !result.error )
            {
                let documentId = result.document.id;
                documentIdArray.push( documentId );

                leaseContract.documentIdArray = [ ...leaseContract.documentIdArray ?? [], ...documentIdArray ];
            }
        }
        else
        {
            let result = await response.json();
            errorArray = [ ...errorArray, result.error ];

            for ( let error of errorArray )
            {
                toast.error( error );
            }

            return false;
        }
    }

    // -- STATEMENTS

    $:
    {
        city;
        handleCityChange()
    }

    // ~~

    onMount(
        async () =>
        {
            let result
                = await fetchData(
                    '/api/company-type',
                    {
                        method: 'POST',
                    }
                    );

            companyTypeArray = result.companyTypeArray;
            isLoading = false
        }
        );
</script>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-mandated-company-label', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'edit-lease-contract-page-company-extract-required-label', $languageTagStore ) }
>
    {#if !hasCompanyExtract }
        <form
            bind:this={ companyExtractForm }
            on:submit|preventDefault={ handleSubmit }
        >
            <FileInput
                fileInputName="file-path"
                acceptedType="image/*,application/pdf"
                maxFileCount={ 1 }
                bind:fileArray={ fileArray }
            />
        </form>
    {/if}
    <LabelledInput
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-company-name-label', $languageTagStore ) }
        placeholder={ getLocalizedTextBySlug( 'edit-lease-contract-page-company-name-placeholder', $languageTagStore ) }
        type="text"
        variant=""
        bind:value={ signatory.companyName }
    />
    <LabelledSelect
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-company-type-label', $languageTagStore ) }
        variant=""
        bind:value={ signatory.companyTypeId }
    >
        {#if isLoading }
            <Loading />
        {:else}
            {#each companyTypeArray as companyType }
                <option value={ companyType.id } >
                    { getLocalizedText( companyType.name, $languageTagStore ) }
                </option>
            {/each}
        {/if}
    </LabelledSelect>
</EditLeaseContractPageSection>
<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-company-address-label', $languageTagStore ) }
>
    <CountryInputAccordion
        label={ getLocalizedTextBySlug( 'personal-information-country', $languageTagStore ) }
        bind:countryCode={ signatory.countryCode }
        bind:countryName={ companyCountryName }
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
        bind:value={ companyPostalCode }
    />
    <CityInputAccordion
        bind:city={ city }
        bind:cityId={ signatory.cityCode }
        bind:cityName={ signatory.cityName }
    />
</EditLeaseContractPageSection>
<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-trade-and-companies-register-number-label', $languageTagStore ) }
>
    <LabelledInput
        variant=""
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-registration-number-label', $languageTagStore ) }
        placeholder='0000000000'
        bind:value={ signatory.companyRegistrationNumber }
    />
</EditLeaseContractPageSection>
