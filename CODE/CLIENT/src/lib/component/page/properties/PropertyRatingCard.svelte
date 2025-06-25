<script>
    // -- IMPORTS

    import { getRatingText, getValueByTypeId } from '$src/lib/base';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug, getRealText } from 'senselogic-gist';
    import Carousel from '../../element/Carousel.svelte';
    import PropertyRating from '../ratings/PropertyRating.svelte';
    import GuestRating from '../ratings/users-modal/GuestRating.svelte';
    import HostRating from '../ratings/users-modal/HostRating.svelte';
    import { onMount } from 'svelte';
    import ProfileImage from '../../layout/ProfileImage.svelte';
    import Image from '../../element/Image.svelte';
    import { link } from 'svelte-routing';

    // -- VARIABLES

    export let isRatingAvailable = false;
    export let userType;
    export let rentalId;
    export let propertyRating;
    export let rentalData;

    let property = rentalData.property;
    let user = rentalData.profile;
    let userAverageRatingValue = 0
    let propertyName = property.title
    let propertyCity = property.cityName
    let totalArea = getValueByTypeId( 'property-area',  property.featureByIdMap );
    let userName = user.firstName
    let userRatings = user.reviewArray.map( review => review.rating )
    let isPropertyRatingModalOpened = false;
    let isHostRatingModalOpened = false;
    let isGuestRatingModalOpened = false;
    let noRating = 'N/A';
    let isUserAlreadyReviewed = false;
    let isPropertyAlreadyReviewed = false;
    let arrivalDate = new Date( rentalData.arrivalDate );
    let departureDate = new Date( rentalData.departureDate );
    let dateFormatter =
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

    // -- FUNCTIONS

    function getShortenedText(
        text,
        length
        )
    {
        return text.length > length ? text.substring( 0, length ) + "..." : text;
    }

    // ~~

    function checkIfUserIsReviewed(
        )
    {
        isUserAlreadyReviewed = user.reviewArray.some( review => review.rentalBookingId === rentalId );
    }

    // ~~

    function checkIfPropertyIsReviewed(
        )
    {
        isPropertyAlreadyReviewed = property.reviewArray.some( review => review.rentalBookingId === rentalId );
    }

    // ~~

    function openPropertyRatingModal(
        )
    {
        isPropertyRatingModalOpened = true;
    }

    // ~~

    function openHostRatingModal(
        )
    {
        isHostRatingModalOpened = true;
    }

    // ~~

    function openGuestRatingModal(
        )
    {
        isGuestRatingModalOpened = true;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            checkIfUserIsReviewed();
            checkIfPropertyIsReviewed();
        }
        );

    // ~~

    $: if ( userRatings.length > 0 )
    {
        userAverageRatingValue = userRatings.reduce( ( acc, rating ) => acc + rating ) / userRatings.length;
    }
    else
    {
        userAverageRatingValue = 0
    }
</script>

<style lang="stylus">
    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    .rating-card-container
    {
        height: 100%;
        width: 80vw;
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
            height: 100%;

            flex-direction: row;
            gap: 2.5rem;
        }
    }

    .rating-card-container:hover
    {
        border: 2px solid greenColor800;

        background-color: greenColor900;
    }

    .property-image-container
    {
        height: 60%;
        width: 100%;

        +media( desktop )
        {
            overflow: hidden;
            height: 100%;
            width: 16.25rem;
        }
    }

    :global( .rating-card-image )
    {
        height: 15rem;
        width: 100%;
        border-radius: .5rem;

        object-fit: cover;

        transition: all 0.3s;

        +media( desktop )
        {
            height: 8.62rem;
        }
    }

    .property-info
    {
        height: 100%;
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

    .stay-info
    {
        display: flex;
        gap: 1rem;
        p
        {
            line-height: 1rem;
            font-size: .65rem;
            font-weight: 700;
            font-style: normal;
            color: grayColor300;
        }
    }

    .user-info
    {
        height: 100%;
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
        height: max-content;
        width: max-content;
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

    .rate-here:hover
    {
        color: blueColor500;

        cursor: pointer;
    }

    .property-image-wrapper
    {
        overflow: hidden;
        border-radius: 0.75rem;

        display: flex;
    }
</style>

{#if window.location.href.includes( 'bookings' ) }
    <PropertyRating
        isOpen={ isPropertyRatingModalOpened }
        thisRental={ rentalData }
        hostName={ user.firstName }
        propertyName={ property.title }
        rentalId={ rentalId }
        on:outsideClick={ () => ( isPropertyRatingModalOpened = !isPropertyRatingModalOpened ) }
        on:reviewSubmitted={ () => ( isPropertyAlreadyReviewed = true ) }
    />
    <HostRating
        isOpen={ isHostRatingModalOpened }
        thisRental={ rentalData }
        previousRating={ userAverageRatingValue }
        hostData={ user }
        rentalId={ rentalId }
        on:outsideClick={ () => ( isHostRatingModalOpened = !isHostRatingModalOpened ) }
        on:reviewSubmitted={ () => ( isUserAlreadyReviewed = true ) }
    />
{:else}
    <GuestRating
        isOpen={ isGuestRatingModalOpened }
        thisRental={ rentalData }
        previousRating={ userAverageRatingValue }
        guestData={ user }
        rentalId={ rentalId }
        on:outsideClick={ () => ( isGuestRatingModalOpened = !isGuestRatingModalOpened ) }
        on:reviewSubmitted={ () => ( isUserAlreadyReviewed = true ) }
    />
{/if}
<div class="rating-card-container">
    <div class="property-image-container">
        <a
            class="property-image-wrapper"
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
                            imagePath={ imagePath }
                            imageSize={ 640 }
                            alt="Property"
                            class="rating-card-image"
                        />
                    {/each}
                </Carousel>
            {/key}
        {:else}
            <Image
                imagePath={ property.imagePath }
                imageSize={ 640 }
                class="rating-card-image"
                alt="Property"
            />
        {/if}
        </a>
    </div>
    <div class="property-info">
        <div class="property-info-header">
            <h1 class="property-name">
                { getShortenedText( getLocalizedText( propertyName, $languageTagStore ) , 50 ) }
            </h1>
            <p class="property-city">
                { propertyCity }
                {#if totalArea && !isNaN( totalArea ) }
                    &#x2022; { getRealText( totalArea, 0, 0 ) }
                    { getLocalizedTextBySlug( 'property-detail-square-meters-label', $languageTagStore ) }
                {/if}
            </p>
            <div class="stay-info">
                <p>
                    { getLocalizedTextBySlug( 'date-from-label', $languageTagStore ) }
                    { arrivalDate.toLocaleDateString( $languageTagStore, dateFormatter ) }
                </p>
                <p>
                    { getLocalizedTextBySlug( 'date-to-label', $languageTagStore ) }
                    { departureDate.toLocaleDateString( $languageTagStore, dateFormatter) }
                </p>
            </div>
        </div>
        {#if userType === 'host' }
            <div class="font-size-75 font-weight-700 color-green property-rating">
                <img src="/image/icon/star.svg" alt="star" class="star" />
                { propertyRating === 0 ? noRating : getRatingText( propertyRating ) }
            </div>
        {:else}
            {#if isRatingAvailable === false }
                <div class="font-size-75 font-weight-700 color-green property-rating">
                    <img src="/image/icon/star.svg" alt="star" class="star" />
                    { propertyRating === 0 ? noRating : getRatingText( propertyRating ) }
                </div>
            {:else}
                {#if !isPropertyAlreadyReviewed }
                    <div
                        class="font-size-75 font-weight-700 color-green property-rating rate-here"
                        on:click={ openPropertyRatingModal }
                    >
                        <img src="/image/icon/star.svg" alt="star" class="star" />
                        { getLocalizedTextBySlug( 'rate-property-label', $languageTagStore ) }
                    </div>
                {:else}
                    <div class="user-rating">
                        <p class="font-size-75 font-weight-700 color-green">
                            { getLocalizedTextBySlug( 'already-rated-label', $languageTagStore ) }
                        </p>
                    </div>
                {/if}
            {/if}
        {/if}
    </div>
    <div class="user-info">
        <div class="user-info-header-container">
            {#if userType === 'host' }
                <p class="user-info-text">
                    { getLocalizedTextBySlug( 'reserved-by-label', $languageTagStore ) }
                </p>
            {:else if userType === 'guest' }
                <p class="user-info-text">
                    { getLocalizedTextBySlug( 'property-host-hosted-by-label', $languageTagStore ) }
                </p>
            {/if}
        <div class="user-info-header">
            <a class="user-header-link" href="/profile/{ user.id }" use:link>
                <ProfileImage profile={ user } size="small" />
                <h1 class="user-name">{ userName }</h1>
            </a>
        </div>
        </div>
        {#if isRatingAvailable === false }
            <div class="font-size-75 font-weight-700 color-green user-rating">
                <img src="/image/icon/star.svg" alt="star" class="star"/>
                { userAverageRatingValue === 0 ? noRating : getRatingText( userAverageRatingValue ) }
            </div>
        {:else}
            {#if !isUserAlreadyReviewed }
                {#if userType === 'host' }
                    <div
                        class="font-size-75 font-weight-700 color-green user-rating rate-here"
                        on:click={ openGuestRatingModal }
                    >
                        <img src="/image/icon/star.svg" alt="star" class="star" />
                        { getLocalizedTextBySlug( 'rate-guest-label', $languageTagStore ) }
                    </div>
                {:else}
                    <div
                        class="font-size-75 font-weight-700 color-green user-rating rate-here"
                        on:click={ openHostRatingModal }
                    >
                        <img src="/image/icon/star.svg" alt="star" class="star" />
                        { getLocalizedTextBySlug( 'rate-host-label', $languageTagStore ) }
                    </div>
                {/if}
            {:else}
                <div class="user-rating">
                    <p class="font-size-75 font-weight-700 color-green">
                        { getLocalizedTextBySlug( 'already-rated-label', $languageTagStore ) }
                    </p>
                </div>
            {/if}
        {/if}
    </div>
</div>
