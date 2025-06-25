<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import CounterInput from '$component/element/CounterInput.svelte';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import PeopleModal from '$component/page/rental-file/PeopleModal.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import SignatoryContainer from '$component/page/edit-lease-contract/SignatoryContainer.svelte';

    // -- VARIABLES

    export let signatoryArray;
    export let leaseContract =
        {
            adultCount: 0,
            childrenCount: 0,
            infantCount: 0
        };
    let signatoryCount = signatoryArray.length ?? 0;
    let isPeopleModalOpen = false;
    $: totalOccupantCount = leaseContract.adultCount + leaseContract.childrenCount + leaseContract.infantCount;

    // -- FUNCTIONS

    function handleSignatoryCountChange(
        )
    {
        if ( signatoryArray.length < signatoryCount )
        {
            signatoryArray.push(
                {
                    monthlyIncome: 3000,
                    employmentStatus: '',
                    hasGuarantor: true
                }
                );
            signatoryArray = signatoryArray;
        }
        else
        {
            signatoryArray.pop();
            signatoryArray = signatoryArray;
        }
    }
</script>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-signatories-label', $languageTagStore ) }
>
    <Accordion
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-number-of-occupants-label', $languageTagStore ) }
        value={ totalOccupantCount }
        bind:isEditing={ isPeopleModalOpen }
    >
        <PeopleModal
            label={ getLocalizedTextBySlug( 'rental-file-page-housing-people-label', $languageTagStore ) }
            bind:leaseContract={ leaseContract }
            bind:isOpen={ isPeopleModalOpen }
        />
    </Accordion>
    <Accordion
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-number-of-signatories-label', $languageTagStore ) }
        value={ signatoryCount }
    >
        <CounterInput
            minCount={ 1 }
            maxCount={ 2 }
            bind:count={ signatoryCount }
            on:change={ handleSignatoryCountChange }
        />
    </Accordion>
    <LabelledSwitch
        label={ getLocalizedTextBySlug( 'rental-file-page-signatory-has-a-guarantor-label', $languageTagStore ) }
        bind:value={ signatoryArray[ 0 ].hasGuarantor }
    />
    {#if signatoryArray.length > 1 }
        <LabelledSwitch
            label={ getLocalizedTextBySlug( 'edit-lease-contract-page-cosignatory-has-a-guarantor-label', $languageTagStore ) }
            bind:value={ signatoryArray[ 1 ].hasGuarantor }
        />
    {/if}

</EditLeaseContractPageSection>
{#each signatoryArray as signatory, index }
    {#if index > 0 }
        <div class="font-size-90 font-weight-700 color-gray-300">
            { getLocalizedTextBySlug( 'edit-lease-contract-page-fill-in-details-of-second-signatory-label', $languageTagStore ) }
        </div>
    {/if}
    <SignatoryContainer bind:signatory={ signatory } />
{/each}
