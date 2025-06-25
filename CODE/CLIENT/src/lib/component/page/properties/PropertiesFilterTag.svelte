<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { updateUrlParameter } from '$lib/url';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { propertyTypeArrayStore } from '$store/propertyTypeArrayStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import { isDesktopMapOpenStore, isDesktopListOpenStore, isMobileMapOpenStore, isMobileListOpenStore } from '$store/locationStore';
    import Tab from '$component/element/Tab.svelte';

    // -- CONSTANTS

    const horizontalScrollAmountInPx = 100;
    const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 56em)' );

    // -- VARIABLES

    let buttonElementReferenceByPropertyTypeIdMap = {};
    let propertyFilterTagListElement;
    let isMobileScreen = maxWidthInEmMediaScreen.matches;

    // -- FUNCTIONS

    function handlePropertyTypeSelector(
        selectedTypeId
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };

                if ( updatedParameters.propertyParameters.typeId === selectedTypeId )
                {
                    delete updatedParameters.propertyParameters.typeId;
                }
                else
                {
                    updatedParameters.propertyParameters.typeId = selectedTypeId;
                }

                buttonElementReferenceByPropertyTypeIdMap[ selectedTypeId ]
                    .scrollIntoView(
                        {
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center'
                        }
                        );

                return updatedParameters;
            }
            );
        updateUrlParameter( $filterParameterByKeyMapStore );
    }

    // ~~

    function handleTermTypeSelected(
        featureType
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };
                let isCurrentlySelected = updatedParameters.propertyParameters[ featureType ];

                delete updatedParameters.propertyParameters[ 'isAvailableForShortTerm' ];
                delete updatedParameters.propertyParameters[ 'isAvailableForLongTerm' ];

                if ( !isCurrentlySelected )
                {
                    updatedParameters.propertyParameters[ featureType ] = true;
                }

                return updatedParameters;
            }
            );
        updateUrlParameter( $filterParameterByKeyMapStore );
    }

    // ~~

    function handlePreviousFilterTagItem(
        )
    {
        propertyFilterTagListElement.scrollBy(
            {
                left: -horizontalScrollAmountInPx,
                behavior: 'smooth'
            }
            );
    }

    // ~~

    function handleNextFilterTagItem(
        )
    {
        propertyFilterTagListElement.scrollBy(
            {
                left: horizontalScrollAmountInPx,
                behavior: 'smooth'
            }
            );
    }

    // ~~

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;
    }

    // -- STATEMENT

    onMount(
        () =>
        {
            window.addEventListener( 'resize', handleResizeEvent );

            return () => window.removeEventListener( 'resize', handleResizeEvent );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-filter-tag
    {
        position: relative;

        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
    }

    .properties-filter-tag-list
    {
        overflow-x: scroll;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .properties-filter-tag-list::-webkit-scrollbar
    {
        display: none;
    }

    .properties-filter-tag-navigation-button
    {
        flex-shrink: 0;
    }
</style>

<div
    class="properties-filter-tag"
    class:is-mobile-map-open={ $isMobileMapOpenStore }
    class:is-mobile-list-open={ $isMobileListOpenStore }
    class:is-desktop-map-open={ $isDesktopMapOpenStore }
    class:is-desktop-list-open={ $isDesktopListOpenStore }
>
    {#if !isMobileScreen
        && $isMobileListOpenStore
        && $isDesktopMapOpenStore
        && $isDesktopListOpenStore
    }
        <button
            class="properties-filter-tag-navigation-button gray-left-caret-icon size-150"
            on:click={ handlePreviousFilterTagItem }
        />
    {/if}
    <div class="properties-filter-tag-list" bind:this={ propertyFilterTagListElement }>
        <Tab
            isActive={ $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForShortTerm' ] }
            label={ getLocalizedTextBySlug( 'filter-short-term-label', $languageTagStore ) }
            on:click={ () => handleTermTypeSelected( 'isAvailableForShortTerm' ) }
        />
        <Tab
            isActive={ $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForLongTerm' ] }
            label={ getLocalizedTextBySlug( 'filter-long-term-label', $languageTagStore ) }
            on:click={ () => handleTermTypeSelected( 'isAvailableForLongTerm' ) }
        />
        {#each $propertyTypeArrayStore as propertyType }
            <Tab
                isActive={ $filterParameterByKeyMapStore.propertyParameters.typeId === propertyType.id }
                label={ getLocalizedText( propertyType.name, $languageTagStore ) }
                bind:elementReference={ buttonElementReferenceByPropertyTypeIdMap[ propertyType.id ] }
                on:click={ () => handlePropertyTypeSelector( propertyType.id ) }
            />
        {/each}
    </div>
    {#if !isMobileScreen
        && $isMobileListOpenStore
        && $isDesktopMapOpenStore
        && $isDesktopListOpenStore
    }
        <button
            class="properties-filter-tag-navigation-button gray-right-caret-icon size-150"
            on:click={ handleNextFilterTagItem }
        />
    {/if}
</div>
