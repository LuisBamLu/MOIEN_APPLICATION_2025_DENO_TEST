<script>
    // -- IMPORTS

    import { onDestroy, onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { currencyArrayStore } from '$lib/store/currencyArrayStore';
    import { languageTagStore } from '$lib/store/languageTagStore';
    import BillLine from './BillLine.svelte';

    // -- VARIABLES

    export let totalAmount;
    export let bill;
    export let billLineArray;
    export let isOpen;
    let modal;
    let isLoading = true;
    let property;

    // -- FUNCTIONS

    const handleClickOutside = (event) =>
    {
        if ( modal && !modal.contains( event.target ) )
        {
            isOpen = false;
        }
    };

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let data = await fetchData( `/api/property/get/${ bill.propertyId }`,
                    {
                        method: 'POST',
                        headers: { "Content-Type": 'application/json' },
                        body: JSON.stringify( { type: 'getPropertyById', } )
                    }
                    );

                property = data.property;
            }
            catch ( error )
            {
                console.error( "Error :", error );
            }
            finally
            {
                isLoading = false;
                document.addEventListener('click', handleClickOutside);
            }
        }
        );

    onDestroy(
        () =>
        {
            document.removeEventListener('click', handleClickOutside);
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    dialog
    {
        z-index: 1000;
        position: fixed;
        top: 0;
        left: 0;

        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: rgba( 0, 0, 0, 0.5 );
    }

    .bill-modal
    {
        height: 80%;
        width: 90%;
        border: 1px solid grayColor700;
        border-radius: 0.5rem;
        padding: 1rem;

        background-color: white;
        + media( desktop )
        {
            height: 60%;
            width: 70%;
        }
    }

    .bill-head
    {
        border-bottom: 1px solid grayColor;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        text-align: center;
        h2
        {
            font-size: 1.5rem;
            font-weight: bold;
            color: grayColor100;
        }

        select
        {
            border: 1px solid grayColor;
            border-radius: 0.5rem;
            padding: 0.5rem;

            background-color: transparent;

            color: grayColor100;
        }

        option
        {
            background-color: grayColor700;

            color: grayColor100;
        }

        + media( desktop )
        {
            flex-direction: row;

            text-align: left;
        }
    }

    .bill-body
    {
        ul
        {
            padding: 0;

            list-style-type: none;
            color: grayColor100;
        }
    }

    .bill-foot
    {
        padding: 1rem;

        display: flex;
        justify-content: flex-end;

        font-size: 1.2rem;
        font-weight: bold;
        color: grayColor100;
    }
</style>

<dialog id={ bill.id }>
    <div class="bill-modal" bind:this={ modal }>
        <div class="bill-head">
            <h2>
                {#if isLoading }
                    { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
                {:else}
                    { getLocalizedText( property.title, $languageTagStore ) }
                {/if}
            </h2>
            <select>
                {#each $currencyArrayStore as currency }
                    <option value={ currency.code }>{  getLocalizedText( currency.singularName ) }</option>
                {/each}
            </select>
        </div>
        <div class="bill-body">
            <ul>
                {#each billLineArray as billLine }
                    <BillLine { billLine } />
                {/each}
            </ul>
        </div>
        <div class="bill-foot">
            <p>Total: { totalAmount }</p>
        </div>
    </div>
</dialog>
