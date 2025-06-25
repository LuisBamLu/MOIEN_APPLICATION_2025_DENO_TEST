<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';

    // -- VARIABLES

    export let name = undefined;
    export let label;
    export let isSelected = false;

    // -- FUNCTIONS

    let dispatch = createEventDispatcher();

    // ~~

    function toggleSelected(
        )
    {
        isSelected = !isSelected;
        dispatch( 'change', isSelected );
    }

    // -- STATEMENTS

    $: isSelected = isSelected?.toString() === 'true' || false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl'

    // -- CLASSES

    .tag
    {
        box-sizing: padding-box;
        outline: 1px solid transparent;
        border: none;
        border-radius: 1.5rem;
        padding: 0.75rem 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background: grayColor950;

        white-space: nowrap;

        cursor: pointer;
        transition: all 400ms ease-in-out;
    }

    .tag:hover
    {
        outline-color: grayColor600;
        background: whiteColor;
        .item-label
        {
            color: grayColor600;

            transition: color 400ms ease-in-out;
        }
    }

    .tag.is-selected,
    .tag.is-selected:hover
    {
        outline: 1px solid transparent;

        background-color: greenColor800;
        .item-label
        {
            color: greenColor100;
        }
    }
</style>

<button
    type="button"
    class="tag"
    class:is-selected={ isSelected }
    on:click={ toggleSelected }
>
    <div class="font-size-75 font-weight-700 color-gray-600 item-label">
        { label }
    </div>
    <input
        hidden
        type="checkbox"
        name={ name }
        bind:checked={ isSelected }
    >
</button>
