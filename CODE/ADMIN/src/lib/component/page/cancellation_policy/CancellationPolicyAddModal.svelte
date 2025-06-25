<script>
    // -- IMPORTS

    import { toast } from '$lib/toast';
    import CancellationPolicyView from './CancellationPolicyView.svelte';
    import { fetchData } from '$lib/base';
    import { toggleCancellationPolicyModal, isCancellationPolicyLoading, cancellationPolicyArrayStore } from '$store/cancellationPolicyStore';
    import ModalActions from '$component/element/modal/ModalActions.svelte';
    import ModalButton from '$component/element/modal/ModalButton.svelte';
    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalHeader from '$component/element/modal/ModalHeader.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';

    // -- VARIABLES

    let cancellationPolicyArrayCount = ( Array.isArray( $cancellationPolicyArrayStore ) ? $cancellationPolicyArrayStore : [] ).length + 1 ;
    let cancellationPolicy =
        {
            id : '',
            number : cancellationPolicyArrayCount,
            name : '',
            partialRefundMinimumDayCount : 0,
            partialRefundRatio : 0,
            fullRefundMinimumDayCount : 0,
            penaltyDayCount : 0
        };
    let isSubmitting = false;

    // -- FUNCTIONS

    async function handleAddCancellationPolicy(
        )
    {
        isSubmitting = true;

        try
        {
            let result
                = await fetchData(
                    '/api/cancellation-policy/add',
                    {
                        method: 'POST',
                        body: JSON.stringify( { cancellationPolicy } )
                    }
                    );

            let newCancellationPolicy = result.cancellationPolicy[ 0 ];

            cancellationPolicyArrayStore.update(
                ( _cancellationPolicy ) => _cancellationPolicy.concat( newCancellationPolicy )
                );

            toast(
                {
                    text : 'Cancellation policy added successfully',
                    variant : 'success'
                }
                );

                toggleCancellationPolicyModal();
        }
        catch ( error )
        {
            console.error( error );
            toast(
                {
                    text : 'Something went wrong',
                    variant : 'error'
                }
                );
        }
        finally
        {
            isSubmitting = false;
        }
    }
</script>

<ModalRoot isOpen={ $isCancellationPolicyLoading }>
    <ModalHeader
        title="Add Cancellation Policy"
        onClose={ toggleCancellationPolicyModal }
    />

    <ModalContent>
        <CancellationPolicyView
            cancellationPolicy={ cancellationPolicy }
        />
    </ModalContent>

    <ModalActions>
        <ModalButton variant="has-error" on:click={ toggleCancellationPolicyModal }>Cancel</ModalButton>
        <ModalButton on:click={ handleAddCancellationPolicy }>Add</ModalButton>
    </ModalActions>
</ModalRoot>
