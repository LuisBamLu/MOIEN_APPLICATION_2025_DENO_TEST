<script>
    // -- VARIABLES

    export let iconClass;
    export let label;
</script>

<style lang="stylus">
    // -- CLASSES

    .badge-container
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>

<div class="badge-container">
    <div class="{ iconClass } size-150" />
    <div class="font-size-90 font-weight-500 color-gray-300">
        { label }
    </div>
</div>
