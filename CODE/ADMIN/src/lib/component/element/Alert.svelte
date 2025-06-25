<script>
    // -- VARIABLES

    /** @type {{text: any, type: any}} */
    let { text, type } = $props();
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

        color: grayColor;
    }

    .icon
    {
        min-width: 1.5rem;
    }

    .warning
    {
        border-color: yellowColor800;

        background-color: yellowColor900;

        color: yellowColor100;
    }

    .error
    {
        border-color: redColor800;

        background-color: redColor900;

        color: redColor100;
    }

    .success
    {
        border-color: greenColor900;

        background-color: greenColor900;

        color: greenColor100;
    }

    .informative
    {
        border-color: blueColor900;

        background-color: blueColor950;

        color: blueColor300;
    }
</style>

<div class="alert { type }" role="alert">
    {#if type }
        <div class="{ type }-icon size-150 icon"></div>
    {/if}
    <div class="font-size-90 font-weight-600">
        { text }
    </div>
</div>
