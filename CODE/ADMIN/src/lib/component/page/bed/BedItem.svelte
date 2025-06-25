<script>
    // IMPORTS

    import { fetchData } from '$lib/base';
    import { getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { bedTypeArrayStore } from '$store/bedTypeArrayStore';
    import TableRow from '$component/element/table/TableRow.svelte';
    import TableCell from '$component/element/table/TableCell.svelte';

    // VARIABLES

    /** @type {{bed?: any}} */
    let { bed = $bindable({}) } = $props();

    // FUNCTIONS

    function deleteBed()
    {
        let formData = new FormData();

        formData.append( 'type', 'deleteBed' );

        formData.append( 'bedId', bed.id );

        fetchData( '/api/bed', { method: 'POST', body: formData } )
            .then( ( response ) => response.json() )
            .then( ( response ) =>
            {
                if ( response.status === 'success' )
                {
                    bed.dispatchEvent( new CustomEvent( 'deleteBed', { detail: bed.id } ) );
                }
            }
            );
    }

    // ~~

    function handleBedEdition(
        )
    {
        fetchData(
            '/api/bed/update',
            {
                method: 'POST',
                body: JSON.stringify(
                    {
                        bed: bed,
                    }
                    ),
                headers: { 'Content-Type': 'application/json' }
            }
            )
            .then( ( response ) =>
            {
                if ( response.status === 'success' )
                {
                    bed.dispatchEvent( new CustomEvent( 'updateBed', { detail: bed.id } ) );
                }

                bed.updateTimestamp = new Date( Date.now() ).toLocaleString();
            }
            );
    }
</script>

<style>
    select
    {
        background-color: transparent;
    }
</style>

<TableRow>
    <TableCell>
        { bed.id }
    </TableCell>
    <TableCell>
        { getLocalizedText( bed.propertyTitle, $languageTagStore ) }
    </TableCell>
    <TableCell>
        { getLocalizedText( bed.spaceName, $languageTagStore ) }
    </TableCell>
    <TableCell>
        <select
            id="bedTypeSelect"
            class="bed-type-select"
            bind:value={ bed.typeId }
            onchange={handleBedEdition}
        >
            {#each $bedTypeArrayStore as bedType }
                <option value={ bedType.id } selected={ bed.typeId == bedType.id }>
                    { getLocalizedText( bedType.name, $languageTagStore ) }
                </option>
            {/each}
        </select>
    </TableCell>
    <TableCell>
        { bed.personCount }
    </TableCell>
    <TableCell>
        { bed.count }
    </TableCell>
    <TableCell>
        { bed.userName }
    </TableCell>
</TableRow>
