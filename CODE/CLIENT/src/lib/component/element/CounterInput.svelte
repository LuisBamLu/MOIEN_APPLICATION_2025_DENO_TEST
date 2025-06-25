<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';
    import { fly } from 'svelte/transition';

    // -- VARIABLES

    export let name = '';
    export let count = 0;
    export let minCount = 0;
    export let maxCount;
    let dispatch = createEventDispatcher();
    let sign = 1;

    // -- FUNCTIONS

    function handleCounterChange(
        direction
        )
    {
        if ( direction === 'increase' && ( maxCount === undefined || count < maxCount ) )
        {
            count++;
            sign = 1;
        }
        else if ( direction === 'decrease' && count > minCount )
        {
            count--;
            sign = -1;
        }

        dispatch( 'change', count );
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
        gap: 1rem;
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
    }

    .counter-button:disabled
    {
        border-color: grayColor800;

        background-color: grayColor800;

        cursor: not-allowed;
        >.icon
        {
            background-color: grayColor300;
        }
    }

    .counter-value
    {
        position: relative;

        width: 1rem;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .counter-text
    {
        position: absolute;

        display: flex;
        justify-content: center;
    }
</style>

<div class="counter">
    <input hidden bind:value={ count } name={ name }/>
    <button
        type="button"
        class="counter-button"
        disabled={ count <= minCount }
        on:click|preventDefault={ () => handleCounterChange( 'decrease' ) }
    >
        <div class="green-minus-icon size-100 icon"/>
    </button>
    <div class="font-size-90 font-weight-700 color-black counter-value">
        {#key count}
            <span
                class="counter-text"
                in:fly={ { y: 20 * sign, duration: 150, delay: 50 } }
                out:fly={ { y: -20 * sign, duration: 150 } }
            >
                { count }
            </span>
        {/key}
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
