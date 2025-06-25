<script>
    // -- IMPORTS

    import AccountBankingInformationAccountModal from '$component/page/account/AccountBankingInformationAccountModal.svelte';

    // -- VARIABLES

    export let isDefault = false;
    export let accountName = '';
    export let accountDescription = '';
    export let hasIcon = false;
    export let account =
        {
            beneficiary: '',
            number: '',
            bank: '',
            date: '',
            communication: '',
            amount: ''
        };
    let isEditModalOpen = false;

    // -- FUNCTIONS

    function handleToggleEditModalOpen(
        )
    {
        isEditModalOpen = !isEditModalOpen;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .account-banking-information-payment-method-card
    {
        width: 100%;
        border: 2px solid grayColor800;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        gap: 0.75rem;
        align-items: center;

        background: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
    }

    .account-banking-information-payment-method-card.is-default
    {
        border: 2px solid greenColor800;

        background: greenColor950;
    }

    .account-banking-information-payment-method-detail
    {
        overflow: hidden;

        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        align-items: flex-start;

        text-overflow: ellipsis;
    }
</style>

<button
    on:click={ handleToggleEditModalOpen }
    class="account-banking-information-payment-method-card"
    class:is-default={ isDefault }
>
    {#if hasIcon }
        <div class="mastercard-icon size-250"/>
    {/if}
    <div class="account-banking-information-payment-method-detail">
        <span class="font-size-90 color-gray-100 { isDefault ? 'font-weight-700' : 'font-weight-500' }">
            { accountName }
        </span>
        <span class="font-size-75 font-weight-500 { isDefault ? 'color-gray-100' : 'color-gray-300' }">
            { accountDescription }
        </span>
    </div>
    <div class="gray-right-caret-icon size-150" class:green-right-caret-icon={ isDefault }/>
</button>
<AccountBankingInformationAccountModal
    onClose={ handleToggleEditModalOpen }
    isOpen={ isEditModalOpen }
    account={ account }
/>
