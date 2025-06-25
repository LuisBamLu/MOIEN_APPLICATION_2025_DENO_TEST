<script>
    // -- IMPORTS

    import { languageTagStore } from "$src/lib/store/languageTagStore";
    import { isDesktopListOpenStore, isDesktopMapOpenStore, isMobileListOpenStore, isMobileMapOpenStore } from "$src/lib/store/locationStore";
    import { getLocalizedTextBySlug } from "senselogic-gist";

    // -- FUNCTIONS

    function handleListButton(
        )
    {
        if ( $isDesktopListOpenStore )
        {
            if ( $isDesktopMapOpenStore )
            {
                $isDesktopListOpenStore = false;
            }
            else
            {
                $isDesktopMapOpenStore = true;
            }
        }
        else if ( $isMobileListOpenStore )
        {
            $isMobileMapOpenStore = true;
            $isMobileListOpenStore = false;
        }
    }

    // ~~

    function handleMapButton(
        )
    {
        if ( $isDesktopMapOpenStore )
        {
            if ( $isDesktopListOpenStore )
            {
                $isDesktopMapOpenStore = false;
            }
            else
            {
                $isDesktopListOpenStore = true;
            }
        }
        else if ( $isMobileMapOpenStore )
        {
            $isMobileListOpenStore = true;
            $isMobileMapOpenStore = false;
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-actions
    {
        z-index: 998;
        position: absolute;
        bottom: calc( 2dvh + 4rem );

        width: 100dvw;

        display: flex;
        gap: 4.125rem;
        justify-content: center;
    }

    .properties-action-button
    {
        height: 3.25rem;
        width: fit-content;
        border-radius: 0.75rem;
        padding: 0.875rem 2.5rem !important;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        font-size: 1rem;
        font-weight: 700;
        white-space: nowrap;

        transition: all 400ms ease-in-out;
        >div
        {
            transition: all 400ms ease-in-out;
        }
    }

    .list-button
    {
        border: 1px solid blueColor;

        background-color: whiteColor;

        color: blueColor;
        &:hover
        {
            border-color: blueColor500;

            color: blueColor500;
            >div
            {
                background-color: blueColor500;
            }
        }
    }

    .map-button
    {
        background-color: blueColor;

        color: whiteColor;
        &:hover
        {
            background-color: blueColor500;
        }
    }
</style>

<div class="properties-actions">
    {#if $isDesktopListOpenStore || $isMobileListOpenStore }
        <button
            class="properties-action-button list-button"
            on:click={ handleListButton }
        >
            {#if $isDesktopMapOpenStore }
                <div class="blue-list-icon size-150"/>
                { getLocalizedTextBySlug( 'property-list-close-list-button', $languageTagStore ) }
            {:else}
                <div class="blue-map-icon size-150"/>
                { getLocalizedTextBySlug( 'property-list-show-map-button', $languageTagStore ) }
            {/if}
        </button>
    {/if}
    {#if $isDesktopMapOpenStore || $isMobileMapOpenStore }
        <button
            class="properties-action-button map-button"
            on:click={ handleMapButton }
        >
            {#if $isDesktopListOpenStore }
                <div class="white-map-icon size-150"/>
                { getLocalizedTextBySlug( 'property-list-close-map-button', $languageTagStore ) }
            {:else}
                <div class="white-list-icon size-150"/>
                { getLocalizedTextBySlug( 'property-list-see-list-button', $languageTagStore ) }
            {/if}
        </button>
    {/if}
</div>
