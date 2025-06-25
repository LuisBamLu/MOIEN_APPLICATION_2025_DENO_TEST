<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';

    // -- VARIABLES

    export let count = 0;
    export let minCount = 0;
    export let maxCount;

    // -- FUNCTIONS

    let dispatch = createEventDispatcher();

    // ~~

    function handleCounterChange(
        direction
        )
    {
        dispatch( 'change', direction );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .counter
    {
        display: flex;
        flex-direction: row;
        gap: var( --counter-gap, 0.5rem );
        align-items: center;
    }

    .counter-button
    {
        border: 0.125rem solid transparent;
        border-color: greenColor800;
        border-radius: 0.5rem;
        padding: 0.5rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: greenColor950;

        transition: all 250ms ease-out;
        >div
        {
           transition: background-color 250ms ease-out;
        }
    }

    .counter-button:disabled
    {
        border-color: grayColor800;

        background-color: grayColor800;

        cursor: not-allowed;
        >div
        {
            background-color: grayColor600;
        }
    }

    .counter-value
    {
        position: relative;

        min-width: 2.5rem;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<div class="counter">
    <button
        type="button"
        class="counter-button"
        on:click|preventDefault={ () => handleCounterChange( 'decrease' ) }
        disabled={ count <= minCount }
    >
        <div class="green-minus-icon size-100 icon"/>
    </button>
    <div class="font-size-100 font-weight-700 color-gray counter-value">
        <slot></slot>
    </div>
    <button
        type="button"
        class="counter-button"
        disabled={ count >= maxCount }
        on:click|preventDefault={ () => handleCounterChange( 'increase' ) }
    >
        <div class="green-plus-icon size-100 icon"/>
    </button>
</div>
