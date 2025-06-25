<script>
    // -- IMPORTS

    import { fade } from 'svelte/transition';
    import { getLocalizedText, getLocalizedTextBySlug, getRealText } from 'senselogic-gist';
    import { getFormattedPrice, getRatingText, getValueByTypeId } from '$lib/base';
    import { handlePropertyFavorite, checkPropertyFavorite } from '$lib/favorite';
    import { profileSignedInStore } from '$store/profileStore';
    import { selectedLocationStore, isDesktopMapOpenStore, isMobileMapOpenStore } from '$store/locationStore';
    import { languageTagStore } from '$store/languageTagStore';
    import Carousel from '$component/element/Carousel.svelte';
    import Image from '../../element/Image.svelte';
    import { link } from 'svelte-routing';
    import { currencyConversionByConversionCodeMapStore } from '$src/lib/store/currencyConversionByConversionCodeMapStore';
    import { isMobileScreen } from '$src/lib/store/appDataStore';

    // -- VARIABLES

    export let property;
    export let showPlaceButton = true;

    let pieceCount =
        Number( getValueByTypeId( 'bathroom-count',  property.featureByIdMap ) )
        + Number( getValueByTypeId( 'bedroom-count',  property.featureByIdMap ) );
    let totalArea = getValueByTypeId( 'property-area',  property.featureByIdMap );
    let isFavorite = checkPropertyFavorite( $profileSignedInStore, property.id );
    let conversionCode = property.currencyCode + ', ' + ( $profileSignedInStore?.currencyCode ?? 'EUR' );
    let conversionRate
        = $currencyConversionByConversionCodeMapStore[ conversionCode ]?.rate ?? 1;

    // -- FUNCTIONS

    function setMapLocation(
        latitude,
        longitude
        )
    {
        if ( $selectedLocationStore )
        {
            if ( $selectedLocationStore.latitude != latitude && $selectedLocationStore.longitude != longitude )
            {
                selectedLocationStore.set( { latitude: property.latitude, longitude: property.longitude } );
                isDesktopMapOpenStore.set( true );
                isMobileMapOpenStore.set( true );
            }
            else
            {
                selectedLocationStore.set( null );
            }
        }
        else
        {
            selectedLocationStore.set( { latitude: property.latitude, longitude: property.longitude } );
            isDesktopMapOpenStore.set( true );
            isMobileMapOpenStore.set( true );
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-property-card
    {
        position: relative;

        max-width: 100%;
        border-radius: 1rem;

        display: flex;
        flex-direction: column;

        background: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );

        cursor: pointer;
        transition: border 400ms ease-in-out;
        transition: background-color 400ms ease-in-out;
        &:hover
        {
            background-color: whiteColor;
            box-shadow: 0px 4px 24px 0px rgba( 23, 23, 23, 0.16 );
        }
    }

    :global( .properties-property-card.selected )
    {
        border: 1px solid greenColor !important;

        transition: border 400ms ease-in-out;
    }

    .properties-property-card-image-container
    {
        position: relative;

        display: block;
    }

    .properties-property-card-image-wrapper
    {
        overflow: hidden;
        height: 9.625rem;
        border-radius: 1rem 1rem 0 0;

        display: flex;
    }

    :global( .properties-property-card-image )
    {
        height: 9.625rem;
        width: 100%;
        aspect-ratio: 16 / 9;

        object-fit: cover;
    }

    .properties-property-card-container
    {
        z-index: 1;
        position: absolute;
        bottom: -1rem;
        right: 0;

        width: 100%;
        padding: 0rem 0.75rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
    }

    .properties-property-card-favorite,
    .properties-property-card-rating
    {
        z-index: 3;

        height: 2rem;
        border-radius: 0.75rem;
        padding: 0.4375rem;

        display: flex;
        gap: 0.25rem;
        justify-content: center;
        align-items: center;

        background-color: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
    }

    .properties-property-card-details
    {
        overflow: hidden;
        padding: 1.5rem 0.75rem 0.75rem 0.75rem;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;
    }

    .properties-property-card-details > a
    {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        align-items: flex-start;
        align-self: stretch;
    }

    .property-card-location
    {
        position: absolute;
        bottom: 1rem;
        right: 1rem;

        height: 1.5rem;
        width: 1.5rem;
        border-radius: 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
        :hover
        {
            background-color: blueColor100;
            box-shadow: 0px 4px 24px 0px rgba( 23, 23, 23, 0.16 );
        }
    }

    .property-card-title
    {
        max-width: 100%;

        line-height: 1.5rem;

        +media( desktop )
        {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-clamp: 2;
            overflow: hidden;
            height: calc( 1.625rem * 2 );

            line-height: 1.625rem;
            text-overflow: ellipsis;
        }
    }

    .property-card-subtitle
    {
        line-height: 1.125rem;
    }

    .properties-property-card:hover .slot-container
    {
        opacity: 1;
    }

    .slot-container
    {
        z-index: 1;
        position: absolute;
        top: 0.75rem;

        opacity: 0;

        transition: opacity 300ms cubic-bezier( 0.75, 0, 0.25, 1 );
    }

    .slot-container.is-mobile
    {
        opacity: 1;
    }

    .slot-container.left
    {
        left: 0.75rem;
    }

    .slot-container.right
    {
        right: 0.75rem;
    }
</style>

<div class="properties-property-card" transition:fade>
    <div class="properties-property-card-image-container">
        <div>
            {#if $$slots[ 'view-button' ] }
                <span class="slot-container left" class:is-mobile={ $isMobileScreen }>
                    <slot name="view-button"/>
                </span>
            {/if}
            {#if $$slots[ 'edit-button' ] }
                <span class="slot-container right" class:is-mobile={ $isMobileScreen }>
                    <slot name="edit-button"/>
                </span>
            {/if}
            <a
                class="properties-property-card-image-wrapper"
                href="/property/{ property.id }"
                use:link
            >
                {#if property.imagePathArray.length > 0 }
                    {#key property }
                        <Carousel
                            resumeDuration={ 4000 }
                            isDraggable={ false }
                            hasCount={ false }
                            hasButtons={ false }
                            isAutomatic={ true }
                        >
                            {#each property.imagePathArray as imagePath }
                                <Image
                                    class="properties-property-card-image"
                                    imagePath={ imagePath }
                                    imageSize={ 640 }
                                />
                            {/each}
                        </Carousel>
                    {/key}
                {:else}
                    <Image
                        class="properties-property-card-image"
                        imagePath={ property.imagePath }
                        imageSize={ 640 }
                    />
                {/if}
            </a>
            <div class="properties-property-card-container">
                {  #if property.averageRating  }
                    <div class="properties-property-card-rating">
                        <span class="green-star-icon size-100"/>
                        <span class="font-size-75 font-weight-700 color-green-100">
                            { getRatingText( property.averageRating ) }
                        </span>
                    </div>
                {:else}
                    <div/>
                {/if}
                {#if $profileSignedInStore }
                    <button
                        class="properties-property-card-favorite"
                        on:click=
                            {
                                async () =>
                                {
                                    handlePropertyFavorite( $profileSignedInStore, property.id, isFavorite );
                                    isFavorite = !isFavorite;
                                }
                            }
                    >
                        <span class="{ isFavorite ? 'red' : 'gray-900' }-favorite-icon size-125"/>
                    </button>
                {/if}
            </div>
        </div>
    </div>
    <div class="properties-property-card-details">
        <a href="/property/{ property.id }" use:link>
            <div class="property-card-title font-size-100-phone font-size-125-desktop font-weight-700 color-gray-100">
                { getLocalizedText( property.title, $languageTagStore ) }
            </div>
            <div class="property-card-subtitle font-size-75 font-weight-500 color-gray-100">
                {#if property.cityName && property.countryName }
                    { getLocalizedText( property.cityName, $languageTagStore ) },
                    { getLocalizedText( property.countryName, $languageTagStore ) }
                {:else if property.cityName }
                    { getLocalizedText( property.cityName, $languageTagStore ) }
                {:else if property.countryName }
                    { getLocalizedText( property.countryName, $languageTagStore ) }
                {/if}
            </div>
            <div class="font-size-75 font-weight-500 color-gray">
                {#if totalArea && !isNaN( totalArea ) && pieceCount && !isNaN( pieceCount )  }
                    { getRealText( totalArea, 0, 0 ) }
                    { getLocalizedTextBySlug( 'property-detail-square-meters-label', $languageTagStore ) }
                    &#x2022; { pieceCount }
                    { getLocalizedTextBySlug( 'property-card-pieces', $languageTagStore ) }
                {:else if totalArea && !isNaN( totalArea ) }
                    { getRealText( totalArea, 0, 0 ) }
                    { getLocalizedTextBySlug( 'property-detail-square-meters-label', $languageTagStore ) }
                {:else if pieceCount && !isNaN( pieceCount )  }
                    { pieceCount } { getLocalizedTextBySlug( 'property-card-pieces', $languageTagStore ) }
                {/if}
            </div>
            <div class="property-card-subtitle font-size-75 font-weight-700 color-gray-100">
                {#if property.shortTermDailyPrice }
                    {
                        getFormattedPrice(
                            property.shortTermDailyPrice * conversionRate,
                            $languageTagStore,
                            $profileSignedInStore?.currencyCode ?? 'EUR'
                            )
                    }
                    { getLocalizedTextBySlug( 'property-card-night-label', $languageTagStore ) }
                {/if}
                {#if property.longTermMonthlyPrice }
                    &#x2022;
                    {
                        getFormattedPrice(
                            property.longTermMonthlyPrice * conversionRate,
                            $languageTagStore,
                            $profileSignedInStore?.currencyCode ?? 'EUR'
                            )
                    }
                    { getLocalizedTextBySlug( 'property-card-month-label', $languageTagStore ) }
                {/if}
            </div>
        </a>
        {#if showPlaceButton }
            <button
                class="property-card-location"
                on:click={ () => setMapLocation( property.latitude, property.longitude ) }
                class:is-selected=
                    {
                        $selectedLocationStore
                        && property.latitude === $selectedLocationStore.latitude
                        && property.longitude === $selectedLocationStore.longitude
                    }
            >
                <span class="green-place-icon size-100"></span>
            </button>
        {/if}
    </div>
</div>
