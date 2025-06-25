<script>
    // -- IMPORTS

    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { isInteger } from 'senselogic-gist';
    import RatingButtons from '../../element/RatingButtons.svelte';
    import RatingCriteria from './RatingCriteria.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { propertyRatings } from '$src/lib/store/ratingsStore';
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { hostUrl } from '$src/lib/base';
    import Loading from '../../element/Loading.svelte';
    import { userBookingsStore } from '$src/lib/store/rentalStore';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let isOpen = true;
    export let thisRental
    export let hostName;
    export let propertyName;
    export let rentalId;

    let property = thisRental.property;
    let reviews = []
    let dispatch = createEventDispatcher();
    let form;
    let average;
    let ratingType = 'property';
    let activeStep = 1;
    let averageRatingValue;
    let allRatingValues = [];
    let isRatingButtonClicked =
        {
            propertyOverall: false,
            propertyCleanliness: false,
            propertyAccuracy: false,
            propertyMoneyValue: false,
            propertyCommunication: false,
            propertyCheckIn: false,
            propertyLocation: false,
        }
    let updatedPropertyRatings;
    let newPropertyAverageRating;
    let publicMessageReview;
    let privateMessage;
    let isSubmitButtonLoading = false;
    let unsubscribe
        = userBookingsStore.subscribe(
            store =>
            {
                let rental = store.propertyArrayByRentalBooking
                    .map( rental => rental.rentalBooking )
                    .find( rental => rental.id === rentalId );
                reviews = rental ? rental.property.reviewArray : [];
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

    function updateEachRating(
        )
    {
        let propertyReviewArray = property.reviewArray;
        let cleanlinessRatings = propertyReviewArray.map( review => review.cleanlinessRating || 0 );
        let accuracyRatings = propertyReviewArray.map( review => review.accuracyRating || 0 );
        let moneyValueRatings = propertyReviewArray.map( review => review.valueRating || 0 );
        let communicationRatings = propertyReviewArray.map( review => review.communicationRating || 0 );
        let checkInRatings = propertyReviewArray.map( review => review.checkInRating || 0 );
        let locationRatings = propertyReviewArray.map( review => review.locationRating || 0 );
        cleanlinessRatings.push( $propertyRatings.propertyCleanliness.value );
        accuracyRatings.push( $propertyRatings.propertyAccuracy.value );
        moneyValueRatings.push( $propertyRatings.propertyMoneyValue.value );
        communicationRatings.push( $propertyRatings.propertyCommunication.value );
        checkInRatings.push( $propertyRatings.propertyCheckIn.value );
        locationRatings.push( $propertyRatings.propertyLocation.value );
        updatedPropertyRatings =
            {
                cleanliness: cleanlinessRatings.reduce( ( a, b ) => a + b ) / cleanlinessRatings.length,
                accuracy: accuracyRatings.reduce( ( a, b ) => a + b ) / accuracyRatings.length,
                moneyValue: moneyValueRatings.reduce( ( a, b ) => a + b ) / moneyValueRatings.length,
                communication: communicationRatings.reduce( ( a, b ) => a + b ) / communicationRatings.length,
                checkIn: checkInRatings.reduce( ( a, b ) => a + b ) / checkInRatings.length,
                location: locationRatings.reduce( ( a, b ) => a + b ) / locationRatings.length
            };
    }

    // ~~

    function nextStep(
        )
    {
        if ( activeStep === 1 )
        {
            if ( !isRatingButtonClicked.propertyOverall )
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
                updateEachRating();
            }
        }
        else if ( activeStep === 3 )
        {
            publicMessageReview = document.querySelector( '.public-comment-textarea' ).value;
            activeStep++;
        }
        else if ( activeStep === 4 )
        {
            privateMessage = document.querySelector( '.private-comment-textarea' ).value;
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
        propertyRatings.update(
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
        let ratingValues = Object.values( $propertyRatings );

        for ( let key in ratingValues )
        {
            allRatingValues.push( ratingValues[ key ].value );
        }

        average = allRatingValues.reduce( ( a, b ) => a + b ) / allRatingValues.length;
        let propertyRatingByReviewArray = property.reviewArray.map( review => review.rating );
        propertyRatingByReviewArray.push( average );
        newPropertyAverageRating = propertyRatingByReviewArray.reduce( ( a, b ) => a + b ) / propertyRatingByReviewArray.length;
        averageRatingValue = `${ isInteger( average ) ? average : average.toFixed( 1 ) }/5`;
    }

    // ~~

    async function handleSubmitRating(
        )
    {
        let formData = new FormData();

        formData.append( 'propertyId', property.id );
        formData.append( 'rating', average );
        formData.append( 'cleanlinessRating', $propertyRatings.propertyCleanliness.value.toString() );
        formData.append( 'communicationRating', $propertyRatings.propertyCommunication.value.toString() );
        formData.append( 'checkInRating', $propertyRatings.propertyCheckIn.value.toString() );
        formData.append( 'accuracyRating', $propertyRatings.propertyAccuracy.value.toString() );
        formData.append( 'locationRating', $propertyRatings.propertyLocation.value.toString() );
        formData.append( 'valueRating', $propertyRatings.propertyMoneyValue.value.toString());
        formData.append( 'text', publicMessageReview );
        formData.append( 'privateMessage', privateMessage );
        formData.append( 'userId', $profileSignedInStore.userId );
        formData.append( 'rentalBookingId', rentalId )
        formData.append( 'hostId', property.userId )
        formData.append( 'updatedCleanliness', updatedPropertyRatings.cleanliness )
        formData.append( 'updatedCommunication', updatedPropertyRatings.communication )
        formData.append( 'updatedCheckIn', updatedPropertyRatings.checkIn )
        formData.append( 'updatedAccuracy', updatedPropertyRatings.accuracy )
        formData.append( 'updatedLocation', updatedPropertyRatings.location )
        formData.append( 'updatedValue', updatedPropertyRatings.moneyValue )
        formData.append( 'updatedRating', newPropertyAverageRating )

        isSubmitButtonLoading = true;

        try
        {
            let response = await fetch(
                hostUrl + '/api/add-property-review',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }
                );

            if ( response.ok )
            {
                sendReview();

                let newReview =
                    {
                        accuracyRating: $propertyRatings.propertyAccuracy.value,
                        cleanlinessRating: $propertyRatings.propertyCleanliness.value,
                        communicationRating: $propertyRatings.propertyCommunication.value,
                        checkInRating: $propertyRatings.propertyCheckIn.value,
                        locationRating: $propertyRatings.propertyLocation.value,
                        valueRating: $propertyRatings.propertyMoneyValue.value,
                        rating: average,
                    }

                userBookingsStore.update(
                    currentBookings =>
                    {
                        currentBookings.propertyArrayByRentalBooking.forEach(
                            rental =>
                            {
                                if ( rental.rentalBooking.property.id === property.id )
                                {
                                    rental.rentalBooking.property.reviewArray.push( newReview );
                                }
                            }
                            );

                        return currentBookings;
                    }
                    );

                Object.keys( isRatingButtonClicked ).forEach(
                    key =>
                    {
                        updateRatingStore(key, '', 0, '');
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
            console.error( 'Fetch error:', error );
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

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

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

    .public-comment-title, .private-comment-title
    {
        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        font-style: normal;
        text-align: center;
        color: grayColor100;
    }

    .public-comment-description, .private-comment-description
    {
        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 400;
        font-style: normal;
        text-align: center;
        color: grayColor300;
    }

    .public-comment-textarea, .private-comment-textarea
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

    .public-comment-textarea:focus, .private-comment-textarea:focus
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
                        { getLocalizedTextBySlug('property-rental-experience-label', $languageTagStore ) }
                    </p>
                </div>
                <RatingButtons
                    { ratingType }
                    criteria="propertyOverall"
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
                <RatingCriteria criteria="propertyCleanliness" />
                <RatingButtons
                    { ratingType }
                    criteria="propertyCleanliness"
                    onRatingClick={ updateRatingStore }
                />
                </div>
                <div class="criteria-container">
                    <RatingCriteria criteria="propertyAccuracy" />
                    <RatingButtons
                        { ratingType }
                        criteria="propertyAccuracy"
                        onRatingClick={ updateRatingStore }
                    />
                </div>
                <div class="criteria-container">
                    <RatingCriteria criteria="propertyMoneyValue" />
                    <RatingButtons
                        { ratingType }
                        criteria="propertyMoneyValue"
                        onRatingClick={ updateRatingStore }
                    />
                </div>
                <div class="criteria-container">
                    <RatingCriteria criteria="propertyCommunication" />
                    <RatingButtons
                        { ratingType }
                        criteria="propertyCommunication"
                        onRatingClick={ updateRatingStore }
                    />
                </div>
                <div class="criteria-container">
                    <RatingCriteria criteria="propertyCheckIn" />
                    <RatingButtons
                        { ratingType }
                        criteria="propertyCheckIn"
                        onRatingClick={ updateRatingStore }
                    />
                </div>
                <div class="criteria-container">
                    <RatingCriteria criteria="propertyLocation" />
                    <RatingButtons
                        { ratingType }
                        criteria="propertyLocation"
                        onRatingClick={ updateRatingStore }
                    />
                </div>
                <!-- <div class="criteria-container">
                    <RatingCriteria criteria="propertyAmenities" />
                    <RatingButtons
                        { ratingType }
                        criteria="propertyAmenities"
                        onRatingClick={ updateRatingStore }/>
                </div> -->
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
                    placeholder={ getLocalizedTextBySlug( 'write-comment-label', $languageTagStore ) }
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
                <h1 class="private-comment-title">
                    { getLocalizedTextBySlug('write-to-host-label', { hostName: hostName }, $languageTagStore ) }
                </h1>
                <p class="private-comment-description">
                    { getLocalizedTextBySlug('thank-host-label', $languageTagStore ) }
                </p>
                <textarea
                    class="private-comment-textarea"
                    placeholder={ getLocalizedTextBySlug('write-comment-label', $languageTagStore ) }
                >
                </textarea>
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
                on:submit|preventDefault={ handleSubmitRating }
                bind:this={ form }
            >
            <div class="content-container">
                <div class="review-header-container">
                    <img src="/image/supporting-documents/heading.svg" alt="">
                    <h1 class="public-comment-title">
                        { getLocalizedTextBySlug('your-experience-label', { hostName: propertyName }, $languageTagStore ) }
                    </h1>
                </div>
                <ul class="review-list">
                    <li>
                        <h2>{ getLocalizedTextBySlug('overall-label', $languageTagStore ) }</h2>
                        <div class="average-item-rating">
                            {#if $propertyRatings.propertyOverall.rating }
                                <p>{ $propertyRatings.propertyOverall.rating }</p>
                                <img src={ $propertyRatings.propertyOverall.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h2>{ getLocalizedTextBySlug('cleanliness-label', $languageTagStore ) }</h2>
                        <div class="average-item-rating">
                            {#if $propertyRatings.propertyCleanliness.rating }
                                <p>{ $propertyRatings.propertyCleanliness.rating }</p>
                                <img src={ $propertyRatings.propertyCleanliness.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h2>{ getLocalizedTextBySlug('accuracy-label', $languageTagStore ) }</h2>
                        <div class="average-item-rating">
                            {#if $propertyRatings.propertyAccuracy.rating }
                                <p>{ $propertyRatings.propertyAccuracy.rating }</p>
                                <img src={ $propertyRatings.propertyAccuracy.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h2>{ getLocalizedTextBySlug('money-value-label', $languageTagStore ) }</h2>
                        <div class="average-item-rating">
                            {#if $propertyRatings.propertyMoneyValue.rating }
                                <p>{ $propertyRatings.propertyMoneyValue.rating }</p>
                                <img src={ $propertyRatings.propertyMoneyValue.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h2>{getLocalizedTextBySlug('transfer-to-account-modal-communication-label', $languageTagStore)}</h2>
                        <div class="average-item-rating">
                            {#if $propertyRatings.propertyCommunication.rating }
                                <p>{ $propertyRatings.propertyCommunication.rating }</p>
                                <img src={ $propertyRatings.propertyCommunication.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h2>{ getLocalizedTextBySlug('events-page-check-in-label', $languageTagStore ) }</h2>
                        <div class="average-item-rating">
                            {#if $propertyRatings.propertyCheckIn.rating }
                                <p>{ $propertyRatings.propertyCheckIn.rating }</p>
                                <img src={ $propertyRatings.propertyCheckIn.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h2>{ getLocalizedTextBySlug('filter-location-label', $languageTagStore ) }</h2>
                        <div class="average-item-rating">
                            {#if $propertyRatings.propertyLocation.rating }
                                <p>{ $propertyRatings.propertyLocation.rating }</p>
                                <img src={ $propertyRatings.propertyLocation.img } alt="Rating">
                            {:else}
                                <p>N/A</p>
                            {/if}
                        </div>
                    </li>
                    <li>
                        <h1 class="overall-rating">
                            { getLocalizedTextBySlug('overall-rating-label', $languageTagStore ) }
                        </h1>
                        <p>
                            { averageRatingValue }
                        </p>
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
