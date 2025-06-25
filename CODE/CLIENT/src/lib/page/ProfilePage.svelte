<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import Loading from '$component/element/Loading.svelte';
    import Seo from '$component/element/Seo.svelte';
    import PublicProfileHeader from '$component/page/profile/PublicProfileHeader.svelte';
    import PublicProfileContent from '$component/page/profile/PublicProfileContent.svelte';
    import PublicProfileButton from '$component/page/profile/PublicProfileButton.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import CallToAction from '$component/element/CallToAction.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import PublicProfileCard from '$component/page/profile/PublicProfileCard.svelte';
    import PublicProfileBiography from '$component/page/profile/PublicProfileBiography.svelte';
    import PublicProfileList from '$src/lib/component/page/profile/PublicProfileList.svelte';
    import PropertyCard from '$component/page/properties/PropertyCard.svelte';
    import UserReviewCard from '$component/page/profile/UserReviewCard.svelte';
    import { currencyConversionByConversionCodeMapStore } from '../store/currencyConversionByConversionCodeMapStore';

    // -- VARIABLES

    export let id;

    let profile;
    let propertyArray = [];
    let documentArray = [];
    let userReviewArray = [];
    let userReviewProfileByUserIdMap = {};
    let hasCompleteRentalFile = false;
    let isTenant = false;
    let isOwnProfile = false;
    let rentalFile;
    let userRatingArray = [];
    let averageRating;
    let isLoading = true;
    $: propertyCount = propertyArray.length || 0;
    $: userReviewCount = userReviewArray.length || 0;

    // -- FUNCTIONS

    function getAverageRating(
        _userRatingArray
        )
    {
        if ( _userRatingArray.length === 0 )
        {
            return 0;
        }
        else
        {
            return ( _userRatingArray.reduce( ( a, b ) => a + b ) / _userRatingArray.length ).toFixed( 1 );
        }
    }

    // ~~

    async function handleShareProfile(
        )
    {
        if ( navigator.share )
        {
            await navigator.share(
                {
                    title: 'Share this profile',
                    text: 'Check out this profile in the app!',
                    url: window.location.href,
                }
                );
        }
  }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/page/profile/' + id, { method: 'POST', credentials: 'include' } );

            profile = result.profile;
            propertyArray = result.propertyArray;
            documentArray = result.documentArray;
            userReviewArray = result.userReviewArray;
            userReviewProfileByUserIdMap = result.userReviewProfileByUserIdMap;
            hasCompleteRentalFile = result.hasCompleteRentalFile;
            isTenant = result.isTenant;
            rentalFile = result.rentalFile;
            isOwnProfile = result.isOwnProfile;
            $currencyConversionByConversionCodeMapStore =
                {
                    ...$currencyConversionByConversionCodeMapStore,
                    ...result.currencyConversionByConversionCodeMap
                };
            userRatingArray = userReviewArray.map( ( userReview ) => userReview.rating );
            averageRating = getAverageRating( userRatingArray );
            userReviewArray.sort(
                ( a, b ) =>
                {
                    return new Date( b.creationTimestamp ).getDate() - new Date( a.creationTimestamp ).getDate();
                }
                );

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .profile-container
    {
        overflow-y: auto;
        height: 100dvh;

        background: grayColor900;
        -ms-overflow-style: none;
        scrollbar-width: none;

        +media( desktop )
        {
            margin: 0 auto;
            height: calc( 100vh - 4.5rem );
            width: 100%;
            max-width: 76.875rem;
            padding: 1.5rem 1.5rem 7.5rem;

            flex-direction: row;
            column-gap: 3rem;
        }
    }

    .profile-container::-webkit-scrollbar
    {
        display: none;
    }

    .profile-content
    {
        height: calc( 100dvh - 4rem );
        max-width: 46rem;
        padding-top: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            height: auto;
            padding: 0;

            flex: 1;
            gap: 1.5rem;
        }
    }

    .upper
    {
        position: sticky;
        top: 0;

        display: none;

        +media( desktop )
        {
            width: 27.9rem;
            padding: 0;

            display: block;
        }
    }
</style>

{#if profile }
    <Seo
        title="{ profile.firstName } { profile.lastName }"
        metaTitle="{ profile.firstName } { profile.lastName }"
        url="https://moien.com/"
        path="profile/{ id }"
    />
{/if}

<div class="profile-container display-flex flex-direction-column">
    <div class="profile-content display-flex flex-direction-column">
        {#if isLoading }
            <Loading/>
        {:else}
            <PublicProfileHeader>
                <div class="display-flex gap-50">
                    <PublicProfileButton
                        isDisabled={ true }
                    >
                        <span class="green-300-outlined-star-icon size-125"/>
                        <span class="color-green-100 font-size-75 font-weight-700 line-height-125">
                            { averageRating || 'N/A' }
                        </span>
                    </PublicProfileButton>

                    <PublicProfileButton
                        type="button"
                        on:click={ handleShareProfile }
                    >
                        <span class="green-300-export-icon size-125"/>
                    </PublicProfileButton>
                </div>
            </PublicProfileHeader>

            <PublicProfileContent>
                <PublicProfileCard profile={ profile }/>

                {#if propertyCount === 0
                     && userReviewCount === 0
                     && profile.aboutDescription }
                    <span class="moien-empty-logo-icon size-375 flex-grow-1 flex-shrink-0"/>
                {:else}
                    <PublicProfileBiography profile={ profile }/>

                    <PublicProfileList
                        label="Ads ({ propertyCount })"
                    >
                        {#if propertyCount }
                            {#each propertyArray as property }
                                <div style="width: 18.175rem;">
                                    <PropertyCard
                                        property={ property }
                                        showPlaceButton={ false }
                                    />
                                </div>
                            {/each}
                        {/if}
                    </PublicProfileList>

                    <PublicProfileList
                        label=
                            {
                                getLocalizedTextBySlug(
                                    'property-rental-review-label',
                                    { reviewCount: userReviewCount },
                                    $languageTagStore
                                    )
                            }
                        --border-bottom="none"
                    >
                            {#each userReviewArray as userReview }
                                <div style="width: 18.175rem;">
                                    <UserReviewCard
                                        userReview={ userReview }
                                        profile={ userReviewProfileByUserIdMap[ userReview.userId ] }
                                        --review-card-min-width="18.175rem"
                                    />
                                </div>
                            {/each}
                    </PublicProfileList>
                {/if}
            </PublicProfileContent>
        {/if}
    </div>

    <div class="upper">
        <div class="display-flex flex-direction-column gap-150">
            <CallToAction
                type="error"
                title={ getLocalizedTextBySlug( 'profile-page-contribute-to-moien-call-to-action', {}, $languageTagStore ) }
                actionLabel={ getLocalizedTextBySlug( 'read-the-article-label', {}, $languageTagStore ) }
            />
            <span class="call-to-action-copyright-text font-size-90 color-gray-300 text-align-center">
                © 2024 MOIEN App. { getLocalizedTextBySlug( 'all-rights-reserved-label', {}, $languageTagStore ) }
            </span>
        </div>
    </div>
</div>
<!-- <div class="profile-page">
    {#if isLoading }
        <Loading/>
    {:else}
        <div class="profile-page-content-container">
            <div class="profile-header">
                <ProfileContainer profile={ profile }/>
                <div class="font-size-75 font-weight-700 color-green guest-average-rating">
                    <img src="/image/icon/star.svg" alt="star"/>
                    { averageRating === 0 ? 'N/A' : averageRating }
                </div>
            </div>
            <BadgeSection
                profile={ profile }
                userReviewArray={ userReviewArray }
                hasCompleteRentalFile={ hasCompleteRentalFile }
            />
            {#if propertyArray.length }
                <PropertySection propertyArray={ propertyArray }/>
            {/if}
            {#if userReviewArray.length > 0 }
                <UserReviewSection
                    userReviewArray={ userReviewArray }
                    userReviewProfileByUserIdMap={ userReviewProfileByUserIdMap }
                />
            {/if}
            {#if isTenant || isOwnProfile }
                {#if rentalFile }
                    <RentalFileSection rentalFile={ rentalFile }/>
                {/if}
                {#if documentArray.length }
                    <DocumentSection documentArray={ documentArray }/>
                {/if}
            {/if}
        </div>
    {/if}
</div> -->
