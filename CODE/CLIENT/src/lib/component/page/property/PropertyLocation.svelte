<script>
    // -- IMPORTS

    import { onMount, onDestroy } from 'svelte';
    import 'leaflet/dist/leaflet.css';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let propertyLatitude;
    export let propertyLongitude;
    export let countryName;
    export let cityName;
    export let showLabel = true;
    let leaflet;
    let mapElement;
    let map;
    let divIcon;
    let marker;

    // -- STATEMENTS

    $:
    {
        propertyLatitude, propertyLongitude;

        if ( leaflet )
        {
            map.setView( [ propertyLatitude, propertyLongitude ], 100 )
            map.removeLayer( marker )
            marker = leaflet.marker( [ propertyLatitude, propertyLongitude ], { icon: divIcon } )
            marker.addTo( map );
        }
    }

    // ~~

    onMount(
        async () =>
        {
            leaflet = await import( 'leaflet' );

            map = leaflet.map(
                mapElement,
                {
                    zoomControl: false,
                    attributionControl: false
                }
                )
                .setView( [ propertyLatitude, propertyLongitude ], 10 );

            leaflet.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                )
                .addTo( map );

            divIcon = leaflet.divIcon(
                {
                    className: 'property-location-map-icon',
                    html: `<div class="property-location-map-icon-wrapper"><div class="property-location-map-icon-bullet"></div></div>`,
                    iconSize: [ 30, 30 ],
                    iconAnchor: [ 15, 15 ]
                }
                );
            marker = leaflet.marker( [ propertyLatitude, propertyLongitude ], { icon: divIcon } )
            marker.addTo( map );
        }
        );

    // ~~

    onDestroy(
        async () =>
        {
            if ( map )
            {
                map.remove();
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-location
    {
        overflow: hidden;
        padding-bottom: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .property-location-map
    {
        height: 20rem;
        border-radius: 0.75rem;
    }

    :global( .property-location-map-icon-wrapper )
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate( -50%, -50% );

        height: 6rem;
        width: 6rem;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba( 36, 127, 121, 0.20 );
    }

    :global( .property-location-map-icon-bullet )
    {
        height: 1.75rem;
        width: 1.75rem;
        border: 4px solid grayColor950;
        border-radius: 50%;

        background-color: greenColor;
    }
</style>

<div class="property-location">
    {#if showLabel }
        <div class="font-size-125 font-weight-600 color-black property-location-title">
            { getLocalizedTextBySlug( 'property-location-label', $languageTagStore ) }
        </div>
    {/if}
    <div class="property-location-map" bind:this={ mapElement }></div>
    {#if cityName && countryName }
        <div class="font-size-100 font-weight-700 color-black property-location-country-city">
            { getLocalizedText( cityName, $languageTagStore ) }, { getLocalizedText( countryName, $languageTagStore ) }
        </div>
    {/if}
</div>
