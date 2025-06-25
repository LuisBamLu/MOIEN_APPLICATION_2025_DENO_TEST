<script>
    // -- IMPORTS

    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import CallToAction from '$component/element/CallToAction.svelte';
    import AccountSection from '$component/page/account/AccountSection.svelte';
    import PersonalDetailAccordion from '$component/page/account/PersonalDetailAccordion.svelte';
    import AccountBalance from '$component/page/account/AccountBalance.svelte';
    import AccountBankingInformation from '$component/page/account/AccountBankingInformation.svelte';
    import AccountStatistics from '$component/page/account/AccountStatistics.svelte';
    import AccountNotificationSettings from '$component/page/account/AccountNotificationSettings.svelte';
    import AccountSettings from '$component/page/account/AccountSettings.svelte';
    import AccountRentalFile from '$component/page/account/AccountRentalFile.svelte';
    import AccountSupportingDocuments from '$component/page/account/AccountSupportingDocuments.svelte';
    import { fetchData } from '$lib/base';
    import { navigate } from 'svelte-routing';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import PublicProfileCard from '$component/page/profile/PublicProfileCard.svelte';
    import PublicProfileBiography from '$component/page/profile/PublicProfileBiography.svelte';
    import PublicProfileHeader from '$component/page/profile/PublicProfileHeader.svelte';
    import PublicProfileButton from '$component/page/profile/PublicProfileButton.svelte';
    import PersonalDetail from '$component/page/account/PersonalDetail.svelte';
    import { onMount } from 'svelte';
    import { currentPathname } from '../router';

    // -- VARIABLES

    let userRatingArray;
    let userRating;
    let sectionArray =
        [
            {
                sectionTitleSlug:  'profile-page-tenant-space',
                sectionAccordionArray:
                    [
                        {
                            accordionTitleSlug: 'profile-page-rental-file',
                            iconClass: 'green-user-icon',
                            href: '/dashboard/rental-file',
                            component: AccountRentalFile
                        },
                        {
                            accordionTitleSlug: 'profile-page-supporting-documents',
                            href: `/dashboard/supporting-document`,
                            iconClass: 'green-address-book-icon',
                            component: AccountSupportingDocuments
                        },
                        {
                            accordionTitleSlug: 'profile-page-ongoing-contracts',
                            href: `/dashboard/ads/ongoing-contracts`,
                            iconClass: 'green-files-icon'
                        }
                    ]
            },
            {
                sectionTitleSlug: 'profile-page-bookings',
                sectionAccordionArray:
                    [
                        {
                            accordionTitleSlug: 'profile-page-bookings-list',
                            href: `/dashboard/bookings`,
                            iconClass: 'green-calendar-check-icon'
                        },
                        {
                            accordionTitleSlug: 'renting-list-label',
                            href: `/dashboard/user-rentals`,
                            iconClass: 'green-address-book-icon'
                        }
                    ]
            },
            {
                sectionTitleSlug: 'profile-page-ads',
                sectionAccordionArray:
                    [
                        {
                            accordionTitleSlug: 'profile-page-ads-list',
                            href: `/dashboard/ads`,
                            iconClass: 'green-house-icon'
                        },
                        {
                            accordionTitleSlug: 'profile-page-ads-new',
                            href: `/dashboard/ads/new`,
                            iconClass: 'green-plus-circle-icon'
                        }
                    ]
            },
            {
                sectionTitleSlug: 'profile-page-finance-and-statistics',
                sectionAccordionArray:
                    [
                        {
                            accordionTitleSlug: 'profile-page-account-balance',
                            iconClass: 'green-currency-circle-icon',
                            component: AccountBalance,
                            href: '/dashboard/balance'
                        },
                        {
                            accordionTitleSlug: 'profile-page-banking-information',
                            iconClass: 'green-cardholder-icon',
                            component: AccountBankingInformation,
                            href: '/dashboard/banking-information'
                        },
                        {
                            accordionTitleSlug: 'profile-page-statistics',
                            iconClass: 'green-presentation-chart-icon',
                            component: AccountStatistics,
                            href: '/dashboard/statistics'
                        }
                    ]
            },
            {
                sectionTitleSlug: 'profile-page-application',
                sectionAccordionArray:
                    [
                        {
                            accordionTitleSlug: 'profile-page-account-settings',
                            href: '/dashboard/settings',
                            iconClass: 'green-settings-icon',
                            component: AccountSettings

                        },
                        {
                            accordionTitleSlug: 'profile-page-notification-settings',
                            iconClass: 'green-bell-icon',
                            component: AccountNotificationSettings
                        },
                        {
                            accordionTitleSlug: 'profile-page-terms-of-use',
                            href: `/terms`,
                            iconClass: 'green-list-dashes-icon'

                        },
                        {
                            accordionTitleSlug: 'profile-page-privacy-policy',
                            href: `/privacy-policy`,
                            iconClass: 'green-list-checks-icon'
                        }
                    ]
            }
        ];

    // -- FUNCTIONS

    async function handleSignOut(
        )
    {
        if ( $currentPathname.includes( '/dashboard' ) )
        {
            navigate( '/search' );
        }

        let result = await fetchData( '/api/sign-out', { method: 'POST', credentials: 'include' } );

        if ( result )
        {
            $profileSignedInStore = result.profile;
        }
    }

    // ~~

    async function getProfileRating(
        )
    {
        let result = await fetchData( '/api/get-user-review',
            {
                method: 'POST',
                body: getJsonText( { userId: $profileSignedInStore.userId } ),
                headers: { 'Content-Type': 'application/json' }
            }
         )

        userRatingArray = result.map( ( item ) => item.rating )

        userRating = getAverageRating( userRatingArray )
    }

    // ~~

    function getAverageRating(
        userRatingArray_
        )
    {
        if ( userRatingArray_.length === 0 )
        {
            return 0;
        }
        else
        {
            return ( userRatingArray_.reduce( ( a, b ) => a + b ) / userRatingArray_.length ).toFixed( 1 );
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
                    url: `/profile/${ $profileSignedInStore.id }`,
                }
                );
        }
  }

    // -- STATEMENTS

    onMount(
       async () =>
        {
            await getProfileRating();
        }
    )
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .page-container
    {
        padding: 1.5rem 1.5rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            padding: 1.5rem 2rem;
        }
    }

    .content-container
    {
        margin-bottom: 4rem;
        width: 100%;
        max-width: pageMaxContentWidth;

        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        +media( desktop )
        {
            margin-bottom: 0;

            grid-template-columns: 1fr 27.875rem;
            gap: 3rem;
        }
    }

    .upper
    {
        width: 100%;

        display: none;
        flex-wrap: wrap;
        row-gap: 1.5rem;
        align-items: flex-start;
        column-gap: 3rem;

        +media( desktop )
        {
            display: flex;
        }
    }

    .dashboard-list
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 46rem;
        }
    }

    .dashboard-list-actions,
    .dashboard-list-header
    {
        display: flex;
    }

    .dashboard-list-actions
    {
        gap: 0.75rem;
    }

    .dashboard-list-header
    {
        justify-content: space-between;
    }

    .dashboard-list-title
    {
        font-family: "Plus Jakarta Sans", sans-serif;
    }

    .call-to-action-container
    {
        max-width: 46rem;

        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 1rem;
        grid-row-start: 1;
        grid-row-end: 1;
    }

    .call-to-action-copyright-text
    {
        text-align: center;
    }

    .mobile
    {
        +media( desktop )
        {
            display: none;
        }
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'admin-menu-dashboard-label', $languageTagStore ) }
    </title>
</svelte:head>

{#if $isLoadingProfile }
    <Loading />
{:else}
    <div class="page-container">
        <div class="content-container">
            <div class="dashboard-list">
                <PublicProfileHeader>
                    <div class="display-flex gap-50">
                        <PublicProfileButton
                            isDisabled={ true }
                        >
                            <span class="green-300-outlined-star-icon size-125"/>
                            <span class="color-green-100 font-size-75 font-weight-700 line-height-125">
                                { userRating ? userRating : 'N/A' }
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
                <PublicProfileCard profile={ $profileSignedInStore }/>
                <PublicProfileBiography profile={ $profileSignedInStore } --desktop-border-bottom="none"/>
                <PersonalDetail/>
                <div class="mobile">
                    <CallToAction
                        type="error"
                        title={ getLocalizedTextBySlug( 'profile-page-contribute-to-moien-call-to-action', $languageTagStore ) }
                        actionLabel={ getLocalizedTextBySlug( 'read-the-article-label', $languageTagStore ) }
                    />
                </div>
                {#each sectionArray as sectionData }
                    <AccountSection { sectionData }/>
                {/each}
            </div>
            <div class="upper">
                <div class="call-to-action-container">
                    <CallToAction
                        type="error"
                        title={ getLocalizedTextBySlug( 'profile-page-contribute-to-moien-call-to-action', $languageTagStore ) }
                        actionLabel={ getLocalizedTextBySlug( 'read-the-article-label', $languageTagStore ) }
                    />
                    <span class="call-to-action-copyright-text font-size-90 color-gray-300">
                        © 2024 MOIEN App. { getLocalizedTextBySlug( 'all-rights-reserved-label', $languageTagStore ) }
                    </span>
                </div>
            </div>
            <ModalButton
                variant="outlined"
                text={ getLocalizedTextBySlug( 'auth-log-out-button' , $languageTagStore ) }
                on:click={ handleSignOut }
            />
            <span class="call-to-action-copyright-text mobile font-size-90 color-gray-300">
                © 2024 MOIEN App. { getLocalizedTextBySlug( 'all-rights-reserved-label', $languageTagStore ) }
            </span>
        </div>
    </div>
{/if}
