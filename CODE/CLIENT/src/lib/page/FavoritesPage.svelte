<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import Properties from '$component/page/properties/Properties.svelte';
    import { propertyArrayStore } from '../store/propertyArray';
    import { urlParamsStore } from '../store/urlParamsStore';

    // -- VARIABLES

    export let selectedCountry;
    export let selectedCity;

    let isCityProperty = false;
    let isLoading = true;

    // -- FUNCTIONS

    async function fetchPropertyArray(
        )
    {
        isLoading = true;

        if ( $profileSignedInStore.favoritePropertyId && $profileSignedInStore.favoritePropertyId.length )
        {
            $filterParameterByKeyMapStore.propertyIdArray = $profileSignedInStore.favoritePropertyId;

            let propertyData
                = await fetchData(
                    '/api/property/get-filtered',
                    {
                        method: 'POST',
                        body: JSON.stringify(
                            {
                                propertyIdArray: $profileSignedInStore.favoritePropertyId,
                                type: 'getPropertyArray'
                            }
                            ),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    );
            $propertyArrayStore = propertyData.propertyArray;
            isCityProperty = propertyData.isCityProperty;
        }

        isLoading = false;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( !$isLoadingProfile && !profileSignedInStore )
            {
                navigate( '/' );
            }

            else
            {
                await fetchPropertyArray();
            }
        }
        );

    // ~~

    $: { $urlParamsStore; fetchPropertyArray(); }
</script>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'properties-page-title', $languageTagStore ) }
    </title>
</svelte:head>

<div>
    <Properties
        isCityProperty={ isCityProperty }
        selectedCity={ selectedCity }
        selectedCountry={ selectedCountry }
        isLoading={ isLoading }
        isFavoritesPage={ true }
    />
</div>
