<script>
    // -- IMPORTS

    import Switch from 'senselogic-flow/Switch.svelte';

    // -- VARIABLES

    export let label;
    export let value = false;
    export let description = null;
    export let borderBottom = false;
    export let onChange = () => {};
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl'

    // -- CLASSES

    .labelled-switch-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .labelled-switch-container.border-bottom
    {
        border-bottom: 1px solid lightGrayBorderColor;
        padding-bottom: 0.75rem;
    }

    .labelled-switch
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

<div
    class="labelled-switch-container"
    class:border-bottom={ borderBottom }
>
    <label class="labelled-switch">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { label }
        </div>
        <Switch
            onChange={ onChange }
            bind:value={ value }
        />
    </label>
    {#if description }
        <div class="font-size-75 font-weight-500 color-gray-300">
            { description }
        </div>
    {/if}
</div>
