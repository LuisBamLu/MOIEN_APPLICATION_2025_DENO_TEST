<script>
    // -- IMPORTS

    import { fade } from 'svelte/transition';
    import { getLocalizedText, getLocalizedTextBySlug, getRealText } from 'senselogic-gist';
    import { getFormattedPrice, getRatingText, getValueByTypeId } from '$lib/base';
    import { handlePropertyFavorite, checkPropertyFavorite } from '$lib/favorite';
    import { profileSignedInStore } from '$store/profileStore';
    import { languageTagStore } from '$store/languageTagStore';
    import Carousel from '$component/element/Carousel.svelte';
    import Image from '../../element/Image.svelte';
    import { link } from 'svelte-routing';
    import { currencyConversionByConversionCodeMapStore } from '$src/lib/store/currencyConversionByConversionCodeMapStore';

    // -- VARIABLES

    export let property;
    let pieceCount =
        Number( getValueByTypeId( 'bathroom-count',  property.featureByIdMap ) )
        + Number( getValueByTypeId( 'bedroom-count',  property.featureByIdMap ) );
    let totalArea = getValueByTypeId( 'property-area',  property.featureByIdMap );
    let isFavorite = checkPropertyFavorite( $profileSignedInStore, property.id );
    let conversionCode = ( property.currencyCode ?? 'EUR' ) + ', ' + ( $profileSignedInStore.currencyCode ?? 'EUR' )
    let conversionRate = $currencyConversionByConversionCodeMapStore[ conversionCode ]?.rate ?? 1;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-property-card
    {
        width: 100%;
        max-width: 27.5rem;
        border: 1px solid transparent;
        border: 1px solid lightGrayBorderColor;
        border-radius: 1rem;
        padding: 0.5rem;

        display: flex;
        flex: 1 0 100%;
        flex-direction: column;
        gap: -1rem;

        background: grayColor950;

        cursor: pointer;
        transition: border 400ms ease-in-out;
        transition: background-color 400ms ease-in-out;
        &:hover
        {
            background-color: whiteColor;
        }
    }

    .properties-property-card-image-container
    {
        position: relative;

        width: 100%;
    }

    .properties-property-card-image-wrapper
    {
        overflow: hidden;
        border-radius: 0.75rem;

        display: block;
    }

    :global( .properties-property-card-image )
    {
        width: 100%;
        aspect-ratio: 16/9;

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
        width: 2rem;
        border-radius: 0.75rem;
        padding: 0.4375rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .properties-property-card-details
    {
        padding: 1.25rem 0.5rem 0.5rem 0.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
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
</style>

<div class="properties-property-card" transition:fade>
    <div class="properties-property-card-image-container">
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
                    <span class="font-size-75 font-weight-700 color-green">
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
    <div class="properties-property-card-details">
        <a href="/property/{ property.id }" use:link>
            <div class="font-size-125 font-weight-700 color-blue">{ getLocalizedText( property.title ) }</div>
            <div class="font-size-100 font-weight-700 color-gray-100">
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
            <div class="font-size-75 font-weight-700 color-gray-100">
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
    </div>
</div>
