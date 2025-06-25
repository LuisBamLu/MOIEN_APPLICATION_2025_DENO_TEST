<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { Link } from 'svelte-routing';

    // -- VARIABLES

    export let text = 'Button';
    export let onClick = () => {};
    export let url = null;
    export let disabled = false;
    export let secondary = false;
    export let isHomeScreen = false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    button
    {
        border-radius: 0.75rem;
        padding: 1rem 2.5rem;

        gap: 0.5rem;

        background: linear-gradient( 96deg, #00FFC7 0%, #00D6A2 100% );

        line-height: 2rem;
        font-size: 1.5rem;
        font-weight: 600;
        color: blueColor100;

        cursor: pointer;
        &:active
        {
            border-color: blueColor300;

            background-color: blueColor300;
        }

        &:disabled
        {
            border-color: blueColorTransparent90;

            background-color: blueColorTransparent90;

            cursor: not-allowed;
        }

        &.secondary
        {
            background-color: transparent;

            color: blueColor300;
            &:hover
            {
                background-color: blueColor500;

                color: blueColor500;
            }

            &:active
            {
                background-color: blueColor300;

                color: blueColor300;
            }

            &:disabled
            {
                background-color: blueColorTransparent90;

                color: blueColorTransparent90;

                cursor: not-allowed;
            }
        }
    }

    button:hover
    {
        background: blueColor100;

        color: whiteColor;
    }
</style>

{#if url }
    <Link to={ url }>
        <button
            disabled={ disabled }
            class:secondary={ secondary }
            on:click={ onClick }
        >
            { getLocalizedTextBySlug( text, $languageTagStore ) }
        </button>
    </Link>
{:else}
    <button
        disabled={ disabled }
        class:secondary={ secondary }
        class:home-screen-button={ isHomeScreen }
        on:click={ onClick }
    >
        { getLocalizedTextBySlug( text, $languageTagStore ) }
    </button>
{/if}
