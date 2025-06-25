<script>
    // -- VARIABLES

    /** @type {{label?: string, value: any, onChange?: any, variant?: string, children?: import('svelte').Snippet}} */
    let {
        label = '',
        value = $bindable(),
        onChange = () => {},
        variant = '',
        children
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .labelled-select
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem 0;

        display: flex;
        flex-direction: column;
    }

    .labelled-select.contained
    {
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.5rem;
        padding: 0.75rem;

        background-color: grayColor950;
    }

    .select
    {
        margin: 0;
        outline: none;
        border: none;
        padding: 0;

        background-color: transparent;

        font-size: 0.875rem;
        font-weight: 700;
        color: grayColor500;
    }
</style>

<label
    class="labelled-select"
    class:contained={ variant === 'contained' }
>
    <div class="font-size-75 font-weight-500 color-gray-300">
        { label }
    </div>
    <select class="select" bind:value={ value } onchange={onChange}>
        {@render children?.()}
    </select>
</label>
