<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from "senselogic-gist";
    import { languageTagStore } from "$store/languageTagStore";

    // -- VARIABLES

    export let selectedTerm = null;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .house-management-options
    {
        margin-top: 1rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: flex-start;
    }

    .house-management-options-button
    {
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        background: whiteColor;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px;

        cursor: pointer;
        p
        {
            margin: 0;

            font-size: 1.2rem;
            text-align: center;
            color: grayColor100;
        }
    }
</style>

<div class="house-management-options">
    {#if selectedTerm == 'long' }
        <div class="house-management-options-button">
            <div class="icon size-150"></div>
            <p>{ getLocalizedTextBySlug( '', $languageTagStore ) }</p>
        </div>
        <div class="house-management-options-button">
            <div class="icon size-150"></div>
            <p>{ getLocalizedTextBySlug( '', $languageTagStore ) }</p>
        </div>
    {:else if selectedTerm == 'short' }
        <div class="house-management-options-button">
            <div class="icon size-150"></div>
            <p>{ getLocalizedTextBySlug( '', $languageTagStore ) }</p>
        </div>
        <div class="house-management-options-button">
            <div class="icon size-150"></div>
            <p>{ getLocalizedTextBySlug( '', $languageTagStore ) }</p>
        </div>
    {/if}
</div>
