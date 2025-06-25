<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import AccountMobileHeader from '../component/page/account/AccountMobileHeader.svelte';
    import { languageTagStore } from '../store/languageTagStore';
    import PersonalDetail from '../component/page/account/PersonalDetail.svelte';
</script>

<style lang="stylus">
    // -- CLASSES

    .personal-details-page
    {
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
</style>

<AccountMobileHeader title={ getLocalizedTextBySlug( 'account-page-personal-details-label', $languageTagStore ) } />
<div class='personal-details-page'>
    <PersonalDetail />
</div>
