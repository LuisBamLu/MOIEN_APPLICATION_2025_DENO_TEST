<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { slide } from 'svelte/transition';
    import CancellationPolicyView from './CancellationPolicyView.svelte';
    import TableCell from '$component/element/table/TableCell.svelte';
    import TableRow from '$component/element/table/TableRow.svelte';
    import IconButton from '$component/element/IconButton.svelte';
    import { cancellationPolicyArrayStore, isCancellationPolicyLoading } from '$store/cancellationPolicyStore';
    import { toast } from '$lib/toast';
    import { fetchData } from '$lib/base';

    // -- VARIABLES

    /** @type {{cancellationPolicy: any, isOpen?: boolean}} */
    let { cancellationPolicy, isOpen = false } = $props();

    // -- FUNCTIONS

    async function handleDeleteCancellationPolicy(
        )
    {
        if ( confirm( 'Are you sure you want to delete this cancellation policy?' ) )
        {
            isCancellationPolicyLoading.set( true );

            try
            {
                let result
                    = await fetchData(
                        '/api/cancellation-policy/delete/' + cancellationPolicy.id,
                        {
                            method: 'POST'
                        }
                        );

                cancellationPolicyArrayStore.update(
                    ( cancellationPolicyArray ) =>
                    {
                        return cancellationPolicyArray.filter(
                            ( _cancellationPolicy ) => _cancellationPolicy.id !== cancellationPolicy.id
                            );
                    }
                    );

                toast(
                    {
                        text : 'Cancellation policy deleted',
                        variant : 'success'
                    }
                    );
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
                isCancellationPolicyLoading.set( false );
            }
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES
</style>

<TableRow on:click>
    <TableCell>{ getLocalizedText( cancellationPolicy.name, $languageTagStore ) }</TableCell>
    <TableCell>{ cancellationPolicy.number }</TableCell>
    <TableCell>{ cancellationPolicy.partialRefundMinimumDayCount }</TableCell>
    <TableCell>{ cancellationPolicy.partialRefundRatio }</TableCell>
    <TableCell>{ cancellationPolicy.fullRefundMinimumDayCount }</TableCell>
    <TableCell>{ cancellationPolicy.penaltyDayCount }</TableCell>
    <TableCell>
        <IconButton on:click={ handleDeleteCancellationPolicy }>
            <div class="red-500-delete-icon size-150"></div>
        </IconButton>
    </TableCell>
</TableRow>
{#if isOpen }
    <tr transition:slide>
        <td colspan="5" class="padding-100">
            <CancellationPolicyView cancellationPolicy={ cancellationPolicy } isOpen={ isOpen }/>
        </td>
    </tr>
{/if}
