<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import AdminCardList from '$component/element/AdminCardList/AdminCardList.svelte';

    // -- VARIABLES

    let statisticsCardArray =
    [
        {
            label: 'Contact List Management',
            icon: 'statistics',
            page: '/admin/settings/mailchimp/contacts',
            requiredPermissionSlug: 'list-statistics'
        },
        {
            label: 'Marketing Dashboard',
            icon: 'statistics',
            page: '/admin/settings/mailchimp/analytics',
            requiredPermissionSlug: 'list-statistics'
        },
        {
            label: 'Campaigns',
            icon: 'statistics',
            page: '/admin/settings/mailchimp/campaigns',
            requiredPermissionSlug: 'list-statistics'
        }
    ];
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- STYLES

    .page-container
    {
        min-height: 100dvh;
        padding-top: 7vh;

        display: flex;

        background-color: grayColor900;
    }
</style>

<div class="page-container">
    <Sidebar/>
    <AdminCardList
        cardArray={ statisticsCardArray }
        name="mailchimp-label"
    />
</div>
