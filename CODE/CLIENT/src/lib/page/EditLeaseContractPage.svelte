<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData, getTimelessISOStringFromDate } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Error from '$component/element/Error.svelte';
    import Loading from '$component/element/Loading.svelte';
    import PageActions from '$component/page/edit-lease-contract/PageActions.svelte';
    import EditLeaseContractStepOne from '$component/page/edit-lease-contract/EditLeaseContractStepOne.svelte';
    import EditLeaseContractStepTwo from '$component/page/edit-lease-contract/EditLeaseContractStepTwo.svelte';
    import EditLeaseContractStepThree from '$component/page/edit-lease-contract/EditLeaseContractStepThree.svelte';
    import EditLeaseContractStepFour from '$component/page/edit-lease-contract/EditLeaseContractStepFour.svelte';
    import EditLeaseContractStepFive from '$component/page/edit-lease-contract/EditLeaseContractStepFive.svelte';
    import EditLeaseContractStepSix from '$component/page/edit-lease-contract/EditLeaseContractStepSix.svelte';
    import EditLeaseContractPageHeader from '$component/page/edit-lease-contract/EditLeaseContractPageHeader.svelte';
    import EditLeaseContractTenantStep from '$component/page/edit-lease-contract/EditLeaseContractTenantStep.svelte';
    import LeaseContractModal from '../component/page/edit-lease-contract/LeaseContractModal.svelte';

    // -- VARAIBLES

    export let id = null;
    let signatoryTypeArray =
        [
            {
                label: getLocalizedTextBySlug( 'edit-lease-contract-page-sole-signatory-label', $languageTagStore ),
                value: 'sole',
            },
            {
                label: getLocalizedTextBySlug( 'edit-lease-contract-page-two-signatories-label', $languageTagStore ),
                value: 'many'
            },
            {
                label: getLocalizedTextBySlug( 'edit-lease-contract-page-legal-representative-label', $languageTagStore ),
                value: 'representative'
            }
        ];
    let selectedSignatoryType = 'sole';
    let lessorSignatoryArray =
        [
            {
                firstName: '',
                lastName: '',
                countryCode: null,
            }
        ];
    let tenantSignatoryArray = [];
    let leaseDuration = 12;
    let leaseContract =
        {
            startingDate: new Date().toISOString(),
            requiredDocumentTypeIdArray: [],
        };
    let leaseSignatoryArray = [];
    let tenantNoticeMonthCount = 3;
    let lessorNoticeMonthCount = 3;
    let selectedSubscriptionOption = 'no-subscription';
    let selectedPaymentMethod = '';
    let documentArray = [];
    let hasCompanyExtract = false;
    let type = 'tenant';
    let companyExtractForm;
    let errorArray = [];
    let stepValidationFunction = function() { return [] };
    let isLoading = true;
    let isSubmitting = false;
    let activeStep = 1;
    let isLeaseContractModalOpen = false;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/page/edit-lease-contract/' + id, { method: 'POST', credentials: 'include' } );
            leaseContract = result.leaseContract;
            documentArray = result.documentArray;
            hasCompanyExtract = result.hasCompanyExtract;
            tenantSignatoryArray = result.tenantSignatoryArray;
            type = result.type;

            if ( result.lessorSignatoryArray.length )
            {
                lessorSignatoryArray = result.lessorSignatoryArray;

                for ( let signatory of lessorSignatoryArray )
                {
                    if ( signatory.isMandated )
                    {
                        selectedSignatoryType = 'representative';
                    }
                }
            }

            leaseSignatoryArray = [ ...tenantSignatoryArray, ...lessorSignatoryArray ];

            isLoading = false;
        }
        );

    // ~~

    leaseContract.endingDate
        = getTimelessISOStringFromDate(
            new Date(
                new Date( leaseContract.startingDate )
                    .setMonth(
                        new Date( leaseContract.startingDate )
                            .getMonth() + Number( leaseDuration )
                        )
                )
            );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .edit-lease-contract-page
    {
        position: relative;

        margin-bottom: 4rem;
        padding: 0rem 1rem;
        padding-bottom: 6.75rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            margin-bottom: unset;
        }
    }

    .edit-lease-contract-page.wait
    {
        cursor: wait !important;
    }

    .edit-lease-contract-page-content-container
    {
        width: 100%;
        padding-top: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 76.875rem;
        }
    }
</style>

<div class="edit-lease-contract-page" class:wait={ isSubmitting }>
    <EditLeaseContractPageHeader
        activeStep={ activeStep }
        handleBack=
            {
                () =>
                {
                    if ( activeStep > 1 ) activeStep--;
                }
            }
    />
    <div class="edit-lease-contract-page-content-container">
        <div class="edit-lease-contract-page-heading">
            <div class="font-size-150 font-weight-600 color-gray-100">
                { getLocalizedTextBySlug( 'edit-lease-contract-page-title', $languageTagStore ) }
            </div>
        </div>
        {#if isLoading }
            <Loading />
        {:else if type === 'lessor' }
            {#if activeStep === 1 }
                <EditLeaseContractStepOne
                    signatoryTypeArray={ signatoryTypeArray }
                    bind:selectedSignatoryType={ selectedSignatoryType }
                    bind:signatoryArray={ lessorSignatoryArray }
                    bind:companyExtractForm={ companyExtractForm }
                    bind:leaseContract={ leaseContract }
                    bind:hasCompanyExtract={ hasCompanyExtract }
                    bind:validationFunction={ stepValidationFunction }
                />
            {:else if activeStep === 2 }
                <EditLeaseContractStepTwo
                    bind:leaseContract={ leaseContract }
                    bind:leaseDuration={ leaseDuration }
                    bind:tenantNoticeMonthCount={ tenantNoticeMonthCount }
                    bind:lessorNoticeMonthCount={ lessorNoticeMonthCount }
                    bind:validationFunction={ stepValidationFunction }
                />
            {:else if activeStep === 3 }
                <EditLeaseContractStepThree
                    leaseContract={ leaseContract }
                    bind:selectedSubscriptionOption={ selectedSubscriptionOption }
                    bind:selectedPaymentMethod={ selectedPaymentMethod }
                />
            {:else if activeStep === 4 }
                <EditLeaseContractStepFour bind:leaseContract={ leaseContract } />
            {:else if activeStep === 5 }
                <EditLeaseContractStepFive
                    bind:tenantSignatoryArray={ tenantSignatoryArray }
                    bind:leaseContract={ leaseContract }
                />
            {:else if activeStep === 6 }
                <EditLeaseContractStepSix
                    bind:leaseContract={ leaseContract }
                />
            {/if}
        {:else if type === 'tenant' }
            <EditLeaseContractTenantStep
                bind:signatoryArray={ tenantSignatoryArray }
                bind:leaseContract={ leaseContract }
            />
        {/if}
    </div>
    <PageActions
        stepValidationFunction={ stepValidationFunction }
        type={ type }
        bind:errorArray={ errorArray }
        bind:activeStep={ activeStep }
        bind:lessorSignatoryArray={ lessorSignatoryArray }
        bind:tenantSignatoryArray={ tenantSignatoryArray }
        bind:leaseContract={ leaseContract }
        bind:selectedSignatoryType={ selectedSignatoryType }
        bind:hasCompanyExtract={ hasCompanyExtract }
        bind:companyExtractForm={ companyExtractForm }
        bind:isSubmitting={ isSubmitting }
        bind:isLeaseContractModalOpen={ isLeaseContractModalOpen }
    />
</div>
<LeaseContractModal
    bind:leaseContract={ leaseContract }
    leaseSignatoryArray={ leaseSignatoryArray }
    bind:isOpen={ isLeaseContractModalOpen }
/>
