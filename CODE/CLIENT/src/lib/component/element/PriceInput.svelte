<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';

    // -- VARIABLES

    export let required = false;
    export let priceNameLabel;
    export let value = 0;
    export let basePrice = null;
    let showedPrice;
    let isEditing = false;
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleOpenEdit(
        event
        )
    {
        isEditing = !isEditing;
        event.preventDefault();
        event.stopPropagation();
    }

    // ~~

    function handleChange(
        value
        )
    {
        dispatch( 'change', value );
    }

    // -- STATEMENTS

    $: showedPrice = basePrice === null ? 0 : basePrice;
    $: value = value === null ? showedPrice : value;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- STYLES

    .price-container
    {
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem 0;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .price-display-value
    {
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        justify-content: space-between;
    }

    .price-input
    {
        border-radius: 0.25rem;
        padding: 0.5rem;

        text-align: right;
    }
</style>

<div class="price-container">
    <button
        class="price-display-value"
        on:click={ event => handleOpenEdit( event )}
    >
        <div class="font-size-100 font-weight-500 color-gray-100">
            { priceNameLabel }
        </div>
        <div class="font-size-90 font-weight-600 color-gray-100">
            { value == null ? showedPrice : value } €
        </div>
    </button>
    {#if isEditing }
        <input
            class="price-input"
            required={ required }
            bind:value={ value }
            on:change={ ( event ) => handleChange( event.target.value ) }
        />
    {/if}
</div>
