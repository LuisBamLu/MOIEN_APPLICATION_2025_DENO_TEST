<script>
    // -- CONSTANTS

    /** @type {{checked?: boolean, label: any, name: any}} */
    let { checked = $bindable(false), label, name } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .checkbox-container
    {
        width: fit-content;
        padding: 0.75rem 0;

        display: flex;
        gap: 0.75rem;
        align-items: center;

        cursor: pointer;
    }

    .checkbox-box
    {
        height: 1.5rem;
        width: 1.5rem;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.25rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: whiteColor;

        transition: all 400ms ease-in;
    }

    .checked
    {
        border-color: greenColor900;

        background-color: greenColor900;
    }

    .icon
    {
        opacity: 0;

        transition: all 400ms ease-in;
    }

    .icon-checked
    {
        opacity: 1;
    }
</style>

<label class="checkbox-container">
    <input hidden type="checkbox" bind:checked={ checked } name={ name } />
    <div class="checkbox-box { checked ? 'checked' :  '' }">
        <div class="green-check-icon size-150 icon { checked ? 'icon-checked' : '' }"></div>
    </div>
    <div class="font-size-90 font-weight-500 color-gray-300">
        { label }
    </div>
</label>
