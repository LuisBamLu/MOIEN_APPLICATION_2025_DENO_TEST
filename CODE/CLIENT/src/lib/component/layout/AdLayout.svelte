<script>
    // -- IMPORTS

    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';

    // -- VARIABLES

    let success = writable( false );

    // -- STATEMENTS

    setContext( 'success', success );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    :global( .action-button )
    {
        width: 100%;
        max-width: 22rem;
        border-radius: 1rem;
        padding: 1rem;

        background-color: blueColor;
    }

    :global( .ads>form )
    {
        overflow-y: scroll;
        scrollbar-width: none;
        height: calc( var( --viewport-height ) - 15.25rem );

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        justify-content: space-between;
        -ms-overflow-style: none;

        +media( desktop )
        {
            height: calc( var( --viewport-height ) - 12rem );
        }
    }

    :global( .ads>form::webkit-scrollbar )
    {
        display: none;
    }

    :global( .ads input ),
    :global( .ads textarea )
    {
        width: 100%;
        border: 2px solid grayColor700;
        border-radius: 0.75rem;
        padding: 0.5rem 0.75rem;

        display: flex;
        flex-direction: column;

        background-color: whiteColor;

        color: blackColor;
    }

    :global( .ads textarea )
    {
        min-height: 9rem;
    }

    // -- CLASSES

    :global( .ads .input-list )
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    :global( .ads .ad-page-container )
    {
        overflow-y: scroll;
        padding: 2rem 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    :global( .ads .ad-page-section )
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    :global( .ads .ad-page-section-text-group )
    {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    :global( .ads .ad-page-section-list-option )
    {
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
        justify-content: space-between;
    }

    :global( .ads .input-list>div )
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    :global( .ads .ad-page-button )
    {
        width: 100%;
        max-width: 22rem;
        border-radius: 1rem;
        padding: 1rem;

        background-color: blueColor;
    }

    :global( .ads .alternate )
    {
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem 0;
    }

    :global( .ads .no-border )
    {
        border-bottom: unset;
    }

    :global( .ads .ad-page-tag-list )
    {
        width: 100%;

        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    :global( .ads .ad-page-button-container )
    {
        z-index: 400;
        position: fixed;
        bottom: 4rem;
        left: 0;

        width: var( --viewport-width );
        border-top: 1px solid grayColor700;
        padding: 1rem 1.5rem;

        display: flex;
        gap: 1rem;
        justify-content: center;

        background-color: pageBackgroundColor;

        +media( desktop )
        {
            bottom: 0;
        }
    }

    :global( .ads .ad-page-button-container button )
    {
        flex: 1;

        +media( desktop )
        {
            min-width: 10rem;

            flex: unset;
        }
    }

    :global( .ads .ad-page-save-button )
    {
        background-color: unset;
    }

    :global( .ads .ad-page-textarea )
    {
        min-height: 9rem;
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 1rem;

        font-size: 0.9rem;
    }

    :global( .ads .ad-page-textarea:focus )
    {
        outline: none;
    }

    // -- CLASSES

    .container
    {
        width: 100%;

        display: flex;
        justify-content: center;
    }

    .ads
    {
        margin-top: 2.5rem;
        height: calc( 100dvh - 11.875rem );
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            height: calc( 100dvh - 12.25rem );
            width: pageMaxContentWidth;
        }
    }
</style>

<div class="container">
    <div class="ads">
        <slot />
    </div>
</div>
