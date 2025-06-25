<script>
    // -- IMRORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import RadioCardGroup from '$component/element/RadioCardGroup.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import SignatoryContainer from '$component/page/edit-lease-contract/SignatoryContainer.svelte';
    import CompanyContainer from '$component/page/edit-lease-contract/CompanyContainer.svelte';

    // -- VARIABLES

    export let signatoryTypeArray;
    export let selectedSignatoryType;
    export let signatoryArray;
    export let companyExtractForm;
    export let leaseContract;
    export let hasCompanyExtract;
    export const validationFunction = validateStep

    // -- FUNCTIONS

    function handleSignatoryTypeChange(
        )
    {
        if ( selectedSignatoryType !== 'many' )
        {
            if ( signatoryArray.length > 1 )
            {
                signatoryArray = signatoryArray.slice( 0, 1 );
            }
        }
        else
        {
            signatoryArray.push( {} );
            signatoryArray = signatoryArray;
        }

        if ( selectedSignatoryType === 'representative' )
        {
            signatoryArray[ 0 ].isMandated = true;
        }
        else
        {
            signatoryArray[ 0 ].isMandated = false;
        }
    }

    // ~~

    function validateStep(
        )
    {
        let errorArray = [];

        for ( let signatory of signatoryArray )
        {
            if ( !signatory.firstName || !signatory.lastName )
            {
                errorArray.push( 'edit-lease-contract-page-fill-in-signatory-name-error' );
            }

            if ( !signatory.birthDate )
            {
                errorArray.push( 'edit-lease-contract-page-fill-in-signatory-name-error' );
            }

            if ( !signatory.addressLine1 || !signatory.countryCode || !signatory.cityCode )
            {
                errorArray.push( 'edit-lease-contract-page-fill-in-signatory-address-error' );
            }

            if ( signatory.isMandated && ( !signatory.companyName || !signatory.companyTypeId || !signatory.companyRegistrationNumber ) )
            {
                errorArray.push( 'edit-lease-contract-page-fill-in-company-information-error' );
            }
        }

        return errorArray;
    }

    // -- STATEMENTS

    $:
    {
        selectedSignatoryType;
        handleSignatoryTypeChange()
    }
</script>

<EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'edit-lease-contract-page-your-situation-label', $languageTagStore ) } >
    <RadioCardGroup
        optionArray={ signatoryTypeArray }
        bind:selected={ selectedSignatoryType }
    />
</EditLeaseContractPageSection>
{#each signatoryArray as signatory, index }
    {#if index > 0 }
        <div class="font-size-90 font-weight-700 color-gray-300">
            { getLocalizedTextBySlug( 'edit-lease-contract-page-fill-in-details-of-second-signatory-label', $languageTagStore ) }
        </div>
    {/if}
    <SignatoryContainer bind:signatory={ signatory } />
    {#if selectedSignatoryType === 'representative' }
        <CompanyContainer
            bind:hasCompanyExtract={ hasCompanyExtract }
            bind:signatory={ signatory }
            bind:leaseContract={ leaseContract }
            bind:companyExtractForm={ companyExtractForm }
        />
    {/if}
{/each}
