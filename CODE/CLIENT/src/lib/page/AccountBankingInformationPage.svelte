<script>
    // -- IMPORTS

    import AccountMobileHeader from '$component/page/account/AccountMobileHeader.svelte';
    import AccountBankingInformation from '$component/page/account/AccountBankingInformation.svelte';
</script>

<style lang="stylus">
    // -- CLASSES

    .account-balance-content
    {
        width: 100%;
        padding: 2rem 1.5rem;

        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 1.5rem;
        justify-content: center;
        align-items: center;
    }
</style>

<AccountMobileHeader title="Banking information"/>
<div class="account-balance-content">
    <AccountBankingInformation/>
</div>
