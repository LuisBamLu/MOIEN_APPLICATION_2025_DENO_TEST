<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import EditLeaseContractPageSection from '../edit-lease-contract/EditLeaseContractPageSection.svelte';
    import UserReviewCard from './UserReviewCard.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { onMount } from 'svelte';

    // -- CONSTANTS

    const userReviewCardWidth = 290;
    const userReviewCardSpacing = 16;

    // -- VARIABLES

    export let userReviewArray;
    export let userReviewProfileByUserIdMap;

    let userReviewListContainerElement;
    let carousel;

    // -- FUNCTIONS

    function getVisibleCarouselSlideCount(
        reviewCardListElementWidth
        )
    {
        return reviewCardListElementWidth / ( userReviewCardWidth + userReviewCardSpacing );
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .user-review-list-container
    {
        width: 100%;

        display: flex;
        gap: 1rem;
    }

    .user-review-list
    {
        width: 100%;

        flex-wrap: nowrap;
    }

    .user-review-card
    {
        width: 18.125rem;
        padding: .4rem;
    }
</style>

<EditLeaseContractPageSection
    label=
        "
            { getLocalizedTextBySlug( 'property-rental-review-label', $languageTagStore ) }
            ({ userReviewArray.length })
        "
    helper={ getLocalizedTextBySlug( 'filter-short-term-label', $languageTagStore ) }
>
    <div class="user-review-list-container">
        <div class="user-review-list" bind:this={ userReviewListContainerElement }>
            {#each userReviewArray as userReview }
                <div class="user-review-card">
                    <UserReviewCard
                        userReview={ userReview }
                        profile={ userReviewProfileByUserIdMap[ userReview.userId ] }
                    />
                </div>
            {/each}
        </div>
    </div>
</EditLeaseContractPageSection>
