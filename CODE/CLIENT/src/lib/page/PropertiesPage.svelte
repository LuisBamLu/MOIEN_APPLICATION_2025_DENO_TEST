<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import { processParameters } from '$lib/parameters';
    import { urlParamsStore } from '$store/urlParamsStore';
    import { updateFeatureParameters, updateLocationParameters, updatePropertyParameters, updateBookingParameters, filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore.js';
    import Properties from '$component/page/properties/Properties.svelte';
    import OnboardingModal from '$component/onboarding/OnboardingModal.svelte';
    import Seo from '$component/element/Seo.svelte';
    import { propertyArrayStore } from '$store/propertyArray';
    import { getJsonText } from 'senselogic-gist';
    import { currencyConversionByConversionCodeMapStore } from '$store/currencyConversionByConversionCodeMapStore';

    // -- VARIABLES

    export let arrivalDate;
    export let departureDate;
    export let selectedCountry;
    export let selectedCity;
    let isCityProperty = true;
    let isLoading = true;
    let currentPage = 1;
    let hasMorePropertyPages = true;

    // -- FUNCTIONS

    async function loadData(
        propertyPage = 1
        )
    {
        isLoading = true;

        let urlParams = new URLSearchParams( window.location.search );
        let { propertyParameters, locationParameters, bookingParameters, featureParameters } = await processParameters( urlParams );
        $filterParameterByKeyMapStore.propertyIdArray = null;

        updateBookingParameters( bookingParameters );
        updatePropertyParameters( propertyParameters );
        updateLocationParameters( locationParameters );
        updateFeatureParameters( featureParameters );

        let data
            = await fetchData(
                '/api/property/get',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: getJsonText(
                        {
                            propertyParameters: { ...propertyParameters, statusId: 'online' },
                            locationParameters,
                            bookingParameters,
                            featureParameters,
                            propertyPage,
                            propertyLimit: 1000,
                            type: 'getPropertyArray'
                        }
                        ),
                }
                );

        if ( data && data.propertyArray )
        {
            if ( propertyPage > 1 )
            {
                $propertyArrayStore = [ ...$propertyArrayStore, ...data.propertyArray ];
            }
            else
            {
                $propertyArrayStore = data.propertyArray;
            }

            hasMorePropertyPages = data.hasMorePropertyPages;
            isCityProperty = data.isCityProperty;

            if ( data.optionMap.currencyConversionByConversionCodeMap )
            {
                $currencyConversionByConversionCodeMapStore =
                    {
                        ...$currencyConversionByConversionCodeMapStore,
                        ...data.optionMap.currencyConversionByConversionCodeMap
                    };
            }
        }
        else
        {
            $propertyArrayStore = [];
        }

        isLoading = false;
    }

    // ~~

    function loadMore(
        )
    {
        if ( !isLoading && hasMorePropertyPages )
        {
            currentPage++;
            loadData( currentPage );
        }
    }

    // ~~

    function handlePopState(
        )
    {
        loadData( 1 );
        currentPage = 1;
    }

    // -- STATEMENTS

    $: { $urlParamsStore; loadData( 1 ); }
    $: { $urlParamsStore; currentPage = 1; }

    // ~~

    onMount(
        () =>
        {
            window.addEventListener( 'popstate', handlePopState );

            return () =>
            {
                window.removeEventListener( 'popstate', handlePopState );
            };
        }
        );
</script>

<Seo
    metaTitle='Moien properties'
    metaDescription="Rent, sublet, live and travel! Discover a new rental experience and simplify your procedures with Moïen."
    url="https://moien.com/"
    path="search"
/>
<div>
    <Properties
        onNearBottom={ loadMore }
        isCityProperty={ isCityProperty }
        selectedCity={ selectedCity }
        selectedCountry={ selectedCountry }
        arrivalDate={ arrivalDate }
        departureDate={ departureDate }
        bind:isLoading={ isLoading }
    />
</div>
<OnboardingModal/>
