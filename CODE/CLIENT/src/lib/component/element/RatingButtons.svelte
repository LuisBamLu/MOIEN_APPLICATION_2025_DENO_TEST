<script>
    // -- IMPORTS

    import terrible from '/image/ratings/terrible.svg';
    import bad from '/image/ratings/bad.svg';
    import average from '/image/ratings/average.svg';
    import good from '/image/ratings/good.svg';
    import veryGood from '/image/ratings/very_good.svg';
    import terrible_filled from '/image/ratings/terrible_filled.svg';
    import bad_filled from '/image/ratings/bad_filled.svg';
    import average_filled from '/image/ratings/average_filled.svg';
    import good_filled from '/image/ratings/good_filled.svg';
    import veryGood_filled from '/image/ratings/very_good_filled.svg';
    import { guestRatings, hostRatings, propertyRatings } from '$src/lib/store/ratingsStore';
    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';

    // -- VARIABLES

    export let criteria = '';
    export let onRatingClick;
    export let ratingType = '';
    let selectedRating = '';
    let selectedRatingValue = 0;

    // -- FUNCTIONS

    function handleRatingClick(
        rating,
        value,
        img
        )
    {
        selectedRating = rating;
        selectedRatingValue = value;
        onRatingClick( criteria, rating, value, img );
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            let ratingStore;

            if ( ratingType === 'host' )
            {
                ratingStore = hostRatings;
            }
            else if ( ratingType === 'guest' )
            {
                ratingStore = guestRatings;
            }
            else if ( ratingType === 'property' )
            {
                ratingStore = propertyRatings;
            }

            ratingStore.subscribe(
                currentRatings =>
                {
                    if ( currentRatings[ criteria ] )
                    {
                        selectedRating = currentRatings[ criteria ].rating;
                        selectedRatingValue = currentRatings[ criteria ].value;
                    }
                }
                );
        }
    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    p
    {
        line-height: 1.12rem;
        font-size: 0.75rem;
        font-weight: 500;
        font-style: normal;
        color: grayColor300;
    }

    img
    {
        height: 3rem;
        width: 3rem;
    }

    // -- CLASSES

    .rating-buttons-container
    {
        width: 100%;
        padding: 1rem;

        display: flex;
        justify-content: space-between;
    }

    .rating
    {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .rating:hover
    {
        cursor: pointer;
    }
</style>

<div class="rating-buttons-container">
    <div
        class="rating terrible"
        on:click={ () => handleRatingClick( getLocalizedTextBySlug( 'terrible-label', $languageTagStore ), 1, terrible_filled ) }
    >
        <img
            src={ selectedRating === getLocalizedTextBySlug( 'terrible-label', $languageTagStore ) ? terrible_filled : terrible }
            alt=""
        >
        <p>
            { getLocalizedTextBySlug( 'terrible-label', $languageTagStore ) }
        </p>
    </div>
    <div
        class="rating bad"
        on:click={ () => handleRatingClick( getLocalizedTextBySlug( 'bad-label', $languageTagStore ), 2, bad_filled )}
    >
        <img
            src={ selectedRating === getLocalizedTextBySlug( 'bad-label', $languageTagStore ) ? bad_filled : bad }
            alt=""
        >
        <p>
            { getLocalizedTextBySlug( 'bad-label', $languageTagStore ) }
        </p>
    </div>
    <div
        class="rating average"
        on:click={ () => handleRatingClick( getLocalizedTextBySlug( 'average-label', $languageTagStore ), 3, average_filled ) }
    >
        <img
            src={ selectedRating === getLocalizedTextBySlug( 'average-label', $languageTagStore ) ? average_filled : average }
            alt=""
        >
        <p>
            { getLocalizedTextBySlug( 'average-label', $languageTagStore ) }
        </p>
    </div>
    <div
        class="rating good"
        on:click={ () => handleRatingClick( getLocalizedTextBySlug( 'good-label', $languageTagStore ), 4, good_filled ) }
    >
        <img
            src={ selectedRating === getLocalizedTextBySlug( 'good-label', $languageTagStore ) ? good_filled : good }
            alt=""
        >
        <p>
            { getLocalizedTextBySlug( 'good-label', $languageTagStore ) }
        </p>
    </div>
    <div
        class="rating very-good"
        on:click={ () => handleRatingClick( getLocalizedTextBySlug( 'very-good-label', $languageTagStore ), 5, veryGood_filled ) }
    >
        <img
            src={ selectedRating === getLocalizedTextBySlug( 'very-good-label', $languageTagStore ) ? veryGood_filled : veryGood }
            alt=""
        >
        <p>
            { getLocalizedTextBySlug( 'very-good-label', $languageTagStore ) }
        </p>
    </div>
</div>
