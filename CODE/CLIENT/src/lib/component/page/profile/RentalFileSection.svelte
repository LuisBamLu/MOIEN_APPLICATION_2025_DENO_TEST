<script>
    // -- IMPORTS

    import EditLeaseContractPageSection from '../edit-lease-contract/EditLeaseContractPageSection.svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import Badge from './Badge.svelte';
    import { fetchData, getFormattedPrice } from '$src/lib/base';
    import { onMount } from 'svelte';
    import Loading from '../../element/Loading.svelte';

    // -- VARIABLES

    export let rentalFile;
    let employmentStatusByIdMap;
    let isLoading = true;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/employment-status/list', { method: 'POST' } );

            employmentStatusByIdMap = result.employmentStatusByIdMap;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- CLASSES

    .badge-list-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'ad-rental-file-label', $languageTagStore ) }
>
    <div class="badge-list-container">
        {#if isLoading }
            <Loading />
        {:else}
            <Badge
                iconClass="green-coins-icon"
                label=
                    {
                        getLocalizedTextBySlug(
                            'profile-page-monthly-income-label',
                            { monthlyIncome: getFormattedPrice( rentalFile.signatory.monthlyIncome, $languageTagStore ) },
                            $languageTagStore
                            )
                    }
            />
            <Badge
                iconClass="green-suitcase-icon"
                label=
                    {
                        getLocalizedText(
                            employmentStatusByIdMap[ rentalFile.signatory.employmentStatus ].name,
                            $languageTagStore
                            )
                    }
            />
            {#if rentalFile.signatory?.hasGuarantor }
                <Badge
                    iconClass="green-user-check-icon"
                    label={ getLocalizedTextBySlug( 'visit-request-page-has-guarantor-label', $languageTagStore ) }
                />
            {/if}
        {/if}
    </div>
</EditLeaseContractPageSection>
