<script>
    // -- VARIABLES

    export let optionArray;
    export let selected;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .radio-group
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .radio-card
    {
        border: 2px solid lightGrayBorderColor;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        gap: 1rem;
        align-items: center;

        background-color: whiteColor;

        cursor: pointer;
        transition: .4s ease;
    }

    .radio-card-text-group
    {
        overflow: hidden;
        width: 100%;

        display: flex;
        flex-direction: column;

        text-overflow: ellipsis;
    }

    .radio-button
    {
        height: 1.125rem;
        width: 1.125rem;
        accent-color: greenColor;
    }

    .radio-card.checked
    {
        border-color: greenColor800;

        background-color: greenColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: greenColor100;
    }

    .radio-card-label
    {
        font-size: 0.875rem;
        font-weight: 700;
        color: grayColor100;

        transition: 400ms ease;
    }

    .radio-card-description
    {
        font-size: 0.75rem;
        color: grayColor300;

        transition: 400ms ease;
    }

    .radio-card-label.checked,
    .radio-card-description.checked
    {
        color: greenColor100;
    }
</style>

<div
    class="radio-group"
    role="radiogroup"
>
    {#each optionArray as option }
        <label
            class="radio-card"
            class:checked={ selected === option.value }
        >
            {#if option.icon }
                <div class="{ option.icon === 'unknown' ? 'gray-100-card' : option.icon }-icon size-280" />
            {/if}
            <div class="radio-card-text-group">
                <div
                    class="radio-card-label"
                    class:checked={ selected === option.value }
                >
                    { option.label }
                </div>
                {#if option.description }
                    <div
                        class="radio-card-description"
                        class:checked={ selected === option.value }
                    >
                        { option.description }
                    </div>
                {/if}
            </div>
            <input
                class="radio-button"
                type="radio"
                value={ option.value }
                name="payment-method"
                bind:group={ selected }
            />
        </label>
    {/each}
</div>
