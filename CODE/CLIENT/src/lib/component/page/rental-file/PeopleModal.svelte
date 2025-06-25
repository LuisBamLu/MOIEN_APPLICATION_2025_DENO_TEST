<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import CounterInput from '$component/element/CounterInput.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';

    // -- VARIABLES

    export let isOpen = false;
    export let leaseContract
    export let label = '';
    let newAdultCount = Number( leaseContract.adultCount );
    let newChildrenCount = Number( leaseContract.childrenCount );
    let newInfantCount = Number( leaseContract.infantCount );
    let isSubmitting = false;

    // -- FUNCTIONS

    async function handleSave(
        )
    {
        leaseContract.adultCount = newAdultCount;
        leaseContract.childrenCount = newChildrenCount;
        leaseContract.infantCount = newInfantCount;
        isSubmitting = true;

        let result
            = await fetchData(
                '/api/update-lease-contract/' + leaseContract.id,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                           leaseContract: leaseContract
                        }
                        )
                }
                );

        leaseContract = result.leaseContract;
        isSubmitting = false;
        isOpen = false;
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .labelled-counter-container
    {
        width: 100%;

        display: flex;
        gap: 0.75rem;
        justify-content: space-between;
        align-items: center;
    }
</style>

<ModalRoot bind:isOpen={ isOpen }>
    <ModalHeader
        title={ label }
        onClose={ () => isOpen = false }
    />
    <ModalContent wait={ isSubmitting } >
        <div class="labelled-counter-container">
            <div class="text-container">
                <div class="font-size-90 font-weight-700 color-gray-100">
                   { getLocalizedTextBySlug( 'guest-adult-label', $languageTagStore ) }
                </div>
                <div class="font-size-75 font-weight-500 color-gray-300">
                   { getLocalizedTextBySlug( 'guest-adult-helper-label', $languageTagStore ) }
                </div>
            </div>
            <CounterInput
                minCount={ 0 }
                bind:count={ newAdultCount }
            />
        </div>
        <div class="labelled-counter-container">
            <div class="text-container">
                <div class="font-size-90 font-weight-700 color-gray-100">
                   { getLocalizedTextBySlug( 'guest-children-label', $languageTagStore ) }
                </div>
                <div class="font-size-75 font-weight-500 color-gray-300">
                   { getLocalizedTextBySlug( 'guest-children-helper-label', $languageTagStore ) }
                </div>
            </div>
            <CounterInput
                minCount={ 0 }
                bind:count={ newChildrenCount }
            />
        </div>
        <div class="labelled-counter-container">
            <div class="text-container">
                <div class="font-size-90 font-weight-700 color-gray-100">
                   { getLocalizedTextBySlug( 'guest-infant-label', $languageTagStore ) }
                </div>
                <div class="font-size-75 font-weight-500 color-gray-300">
                   { getLocalizedTextBySlug( 'guest-infant-helper-label', $languageTagStore ) }
                </div>
            </div>
            <CounterInput
                minCount={ 0 }
                bind:count={ newInfantCount }
            />
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton
            disabled={ isSubmitting }
            variant="light"
            text={ getLocalizedTextBySlug( 'onboarding-skip-label', $languageTagStore ) }
            on:click={ () => isOpen = false }
        />
        <ModalButton
            isLoading={ isSubmitting }
            variant="contained"
            text={ getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
            on:click={ handleSave }
       />
    </ModalActions>
</ModalRoot>
