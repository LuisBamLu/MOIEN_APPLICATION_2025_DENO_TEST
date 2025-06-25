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
            label: getLocalizedTextBySlug( 'Statistics', $languageTagStore ),
            icon: 'statistics',
            page: '/admin/statistics/statistics-page',
            requiredPermissionSlug: 'list-statistics'
        },
        {
            label: getLocalizedTextBySlug( 'Dashboard', $languageTagStore ),
            icon: 'dashboard',
            page: '/admin/statistics/dashboard',
            requiredPermissionSlug: 'list-dashboard'
        }
    ];
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

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
    <Sidebar />
    <AdminCardList
        cardArray={ statisticsCardArray }
        name="admin-sidebar-statistics-label"
    />
</div>
