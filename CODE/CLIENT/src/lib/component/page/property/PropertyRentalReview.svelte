<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import PropertyRentalReviewCard from '$component/page/property/PropertyRentalReviewCard.svelte';
    import Carousel from '../../element/Carousel.svelte';

    // -- CONSTANTS

    const visiblePropertyRentalReviewCardCount = 3;
    const propertyRentalReviewCardWidth = 260;
    const propertyRentalReviewCardSpacing = 12;

    // -- VARIABLES

    export let propertyRentalReviewArray;
    let propertyRentalReviewCardListElement;
    let showsAllPropertyRentalReviews = false;
    let carousel;

    // --  FUNCTIONS

    function getVisibleCarouselSlideCount(
        reviewCardListElementWidth
        )
    {
        return reviewCardListElementWidth / ( propertyRentalReviewCardWidth + propertyRentalReviewCardSpacing );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-rental-review
    {
        border-top: 1px solid lightGrayBorderColor;
        padding: 1.5rem 0;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .property-rental-review-card-list
    {
        width: 100%;
        max-width: 46rem;
    }
</style>

{#if propertyRentalReviewArray.length > 0 }
    <div class="property-rental-review">
        <div class="font-size-125 font-weight-600 color-black property-rental-review-title">
            {
                getLocalizedTextBySlug(
                    'property-rental-review-label',
                    { reviewCount: propertyRentalReviewArray.length },
                    $languageTagStore
                    )
            }
        </div>
        <div class="property-rental-review-card-list" bind:this={ propertyRentalReviewCardListElement }>
            <Carousel
                hasButtons={ false }
                hasDots={ false }
                hasCount={ false }
                isAutomatic={ false }
                columnCount={ visiblePropertyRentalReviewCardCount }
            >
                {#each propertyRentalReviewArray as propertyRentalReview }
                    <PropertyRentalReviewCard
                        propertyRentalReview={ propertyRentalReview }
                    />
                {/each}
            </Carousel>
        </div>
    </div>
{/if}
