<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '../base';
    import { billLineArrayStore } from '../store/billLineArrayStore';
    import { currencyArrayStore } from '../store/currencyArrayStore';
    import { profileSignedInStore } from '../store/profileStore';
    import { billStore } from '../store/billStore';
    import BillModal from '../component/page/bill/BillModal.svelte';
    import BillSummary from '../component/page/bill/BillSummary.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '../store/languageTagStore';

    // -- VARIABLES

    let isLoading = true;
    let billArray = [];
    let isBillModalOpen = false;
    let totalAmount = 0;
    let billLineArray = [];

    // -- FUNCTIONS

    function handleOpenBillModal(
        event
        )
    {
        $billStore = event.detail.bill;
        totalAmount = event.detail.total;
        billLineArray = event.detail.billLines;
        isBillModalOpen = true;
    };

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let data = await fetchData(
                    `/api/page/bills`,
                    {
                        method: 'POST',
                        headers: { "Content-Type": 'application/json' },
                        body: JSON.stringify(
                            {
                                type: 'getBillArray',
                                userId: $profileSignedInStore.userId
                            }
                            )
                    }
                    );

                billArray = data.billArray;
                $billLineArrayStore = data.billLineArray;
                $currencyArrayStore = data.currencyArray;
            }
            catch ( error )
            {
                console.error( "Error :", error );
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

    .bill-page
    {
        width: 100%;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<main class="bill-page">
    {#if isLoading }
        <div>{ getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }</div>
    {:else}
        {#if isBillModalOpen }
            <BillModal
                bill={ $billStore }
                totalAmount={ totalAmount }
                billLineArray={ billLineArray }
                bind:isOpen={ isBillModalOpen }
            />
        {/if}
        {#if billArray.length }
            {#each billArray as bill }
                <BillSummary
                    { bill }
                    on:openBillModal={ handleOpenBillModal }
                />
            {/each}
        {:else}
            <div class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'no-bills-found-label', $languageTagStore ) }
            </div>
        {/if}
    {/if}
</main>
