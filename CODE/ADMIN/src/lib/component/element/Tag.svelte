<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';

    // -- VARIABLES

    /** @type {{name?: any, label: any, isSelected?: boolean}} */
    let { name = undefined, label, isSelected = $bindable(false) } = $props();

    // -- FUNCTIONS

    let dispatch = createEventDispatcher();

    // ~~

    function toggleSelected(
        )
    {
        isSelected = !isSelected;
        dispatch( 'change', isSelected );
    }

    run(() => {
        isSelected = isSelected?.toString() === 'true' || false;
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl'

    // -- CLASSES

    .tag
    {
        padding: 0.75rem 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background: grayColor950;

        white-space: nowrap;

        cursor: pointer;
    }

    .tag:hover,
    .tag.is-selected
    {
        box-sizing: border-box;

        background: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        transition: box-shadow 400ms ease-in-out;
        .item-label
        {
            color: blueColor;

            transition: color 400ms ease-in-out;
        }
    }
</style>

{#if isSelected }
    <button type="button" class="tag is-selected" onclick={toggleSelected}>
        <div class="font-size-75 font-weight-700 color-gray-400 item-label">
            { label }
        </div>
        <input hidden type="checkbox" bind:checked={ isSelected } name={ name }>
    </button>
{:else}
    <button type="button" class="tag" onclick={toggleSelected}>
        <div class="font-size-75 font-weight-700 color-gray-400 item-label">
            { label }
        </div>
        <input hidden type="checkbox" bind:checked={ isSelected } name={ name }>
    </button>
{/if}
