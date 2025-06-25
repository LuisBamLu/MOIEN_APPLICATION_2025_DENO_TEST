<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    export let activeStep;

    // -- FUNCTIONS

    function handleBack(
        )
    {
        if ( activeStep > 0 )
        {
            activeStep--;
        }
        else
        {
            history.back();
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .checkout-page-header
    {
        z-index: 401;
        position: sticky;
        top: 0rem;
        left: 0;

        width: 100vw;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem 1.5rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: grayColor900;

        +media( desktop )
        {
            position: relative;
            top: auto;
            left: auto;

            width: 100%;
            max-width: 76.875rem;
            border-bottom: none;
            padding: 1.5rem 0 0;

            background-color: transparent;
        }
    }

    .back-button
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        font-size: 1rem;
        font-weight: 700;
        color: blueColor;

        +media( desktop )
        {
            font-size: 1.5rem;
            color: grayColor100;
        }
    }

    .skip-button
    {
        font-size: 0.75rem;
        font-weight: 500;
        color: greenColor;

        +media( desktop )
        {
            display: none;
        }
    }
</style>

<div class="checkout-page-header">
    <button
        class="back-button"
        type="button"
        on:click={ handleBack }
    >
        <div class="green-left-caret-icon size-150" />
        { getLocalizedTextBySlug( 'back-label', $languageTagStore ) }
    </button>
    {#if activeStep < 2 }
        <button
            class="skip-button"
            on:click={ () => activeStep++ }
        >
            { getLocalizedTextBySlug( 'onboarding-skip-label', $languageTagStore ) }
        </button>
    {/if}
</div>
