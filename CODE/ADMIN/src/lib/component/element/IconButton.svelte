<script>
    // -- VARIABLES

    /** @type {{type?: 'button' | 'submit' | 'reset', title?: any, disabled?: boolean, handleClick?: () => void, children?: import('svelte').Snippet}} */
    let {
        type = 'button',
        title = null,
        disabled = false,
        handleClick = () => {},
        children
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .adornment-button
    {
        align-items: center;
        appearance: none;
        position: relative;

        overflow: visible;
        box-sizing: border-box;
        margin: 0;
        outline: 0px;
        height: 1.5em;
        width: 1.5em;
        border: 0px;
        border-radius: 50%;
        padding: 0em;

        display: inline-flex;
        flex: 0 0 auto;
        justify-content: center;

        background-color: transparent;

        font-size: 1.5em;
        vertical-align: middle;
        text-align: center;
        text-decoration: none;
        color: grayColorTransparent70;

        user-select: none;
        cursor: pointer;
        transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }

    .adornment-button:hover
    {
        background-color: rgba(0, 0, 0, 0.04);
    }

    .adornment-button[ disabled ]
    {
        cursor: not-allowed;
    }
</style>

<button
    class="adornment-button"
    { type }
    { title }
    { disabled }
    onclick={ handleClick }
>
    {@render children?.()}
</button>
