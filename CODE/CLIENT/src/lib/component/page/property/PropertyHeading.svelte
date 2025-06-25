<script>
    // -- IMPORTS

    import { onDestroy, setContext } from 'svelte';
    import BigPicture from 'bigpicture';
    import { getLocalizedText } from 'senselogic-gist';
    import { getRatingText } from '$lib/base';
    import { getStorageImagePath } from '$lib/storage';
    import { handlePropertyFavorite, checkPropertyFavorite } from '$lib/favorite';
    import { profileSignedInStore } from '$store/profileStore';
    import GoBack from '$component/layout/GoBack.svelte';
    import Carousel from '$component/element/Carousel.svelte';
    import StoryViewer from '$component/element/StoryViewer.svelte';
    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Image from '$component/element/Image.svelte';
    import { isMobileScreen } from '$store/appDataStore';
    import MobileGallery from '$component/element/MobileGallery.svelte';
    import PropertyGallery from './PropertyGallery.svelte';

    // -- VARIABLES

    export let propertyId;
    export let title;
    export let averageRating;
    export let cityName;
    export let countryName;
    export let imagePathArray;
    export let userProfile;

    let userId = $profileSignedInStore?.userId;
    let isFavorite = checkPropertyFavorite( $profileSignedInStore, propertyId );
    let isGalleryOpen = false;
    let activeGalleryImageIndex = 0;

    // -- FUNCTIONS

    function handleOpenGallery(
        event
        )
    {
        let targetElement = event.currentTarget;
        let index = parseInt( targetElement.getAttribute( 'data-index' ), 10 );
        let imageUrlArray = imagePathArray.map( img => ( { src: getStorageImagePath( img, 1280 ) } ) );

        activeGalleryImageIndex = index;
        isGalleryOpen = true;
        BigPicture(
            {
                el: event.target,
                gallery: imageUrlArray,
                animEl: event.target,
                position: index
            }
            );
    }

    // ~~

    function handleEditClick(
        )
    {
        navigate( `/dashboard/ads/${ propertyId }` );
    }

    // -- STATEMENTS

    setContext( 'imagePathArray', imagePathArray );

    // ~~

    setContext( 'propertyTitle', title );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-heading
    {
        position: relative;
    }

    .property-heading-actions
    {
        z-index: 2;
        position: absolute;
        top: 1rem;
        right: 1rem;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;

        +media( desktop )
        {
            right: 0;
        }
    }

    // .property-heading-actions-mobile
    // {
    //     z-index: 2;
    //     position: absolute;
    //     right: 1rem;
    //     bottom: 1rem;

    //     display: flex;
    //     flex-direction: row;
    //     gap: 1rem;
    // }

    .property-heading-city-average-rating,
    .property-heading-city-favorite
    {
        height: 2.25rem;
        width: max-content;
        border-radius: 0.75rem;
        padding: 0.5rem 0.625rem;

        display: flex;
        gap: 0.25rem;
        justify-content: center;
        align-items: center;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        +media( desktop )
        {
            height: 2.5rem;

            align-items: stretch;
        }
    }

    .property-heading-city-favorite
    {
        align-items: center;
    }

    .property-heading-go-back
    {
        z-index: 2;
        position: absolute;
        top: 1rem;
        left: 1rem;

        +media( desktop )
        {
            display: none;
        }
    }

    .property-heading-image-list-carousel-container
    {
        position: relative;
    }

    .property-heading-image-list-grid
    {
        +media( desktop )
        {
            width: calc( 100% - 3rem );

            display: grid;
            grid-template-columns: 30% 20% 30% 20%;
            gap: 1rem;
        }
    }

    :global( .gallery-image )
    {
        height: 20rem;
        width: 100%;

        object-fit: cover;
        object-position: center;

        +media( tablet )
        {
            height: 30rem;
        }

        +media( desktop )
        {
            border-radius: 0.75rem;
        }
    }

    .property-heading-image-list-grid-column
    {
        max-height: 30rem;
    }

    .property-heading-image-list-grid-column a,
    :global( .property-heading-image-list-grid-column-image )
    {
        +media( desktop )
        {
            height: 100%;
            width: 100%;
            border-radius: 0.75rem;

            display: block;
            object-fit: cover;
        }
    }

    .property-heading-image-list-grid-column.single a
    {
        display: none;

        +media( desktop )
        {
            display: block;
        }
    }

    .property-heading-image-list-grid-column.doble
    {
        display: none;

        +media( desktop )
        {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    }

    .property-heading-image-list-grid-column.doble a
    {
        +media( desktop )
        {
            max-height: 14.5rem;
        }
    }

    .property-heading-content
    {
        width: 90%;
        padding: 1.5rem 1rem;

        display: flex;
        flex-direction: column;
    }

    .property-heading-content.mobile
    {
        padding: 1.5rem 1rem 0 1rem;

        display: flex;

        +media( desktop )
        {
            display: none;
        }
    }

    .property-heading-content.large
    {
        display: none;

        +media( desktop )
        {
            border-bottom: unset;
            padding: unset;
            padding-bottom: 1.5rem;

            display: flex;
        }
    }

    .property-heading-image-list-carousel-gradient-overlay
    {
        z-index: 1;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        height: 100%;

        background: linear-gradient( 180deg, rgba( 0, 0, 0, 0.40 ) 0%, rgba( 0, 0, 0, 0 ) 100% );

        +media( desktop )
        {
            background: unset;
        }
    }

    .edit-button
    {
        z-index: 2;
        position: absolute;
        bottom: 1rem;
        right: 1rem;

        display: flex;
        flex-direction: row;
        gap: 1rem;

        font-size: 1rem;
        font-weight: 700;
        text-decoration: underline;
        color: greenColor300;

        +media( desktop )
        {
            top: 1rem;
            bottom: 0;
        }
    }

    .edit-button:hover
    {
        color: blueColor300;
    }
</style>

<div class="property-heading">
    <div class="property-heading-content large">
        <div class="font-size-150 font-weight-600 color-black property-heading-content-title">
            { getLocalizedText( title ) }
        </div>
        <div class="font-size-90 font-weight-500 color-gray property-heading-content-city-country">
            {#if cityName && countryName }
                { getLocalizedText( cityName ) } &#x2022; { getLocalizedText( countryName ) }
            {:else if cityName }
                { getLocalizedText( cityName ) }
            {:else if countryName }
                { getLocalizedText( countryName ) }
            {/if}
        </div>
    </div>
    <div class="property-heading-go-back">
        <GoBack/>
    </div>
    <!-- <PropertyGallery
        bind:isOpen={ isGalleryOpen }
        activeIndex={ activeGalleryImageIndex }
    /> -->
    <div class="property-heading-actions">
        {#if $profileSignedInStore }
            {#if userProfile.userId !== userId }
                <div class="font-size-90 font-weight-700 color-green-100 property-heading-city-average-rating">
                    <span class="green-star-icon size-150"/>
                    { averageRating === 0 ? 'N/A' : getRatingText( averageRating ) }
                </div>
                <button
                    class="property-heading-city-favorite"
                    on:click=
                        {
                            async () =>
                            {
                                isFavorite = await handlePropertyFavorite(
                                    $profileSignedInStore,
                                    propertyId,
                                    isFavorite
                                    );
                            }
                        }
                >
                    <span class="{ isFavorite ? 'green' : 'gray' }-favorite-icon size-150"></span>
                </button>
            {/if}
        {/if}
    </div>
    <div class="property-heading-image-list">
        <div class="property-heading-image-list-grid">
            <div class="property-heading-image-list-grid-column">
                <Carousel
                    hasDots={ true }
                    isAutomatic={ true }
                    resumeDuration={ 4000 }
                    isDraggable={ false }
                    hasCount={ false }
                    hasButtons={ false }
                >
                    {#each imagePathArray as imagePath, imagePathArrayIndex }
                        <div class="property-heading-image-list-carousel-container">
                            <Image
                                class="gallery-image"
                                imagePath={ imagePath }
                                imageSize={ 1280 }
                            />
                            {#if !$isMobileScreen }
                                <a
                                    class="property-heading-image-list-carousel-gradient-overlay"
                                    href={ imagePath }
                                    data-index="{ imagePathArrayIndex }"
                                    on:click|preventDefault={ handleOpenGallery }
                                >
                                    <div></div>
                                </a>
                            {/if}
                        </div>
                    {/each}
                </Carousel>
                {#if $isMobileScreen }
                    <MobileGallery propertyTitle={ getLocalizedText( title ) } imageArray={ imagePathArray }/>
                {/if}
            </div>
            {#each imagePathArray as imagePath, imagePathArrayIndex }
                 {#if imagePathArrayIndex < 5 }
                    {#if imagePathArrayIndex % 3 === 0 }
                        <div class="property-heading-image-list-grid-column doble">
                            <a
                                href={ imagePath }
                                data-bp={ getStorageImagePath( imagePath, 1280 ) }
                                data-index="{ imagePathArrayIndex }"
                                on:click|preventDefault={ handleOpenGallery }
                            >
                                <Image
                                    class="property-heading-image-list-grid-column-image"
                                    imagePath={ imagePath }
                                    imageSize={ 640 }
                                />
                            </a>
                            <a
                                href={ imagePathArray[ imagePathArrayIndex + 1 ] }
                                data-bp={ getStorageImagePath( imagePathArray[ imagePathArrayIndex + 1 ], 1280 ) }
                                data-index="{ imagePathArrayIndex + 1 }"
                                on:click|preventDefault={ handleOpenGallery }
                            >
                                <Image
                                    class="property-heading-image-list-grid-column-image"
                                    imagePath={ imagePathArray[ imagePathArrayIndex + 1 ] }
                                    imageSize={ 640 }
                                />
                            </a>
                        </div>
                    {:else if imagePathArrayIndex % 3 === 2 }
                        <div class="property-heading-image-list-grid-column single">
                            <a
                                href={ imagePath }
                                data-bp={ getStorageImagePath( imagePath, 1280 ) }
                                data-index="{ imagePathArrayIndex }"
                                on:click|preventDefault={ handleOpenGallery }
                            >
                                <Image
                                    class="property-heading-image-list-grid-column-image"
                                    imagePath={ imagePath }
                                    imageSize={ 1280 }
                                />
                            </a>
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
    </div>
    <div class="property-heading-content mobile">
        <div class="font-size-150 font-weight-600 color-black property-heading-content-title">
            { getLocalizedText( title ) }
        </div>
        <div class="font-size-90 font-weight-500 color-gray property-heading-content-city-country">
            {#if cityName && countryName }
                { getLocalizedText( cityName ) } &#x2022; { getLocalizedText( countryName ) }
            {:else if cityName }
                { getLocalizedText( cityName ) }
            {:else if countryName }
                { getLocalizedText( countryName ) }
            {/if}
        </div>
    </div>
    <div class="property-heading-actions-mobile">
        {#if $profileSignedInStore }
            {#if userId === userProfile.userId }
                <button class="edit-button" on:click={ handleEditClick }>
                    { getLocalizedTextBySlug( 'edit-label' ) }
                </button>
            {/if}
        {/if}
    </div>
</div>
