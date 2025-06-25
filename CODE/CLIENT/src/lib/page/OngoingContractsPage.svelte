<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug, getLocalizedText } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import PropertyMiniCard from '$component/element/PropertyMiniCard.svelte';
    import Loading from '$component/element/Loading.svelte';

    // -- VARIABLES

    let leaseContractArray = [];
    let isLoading = true;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/page/ongoing-contracts', { method: 'POST', credentials: 'include' } );

            for ( let leaseContract of result.leaseContractArray )
            {
                let tenantProfile = result.profileByUserIdMap[ leaseContract.tenantUserProfileId ];
                let property = result.propertyByIdMap[ leaseContract.propertyId ];
                leaseContractArray.push(
                    {
                        href: '/dashboard/ads/lease-contract/' + leaseContract.id,
                        propertyTitle: property.title,
                        lessorName: tenantProfile.firstName + ' ' + tenantProfile.lastName,
                        propertyImagePath: property.imagePath
                    }
                    );
            }

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .ongoing-contracts-page
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

    .ongoing-contracts-page-content-container
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

    .ongoing-contracts-page-minicard-list-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'profile-page-ongoing-contracts', $languageTagStore ) }
    </title>
</svelte:head>

<div class="ongoing-contracts-page">
    <div class="ongoing-contracts-page-content-container">
        <div class="ongoing-contracts-page-heading">
            <div class="font-size-150 font-weight-600 color-gray-100">
                { getLocalizedTextBySlug( 'profile-page-ongoing-contracts', $languageTagStore ) }
            </div>
        </div>
        <div class="ongoing-contracts-page-minicard-list-container">
            {#if isLoading }
                <Loading />
            {:else}
                {#each leaseContractArray as leaseContract }
                    <PropertyMiniCard
                        route={ leaseContract.href }
                        text={ leaseContract.lessorName }
                        label={ getLocalizedText( leaseContract.propertyTitle, $languageTagStore ) }
                        imagePath={ leaseContract.propertyImagePath }
                    />
                {/each}
            {/if}
        </div>
    </div>
</div>
