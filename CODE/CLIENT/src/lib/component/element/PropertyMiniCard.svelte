<script>
    // -- IMPORTS

    import { Link } from 'svelte-routing';
    import Image from './Image.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import Carousel from './Carousel.svelte';
    import ProfileImage from '../layout/ProfileImage.svelte';
    import { getRatingText } from '$src/lib/base';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let bookingData;

    let profileRatingValues = [];
    let profileAverageRatingValue;
    let noRating = 'N/A';

    // -- FUNCTIONS

    function getShortenedText(
        text,
        length
        )
    {
        return text.length > length ? text.substring( 0, length ) + "..." : text;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( bookingData.profile.profileReviews?.length )
            {
                profileRatingValues = bookingData.profile.profileReviews.map( review => review.rating );
            }

            if ( profileRatingValues.length > 0 )
            {
                profileAverageRatingValue = profileRatingValues.reduce( ( acc, rating ) => acc + rating ) / profileRatingValues.length;
            }
            else
            {
                profileAverageRatingValue = 0
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .rating-card-container
    {
        width: 100%;
        border: 2px solid grayColor800;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
        align-self: stretch;

        background: grayColor950;

        transition: all 0.3s;

        +media( desktop )
        {
            flex-direction: row;
            gap: 2.5rem;
            align-items: stretch;
        }
    }

    .rating-card-container:hover
    {
        border: 2px solid greenColor800;

        background-color: greenColor900;
    }

    .property-image-container
    {
        overflow: hidden;
        height: 15rem;
        width: 100%;
        border-radius: .5rem;

        object-fit: cover;

        +media( desktop )
        {
            height auto;
            width: 10rem;
            aspect-ratio: 1/1;
        }
    }

    .card-image
    {
        height: 100%;
        width: 100%;
        border-radius: .5rem;

        object-fit: cover;

        transition: all 0.3s;
    }

    .property-info
    {
        width: 100%;
        border-bottom: 1px solid grayColor800;
        padding-bottom: 1rem;

        display: flex;
        flex: 1 0 0;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        +media( desktop )
        {
            border-bottom: none;
            border-right: 1px solid grayColor800;
            padding-bottom: 0;
            padding-right: 2rem;

            flex-direction: column;
        }
    }

    .property-info-header
    {
        width: 80%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        +media( desktop )
        {
            width: 100%;
        }
    }

    .property-name
    {
        width: 60%;

        line-height: 1.6rem;
        font-size: 1rem;
        font-weight: 600;
        font-style: normal;
        color: grayColor100;

        +media( desktop )
        {
            width: 100%;

            font-size: 1rem;
        }
    }

    .property-city,
    .user-info-text,
    .user-name
    {
        line-height: 1.125rem;
        font-size: .75rem;
        font-weight: 500;
        font-style: normal;
        color: grayColor300;
    }

    .user-info
    {
        width: 100%;

        display: flex;
        flex: 1 0 0;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        +media( desktop )
        {
            flex-direction: column;
        }
    }

    .user-header-link
    {
        display: flex;
        gap: .25rem;
        align-items: center;
    }

    .user-name
    {
        color: grayColor100
        font-weight: 700;
    }

    .user-info-header-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .property-rating,
    .user-rating
    {
        border-radius: 0.75rem;
        padding: 0.5rem;

        display: flex;
        gap: 0.2rem;
        justify-content: center;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .user-rating p
    {
        text-align: center;
    }

    .star
    {
        height: 1rem;
        width: .9rem;
    }
</style>

<div class="rating-card-container">
    <div class="property-image-container">
        {#if bookingData.imagePathArray.length > 0 }
            {#key bookingData }
                <Carousel
                    resumeDuration={ 4000 }
                    isDraggable={ false }
                    hasCount={ false }
                    hasButtons={ false }
                    isAutomatic={ true }
                >
                    {#each bookingData.imagePathArray as imagePath }
                        <Image
                            imagePath={ imagePath }
                            imageSize={ 640 }
                            alt="Property"
                            class="card-image"
                        />
                    {/each}
                </Carousel>
            {/key}
        {:else}
            <Image
                imagePath={ bookingData.imagePath }
                imageSize={ 640 }
                class="rating-card-image"
                alt="Property"
            />
        {/if}
    </div>
    <div class="property-info">
        <div class="property-info-header">
            <h1 class="property-name">
                { getShortenedText( getLocalizedText( bookingData.title, $languageTagStore ) , 50 ) }
            </h1>
            <p class="property-city">
                { bookingData.cityName }
            </p>
        </div>
        <div class="font-size-75 font-weight-700 color-green property-rating">
            <img src="/image/icon/star.svg" alt="star" class="star" />
            { !bookingData.averageValueRating ? noRating : getRatingText( bookingData.averageValueRating ) }
        </div>
    </div>
    <div class="user-info">
        <div class="user-info-header-container">
            <p class="user-info-text">
                { getLocalizedTextBySlug( 'property-host-hosted-by-label', $languageTagStore ) }
            </p>
        <div class="user-info-header">
            <div class="user-header-link">
                <ProfileImage profile={ bookingData.profile } size="small" />
                <h1 class="user-name">{ `${bookingData.profile.firstName}` }</h1>
            </div>
        </div>
        </div>
            <div class="font-size-75 font-weight-700 color-green user-rating">
                <img src="/image/icon/star.svg" alt="star" class="star"/>
                { profileAverageRatingValue === 0 ? noRating : getRatingText( profileAverageRatingValue ) }
            </div>
    </div>
</div>
