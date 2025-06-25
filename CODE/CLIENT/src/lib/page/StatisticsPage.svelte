<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '../store/languageTagStore';
    import AccountMobileHeader from '../component/page/account/AccountMobileHeader.svelte';
    import AccountStatistics from '../component/page/account/AccountStatistics.svelte';
</script>

<style lang="stylus">
    // -- CLASSES

    .statistics-page
    {
        padding: 0 1rem;
    }
</style>

<AccountMobileHeader title={ getLocalizedTextBySlug( 'profile-page-statistics', $languageTagStore ) } />
<div class="statistics-page">
    <AccountStatistics />
</div>
