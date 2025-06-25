<script>
    // -- VARIABLES

    export let label;
    export let dataText;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .travelling-data-card
    {
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 1.5rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: center;

        background-color: whiteColor;
    }

    .heading-image
    {
        height: 3.5rem;
    }

    .travelling-data-card-text-group
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;

        text-align: center;
    }
</style>

<div class="travelling-data-card">
    <img
        src="/image/supporting-documents/heading.svg"
        alt="heading"
        class="heading-image"
    />
    <div class="travelling-data-card-text-group">
        <div class="font-size-75 font-weight-500 color-gray-300">
            { label }
        </div>
        <div class="font-size-90 font-weight-700 color-gray-100">
            { dataText }
        </div>
    </div>
</div>
