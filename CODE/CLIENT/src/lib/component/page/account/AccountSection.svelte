<script>
    // -- IMPORTS

    import DashboardAccordion from '$component/page/account/AccountAccordion.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    export let sectionData;
    let { sectionTitleSlug: titleSlug, sectionAccordionArray: accordionArray } = sectionData;
</script>

<style lang="stylus">
    // -- CLASSES

    .dashboard-section
    {
        display: flex;
        flex-direction: column;
    }

    .dashboard-section-accordion-list
    {
        display: flex;
        flex-direction: column;
    }
</style>

<!-- svelte-ignore empty-block -->
{#if !$profileSignedInStore.mangopayUserId && ( titleSlug === 'profile-page-ads' || titleSlug === 'profile-page-finance-and-statistics' ) }
{:else}
    <section class="dashboard-section">
        <div class="font-size-100 font-weight-700 color-black">
            { getLocalizedTextBySlug( titleSlug, $languageTagStore ) }
        </div>
        <div class="dashboard-section-accordion-list">
            {#each accordionArray as accordionData }
                <DashboardAccordion { accordionData }/>
            {/each}
        </div>
    </section>
{/if}
