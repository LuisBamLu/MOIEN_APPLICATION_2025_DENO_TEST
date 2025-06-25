<script>
    // -- VARIABLES

    export let label;
    let isOpen = false;
</script>

<style lang="stylus">
    //  -- IMPORTS

    @import '../../../constant.styl'

    // -- CLASSES

    .form-accordion
    {
        margin-top: 0.75rem;
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .label-container
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .accordion-arrow-icon
    {
        transition: 0.4s all ease;
    }

    .accordion-arrow-icon.is-open
    {
        transform: rotate( 90deg );
    }
</style>

<div class="form-accordion">
    <button
        class="label-container"
        on:click={ () => isOpen = !isOpen }
    >
        <div class="font-size-90 font-weight-700 color-gray-100">
            { label }
        </div>
        <div
            class="gray-right-caret-icon size-150 accordion-arrow-icon"
            class:is-open={ isOpen }
        />
    </button>
    {#if isOpen }
        <div>
            <slot />
        </div>
    {/if}
</div>
