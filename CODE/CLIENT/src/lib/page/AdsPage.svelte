<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { Link, navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug, getJsonText } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { updateUrlParameter } from '$lib/url.js';
    import { languageTagStore } from '$store/languageTagStore';
    import { isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore.js';
    import Loading from '$component/element/Loading.svelte';
    import DashboardAccordion from '$component/page/account/AccountAccordion.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import PropertyCard from '$component/page/properties/PropertyCard.svelte';
    import Tab from '$component/element/Tab.svelte';
    import { currencyConversionByConversionCodeMapStore } from '$store/currencyConversionByConversionCodeMapStore';

    // -- VARIABLES

    let callToActionIsVisible = true;
    let propertyArray = null;
    let isLoading = true;
    let isLoadingProperties = true;
    let longTermAccordionDataArray =
        [
            {
                iconClass: 'green-calendar-check-icon',
                accordionTitleSlug: 'my-ads-page-availability-for-visits',
                href: 'availability'
            },
            {
                iconClass: 'green-files-icon',
                accordionTitleSlug: 'my-ads-page-ongoing-contracts',
                href: 'ongoing-contracts'
            },
            {
                iconClass: 'green-device-tablet-speaker-icon',
                accordionTitleSlug: 'my-ads-page-subscribe-to-moien-services'
            }
        ];
    let shortTermAccordionDataArray =
        [
            {
                iconClass: 'green-suitcase-icon',
                accordionTitleSlug: 'my-ads-page-current-and-upcoming-stays',
                href: 'current-stays'
            },
            {
                iconClass: 'green-files-icon',
                accordionTitleSlug: 'my-ads-page-completed-or-canceled-stays'
            }
        ];
    let showAll = false;

    // -- FUNCTIONS

    function termTypeSelector(
        termType
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };
                let isCurrentlySelected = updatedParameters.propertyParameters[ termType ];

                updatedParameters.featureParameters = {};

                if ( !isCurrentlySelected )
                {
                    updatedParameters.propertyParameters[ termType ] = true;
                }
                else
                {
                    delete updatedParameters.propertyParameters[ termType ];
                }

                return updatedParameters;
            }
            );

        updateUrlParameter(
            $filterParameterByKeyMapStore
            );
    }

    // ~~

    function statusSelector(
        statusId
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };
                let currentValue = updatedParameters.propertyParameters.statusId;

                if ( currentValue === statusId )
                {
                    delete updatedParameters.propertyParameters.statusId;
                }
                else
                {
                    updatedParameters.propertyParameters.statusId = statusId;
                }

                return updatedParameters;
            }
            );

        updateUrlParameter(
            $filterParameterByKeyMapStore
            );
    }

    // ~~

    async function fetchPropertyArray(
        )
    {
        isLoadingProperties = true;

        let propertyData
            = await fetchData(
                '/api/property/get',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: getJsonText(
                        {
                            propertyParameters:
                                {
                                    userId: $profileSignedInStore.userId,
                                    ...$filterParameterByKeyMapStore.propertyParameters
                                },
                            propertyLimit: showAll ? 100 : 4
                        }
                        )
                }
                );

        propertyArray = propertyData.propertyArray;
        $currencyConversionByConversionCodeMapStore =
            {
                ...$currencyConversionByConversionCodeMapStore,
                ...propertyData.optionMap.currencyConversionByConversionCodeMap
            };

        if ( propertyArray === null )
        {
            propertyArray = [];
        }

        isLoadingProperties = false;
    }

    // ~~

    function toggleShowAll(
        )
    {
        showAll = !showAll;
        fetchPropertyArray();
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( !$isLoadingProfile && $profileSignedInStore === null )
            {
                navigate( '/' );
            }

            let data = await fetchData( '/api/page/ads', { method: 'POST', credentials: 'include' } );

            propertyArray = data.propertyData.propertyArray;
            isLoading = false;
        }
        );

    // ~~

    $:
    {
        $filterParameterByKeyMapStore;
        fetchPropertyArray();
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .my-ads-page
    {
        margin-top: 5.3125rem;
        margin-bottom: 4.5rem;
        margin-left: auto;
        margin-right: auto;
        max-width: 78.875rem;
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        row-gap: 1.5rem;
        column-gap: 3rem;

        +media( desktop )
        {
            margin-top: 0rem;

            flex-direction: row;
        }
    }

    .my-ads-page-section
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 27.875rem;
        }
    }

    .my-ads-page-section.first
    {
        +media( desktop )
        {
            width: 60%;
            max-width: unset;
        }
    }

    .my-ads-page-section.second
    {
        flex-direction: column-reverse;

        +media( desktop )
        {
            flex-direction: column;
        }
    }

    .my-ads-page-section-header
    {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 2rem 1.5rem 1rem;

        display: none;
        justify-content: space-between;
        align-items: center;

        background-color: grayColor900;

        +media( desktop )
        {
            position: static;
            top: unset;
            left: unset;

            border-bottom: none;
            padding: 0;

            display: flex;

            background-color: transparent;
        }
    }

    .my-ads-page-tag-list
    {
        display: none;

        +media( desktop )
        {
            display: flex;
            gap: 0.5rem;
        }
    }

    .my-ads-page-ad-list
    {
        display: grid;
        grid-template-columns: repeat( auto-fill, minmax( 21.5rem, 1fr ) );
        gap: 1.5rem;
    }

    .my-ads-page-list-anchor-container
    {
        height: 3.25rem;
        width: fit-content;
        width: 100%;
        border-radius: 0.5rem;
        padding: 0.75rem 2.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        background: whiteColor;

        color: blueColor;
    }

    .my-ads-page-call-to-action
    {
        position: relative;

        border: 2px solid greenColor800;
        border-radius: 1rem;
        padding: 1.5rem 1rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: greenColor950;
    }

    .my-ads-page-call-to-action-text-container
    {
        display: flex;
        flex-direction: column;
        gap: 1.875rem;
    }

    .my-ads-page-call-to-action-image
    {
        margin-top: 2.25rem;
        width: 6rem;
    }

    .my-ads-page-call-to-action-close-button
    {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
    }

    .my-ads-page-new-ad-action
    {
        height: 16rem;
        width: 100%;
        border: 2px solid blueColor900;
        border-radius: 1rem;
        padding: 1rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        justify-content: center;
        align-items: center;

        background-color: blueColor950;
    }

    :global( .my-ads-page-new-ad-link )
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .property-card-button
    {
        height: 2.125rem;
        border-radius: 0.75rem;
        padding: 0.375rem 1rem 0.375rem 0.75rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        background: rgba( 0, 0, 0, 0.20 );
        backdrop-filter: blur( 10px );

        font-size: 0.875rem;
        color: whiteColor;
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'profile-page-ads', $languageTagStore ) }
    </title>
</svelte:head>

{#if isLoading }
    <Loading />
{:else}
    <div class="my-ads-page">
        <div class="my-ads-page-section first">
            <div class="my-ads-page-section-header">
                <div class="font-size-150 font-weight-600 color-gray-100">
                    { getLocalizedTextBySlug( 'profile-page-ads', $languageTagStore ) }
                </div>
            </div>
            <div class="my-ads-page-tag-list">
                <Tab
                    isActive={ $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForShortTerm' ] }
                    label={ getLocalizedTextBySlug( 'filter-short-term-label', $languageTagStore ) }
                    on:click={ () => termTypeSelector( 'isAvailableForShortTerm' ) }
                />
                <Tab
                    isActive={ $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForLongTerm' ] }
                    label={ getLocalizedTextBySlug( 'filter-long-term-label', $languageTagStore ) }
                    on:click={ () => termTypeSelector( 'isAvailableForLongTerm' ) }
                />
                <Tab
                    isActive={ $filterParameterByKeyMapStore.propertyParameters.statusId === 'online' }
                    label={ getLocalizedTextBySlug( 'published-label', $languageTagStore ) }
                    on:click={ () => statusSelector( 'online' ) }
                />
                <Tab
                    isActive={ $filterParameterByKeyMapStore.propertyParameters.statusId === 'offline' }
                    label={ getLocalizedTextBySlug( 'unpublished-label', $languageTagStore ) }
                    on:click={ () => statusSelector( 'offline' ) }
                />
            </div>
            <div class="my-ads-page-ad-list">
                {#if isLoadingProperties }
                    <Loading />
                {:else}
                    {#if propertyArray.length > 0 }
                        <Link class="my-ads-page-new-ad-link" to='new'>
                            <div class="my-ads-page-new-ad-action">
                                <div class="add-icon size-150"/>
                                <div class="font-size-90 font-weight-700 color-blue">
                                    { getLocalizedTextBySlug( 'profile-page-ads-new', $languageTagStore ) }
                                </div>
                            </div>
                        </Link>
                        {#each propertyArray as property }
                            <PropertyCard
                                property={ property }
                                showPlaceButton={ false }
                            >
                                <a class="property-card-button" href="/property/{ property.id }" slot="view-button">
                                    <span class="bold-white-eye-icon size-100"/>
                                    View
                                </a>
                                <a class="property-card-button" href="/dashboard/property-management/{ property.id }" slot="edit-button">
                                    <span class="white-regular-pencil-icon size-100"/>
                                    Edit
                                </a>
                            </PropertyCard>
                        {/each}
                    {:else}
                        <div class="my-ads-page-new-ad-action">
                            <div class="font-size-90 font-weight-700 color-blue-400">
                                { getLocalizedTextBySlug( 'my-ads-page-you-dont-have-ads', $languageTagStore ) }
                            </div>
                            <Link class="my-ads-page-new-ad-link" to='new'>
                                <div class="add-icon size-150"/>
                                <div class="font-size-90 font-weight-700 color-blue">
                                    { getLocalizedTextBySlug( 'profile-page-ads-new', $languageTagStore ) }
                                </div>
                            </Link>
                        </div>
                        <div class="no-ads-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="40" r="40" fill="#E5E5E5"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M57.0256 29.1797C57.0256 31.3038 55.3037 33.0258 53.1795 33.0258C51.0553 33.0258 49.3333 31.3038 49.3333 29.1797C49.3333 27.0555 51.0553 25.3335 53.1795 25.3335C55.3037 25.3335 57.0256 27.0555 57.0256 29.1797ZM31.6923 29.2291C31.6923 31.3533 29.9703 33.0753 27.8462 33.0753C25.722 33.0753 24 31.3533 24 29.2291C24 27.105 25.722 25.383 27.8462 25.383C29.9703 25.383 31.6923 27.105 31.6923 29.2291ZM28 56.0002L53.3333 56.0002L53.3333 49.3335L28 49.3335L28 56.0002Z" fill="#A3A3A3"/>
                            </svg>
                        </div>
                    {/if}
                {/if}
            </div>

            <div class="my-ads-page-list-anchor-container">
                <ModalButton
                    variant="light"
                    text={ getLocalizedTextBySlug( showAll ? 'show-less-label' : 'ad-show-all-label', $languageTagStore ) }
                    on:click={ toggleShowAll }
                />
            </div>
        </div>
        <div class="my-ads-page-section second">
            {#if callToActionIsVisible }
                <div class="my-ads-page-call-to-action">
                    <div class="my-ads-page-call-to-action-text-container">
                        <div class="font-size-90 font-weight-700 color-green">
                            { getLocalizedTextBySlug( 'my-ads-page-manage-your-long-term-rentals', $languageTagStore ) }
                        </div>
                        <Link class="font-size-90 font-weight-700 color-blue my-ads-page-call-to-action-anchor" to="/">
                            { getLocalizedTextBySlug( 'my-ads-page-learn-more', $languageTagStore ) }
                        </Link>
                    </div>
                    <img
                        src="/image/supporting-documents/heading.svg"
                        alt="heading"
                        class="my-ads-page-call-to-action-image"
                    />
                    <button class="my-ads-page-call-to-action-close-button" on:click={ () => callToActionIsVisible = false }>
                        <div class="green-close-icon size-90"/>
                    </button>
                </div>
            {/if}
            <div>
                <div class="my-ads-page-property-management">
                    <div class="font-size-100 font-weight-700 color-black">
                        { getLocalizedTextBySlug( 'my-ads-page-property-management', $languageTagStore ) }
                    </div>
                    <div class="my-ads-page-property-management">
                        {#each longTermAccordionDataArray as accordionData }
                            <DashboardAccordion accordionData={ accordionData } />
                        {/each}
                    </div>
                </div>
                <div class="my-ads-property-management">
                    <div class="font-size-100 font-weight-700 color-black">
                        { getLocalizedTextBySlug( 'my-ads-page-short-term-stay-management', $languageTagStore ) }
                    </div>
                    <div class="my-ads-page-property-management">
                        {#each shortTermAccordionDataArray as accordionData }
                            <DashboardAccordion accordionData={ accordionData } />
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
