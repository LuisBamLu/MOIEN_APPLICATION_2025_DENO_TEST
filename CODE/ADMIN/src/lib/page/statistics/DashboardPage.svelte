<script>
    // -- IMPORTS

    import AdminPage from '$component/element/AdminPage.svelte';
    import DashboardContent from '$component/page/dashboard/DashboardContent.svelte';
</script>

<AdminPage
    pageTitle="admin-menu-dashboard-label"
    selectedObject={ null }
    objectArrayStore={ null }
    isObjectModalOpen={ null }
    filterParameterByKeyMap={ null }
    titleSlugMap={ null }
    loadObjectArray={ () => {} }
    arrayProcessing={ () => {} }
    tablePage={ false }
    showButton={ false }
>
    <DashboardContent/>
</AdminPage>
