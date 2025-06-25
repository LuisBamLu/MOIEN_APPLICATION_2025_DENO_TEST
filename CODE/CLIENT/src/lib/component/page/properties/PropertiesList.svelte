<script>
    // -- IMPORTS

    import { slide } from 'svelte/transition';
    import { getJsonText, getLocalizedText, getLocalizedTextBySlug, logError } from 'senselogic-gist';
    import { isDesktopMapOpenStore, isDesktopListOpenStore, isMobileMapOpenStore, isMobileListOpenStore } from '$store/locationStore';
    import { languageTagStore } from '$store/languageTagStore';
    import PropertyLoading from '$component/page/properties/PropertyLoading.svelte';
    import PropertyCard from '$component/page/properties/PropertyCard.svelte';
    import { propertyArrayStore } from '$store/propertyArray';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { clearAllfilterParameterByKeyMap, fetchData } from '$lib/base';
    import { filterParameterByKeyMapStore, mapCenterStore, updatePropertyParameters } from '$store/filterParameterByKeyMapStore';
    import { createEventDispatcher } from 'svelte';
    import { currentPathname } from '$src/lib/router';
    import { updateUrlParameter } from '$src/lib/url';

    // -- CONSTANTS

    const dipatch = createEventDispatcher();

    // -- VARIABLES

    export let isCityProperty;
    export let selectedCity;
    export let selectedCountry;
    export let isLoading;
    export let onNearBottom;
    let isLoadingNearbyPropertyArray = false;

    // -- FUNCTIONS

    function onScroll(
        event
        )
    {
        let bottomReached = event.target.scrollHeight - event.target.scrollTop - 1 <= event.target.clientHeight;

        if ( bottomReached && onNearBottom )
        {
            onNearBottom();
        }
    }

    // ~~

    async function getNearbyPropertyArray(
        )
    {
        isLoadingNearbyPropertyArray = true;

        try
        {
            filterParameterByKeyMapStore.update(current => {
                return {
                    ...current,
                    propertyParameters: {},
                }
                }
            )

            let url = new URL( window.location.href );

            url.search = ''
            window.history.replaceState( {}, '', url );

            let response = await fetchData(
                '/api/property/get-nearest-properties',
                {
                    method: 'POST',
                    body: getJsonText(
                        {
                            latitude: $mapCenterStore?.latitude,
                            longitude: $mapCenterStore?.longitude,
                            distanceInKilometersCount: 100
                        }
                        )
                }
                );

            propertyArrayStore.set( response );
        }
        catch( error )
        {
            logError( error );
        }
        finally
        {
            dipatch( 'update' );
            isLoadingNearbyPropertyArray = false;
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-list
    {
        height: calc( var( --viewport-height ) - 11.75rem );
        width: 100%;
        padding-top: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;

        +media( desktop )
        {
            height: calc( var( --viewport-height ) - 10.3125rem );
        }
    }

    .properties-list-message
    {
        padding: 0.5rem 1.5rem 0rem;

        text-align: left;
    }

    .properties-list-container
    {
        overflow-y: auto;
        height: 100%;
        width: 100%;
        border-radius: 1rem;
        padding: 1rem 1rem 5rem 1rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        -ms-overflow-style: none;
        scrollbar-width: none;

        +media( tablet )
        {
            display: grid;
            grid-template-columns: repeat( auto-fill, minmax( 18rem, 1fr ) );
            grid-auto-rows: min-content;
        }

        +media( desktop )
        {
            width: 100%;
            padding: 1rem 1.5rem 6.5rem 1.5rem;
        }
    }

    .properties-list-container::-webkit-scrollbar
    {
        display: none;
    }

    .nearby-results-button
    {
        margin: 1rem 0.5rem 0.5rem 0;
        width: 18.5rem;
    }

    .properties-not-found-container
    {
        margin-top: 20%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;

        text-align: center;
    }

    .properties-not-found-content
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
    }
</style>

<div
    class="properties-list"
    class:is-mobile-map-open={ $isMobileMapOpenStore }
    class:is-mobile-list-open={ $isMobileListOpenStore }
    class:is-desktop-map-open={ $isDesktopMapOpenStore }
    class:is-desktop-list-open={ $isDesktopListOpenStore }
    transition:slide
>
    {#if $propertyArrayStore.length > 0 }
        {#if selectedCity && isCityProperty || selectedCity && selectedCountry }
            <div class="properties-list-message">
                <div class="font-size-125 font-weight-700 color-gray">
                    {#if selectedCity && isCityProperty }
                        { $propertyArrayStore.length }
                        { getLocalizedTextBySlug( 'property-list-results-in-label', $languageTagStore ) }
                        { getLocalizedText( selectedCity.name, $languageTagStore ) }
                    {:else if selectedCity && selectedCountry }
                        { getLocalizedTextBySlug( 'property-list-closer-results-label', $languageTagStore ) }
                        { getLocalizedText( selectedCity.name, $languageTagStore ) }
                    {/if}
                </div>
            </div>
        {/if}
    {:else if !isLoading }
        <div class="properties-not-found-container">
            <div class="moien-neutral-icon size-350" />
            <div class="properties-not-found-content font-size-125 font-weight-700 color-gray">
                { getLocalizedTextBySlug( 'property-list-no-results-label', $languageTagStore ) }
                <div class="nearby-results-button">
                    <ModalButton
                        type="button"
                        variant="outlined"
                        on:click={ getNearbyPropertyArray }
                        isLoading={ isLoadingNearbyPropertyArray }
                        --modal-action-button-height="2.75rem"
                        --modal-action-button-padding="0.75rem 1rem"
                    >
                        <span class="font-size-90 font-weight-500">
                            { getLocalizedTextBySlug( 'show-nearest-results-label', $languageTagStore ) }
                        </span>
                    </ModalButton>
                </div>
            </div>
        </div>
    {/if}
    <div
        class="properties-list-container"
        on:scroll={ ( event ) => onScroll( event ) }
    >
        {#if $propertyArrayStore?.length > 0 }
            {#each $propertyArrayStore as property ( property.id ) }
                <PropertyCard property={ property } />
            {/each}
        {/if}
        {#if isLoading }
            <PropertyLoading />
        {/if}
    </div>
</div>
