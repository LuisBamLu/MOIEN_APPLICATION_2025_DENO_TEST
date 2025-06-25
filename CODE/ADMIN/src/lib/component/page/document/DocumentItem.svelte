<script>
    // -- IMPORTS

    import { clickOutside, fetchData } from '$lib/base';
    import { faIdCard } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    import TableRow from '$component/element/table/TableRow.svelte';
    import TableCell from '$component/element/table/TableCell.svelte';
    import DocumentView from './DocumentView.svelte';

    // -- VARIABLES

    /** @type {{document?: any}} */
    let { document = $bindable({}) } = $props();
    let showModal = $state(false);

    // -- FUNCTIONS

    function deleteDocument(
        )
    {
        let formData = new FormData();

        formData.append( 'type', 'deleteDocument' );

        formData.append( 'documentId', document.id );

        fetchData( '/api/document', { method: 'POST', body: formData } )
            .then( ( response ) => response.json() )
            .then( ( response ) =>
            {
                if ( response.status === 'success' )
                {
                    document.dispatchEvent( new CustomEvent( 'deleteDocument', { detail: document.id } ) );
                }
            }
            );
    }

    // ~~

    function handleValidationStatusChange(
        )
    {
        fetchData(
            '/api/document/update',
            {
                method: 'POST',
                body: JSON.stringify(
                    {
                        document: document,
                    }
                    ),
                headers: { 'Content-Type': 'application/json' }
            }
            )
            .then( ( response ) =>
            {
                if ( response.status === 'success' )
                {
                    document.dispatchEvent( new CustomEvent( 'updateDocument', { detail: document.id } ) );
                }

                document.updateTimestamp = new Date( Date.now() ).toLocaleString();
            }
            );
    }

    // ~~

    let document.creationTimestamp = $derived(new Date( document.creationTimestamp ).toLocaleString());
    let document.updateTimestamp = $derived(new Date( document.updateTimestamp ).toLocaleString());
</script>

<style>
    select
    {
        background-color: transparent;
    }
</style>

<TableRow>
    <TableCell>
        <button
            style="cursor: pointer;"
            type="button"
            onclick={() => showModal = true}
            use:clickOutside
            onclickOutside={() => showModal = false}
        >
            <Fa icon={ faIdCard }/>
            {#if showModal }
                <DocumentView bind:isOpen={ showModal } doc={ document }/>
            {/if}
        </button>
    </TableCell>
    <TableCell>
        { document.name }
    </TableCell>
    <TableCell>
        { document.userName }
    </TableCell>
    <TableCell>
        { document.languageTag + ' ' + document.countryIdArray[ 0 ] }
    </TableCell>
    <TableCell>
        <select
            id="validationStatusId"
            class="document-validation-status-select"
            bind:value={ document.validationStatusId }
            onchange={() => handleValidationStatusChange()}
        >
            <option value={ 'pending' }>Under verification</option>
            <option value={ 'accepted' }>Accepted</option>
            <option value={ 'declined' }>Declined</option>
        </select>
    </TableCell>
    <TableCell>
        { document.creationTimestamp }
    </TableCell>
    <TableCell>
        { document.updateTimestamp }
    </TableCell>
</TableRow>
