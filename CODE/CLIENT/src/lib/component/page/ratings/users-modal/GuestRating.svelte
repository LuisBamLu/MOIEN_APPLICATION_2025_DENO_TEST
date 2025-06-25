<script>
    // -- IMPORTS

    import RatingButtons from '$src/lib/component/element/RatingButtons.svelte';
    import ModalActions from '$src/lib/component/modal/ModalActions.svelte';
    import ModalButton from '$src/lib/component/modal/ModalButton.svelte';
    import ModalContent from '$src/lib/component/modal/ModalContent.svelte';
    import ModalHeader from '$src/lib/component/modal/ModalHeader.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug, isInteger } from 'senselogic-gist';
    import RatingCriteria from '../RatingCriteria.svelte';
    import ModalRoot from '$src/lib/component/modal/ModalRoot.svelte';
    import { guestRatings } from '$src/lib/store/ratingsStore';
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { hostUrl } from '$src/lib/base';
    import Loading from '$src/lib/component/element/Loading.svelte';
    import { userRentalsStore } from '$src/lib/store/rentalStore';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let isOpen = true;
    export let thisRental;
    export let guestData;
    export let rentalId;

    let property = thisRental.property;
    let guestName = guestData.firstName;
    let profileReviews = [];
    let guestId = guestData.userId;
    let updatedProfileRating;
    let average;
    let form;
    let ratingType = 'guest'
    let activeStep = 1;
    let averageRatingValue;
    let allRatingValues = [];
    let dispatch = createEventDispatcher();
    let publicMessageReview;
    let privateMessageReview;
    let isRatingButtonClicked =
        {
            guestOverall: false,
            guestCommunication: false,
            guestCheckIn: false,
            guestCompliance: false
        }
    let isSubmitButtonLoading = false;

    let unsubscribe = userRentalsStore.subscribe(
        store =>
        {
            let rental
                = store.userRentalsArray.find( rental => rental.id === rentalId );

            profileReviews = rental ? rental.profile.reviewArray : []
        }
        );

    // -- FUNCTIONS

    function closeModal(
        )
    {
        dispatch( 'outsideClick' );
    }

    // ~~

    function sendReview(
        )
    {
        dispatch( 'reviewSubmitted' );
    }

    // ~~

    function nextStep(
        )
    {
        if ( activeStep === 1 )
        {
            if ( !isRatingButtonClicked.guestOverall )
            {
                toast.warning( getLocalizedTextBySlug( 'choose-a-rating-label', $languageTagStore ) );
            }
            else
            {
                activeStep++;
            }
        }
        else if ( activeStep === 2 )
        {
            if ( Object.values( isRatingButtonClicked ).some( clicked => !clicked ) )
            {
                toast.warning( getLocalizedTextBySlug( 'rate-all-criteria-label', $languageTagStore ) );
            }
            else
            {
                getAverageRating();
                activeStep++;
            }
        }
        else if ( activeStep === 3 )
        {
            publicMessageReview = document.querySelector( '.public-comment-textarea' ).value;
            activeStep++;
        }
        else if ( activeStep === 4 )
        {
            privateMessageReview = document.querySelector( '.public-comment-textarea' ).value;
            activeStep++;
        }
        else
        {
            return;
        }
    }

    // ~~

    function previousStep(
        )
    {
        if ( activeStep > 1 )
        {
            activeStep--;
        }
    }

    // ~~

    function updateRatingStore(
        criteria,
        rating,
        value,
        img
        )
    {
        guestRatings.update(
            currentRatings =>
            {
                currentRatings[ criteria ] = { value, rating, img };
                return currentRatings;
            }
            );
        isRatingButtonClicked[ criteria ] = true;
    }

    // ~~

    function getAverageRating(
        )
    {
        let ratingValues = Object.values( $guestRatings );
        allRatingValues = [];

        for ( let key in ratingValues )
        {
            allRatingValues.push( ratingValues[ key ].value );
        }
        average = allRatingValues.reduce( ( a, b ) => a + b ) / allRatingValues.length;

        let guestRatingsByReviewArray = guestData.reviewArray.map( review => review.rating );
        guestRatingsByReviewArray.push( average );

        updatedProfileRating = guestRatingsByReviewArray.reduce( ( a, b ) => a + b ) / guestRatingsByReviewArray.length;
        averageRatingValue = `${ isInteger( average ) ? average : average.toFixed( 1 ) }/5`;
    }

    // ~~

    async function handleSubmitRating(
        )
    {
        let formData = new FormData();

        formData.append( 'ratedUserProfileId', guestId )
        formData.append( 'rating', average )
        formData.append( 'text', publicMessageReview )
        formData.append( 'userId', $profileSignedInStore.userId )
        formData.append( 'rentalBookingId', rentalId )
        formData.append( 'privateMessage', privateMessageReview )
        formData.append( 'propertyId', property.id )

        isSubmitButtonLoading = true;

        try
        {
            let response = await fetch(
                hostUrl + '/api/add-user-review',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }
                );

            if ( response.ok )
            {
                sendReview();
                let newReview = { rating: average };

                userRentalsStore.update(
                    currentBookings =>
                    {
                        currentBookings.userRentalsArray.map(
                            rental =>
                            {
                                if ( rental.profile.userId === guestId )
                                {
                                    rental.profile.reviewArray.push( newReview );
                                }
                            }
                            )

                        return currentBookings;
                    }
                    );

                Object.keys( isRatingButtonClicked ).forEach(
                    key =>
                    {
                        updateRatingStore( key, '', 0, '' );
                    }
                    );

                console.log( await response.text() );
                isSubmitButtonLoading = false;
                toast.success( getLocalizedTextBySlug( 'review-submitted-label', $languageTagStore ) );
            }
            else
            {
                console.error( await response.text() );
                toast.error( getLocalizedTextBySlug( 'account-transfer-to-account-modal-error-label', $languageTagStore ) );
            }
        }
        catch ( error )
        {
            console.error('Fetch error:', error);
        }

        closeModal();
    }

    // -- STATEMENTS

    onDestroy(
        () =>
        {
            unsubscribe();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../constant.styl';
    @import '../../../../../mixin.styl';

    // -- ELEMENTS

    form
    {
        width: 100%;
    }

    // -- CLASSES

    .content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .general-experience
    {
        width: 95%;

        display: flex;
        flex-direction: column;
        align-items: center;

        text-align: center;
    }

    .general-experience img
    {
        transform: scaleX( -1 );
    }

    .text-center
    {
        margin-top: 1rem;
        margin-top: 1rem;

        font-size: 1.5rem;
        font-weight: 500;
        color: grayColor300;
    }

    .criteria-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .rating-criteria-title
    {
        margin-bottom: 1rem;

        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 400;
        font-style: normal;
        text-align: center;
        color: grayColor300;
    }

    .public-comment-title
    {
        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        font-style: normal;
        text-align: center;
        color: grayColor100;
    }

    .public-comment-description
    {
        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 400;
        font-style: normal;
        text-align: center;
        color: grayColor300;
    }

    .public-comment-textarea
    {
        margin-top: 2rem;
        height: 200px;
        width: 100%;
        border-radius: 1rem;
        padding: var(--Radius-Medium, 12px) 16px 16px 16px;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        background-color: white;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);

        color: grayColor100;

        resize: none;
    }

    .public-comment-textarea:focus
    {
        outline: none;

        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    .review-list
    {
        color: grayColor300;
    }

    .overall-rating
    {
        color: grayColor100;
    }

    .modal-actions-container
    {
        margin-bottom: .3rem;
        width: 100%;

        display: flex;
        justify-content: center;
    }

    .review-header-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }

    .review-list
    {
        margin-top: 1rem;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .review-list li
    {
        border-bottom: 1px solid grayColor700;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .review-list li h2
    {
        line-height: 1.3rem;
        font-size: 0.87rem;
        font-weight: 600;
        font-style: normal;
    }

    .review-list li:last-child
    {
        width: 98%;
        border-bottom: none;
        padding-top: 1rem;
        padding-bottom: .6rem;

        gap: 16px;
        align-items: center;
        align-self: stretch;
    }

    .review-list li:last-child p
    {
        line-height: 1.6rem;
        font-size: 1.5rem;
        font-weight: 400;
        font-style: normal;
        text-align: right;
        color: blueColor100;
    }

    .overall-rating
    {
        line-height: 1.6rem;
        font-size: 1.5rem;
        font-weight: 700;
        font-style: normal;
        color: blueColor100;
    }

    .average-item-rating
    {
        padding: .5rem;

        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .average-item-rating p
    {
        line-height: 1.3rem;
        font-size: 0.87rem;
        font-weight: 400;
        font-style: normal;
        text-align: center;
    }

    .average-item-rating img
    {
        height: 2rem;
        width: 2rem;
    }

    .rating-form
    {
        width: 100%;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    {#if activeStep === 1 }
        <ModalHeader
            title={ getLocalizedTextBySlug('general-experience-label', $languageTagStore ) }
            onClose={ closeModal }
            hasPreviousSteps={ false }
        />
        <ModalContent>
            <div class="content-container">
                <div class="general-experience">
                    <img src="/image/supporting-documents/heading.svg" alt="">
                    <p class="text-center">
                        { getLocalizedTextBySlug('rate-your-experience-label', { hostName: guestName }, $languageTagStore ) }
                    </p>
                </div>
                <RatingButtons
                    { ratingType }
                    criteria="guestOverall"
                    onRatingClick={ updateRatingStore }
                />
            </div>
        </ModalContent>
        <ModalActions>
            <div class="modal-actions-container">
                <ModalButton
                    text={ getLocalizedTextBySlug('continue-review-button-label', $languageTagStore ) }
                    on:click={ nextStep }
                />
            </div>
        </ModalActions>
    {:else if activeStep === 2 }
        <ModalHeader
            title={ getLocalizedTextBySlug('in-detail-label', $languageTagStore ) }
            onClose={ closeModal }
            hasPreviousSteps={ true }
            previousStep={ previousStep }
        />
        <ModalContent>
            <div class="content-container">
                <h1 class="rating-criteria-title">
                    { getLocalizedTextBySlug('criteria-memories-label', $languageTagStore ) }
                </h1>
                <div class="criteria-container">
                    <RatingCriteria criteria="guestCommunication" />
                    <RatingButtons
                        { ratingType }
                        criteria="guestCommunication"
                        onRatingClick={ updateRatingStore }
                    />
                </div>
                <div class="criteria-container">
                    <RatingCriteria criteria="guestCheckIn" />
                    <RatingButtons
                        { ratingType }
                        criteria="guestCheckIn"
                        onRatingClick={ updateRatingStore }
                    />
                </div>
                <div class="criteria-container">
                    <RatingCriteria criteria="guestCompliance" />
                    <RatingButtons
                        { ratingType }
                        criteria="guestCompliance"
                        onRatingClick={ updateRatingStore }
                    />
                </div>
            </div>
        </ModalContent>
        <ModalActions>
            <div class="modal-actions-container">
                <ModalButton
                    text={ getLocalizedTextBySlug('continue-review-button-label', $languageTagStore ) }
                    on:click={ nextStep }
                />
            </div>
        </ModalActions>
    {:else if activeStep === 3 }
        <ModalHeader
            title={ getLocalizedTextBySlug('public-comment-label', $languageTagStore ) }
            onClose={ closeModal }
            hasPreviousSteps={ true }
            previousStep={ previousStep }
        />
        <ModalContent>
            <div class="content-container">
                <h1 class="public-comment-title">
                    { getLocalizedTextBySlug('write-to-users-label', $languageTagStore ) }
                </h1>
                <p class="public-comment-description">
                    { getLocalizedTextBySlug('share-experiences-label', $languageTagStore ) }
                </p>
                <textarea
                    class="public-comment-textarea"
                    placeholder={ getLocalizedTextBySlug('write-comment-label', $languageTagStore ) }
                />
            </div>
        </ModalContent>
        <ModalActions>
            <div class="modal-actions-container">
                <ModalButton
                    text={ getLocalizedTextBySlug('continue-review-button-label', $languageTagStore ) }
                    on:click={ nextStep }
                />
            </div>
        </ModalActions>
    {:else if activeStep === 4 }
        <ModalHeader
            title={ getLocalizedTextBySlug('private-message-label', $languageTagStore ) }
            onClose={ closeModal }
            hasPreviousSteps={ true }
            previousStep={ previousStep }
        />
        <ModalContent>
            <div class="content-container">
                <h1 class="public-comment-title">
                    { getLocalizedTextBySlug('write-to-host-label', { hostName: guestName }, $languageTagStore ) }
                </h1>
                <p class="public-comment-description">
                    { getLocalizedTextBySlug('thank-guest-label', $languageTagStore ) }
                </p>
                <textarea
                    class="public-comment-textarea"
                    placeholder={ getLocalizedTextBySlug('write-comment-label', $languageTagStore ) }
                />
            </div>
        </ModalContent>
        <ModalActions>
            <div class="modal-actions-container">
                <ModalButton
                    text={ getLocalizedTextBySlug('continue-review-button-label', $languageTagStore ) }
                    on:click={ nextStep }
                />
            </div>
        </ModalActions>
    {:else if activeStep === 5 }
        <ModalHeader
            title={ getLocalizedTextBySlug('summary-label', $languageTagStore ) }
            onClose={ closeModal }
            hasPreviousSteps={ true }
            previousStep={ previousStep }
        />
        <ModalContent>
            <form
                class="rating-form"
                on:submit|preventDefault={ handleSubmitRating }
                bind:this={ form }
            >
            <div class="content-container">
                <div class="review-header-container">
                    <img src="/image/supporting-documents/heading.svg" alt="">
                    <h1 class="public-comment-title">
                        { getLocalizedTextBySlug('experience-with-user-label', { hostName: guestName }, $languageTagStore ) }
                    </h1>
                </div>
                <ul class="review-list">
                    <li>
                        <h2>{ getLocalizedTextBySlug('overall-label', $languageTagStore ) }</h2>
                        <div class="average-item-rating">
                            {#if $guestRatings.guestOverall.rating }
                                <p>{ $guestRatings.guestOverall.rating }</p>
                                <img src={ $guestRatings.guestOverall.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h2>
                            { getLocalizedTextBySlug( 'transfer-to-account-modal-communication-label', $languageTagStore ) }
                        </h2>
                        <div class="average-item-rating">
                            {#if $guestRatings.guestCommunication.rating }
                                <p>{ $guestRatings.guestCommunication.rating }</p>
                                <img src={ $guestRatings.guestCommunication.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h2>
                            { getLocalizedTextBySlug('events-page-check-in-label', $languageTagStore ) }
                        </h2>
                        <div class="average-item-rating">
                            {#if $guestRatings.guestCheckIn.rating }
                                <p>{ $guestRatings.guestCheckIn.rating }</p>
                                <img src={ $guestRatings.guestCheckIn.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h2>
                            { getLocalizedTextBySlug('compliance-with-rules-label', $languageTagStore ) }
                        </h2>
                        <div class="average-item-rating">
                            {#if $guestRatings.guestCompliance.rating }
                                <p>{ $guestRatings.guestCompliance.rating }</p>
                                <img src={ $guestRatings.guestCompliance.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h1 class="overall-rating">
                            { getLocalizedTextBySlug('overall-rating-label', $languageTagStore ) }
                        </h1>
                        <p>{ averageRatingValue }</p>
                    </li>
                </ul>
            </div>
            </form>
        </ModalContent>
        <ModalActions>
            <div class="modal-actions-container">
                {#if isSubmitButtonLoading }
                    <Loading />
                {:else}
                    <ModalButton
                        text={ getLocalizedTextBySlug('submit-review-button-label', $languageTagStore ) }
                        on:click={ () => form.requestSubmit() }
                    />
                {/if}
            </div>
        </ModalActions>
    {/if}
</ModalRoot>
