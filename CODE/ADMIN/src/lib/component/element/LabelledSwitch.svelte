<script>
    // -- IMPORTS

    import Switch from 'senselogic-flow/Switch.svelte';

    // -- VARIABLES

    /** @type {{label: any, value?: boolean, description?: any, borderBottom?: boolean, onChange?: any}} */
    let {
        label,
        value = $bindable(false),
        description = null,
        borderBottom = false,
        onChange = () => {}
    } = $props();
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

<div class="labelled-switch-container" class:border-bottom={ borderBottom } >
    <label class="labelled-switch">
        <div class="font-size-75 font-weight-700 color-gray-100">
            { label }
        </div>
        <Switch bind:value={ value } onChange={ onChange } />
    </label>
    {#if description }
        <div class="font-size-75 font-weight-500 color-gray-300">
            { description }
        </div>
    {/if}
</div>
