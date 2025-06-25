<script>
    // -- IMPORTS

    import AccountBalance from '$component/page/account/AccountBalance.svelte';
    import AccountMobileHeader from '$component/page/account/AccountMobileHeader.svelte';
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl'
    @import '../../mixin.styl'

    // -- CLASSES

    .account-balance-content
    {
        margin-bottom: 4rem;
        width: 100%;
        padding: 2rem 1.5rem;

        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 1.5rem;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            margin-bottom: 0;
        }
    }
</style>

<AccountMobileHeader title="Account balance"/>
<div class="account-balance-content">
    <AccountBalance/>
</div>
