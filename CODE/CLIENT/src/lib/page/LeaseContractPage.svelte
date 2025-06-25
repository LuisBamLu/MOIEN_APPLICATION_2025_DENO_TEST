<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import AccountAccordion from '$component/page/account/AccountAccordion.svelte';
    import ProfileImage from '../component/layout/ProfileImage.svelte';
    import { link } from 'svelte-routing';

    // -- VARIABLES

    export let id;
    let property;
    let tenantProfile;
    let leaseContract = null;
    let isLoading = true;
    $: accordionDataArray =
        [
            {
                href: '/dashboard/ads/lease-contract/supporting-documents/' + leaseContract?.id,
                accordionTitleSlug: 'profile-page-supporting-documents'
            },
            {
                href: '/dashboard/edit-lease-contract/' + leaseContract?.id,
                accordionTitleSlug: 'lease-contract-page-lease-contract-label'
            },
            {
                accordionTitleSlug: 'lease-contract-page-current-situation-label'
            },
            {
                accordionTitleSlug: 'lease-contract-page-payment-schedule-label'
            }
        ];

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/page/lease-contract/' + id, { method: 'POST', credentials: 'include' } );
            property = result.property;
            tenantProfile = result.tenantProfile;
            leaseContract = result.leaseContract;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .lease-contract-page
    {
        position: relative;

        margin-bottom: 4rem;
        padding: 0rem 1rem;
        padding-bottom: 6.75rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            margin-bottom: unset;
        }
    }

    .lease-contract-page-content-container
    {
        width: 100%;
        padding-top: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 76.875rem;
        }
    }

    .lease-contract-page-profile-container
    {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .profile-container-text-container
    {
        display: flex;
        flex-direction: column;
    }
</style>

<div class="lease-contract-page">
    <div class="lease-contract-page-content-container">
        {#if isLoading }
            <Loading />
        {:else}
            <div class="lease-contract-page-heading">
                <div class="font-size-150 font-weight-600 color-gray-100">
                    { getLocalizedText( property.title , $languageTagStore ) }
                </div>
            </div>
            <div class="lease-contract-page-profile-container">
                <ProfileImage profile={ tenantProfile } size="extra-large" />
                <div class="profile-container-text-container">
                    <div class="font-size-125 font-weight-600 color-gray-100">
                        { tenantProfile.firstName } { tenantProfile.lastName }
                    </div>
                    <a
                        class="font-size-90 font-weight-600 color-green-300"
                        href="/profile/{ tenantProfile.id }"
                        use:link
                    >
                        { getLocalizedTextBySlug( 'lease-contract-page-view-profile-label', $languageTagStore ) }
                    </a>
                </div>
            </div>
            <div class="lease-contract-page-accordion-list">
                {#each accordionDataArray as accordionData }
                    <AccountAccordion accordionData={ accordionData } />
                {/each}
            </div>
        {/if}
    </div>
</div>
