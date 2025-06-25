<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';

    // -- CONSTANTS

    export let checked = false;
    export let label;
    export let name = '';
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleChange(
        event
        )
    {
        dispatch( 'change', event.target.checked );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .checkbox-container
    {
        width: fit-content;
        padding: 0.875rem 0;

        display: flex;
        gap: 0.75rem;
        align-items: center;

        cursor: pointer;
    }

    .checkbox-box
    {
        height: 1.75rem;
        width: 1.75rem;
        border: 1px solid grayColor600;
        border-radius: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: grayColor800;

        transition: all 400ms ease-in;
    }

    .checkbox-box.checked
    {
        border-color: greenColor500;

        background-color: greenColor500;
    }

    .icon
    {
        opacity: 0;

        transition: all 400ms ease-in;
    }

    .icon.icon-checked
    {
        opacity: 1;
    }
</style>

<label class="checkbox-container">
    <input
        hidden
        type="checkbox"
        name={ name }
        bind:checked={ checked }
        on:change={ handleChange }
    />
    <div
        class="checkbox-box"
        class:checked={ checked }
    >
        <div
            class="white-check-icon size-150 icon"
            class:icon-checked={ checked }
        />
    </div>
    <div class="font-size-90 font-weight-500 color-gray-300">
        { label }
    </div>
</label>
