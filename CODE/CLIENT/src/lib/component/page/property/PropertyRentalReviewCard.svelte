<script>
    // -- IMPORTS

    import { fade } from 'svelte/transition';
    import { getLocalizedText } from 'senselogic-gist';
    import { getLocalizedMonthDayYearTextFromDateText } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import ProfileImage from '$component/layout/ProfileImage.svelte';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let propertyRentalReview;
    let rating = 0
    let fullStars;

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( propertyRentalReview && propertyRentalReview.rating )
            {
                rating = propertyRentalReview.rating;
                fullStars = Math.floor( rating );
            }
            else
            {
                return;
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-rental-review-card
    {
        overflow: hidden;
        margin: auto;
        height: 15rem;
        width: calc( 100% - 0.75rem );
        min-width: 15rem;
        border: 1px solid grayColor800;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        background-color: grayColor950;
        box-shadow: 0 0 0.5rem grayColor800;
    }

    .property-rental-review-card-head
    {
        min-height: 4rem;

        display: flex;
        flex-direction: row;
        gap: 0.75rem;
    }

    .property-rental-review-card-head-profile-name
    {
        max-width: 9.5rem;

        white-space: nowrap;
    }

    .property-rental-review-card-text,
    .property-rental-review-card-head-profile-name
    {
        overflow: hidden;

        text-overflow: ellipsis;
    }

    .property-rental-review-card-text
    {
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .star-container
    {
        display: flex;
        gap: 0.1rem;
    }
</style>

<div class="property-rental-review-card" transition:fade>
    <div class="property-rental-review-card-head">
        <ProfileImage
            profile=
                {
                    {
                        imagePath: propertyRentalReview.profileImagePath,
                        firstName: propertyRentalReview.profileFirstName
                    }
                }
            size="medium"
        />
        <div class="property-rental-review-card-head-profile">
            <div class="font-size-100 font-weight-700 color-black property-rental-review-card-head-profile-name">
                { propertyRentalReview.profileFirstName } { propertyRentalReview.profileLastName }
            </div>
            <div class="font-size-90 font-weight-500 color-gray property-rental-review-card-head-profile-date">
                { getLocalizedMonthDayYearTextFromDateText( propertyRentalReview.creationTimestamp ) }
            </div>
        </div>
    </div>
    <div class="star-container">
        {#each Array(fullStars) as _, index}
            <img src="/image/icon/star.svg" alt="star" class="property-rental-review-card-head-star"/>
        {/each}
    </div>
    <div class="font-size-90 font-weight-500 color-black property-rental-review-card-text">
        { getLocalizedText( propertyRentalReview.text, $languageTagStore ) }
    </div>
</div>
