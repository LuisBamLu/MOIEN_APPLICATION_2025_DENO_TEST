<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import PropertyManagementHeader from '$component/page/property-management/PropertyManagementHeader.svelte';
    import ShortTermSection from '$component/page/property-management/ShortTermSection.svelte';
    import LongTermSection from '$component/page/property-management/LongTermSection.svelte';
    import AccountAccordion from '$component/page/account/AccountAccordion.svelte';

    // -- VARIABLES

    export let id;
    let property = {};
    let isLoading = true;
    let timer = null;
    let accordionDataArray =
        [
            {
                accordionTitleSlug: 'property-management-page-view-ad-label',
                href: '/property/' + id
            },
            {
                accordionTitleSlug: 'property-management-page-modify-ad-label',
                href: '/dashboard/ads/' + id
            }
        ];

    // -- FUNCTIONS

    function handlePropertyStatusChange(
        )
    {
        if ( property.statusId === 'online' )
        {
            property.statusId = 'offline';
        }
        else
        {
            property.statusId =  'online';
        }

        clearTimeout( timer );
        timer = setTimeout(
            async () =>
            {
                await fetchData(
                    '/api/property/set/' +  id,
                    {
                        method: 'POST',
                        body: JSON.stringify( { property } ),
                        credentials: 'include'
                    }
                    );
            },
            1000
            );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result
                = await fetchData(
                    '/api/page/property-management/' + id,
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                    );

            property = result.property;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .property-management-page
    {
        position: relative;

        margin-bottom: 4rem;
        padding: 0rem 1rem;
        padding-bottom: 6.75rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            margin-bottom: unset;
        }
    }

    .property-management-page-content-container
    {
        width: 100%;
        padding-top: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 76.875rem;
        }
    }
</style>

<div class="property-management-page">
    {#if isLoading }
        <Loading />
    {:else}
        <PropertyManagementHeader label={ getLocalizedText( property.title, $languageTagStore ) } />
        <div class="property-management-page-content-container">
            <div>
                <LabelledSwitch
                    label={ getLocalizedTextBySlug( 'published-label', $languageTagStore ) }
                    value={ property.statusId === 'online' }
                    onChange={ handlePropertyStatusChange }
                    borderBottom={ true }
                />
                {#each accordionDataArray as accordionData }
                    <AccountAccordion accordionData={ accordionData } />
                {/each}
            </div>
            {#if property.isAvailableForShortTerm }
                <ShortTermSection property={ property } />
            {/if}
            {#if property.isAvailableForLongTerm }
                <LongTermSection />
            {/if}
        </div>
    {/if}
</div>
