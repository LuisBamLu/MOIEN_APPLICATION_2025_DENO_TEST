<script>
    // -- IMPORTS

    import Counter from '$component/element/Counter.svelte';
    import { createEventDispatcher } from 'svelte';
    import { fly } from 'svelte/transition';

    // -- VARIABLES

    export let count = 0;
    export let minCount = 0;
    export let maxCount = 10;
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleCounterChange(
        { detail }
        )
    {
        if ( detail === 'decrease' )
        {
            count--;
        }
        else
        {
            count++;
        }

        dispatch( 'change', count );
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .counter-text
    {
        position: absolute;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<Counter
    count={ count }
    minCount={ minCount }
    maxCount={ maxCount }
    on:change={ e => handleCounterChange( e ) }
>
    {#key count}
        <span
            in:fly={ { y: 20, duration: 300, delay: 100 } }
            out:fly={ { y: -20, duration: 300 } }
            class="counter-text"
        >
            { count }
        </span>
    {/key}
</Counter>
