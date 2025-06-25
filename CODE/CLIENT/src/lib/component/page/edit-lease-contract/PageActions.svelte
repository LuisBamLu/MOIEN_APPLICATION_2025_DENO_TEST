<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let activeStep = 1;
    export let lessorSignatoryArray;
    export let tenantSignatoryArray;
    export let leaseContract;
    export let selectedSignatoryType;
    export let isSubmitting = false
    export let hasCompanyExtract = false;
    export let companyExtractForm;
    export let stepValidationFunction;
    export let errorArray = [];
    export let type;
    export let isLeaseContractModalOpen;

    // -- FUNCTIONS

    async function handleSubmit(
        )
    {
        errorArray = stepValidationFunction();

        if ( errorArray.length )
        {
            for ( let error of errorArray )
            {
                toast.error( error );
            }

            return;
        }

        if ( type === 'lessor' && activeStep < 6 )
        {
            if ( activeStep === 1 && selectedSignatoryType === 'representative' && !hasCompanyExtract )
            {
                isSubmitting = true;
                await companyExtractForm.requestSubmit();
                isSubmitting = false;
            }

            ++activeStep;
        }
        else
        {
            isSubmitting = true;

            let body = { leaseContract: { ...leaseContract, status: 'requested' } };

            if ( type === 'lessor' )
            {
                body.signatoryArray = lessorSignatoryArray;
                body.otherSignatoryArray = tenantSignatoryArray;
            }
            else
            {
                body.signatoryArray = tenantSignatoryArray;
            }

            let result
                = await fetchData(
                    '/api/update-lease-contract/' + leaseContract.id,
                    {
                        method: 'POST',
                        body: JSON.stringify( body ),
                        credentials: 'include'
                    }
                    );
            leaseContract = result.leaseContract;
            isLeaseContractModalOpen = true;
            isSubmitting = false;
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .page-actions
    {
        position: fixed;
        bottom: 4rem;

        width: 100%;
        border-top: 2px solid lightGrayBorderColor;
        padding: 1rem;

        display: flex;
        gap: 3rem;
        justify-content: center;

        background-color: grayColor900;

        +media( desktop )
        {
            bottom: 0;
        }
    }
</style>

<div class="page-actions">
    <ModalButton
        variant="light"
        text={ getLocalizedTextBySlug( 'cancel-label', $languageTagStore ) }
        fullWidth={ false }
    />
    <ModalButton
        variant="contained"
        text=
            {
                activeStep === 6 || type !== 'lessor'
                ? getLocalizedTextBySlug( 'edit-lease-contract-page-generate-lease-label', $languageTagStore )
                : getLocalizedTextBySlug( 'onboarding-next-label', $languageTagStore )
            }
        fullWidth={ false }
        isLoading={ isSubmitting }
        on:click={ handleSubmit }
    />
</div>
