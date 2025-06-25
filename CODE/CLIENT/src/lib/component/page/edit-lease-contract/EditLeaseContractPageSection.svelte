<script>
    // -- VARIABLES

    export let label = '';
    export let helper = null;
</script>

<style lang="stylus">
    // -- CLASSES

    .page-section
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

<div class="page-section">
    <div class="section-heading">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { label }
        </div>
        {#if helper }
            <div class="font-size-75 font-weight-500 font-color-300">
                { helper }
            </div>
        {/if}
    </div>
    <slot />
</div>
