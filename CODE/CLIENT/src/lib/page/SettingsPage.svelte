<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import AccountMobileHeader from '../component/page/account/AccountMobileHeader.svelte';
    import { languageTagStore } from '../store/languageTagStore';
    import AccountSettings from '../component/page/account/AccountSettings.svelte';
</script>

<style lang="stylus">
    // -- CLASSES

    .settings-page
    {
        padding: 2rem 1.5rem;
    }
</style>

<AccountMobileHeader title={ getLocalizedTextBySlug( 'profile-page-account-settings', $languageTagStore ) } />
<div class="settings-page">
    <AccountSettings />
</div>
