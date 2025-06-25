<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import GenericTableForm from '$component/element/GenericTableForm.svelte';

    // -- VARAIBLES

    let cancellationPolicyArray = $state([]);
    let isLoading = $state(true);

    // -- FUNCTIONS

    async function handleSubmit(
        event,
        cancellationPolicyId
        )
    {
        let formData = new FormData( event.target );
        let fieldNameSet = new Set( Object.keys( cancellationPolicyArray[ 0 ] ) );
        let cancellationPolicy = {};

        for ( let [ fieldName, fieldValue ] of formData.entries() )
        {
            if ( fieldNameSet.has( fieldName ) )
            {
                cancellationPolicy[ fieldName ] = fieldValue;
            }
        }

        if ( cancellationPolicyId === Object.getPrototypeOf( '' ) )
        {
            let result
                = await fetchData(
                    '/api/cancellation-policy/add',
                    {
                        method: 'POST',
                        body: JSON.stringify( { cancellationPolicy } )
                    }
                    );

            cancellationPolicyArray[ cancellationPolicyArray.length - 1 ] = result.cancellationPolicy;

            return;
        }

        let result
            = await fetchData(
                '/admin/api/cancellation-policy/' + cancellationPolicyId + '/set',
                {
                    method: 'POST',
                    body: JSON.stringify( { cancellationPolicy } )
                }
                );

        let cancellationPolicyIndex
            = cancellationPolicyArray.findIndex( cancellationPolicy => cancellationPolicy.id === cancellationPolicyId );
        cancellationPolicyArray[ cancellationPolicyIndex ] = result.cancellationPolicy;
    }

    // ~~

    async function handleDelete(
        cancellationPolicyId
        )
    {
        if ( cancellationPolicyId === Object.getPrototypeOf( '' ) )
        {
            cancellationPolicyArray.pop();
            cancellationPolicyArray = cancellationPolicyArray;

            return;
        }

        let result
            = await fetchData(
                '/api/cancellation-policy/delete/' + cancellationPolicyId,
                {
                    method: 'POST'
                }
                );

        if ( result )
        {
            cancellationPolicyArray
                = cancellationPolicyArray.filter( ( cancellationPolicy ) => cancellationPolicy.id !== cancellationPolicyId );
        }
    }

    // ~~

    function handleAddCancellationPolicy()
    {
        let newCancellationPolicy = {};

        for ( let [ fieldName, fieldValue ] of Object.entries( cancellationPolicyArray[ 0 ] ) )
        {
            newCancellationPolicy[ fieldName ] = Object.getPrototypeOf( fieldValue );
        }

        cancellationPolicyArray.push( newCancellationPolicy );
        cancellationPolicyArray = cancellationPolicyArray;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/cancellation-policy', { method: 'POST', credentials: 'include' } );
            cancellationPolicyArray = result.cancellationPolicyArray ?? [];
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .page-container
    {
        padding-top: 4.5rem;

        display: flex;
        gap: 1.5rem;
    }

    .cancellation-policy-manager-page
    {
        width: 100%;
        padding-top: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

<div class="page-container">
    <Sidebar />
    <div class="cancellation-policy-manager-page" >
        <div class="font-size-100 font-weight-700">
            Cancellation Policy Page
        </div>
        {#if isLoading }
            loading...
        {:else}
            <div class="display-flex flex-direction-column gap-100 padding-100 margin-top-400">
                {#each cancellationPolicyArray as cancellationPolicy }
                    <GenericTableForm
                        row={ cancellationPolicy }
                        handleDelete={ handleDelete }
                        on:submit={ ( event ) => handleSubmit( event, cancellationPolicy.id ) }
                    />
                {/each}
                <button onclick={handleAddCancellationPolicy}>Add new</button>
            </div>
        {/if}
    </div>
</div>
