<script>
    // -- IMPORTS

    import AdminPage from '$component/element/AdminPage.svelte';
    import StatisticsCharts from '$component/page/statistics/StatisticsCharts.svelte';
</script>

<AdminPage
    pageTitle="admin-sidebar-statistics-label"
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
    <StatisticsCharts />
</AdminPage>
