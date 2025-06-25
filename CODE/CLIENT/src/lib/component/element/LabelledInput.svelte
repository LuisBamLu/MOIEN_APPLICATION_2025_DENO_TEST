<script>
    // -- VARIABLES

    export let variant = 'contained';
    export let label = '';
    export let value;
    export let suffix = null;
    export let placeholder = null;
    export let onChange = () => {};
    export let onBlur = () => {};
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .labelled-input
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem 0;

        display: flex;
        flex-direction: column;
    }

    .contained
    {
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;

        background-color: grayColor950;

        transition: all 200ms ease-in-out;
        &:focus-within
        {
            border-color: greenColor900;

            box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
        }
    }

    .input-text
    {
        margin: 0;
        outline: none;
        width: 100%;
        border: none;
        padding: 0;

        background-color: transparent !important;

        font-size: 0.875rem;
        font-weight: 500;
        color: grayColor300 !important;

        transition: background-color 5000s ease-in-out 0s;
        &:-internal-autofill-selected,
        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active
        {
            -webkit-background-clip: text;
            -webkit-text-fill-color: grayColor100;
            box-shadow: inset 0 0 20px 20px grayColor950;
        }
    }

    .input::placeholder
    {
        color: grayColor500;
    }

    .labelled-input:has( .input-text:invalid )
    {
        border-color: redColor500;

        box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
    }

    .labelled-input:has( .input-text:invalid ) div
    {
        color: redColor500;
    }

    .input-container
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>

<label class="labelled-input { variant }">
    <div class="font-size-75 font-weight-500 color-gray-500">
        { label }
    </div>
    <div class="input-container">
        <input
            { ...$$restProps }
            class="input-text"
            placeholder={ placeholder }
            bind:value={ value }
            on:change={ onChange }
            on:blur={ onBlur }
        />
        {#if suffix }
            <div class="font-size-75 font-weight-500 color-gray-300">
                { suffix }
            </div>
        {/if}
    </div>
</label>
