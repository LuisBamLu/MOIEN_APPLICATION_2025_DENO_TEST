<script>
    // -- IMPORTS

    import { fade } from 'svelte/transition';
    import { getLocalizedText } from 'senselogic-gist';
    import { getLocalizedMonthDayYearTextFromDateText } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import ProfileImage from '../../layout/ProfileImage.svelte';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let userReview;
    export let profile;

    let rating = 0;
    let fullStarCount;

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( userReview && userReview.rating )
            {
                rating = userReview.rating;
                fullStarCount = Math.floor( rating );
            }
            else
            {
                return;
            }

            if ( !profile )
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

    .user-review-card
    {
        overflow: hidden;
        height: 15rem;
        width: 100%;
        min-width: var( --review-card-min-width, 15rem );
        max-width: 27.5rem;
        border: 1px solid lightGrayBorderColor;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
    }

    .user-review-card-head
    {
        min-height: 4rem;

        display: flex;
        flex-direction: row;
        gap: 0.75rem;
    }

    .user-review-card-head-profile-name
    {
        max-width: 9.5rem;

        white-space: nowrap;
    }

    .user-review-card-text,
    .user-review-card-head-profile-name
    {
        overflow: hidden;

        text-overflow: ellipsis;
    }

    .star-container
    {
        display: flex;
        gap: 0.1rem;
    }
</style>

<div class="user-review-card" transition:fade>
    <div class="user-review-card-head">
        <ProfileImage profile={ profile } size="medium" />
        <div class="user-review-card-head-profile">
            <div class="font-size-100 font-weight-700 color-black user-review-card-head-profile-name">
                { profile.firstName } { profile.lastName }
            </div>
            <div class="font-size-90 font-weight-500 color-gray user-review-card-head-profile-date">
                { getLocalizedMonthDayYearTextFromDateText( userReview.creationTimestamp ) }
            </div>
        </div>
    </div>
    <div class="star-container">
        {#each Array( fullStarCount ) as _, index}
            <img src="/image/icon/star.svg" alt="star" class="property-rental-review-card-head-star" />
        {/each}
    </div>
    <div class="font-size-90 font-weight-500 color-black user-review-card-text">
        { getLocalizedText( userReview.text, $languageTagStore ) }
    </div>
</div>
