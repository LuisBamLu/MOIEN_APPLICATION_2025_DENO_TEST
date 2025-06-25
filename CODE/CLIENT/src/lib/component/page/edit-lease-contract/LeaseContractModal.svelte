<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from "senselogic-gist";
    import ModalHeader from "../../modal/ModalHeader.svelte";
    import ModalRoot from "../../modal/ModalRoot.svelte";
    import { languageTagStore } from "$src/lib/store/languageTagStore";
    import ModalContent from "../../modal/ModalContent.svelte";
    import ModalActions from "../../modal/ModalActions.svelte";
    import ModalButton from "../../modal/ModalButton.svelte";
    import { fetchData } from "$src/lib/base";
    import { profileSignedInStore } from "$src/lib/store/profileStore";
    import { toast } from "$src/lib/toast";

    // -- VARIABLES

    export let isOpen = false;
    export let leaseContract;
    export let leaseSignatoryArray;
    let isSubmitting = false;

    // -- FUNCTIONS

    async function signLeaseContract(
        )
    {
        isSubmitting = true;
        let body = { leaseContract: { ...leaseContract, status: 'signed' } };
        let result
            = await fetchData(
                '/api/update-lease-contract/' + leaseContract.id,
                {
                    method: 'POST',
                    body: JSON.stringify( body ),
                    credentials: 'include'
                }
                );
        isSubmitting = false;

        toast.success( 'Lease contract signed' );

        isOpen = false;
    }
</script>

<ModalRoot bind:isOpen={ isOpen } >
    <ModalHeader
        title={ getLocalizedTextBySlug( 'lease-contract-page-lease-contract-label', $languageTagStore ) }
        onClose={ () => isOpen = false }
    />
    <ModalContent>
        EMBEDDED CONTRACT GOES HERE
    </ModalContent>
    {#if $profileSignedInStore.userId === leaseContract.tenantUserProfileId }
        <ModalActions>
            <ModalButton
                text={ getLocalizedTextBySlug( 'edit-lease-contract-page-sign-lease-contract-label', $languageTagStore ) }
                bind:isLoading={ isSubmitting }
                on:click={ signLeaseContract }
            />
        </ModalActions>
    {/if}
</ModalRoot>
