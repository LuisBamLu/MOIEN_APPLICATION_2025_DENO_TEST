<script>
    // -- VARIABLES

    export let text;
    export let type;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .alert
    {
        border: 1px solid lightGrayBorderColor;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        gap: 1rem;
        align-items: center;

        background-color: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: grayColor;
    }

    .icon
    {
        min-width: 1.5rem;
    }

    .warning
    {
        border-color: yellowColor800;

        background-color: yellowColor950;

        color: yellowColor100;
    }

    .error
    {
        border-color: redColor800;

        background-color: redColor950;

        color: redColor100;
    }

    .success
    {
        border-color: greenColor800;

        background-color: greenColor950;

        color: greenColor100;
    }

    .informative
    {
        border-color: blueColor900;

        background-color: blueColor950;

        color: blueColor100;
    }
</style>

<div class="alert {type}">
    {#if type }
        <div class="{ type }-icon size-150 icon" />
    {/if}
    <div class="font-size-90 font-weight-600">
        { text }
    </div>
</div>
