<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore'

    // -- VARIABLES

    export let activeStep;
    export let handleBack = () => {}
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl';

    // -- CLASSES

    .secondary-header
    {
        z-index: 401;
        position: fixed;
        top: 0rem;
        left: 0;

        width: var( --viewport-width );
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem 1.5rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: pageBackgroundColor;

        +media( desktop )
        {
            top: 4.5rem;
        }
    }

    .secondary-header-button
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>

<div class="secondary-header">
    {#if activeStep === 1 }
        <div />
    {:else}
        <button
            class="secondary-header-button"
            on:click={ handleBack }
        >
            <div class="green-left-caret-icon size-150"  />
            <div class="font-size-100 font-weight-700 color-blue-100">
                { getLocalizedTextBySlug( 'back-label', $languageTagStore ) }
            </div>
        </button>
    {/if}
    <div class="font-size-75 font-weight-500 color-gray-300">
        { getLocalizedTextBySlug( 'step-label', $languageTagStore ) }
        { activeStep }
    </div>
</div>
