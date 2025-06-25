<script>
    // -- IMPORTS

    import { onMount, onDestroy } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { currencyArrayStore } from '$lib/store/currencyArrayStore';
    import { invoiceStore } from '$src/lib/store/invoiceStore';
    import { languageTagStore } from '$lib/store/languageTagStore';
    import InvoiceBillAccordion from './InvoiceBillAccordion.svelte';

    // -- CONSTANTS

    const currencySymbolMap =
        {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'CHF': 'CHF'
        };

    // -- VARIABLES

    export let totalAmount;
    export let billArray;
    export let billLineArray;
    export let isOpen;
    let modal;
    let isLoading = true;
    let symbol = currencySymbolMap[ $invoiceStore.currencyCode ] || '€';
    let property;

    // -- FUNCTIONS

    const handleClickOutside = ( event ) =>
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
                let data = await fetchData( `/api/property/get/${ billArray[0].propertyId }`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify( { type: 'getPropertyById', } )
                    }
                    );

                property = data.property;
            }
            catch ( error )
            {
                console.error( 'Error :', error );
            }
            finally
            {
                isLoading = false;
                document.addEventListener( 'click', handleClickOutside );
            }
        }
        );

    // ~~

    onDestroy(
        () =>
        {
            document.removeEventListener('click', handleClickOutside);
        }
        );

    // ~~

    $: symbol = $currencyArrayStore.find( currency => currency.code === $invoiceStore.currencyCode ).symbol;
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

    .invoice-modal
    {
        min-height: 400px;
        width: 90%;
        border-radius: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        background-color: white;
        + media( desktop )
        {
            height: auto;
            width: 70%;
        }
    }

    .bill-head
    {
        width: 100%;
        border-bottom: 1px solid grayBorderColor;
        border-radius: 1rem 1rem 0 0;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;

        background-color: blueColor950;
        h2
        {
            font-size: 1.5rem;
            font-weight: bold;
            color: grayColor100;
        }

        select
        {
            width: 50%;
            border: 1px solid greenColor300;
            border-radius: 0.5rem;
            padding: 0.5rem;

            background-color: greenColor300;

            font-weight: bold;
            color: blueColor950;
            + media( desktop )
            {
                width: auto;
            }
        }

        option
        {
            background-color: grayColor700;

            font-weight: bold;
            color: greenColor300;
        }

        + media( desktop )
        {
            flex-direction: row;
            gap: 1rem;

            text-align: left;
        }
    }

    .invoice-body
    {
        width: 100%;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    ul
    {
        width: 100%;

        list-style-type: none;
    }

    .invoice-foot
    {
        width: 100%;
        border-radius: 0 0 1rem 1rem;
        padding: 0.5rem 1rem;

        display: flex;
        flex-direction: row-reverse;

        background-color: blueColor950;
        p
        {
            font-size: 1.5rem;
            font-weight: bold;
            color: greenColor300;
        }
    }
</style>

<dialog id={ $invoiceStore.id }>
    <div class="invoice-modal" bind:this={ modal }>
        <div class="bill-head">
            <h2>
                {#if isLoading }
                    { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
                {:else}
                    { getLocalizedText( property.title, $languageTagStore ) }
                {/if}
            </h2>
            <select name="currency-code" bind:value={ $invoiceStore.currencyCode }>
                {#each $currencyArrayStore as currency }
                    <option value={ currency.code } selected={ currency.code === $invoiceStore.currencyCode }>
                        { getLocalizedText( currency.singularName, $languageTagStore ) }
                    </option>
                {/each}
            </select>
        </div>
        <div class="invoice-body">
            <ul>
                {#each billArray as bill }
                    {#if isLoading }
                        ...
                    {:else}
                        <InvoiceBillAccordion
                            bill={ bill }
                            billLineArray={ billLineArray }
                        />
                    {/if}
                {/each}
            </ul>
        </div>
        <div class="invoice-foot">
            <p>
                { `Total: ${ symbol }${ totalAmount }` }
            </p>
        </div>
    </div>
</dialog>
