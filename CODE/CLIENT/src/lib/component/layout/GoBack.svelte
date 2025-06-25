<script>
    // -- IMPORTS

    import { navigate } from 'svelte-routing';

    // -- VARIABLES

    let previousPage = '/search';

    // -- FUNCTIONS

    function goBack(
        )
    {
        navigate( previousPage );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .go-back
    {
        height: 2.25rem;
        width: 2.25rem;
        border-radius: 0.75rem;
        border-radius: 0.75rem;
        padding: 0.375rem 0.4375rem 0.375rem 0.3125rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: whiteColor;
    }
</style>

<button class="go-back" on:click={ goBack }>
    <span class="green-left-caret-icon size-150"/>
</button>
