<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { get } from 'svelte/store';
    import { getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { loadArticleCategoryArray, errorMessage } from '$store/articleCategoryArrayStore';
    import { onMount } from 'svelte';
    import { urlParamsStore } from '$store/urlParamsStore';
    import Alert from '$component/element/Alert.svelte';
    import CategoryList from '$component/page/article_category/CategoryList.svelte';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import ToolContainer from '$component/element/ToolContainer.svelte';

    // -- FUNCTIONS

    async function handlePopState(
        )
    {
        let urlSearchParams = get( urlParamsStore );

        await loadArticleCategoryArray();
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            window.addEventListener(
                'popstate',
                handlePopState
                );

            return () => window.removeEventListener( 'popstate', handlePopState );
        }
        );

    // ~~

    run(() => {
        $urlParamsStore, handlePopState();
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .page-section
    {
        min-height: 100dvh;
        padding-top: 4.5rem;

        display: grid;
        grid-template-columns: min-content 1fr;

        background: pageBackgroundColor;
    }

    .main-section
    {
        padding-bottom: 4.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

<div class="page-section">
    <Sidebar/>

    <main class="padding-150 main-section">
        <CategoryList/>

        {#if $errorMessage }
            <Alert text={ getLocalizedTextBySlug( $errorMessage, $languageTagStore ) } type="error"/>
        {/if}
    </main>
</div>
