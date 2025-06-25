<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import LabelledInput from '$component/element/LabelledInput.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';

    // -- VARIABLES

    export let leaseContract = {};
    export let tenantSignatoryArray = [ { hasDeposit: false } ];
    let noGuarantee;
    let hasGuarantee = leaseContract.guaranteeAmount !== null;
    let guarantee = Math.floor( ( leaseContract.guaranteeAmount ?? 0 ) / leaseContract.monthlyRent );
    let tenantGuarantee = 0;
    let cotenantGuarantee = 0;

    // -- STATEMENTS

    tenantSignatoryArray[ 0 ].hasDeposit = tenantSignatoryArray[ 0 ]?.hasDeposit ?? false;
    leaseContract.hasBankGuarantee = leaseContract.hasBankGuarantee ?? false;

    // ~~

    onMount(
        () =>
        {
            if ( tenantSignatoryArray[ 0 ]?.hasDeposit )
            {
                tenantGuarantee = tenantSignatoryArray[ 0 ].depositAmount / leaseContract.monthlyRent;
            }

            if ( tenantSignatoryArray.length > 1 )
            {
                cotenantGuarantee = tenantSignatoryArray[ 1 ].depositAmount / leaseContract.monthlyRent;
            }
        }
        );
</script>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-what-guarantees-for-lease-label', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'edit-lease-contract-page-what-guarantees-for-lease-helper', $languageTagStore ) }
>
    <LabelledSwitch
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-security-deposit-label', $languageTagStore ) }
        description={ getLocalizedTextBySlug( 'edit-lease-contract-page-security-deposit-helper', $languageTagStore ) }
        borderBottom={ hasGuarantee }
        bind:value={ hasGuarantee }
    />
    {#if hasGuarantee }
        <LabelledInput
            label={ getLocalizedTextBySlug( 'edit-lease-contract-page-security-deposit-amount-label', $languageTagStore ) }
            type='number'
            variant=""
            min={ 1 }
            onChange={ () => leaseContract.guaranteeAmount = guarantee * leaseContract.monthlyRent }
            bind:value={ guarantee }
        />
    {/if}
    <LabelledSwitch
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-bank-guarantee-label', $languageTagStore ) }
        description={ getLocalizedTextBySlug( 'edit-lease-contract-page-bank-guarantee-helper', $languageTagStore ) }
        borderBottom={ true }
        bind:value={ leaseContract.hasBankGuarantee }
    />
    <LabelledSwitch
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-guarantee-label', $languageTagStore ) }
        description={ getLocalizedTextBySlug( 'edit-lease-contract-page-guarantee-helper', $languageTagStore ) }
        borderBottom={ !tenantSignatoryArray[ 0 ].hasDeposit }
        bind:value={ tenantSignatoryArray[ 0 ].hasDeposit }
    />
    {#if tenantSignatoryArray[ 0 ].hasDeposit }
        <LabelledInput
            label={ getLocalizedTextBySlug( 'edit-lease-contract-page-tenant-guarantee-label', $languageTagStore ) }
            suffix={ getLocalizedTextBySlug( 'edit-lease-contract-page-months-gross-rent-label', $languageTagStore ) }
            type='number'
            variant=""
            min={ 1 }
            max={ 15 }
            onChange={ () => tenantSignatoryArray[ 0 ].depositAmount = leaseContract.monthlyRent * tenantGuarantee }
            bind:value={ tenantGuarantee }
        />
        {#if tenantSignatoryArray.length > 1 }
            <LabelledInput
                label={ getLocalizedTextBySlug( 'edit-lease-contract-page-cotenant-guarantee-label', $languageTagStore ) }
                suffix={ getLocalizedTextBySlug( 'edit-lease-contract-page-months-gross-rent-label', $languageTagStore ) }
                type='number'
                variant=""
                min={ 1 }
                max={ 15 }
                onChange={ () => tenantSignatoryArray[ 1 ].depositAmount = leaseContract.monthlyRent * tenantGuarantee }
                bind:value={ cotenantGuarantee }
            />
        {/if}
    {/if}
    <LabelledSwitch
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-no-guarantee-label', $languageTagStore ) }
        description={ getLocalizedTextBySlug( 'edit-lease-contract-page-no-guarantee-helper', $languageTagStore ) }
        onChange=
            {
                () =>
                {
                    if ( noGuarantee )
                    {
                        tenantSignatoryArray[ 0 ].hasDeposit = false;
                        leaseContract.hasBankGuarantee = false;
                    }
                }
            }
        bind:value={ noGuarantee }
    />
</EditLeaseContractPageSection>
