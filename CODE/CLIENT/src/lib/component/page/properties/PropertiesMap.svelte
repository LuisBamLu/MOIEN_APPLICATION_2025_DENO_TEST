<script>
    // -- IMPORTS

    import { onMount, onDestroy, afterUpdate } from 'svelte';
    import { slide } from 'svelte/transition';
    import 'leaflet/dist/leaflet.css';
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { filterParameterByKeyMapStore, mapCenterStore, updateBookingParameters, updateFeatureParameters, updateLocationParameters, updatePropertyParameters } from '$store/filterParameterByKeyMapStore.js';
    import { selectedLocationStore,defaultLocationStore, isDesktopMapOpenStore, isDesktopListOpenStore, isMobileMapOpenStore, isMobileListOpenStore } from '$store/locationStore';
    import { languageTagStore } from '$store/languageTagStore';
    import PropertyCard from '$component/page/properties/PropertyCard.svelte';
    import { getFormattedPrice } from '$lib/base';
    import { processParameters } from '$lib/parameters';
    import { propertyArrayStore } from '$lib/store/propertyArray';
    import { webSocket } from '$store/webSocketStore';
    import { isOnboardingCompletedStore } from '$lib/store/onboardingStore';
    import { webSocketManager } from '$lib/web_socket_manager';

    // -- VARIABLES

    export let isLoading;
    export let shouldShowNearbyPlaces = true;
    export let isOpen = true;
    export let isFavoritesPage = false;

    let previousPropertyArray = [];
    let mapElement;
    let map;
    let markers;
    let leaflet;
    let isUpdatingMap = false;
    let showNearbyPlacesTimeout;

    // -- FUNCTIONS

    async function initializeMap(
        )
    {
        leaflet = await import( 'leaflet' );

        if ( !map )
        {
            map = leaflet.map(
                mapElement,
                {
                    zoomControl: false,
                    attributionControl: false,
                    maxZoom: 18,
                    minZoom: 8
                }
                );
        }

        await import( 'leaflet.markercluster/dist/leaflet.markercluster-src.js' );

        if ( $propertyArrayStore && $propertyArrayStore.length > 0 )
        {
            fitMapViewToProperties();
        }
        else
        {
            if ( $selectedLocationStore )
            {
                if ( $selectedLocationStore.latitude && $selectedLocationStore.longitude )
                {
                    map.setView( [ $selectedLocationStore.latitude, $selectedLocationStore.longitude ], 10 );
                }
            }
            else
            {
                map.setView( [ $defaultLocationStore.latitude, $defaultLocationStore.longitude ], 3 );
            }
        }

        leaflet.tileLayer( 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' ).addTo( map );

        if ( !markers )
        {
            markers = new L.MarkerClusterGroup(
                {
                    iconCreateFunction:
                        function( cluster )
                        {
                            var childCount = cluster.getChildCount();

                            return new L.DivIcon(
                                {
                                    html: '<div><span>' + childCount + '</span></div>',
                                    className: 'font-size-75 font-weight-700 color-white properties-map-cluster-icon',
                                    iconSize: new L.Point( 40, 40 )
                                }
                                );
                        }
                }
                );
        }

        if ( $propertyArrayStore && $propertyArrayStore.length > 0 )
        {
            updateMapView();
            // for ( let property of $propertyArrayStore )
            // {
            //     addMarker( property );
            // }
        }

        const mapEventArray =
            [
                'moveend',
                'zoomend',
                'resize'
            ];

        for ( let mapEvent of mapEventArray )
        {
            if ( shouldShowNearbyPlaces )
            {
                map.on(
                    mapEvent,
                    async () =>
                    {
                        clearTimeout( showNearbyPlacesTimeout );
                        showNearbyPlacesTimeout
                            = setTimeout(
                                showNearbyPlaces,
                                1000
                                );
                    }
                    );
            }
        }

        map.addLayer( markers );
    };

    // ~~

    function requestPointOfInterest(
        payload
        )
    {
        if ( isOpen )
        {
            try
            {
                webSocketManager.send(
                    payload
                    );
            }
            catch ( error )
            {
                console.log( error );
            }
            finally
            {
                isUpdatingMap = false;
            }
        }
    }

    // ~~

    async function showNearbyPlaces(
        )
    {
        if( !isFavoritesPage )
        {
            let center = map.getCenter();
            mapCenterStore.set(
                {
                    latitude: center.lat,
                    longitude: center.lng
                }
                );
            let locationBoundingBox = map.getBounds();
            let urlParams = new URLSearchParams( window.location.search );
            let { propertyParameters, locationParameters, bookingParameters, featureParameters }
                = await processParameters( urlParams );

            updateBookingParameters( bookingParameters );
            updatePropertyParameters( propertyParameters );
            updateLocationParameters( locationParameters );
            updateFeatureParameters( featureParameters );

            requestPointOfInterest(
                {
                    propertyParameters: { ...propertyParameters, statusId: 'online' },
                    locationParameters:
                        {
                            ...locationParameters,
                            currentCoordinates: [ center.lat, center.lng ].join( ',' ),
                            minimumLatitude: locationBoundingBox._southWest.lat,
                            maximumLatitude: locationBoundingBox._northEast.lat,
                            minimumLongitude: locationBoundingBox._southWest.lng,
                            maximumLongitude: locationBoundingBox._northEast.lng
                        },
                    bookingParameters,
                    featureParameters,
                    propertyIdArray: $filterParameterByKeyMapStore.propertyIdArray ?? [],
                    propertyPage: 1,
                    propertyLimit: 1000,
                    type: 'getPointsOfInterest'
                }
                );
        }
    }

    // ~~

    function updateMapView(
        )
    {
        if ( map && markers )
        {
            markers.clearLayers();

            for ( let property of $propertyArrayStore )
            {
                addMarker( property );
            }
        }
    }

    // ~~

    function addMarker(
        property
        )
    {
        let propertyIconPrice;

        if ( $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForShortTerm' ] )
        {
            propertyIconPrice = property.shortTermDailyPrice;
        }
        else if ( $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForLongTerm' ] )
        {
            propertyIconPrice = property.longTermMonthlyPrice;
        }
        else
        {
            propertyIconPrice = property.shortTermDailyPrice;
        }

        let marker = leaflet.marker(
            [ property.latitude, property.longitude ],
            {
                icon: leaflet.divIcon(
                    {
                        className: 'custom-div-icon',
                        html: `<div class="properties-map-icon">${ getFormattedPrice( propertyIconPrice, $languageTagStore ) }</div>`,
                        iconSize: [ 40, 40 ],
                        iconAnchor: [ 15, 42 ]
                    }
                    )
            }
            );

        marker.bindPopup( `<div id="property-container-${ property.id }"></div>`,).on(
            'popupopen',
            function(
                )
            {
                let container = document.getElementById( `property-container-${ property.id }` );

                if ( container )
                {
                    new PropertyCard(
                    {
                        target: container,
                        props: { property }
                    }
                    );
                }
            }
            );

        markers.addLayer( marker );
    }

    // ~~

    function getBounds(
        )
    {
        let bounds = leaflet.latLngBounds();

        for ( let property of $propertyArrayStore )
        {
            bounds.extend( [ property.latitude, property.longitude ] );
        }

        return bounds;
    }

    // ~~

    function fitMapViewToProperties(
        )
    {
        if ( isUpdatingMap ) return;

        if ( map && $propertyArrayStore?.length > 0 )
        {
            let bounds = getBounds();

            map.fitBounds(
                bounds,
                {
                    animate: true,
                    duration: 1
                }
                );
        }
    };

    // ~~

    export function flyToProperty(
        )
    {
        if ( isUpdatingMap ) return;

        if ( map && $propertyArrayStore?.length > 0 )
        {
            let bounds = getBounds();

            map.flyToBounds(
                bounds,
                {
                    animate: true,
                    duration: 1
                }
                );
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( !isLoading )
            {
                initializeMap();
            }
        }
        );

    // ~~

    $: if ( !isLoading )
    {
        initializeMap();
    }

    // ~~

    onDestroy(
        async () =>
        {
            if ( map )
            {
                map.remove();
            }

            if ( showNearbyPlacesTimeout )
            {
                clearTimeout( showNearbyPlacesTimeout );
            }
        }
        );

    // ~~

    afterUpdate(
        () =>
        {
            if ( getJsonText( previousPropertyArray ) !== getJsonText( $propertyArrayStore ) )
            {
                updateMapView();
                previousPropertyArray = [ ...$propertyArrayStore ];
            }
        }
        );

    // ~~

    $: if ( $isDesktopMapOpenStore === true || $isMobileMapOpenStore === true )
    {
        if ( $selectedLocationStore )
        {
            if ( map )
            {
                map.setView( [ $selectedLocationStore.latitude, $selectedLocationStore.longitude ], 10 );
            }
        }
        else
        {
            fitMapViewToProperties();
        }

        if ( map )
        {
            setTimeout(
                () =>
                {
                    map.invalidateSize();
                },
                100
                );
        }
    }

    // ~~

    // $: if ( $propertyArrayStore )
    // {
    //     updateMapView();
    //     fitMapViewToProperties();
    // }

    // ~~

    $: if ( $isDesktopListOpenStore === false )
    {
        if ( $selectedLocationStore )
        {
            if ( map )
            {
                map.setView( [ $selectedLocationStore.latitude, $selectedLocationStore.longitude ], 10 );
            }
        }
        else
        {
            updateMapView();
            fitMapViewToProperties();
        }

        if ( map )
        {
            map.invalidateSize();
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    :global( .leaflet-popup-content )
    {
        margin: unset;
        min-height: unset;

        line-height: unset;
        font-size: unset;
        font-size: unset;
    }

    :global( .leaflet-popup-close-button )
    {
        display: none;
    }

    :global( .leaflet-fade-anim .leaflet-map-pane .leaflet-popup )
    {
        bottom: 2rem !important;
    }

    :global( .leaflet-popup-content-wrapper )
    {
        width: 20rem;
        max-width: calc( var( --viewport-width ) - 3rem );
        border-radius: 0.5rem;
        padding: 0.5rem;

        background: pageBackgroundColor;
    }

    :global( .leaflet-popup-content-wrapper .leaflet-popup-content )
    {
        width: 100% !important;
    }

    :global( .leaflet-popup-tip )
    {
        display: none;
    }

    .properties-map
    {
        height: calc( var( --viewport-height ) - 12.5rem );

        +media( desktop )
        {
            position: relative;

            height: calc( var( --viewport-height ) - 8.5rem );
            width: 100%;
        }
    }

    .properties-map.is-full-screen
    {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        height: 100dvh;

        +media( desktop )
        {
            position: relative;

            height: calc( var( --viewport-height ) - 8.5rem );
            width: 100%;
        }
    }

    .properties-map.is-desktop-list-open.is-desktop-map-open
    {
        +media( desktop )
        {
            height: calc( var( --viewport-height ) - 4.5rem );
        }
    }

    .properties-map.is-desktop-map-open
    {
        +media( desktop )
        {
            height: calc( var( --viewport-height ) - 10.5rem );
        }
    }

    .properties-map-container
    {
        height: 100%;
    }

    :global( .properties-map-cluster-icon )
    {
        border-radius: 50%;

        display: flex !important;
        justify-content: center;
        align-items: center;

        background-color: blueColor300;
    }

    :global( .properties-map-icon )
    {
        min-width: 3rem;
        border-radius: 1.5rem;
        padding: 6.6px 1.25rem 7.4px 1.25rem;

        display: inline-flex;
        gap: 0.25rem;

        background-color: blueColor300;
        box-shadow: 0px 4px 24px 0px rgba(23, 23, 23, 0.16);

        text-align: center;
        color: grayColor950 !important;
    }
</style>

<div
    class="properties-map"
    class:is-full-screen={ !$isOnboardingCompletedStore }
    class:is-mobile-map-open={ $isMobileMapOpenStore }
    class:is-mobile-list-open={ $isMobileListOpenStore }
    class:is-desktop-map-open={ $isDesktopMapOpenStore }
    class:is-desktop-list-open={ $isDesktopListOpenStore }
    transition:slide
>
    <div class="properties-map-container" bind:this={ mapElement }></div>
</div>
