<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { get } from 'svelte/store';
    import { getLocalizedText } from 'senselogic-gist';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { onDestroy, onMount } from 'svelte';
    import { toast } from '$lib/toast';
    import { urlParamsStore } from '$store/urlParamsStore';
    import Button from '$component/element/Button.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import ToolContainer from '$component/element/ToolContainer.svelte';
    import { useIntersectionObserver } from '$lib/intersection_observer';

    // -- CONSTANTS

    const limit = $state(15);

    // -- VARIABLES

    let
    {
        handleObserver,
        bottomElement,
        page,
        handleStopObserving,
        setBottomElement
    } = $state(useIntersectionObserver());
    let searchTerm = $state('');
    let isLoading = false;
    let textArray = [];
    let filteredTextArray = $state([]);
    let isSubmitting = $state(false);

    // -- FUNCTIONS

    async function loadTextArray(
        )
    {
        isLoading = true;

        try
        {
            let response = await fetchData(
                '/api/text/get',
                {
                    method : 'POST',
                    body : JSON.stringify({}),
                }
                );

            textArray = response.textArray;
        }
        catch ( error )
        {
            console.error( error );
            toast(
                {
                    text : 'Something went wrong',
                    variant : 'error'
                }
                );
        }
        finally
        {
            isLoading = false;
        }
    }

    // ~~

    function handleFilter(
        )
    {
        filteredTextArray = textArray.filter(
            ( textItem ) =>
            {
                return textItem.text.toLowerCase().includes( searchTerm.toLowerCase() );
            }
            );

        page.set( 1 );
    }

    // ~~

    async function handleSaveText(
        text
        )
    {
        isSubmitting = true;

        try
        {
            let response = await fetchData(
                '/api/text/set-by-slug',
                {
                    method : 'POST',
                    credentials : 'include',
                    body: JSON.stringify(
                        {
                            slug : text.slug,
                            text,
                            type : 'updateText'
                        }
                        )
                }
                );

            textArray = response.textArray;
        }
        catch ( error )
        {
            console.error( error );

            toast(
                {
                    text : 'Something went wrong',
                    variant : 'error'
                }
                );
        }
        finally
        {
            isSubmitting = false;
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await loadTextArray();

            filteredTextArray = textArray;
        }
        );

    // ~~

    onMount(
        () =>
        {
            setBottomElement( bottomElement );

            handleObserver();

            return () => handleStopObserving();
        }
        );

    // ~~

    run(() => {
        searchTerm, handleFilter();
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .page-section
    {
        overflow: hidden;
        height: 100dvh;
        padding-top: 7vh;

        display: grid;
        grid-template-columns: 1fr;

        background: pageBackgroundColor;

        +media( desktop )
        {
            grid-template-columns: min-content 1fr;
        }
    }

    .main-section
    {
        padding-bottom: 4.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .text-list
    {
        overflow-y: scroll;
        max-height: calc( 100dvh - 9rem );

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .text-item
    {
        border: 1px solid grayColor700;
        border-radius: 0.5rem;
        padding: 1rem;
    }
</style>

<div class="page-section">
    <Sidebar/>

    <main class="padding-150 main-section">
        <ToolContainer
            bind:value={ searchTerm }
            on:submit={
                ( event ) =>
                {
                    event.preventDefault();

                    handleFilter();
                }
                }
        />

        <div class="text-list">
            {#each filteredTextArray.slice( 0, $page * limit ) as textItem ( textItem ) }
                <div class="text-item">
                        <InputLocalizedForm
                            itemsString={ textItem.text }
                            name={ textItem.slug }
                            languageArray={ $languageArrayStore }
                            on:update={ ( event ) => textItem.text = event.detail.text }
                        />

                    <Button type="button" on:click={ () => handleSaveText( textItem ) } loading={ isSubmitting }>
                        Save
                    </Button>
                </div>
            {/each}
            <div style="border: 1px solid #fff;" bind:this={ bottomElement }></div>
        </div>
    </main>
</div>
