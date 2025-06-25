<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let error;
    let isVisible = true;

    // -- FUNCTIONS

    onMount(
        async () =>
        {
            document.body.scrollIntoView();

            isVisible = true;

            setTimeout(
                () =>
                {
                    isVisible = false;
                },
                5000
                );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .error
    {
        color: redColor;
    }
</style>

{#if error }
    {#if isVisible }
        <div class="error">
            { getLocalizedTextBySlug( error, $languageTagStore ) }
        </div>
    {/if}
{/if}
