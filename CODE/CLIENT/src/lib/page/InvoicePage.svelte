<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import { currencyArrayStore } from '$store/currencyArrayStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { invoiceStore } from '$store/invoiceStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { billTypeArrayStore } from '$store/billTypeArrayStore';
    import InvoiceModal from '$component/page/invoice/InvoiceModal.svelte';
    import InvoiceSummaryCard from '$component/page/invoice/InvoiceSummaryCard.svelte';

    // -- VARIABLES

    let isLoading = true;
    let invoiceArray = [];
    let billArray = [];
    let billLineArray = [];
    let isInvoiceModalOpen = false;
    let totalAmount = 0;

    // -- FUNCTIONS

    function handleOpenInvoiceModal(
        event
        )
    {
        $invoiceStore = event.detail.invoice;
        totalAmount = event.detail.total;
        billArray = event.detail.billArray;
        billLineArray = event.detail.billLineArray;
        isInvoiceModalOpen = true;
    };

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let data = await fetchData(
                    `/api/page/invoices`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(
                            {
                                type: 'getInvoiceArray',
                                userId: $profileSignedInStore.userId
                            }
                            )
                    }
                    );

                invoiceArray = data.invoiceArray;
                $currencyArrayStore = data.currencyArray;
                $billTypeArrayStore = data.billTypeArray;
            }
            catch ( error )
            {
                console.error( 'Error :', error );
            }
            finally
            {
                isLoading = false;
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .invoice-page
    {
        width: 100%;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    h1
    {
        margin: 2rem 0 3rem;

        display: flex;
        justify-content: center;

        font-size: 2rem;
        font-weight: bold;
        color: blueColor300;
    }
</style>

<main class="invoice-page">
    {#if isLoading }
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
        </div>
    {:else}
        {#if isInvoiceModalOpen }
            <InvoiceModal
                { totalAmount }
                { billArray }
                { billLineArray }
                bind:isOpen={ isInvoiceModalOpen }
            />
        {/if}
        <h1>{ getLocalizedTextBySlug( 'invoice-list-label', $languageTagStore ) }</h1>
        {#if invoiceArray && invoiceArray.length > 0 }
            {#each invoiceArray as invoice }
                <InvoiceSummaryCard
                    { invoice }
                    on:openInvoiceModal={ handleOpenInvoiceModal }
                />
            {/each}
        {:else}
            <div class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'no-invoice-found-label', $languageTagStore ) }
            </div>
        {/if}
    {/if}
</main>
