<script>
    // -- IMPORTS

    import Badge from './Badge.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';

    // -- VARIABLES

    export let profile;
    export let userReviewArray;
    export let hasCompleteRentalFile = false;
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

<div class="badge-list-container">
    {#if profile.governmentIdValidationStatusId === 'verified' }
        <Badge
            iconClass="green-verified-icon"
            label={ getLocalizedTextBySlug( 'property-host-verified-user-label', $languageTagStore ) }
        />
    {/if}
    {#if userReviewArray.length > 0 }
        <Badge
            iconClass="green-quotes-icon"
            label=
                "
                    { getLocalizedTextBySlug( 'account-statistics-commentaires-label', $languageTagStore ) }
                    ({ userReviewArray.length })
                "
        />
    {/if}
    {#if hasCompleteRentalFile }
        <Badge
            iconClass="green-user-icon"
            label={ getLocalizedTextBySlug( 'visit-request-page-complete-rental-file-label', $languageTagStore ) }
        />
    {/if}
</div>
