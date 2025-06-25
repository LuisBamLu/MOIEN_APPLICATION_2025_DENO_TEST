<script>
    // -- IMPORTS

    import { onMount } from 'svelte';

    // -- VARIABLES

    export let success;

    let isVisible;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            document.body.scrollIntoView();

            isVisible = 1;

            setTimeout(
                () =>
                {
                    isVisible = 0;
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

    .success
    {
        color: greenColor;
    }
</style>

{#if success }
    {#if isVisible }
        <div class="success">
            { success }
        </div>
    {/if}
{/if}
