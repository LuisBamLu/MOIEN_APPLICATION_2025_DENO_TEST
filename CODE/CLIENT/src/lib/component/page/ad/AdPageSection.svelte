<script>
    // -- VARIABLES

    export let label = null;
    export let helper = null;
</script>

<style lang="stylus">
    // -- CLASSES

    .ad-page-section-container
    {
        display: flex;
        flex-direction: column;
    }

    .ad-page-section-text-group
    {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
</style>

<div class="ad-page-section-container">
    {#if label || helper }
        <div class="ad-page-section-text-group">
            {#if label }
                <div class="font-size-100 font-weight-700 color-gray-100">
                    { label }
                </div>
            {/if}
            {#if helper }
                <div class="font-size-75 color-gray-300">
                    { helper }
                </div>
            {/if}
        </div>
    {/if}
    <slot />
</div>
