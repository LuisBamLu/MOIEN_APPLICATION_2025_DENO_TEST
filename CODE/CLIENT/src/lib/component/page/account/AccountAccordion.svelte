<script>
    // -- IMPORTS

    import { Link } from 'svelte-routing';
    import { slide } from 'svelte/transition';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { isMobileScreen } from '$store/appDataStore';

    // -- VARIABLES

    export let accordionData;
    let { accordionTitleSlug: titleSlug, accordionSubtitle: subtitle, iconClass, href, component } = accordionData
    let isAccordionOpen = false;

    // -- FUNCTIONS

    function toggleAccordion(
        )
    {
        isAccordionOpen = !isAccordionOpen;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    :global( .dashboard-accordion )
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem 0;

        display: flex;
        gap: 0.75rem;
        justify-content: space-between;
        align-items: center;

        text-align: left;
        text-decoration: none;
        color: unset;

        cursor: pointer;
        transition: all 0.4s ease;
    }

    .dashboard-accordion-title
    {
        width: 100%;

        display: flex;
        flex-direction: column;

        line-height: 1.5rem;
    }

    .no-href
    {
        cursor: not-allowed;
    }

    .dashboard-accordion.is-open
    {
        border-bottom: 0;
    }

    .gray-right-caret-icon
    {
        transition: 0.4s all ease;
    }

    .gray-right-caret-icon.is-open
    {
        transform: rotate( 90deg );
    }

    .dashboard-accordion-content
    {
        width: 100%;
    }
</style>

{#if ( $isMobileScreen && href ) || ( href && !component ) }
    <Link class="dashboard-accordion { href ? '' : 'no-href' }" to={ href }>
        {#if iconClass }
            <div class="{ iconClass } size-150"/>
        {/if}
        <div class="dashboard-accordion-title">
            <span class="font-size-85 font-weight-500 color-gray-100" >
                { getLocalizedTextBySlug( titleSlug, $languageTagStore ) }
            </span>
            {#if subtitle }
                <span class="font-size-75 font-weight-500 color-gray" >{ subtitle }</span>
            {/if}
        </div>
        <div class ="gray-right-caret-icon size-150"/>
    </Link>
{:else}
    {#if component }
        <button class="dashboard-accordion" class:is-open={ isAccordionOpen } on:click={ toggleAccordion }>
            {#if iconClass }
                <div class="{ iconClass } size-150"/>
            {/if}
            <div class="dashboard-accordion-title">
                <span class="font-size-85 font-weight-500 color-gray-100" >
                    { getLocalizedTextBySlug( titleSlug, $languageTagStore ) }
                </span>
                {#if subtitle }
                    <span class="font-size-75 font-weight-500 color-gray" >{ subtitle }</span>
                {/if}
            </div>
            <div class ="gray-right-caret-icon size-150" class:is-open={ isAccordionOpen }/>
        </button>
    {:else}
        <Link class="dashboard-accordion { href ? '' : 'no-href' }" to={ href }>
            {#if iconClass }
                <div class="{ iconClass } size-150"/>
            {/if}
            <div class="dashboard-accordion-title">
                <span class="font-size-85 font-weight-500 color-gray-100" >
                    { getLocalizedTextBySlug( titleSlug, $languageTagStore )  }
                </span>
                {#if subtitle }
                    <span class="font-size-75 font-weight-500 color-gray" >{ subtitle }</span>
                {/if}
            </div>
            <div class ="gray-right-caret-icon size-150"/>
        </Link>
    {/if}
    {#if isAccordionOpen && component }
        <div class="dashboard-accordion-content" transition:slide>
            <svelte:component this={ component }/>
        </div>
    {/if}
{/if}
