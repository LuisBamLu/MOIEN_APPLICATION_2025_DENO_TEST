<script>
    // -- IMPORTS

    import { isDesktopMapOpenStore, isDesktopListOpenStore, isMobileMapOpenStore, isMobileListOpenStore } from '$store/locationStore';
    import PropertiesFilterTag from '$component/page/properties/PropertiesFilterTag.svelte';
    import PropertiesList from '$component/page/properties/PropertiesList.svelte';
    import PropertiesMap from '$component/page/properties/PropertiesMap.svelte';
    import PropertiesActions from './PropertiesActions.svelte';
    import { onMount } from 'svelte';
    import { isMobileScreen } from '$src/lib/store/appDataStore';

    // -- VARIABLES

    export let isCityProperty;
    export let selectedCountry;
    export let selectedCity;
    export let isLoading;
    export let onNearBottom = () => {};
    export let arrivalDate;
    export let departureDate;
    export let isFavoritesPage =  false;

    let propertyMapElement;

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        if ( $isMobileScreen )
        {
            $isDesktopListOpenStore = false;
            $isDesktopMapOpenStore = false;

            $isMobileListOpenStore = true;
            $isMobileMapOpenStore = false;
        }
        else
        {
            $isDesktopListOpenStore = true;
            $isDesktopMapOpenStore = true;

            $isMobileListOpenStore = false;
            $isMobileMapOpenStore = false;
        }
    }

    // ~~

    function fitMapViewToProperties(
        )
    {
        if ( propertyMapElement )
        {
            propertyMapElement.flyToProperty();
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            window.addEventListener( 'resize', handleResizeEvent );

            return () => window.removeEventListener( 'resize', handleResizeEvent );
        }
        );

    // ~~

    handleResizeEvent();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties
    {
        position: relative;

        margin-top: 4.25rem;
        height: 100%;

        display: flex;
        flex-direction: column;

        +media( desktop )
        {
            margin-top: unset;
        }
    }

    .properties-filter-list
    {
        overflow: hidden;
        min-height: calc( var( --viewport-height ) - 8.5rem );
        width: 100%;

        flex: 1;

        +media( desktop )
        {
            min-height: calc( var( --viewport-height ) - 4.5rem );
        }
    }

    .properties-filter
    {
        padding: 1rem 1rem 0;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        +media( desktop )
        {
            border-bottom: 1px solid grayColor800;
            padding: 1.5rem 2rem;
        }
    }

    .properties-map
    {
        display: none;
    }

    .properties
    {
        +media( desktop )
        {
            flex-direction: row;
        }
    }

    .properties .properties-filter-list
    {
        +media( desktop )
        {
            display: none;
        }
    }

    .properties.is-desktop-map-open
    {
        +media( desktop )
        {
            flex-direction: column;
        }
    }

    .properties.is-desktop-map-open.is-desktop-list-open
    {
        +media( desktop )
        {
            flex-direction: row;
        }
    }

    :global( .properties.is-desktop-list-open .properties-filter-list .properties-list )
    {
        +media( desktop )
        {
            display: block;
        }
    }

    :global( .properties .properties-filter-list .properties-list )
    {
        +media( desktop )
        {
            display: none;
        }
    }

    .properties.is-desktop-list-open .properties-filter-list
    {
        +media( desktop )
        {
            display: block;
        }
    }

    .properties.is-desktop-map-open .properties-filter-list
    {
        +media( desktop )
        {
            min-height: calc( var( --viewport-height ) - 80.5rem );

            display: block;
        }
    }

    .properties.is-mobile-map-open .properties-map
    {
        z-index: 1;
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;

        display: block;
    }

    .properties.is-desktop-map-open .properties-map
    {
        +media( desktop )
        {
            position: relative;

            display: block;
            flex: 1;
        }
    }
</style>

<div
    class="properties"
    class:is-mobile-map-open={ $isMobileMapOpenStore }
    class:is-mobile-list-open={ $isMobileListOpenStore }
    class:is-desktop-map-open={ $isDesktopMapOpenStore }
    class:is-desktop-list-open={ $isDesktopListOpenStore }
>
    <div class="properties-filter-list">
        <div class="properties-filter">
            <PropertiesFilterTag/>
        </div>
        <PropertiesList
            onNearBottom={ onNearBottom }
            isCityProperty={ isCityProperty }
            selectedCity={ selectedCity }
            selectedCountry={ selectedCountry }
            bind:isLoading={ isLoading }
            on:update={ fitMapViewToProperties }
        />
    </div>
    <div class="properties-map">
        <PropertiesMap
            isLoading={ isLoading }
            isOpen={ $isDesktopMapOpenStore || $isMobileMapOpenStore }
            bind:this={ propertyMapElement }
            bind:isFavoritesPage={ isFavoritesPage }
        />
    </div>
</div>
<PropertiesActions />
