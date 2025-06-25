<script>
    // -- VARIABLES

    export let isOpen = false;
    export let openHostRating = () => {};
    export let openGuestRating = () => {};

    let choices =
        [
            {
                userType: 'guest',
                text: 'Rate as a guest'
            },
            {
                userType: 'host',
                text: 'Rate as a host'
            }
        ];
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .rating-choice-container
    {
        position: absolute;
        top: 81%;
        left: 50%;
        transform: translate( -45% )

        width: max-content;
        border-radius: 0.75rem;
        padding: 0.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .rating-choice-button
    {
        display: flex;
        justify-content: center;
        align-items: center;

        color: greenColor300;
    }

    .separator
    {
        height: 1px;
        width: 100%;

        background-color: grayColor700;
    }

    .rating-choice-button:last-child + .separator
    {
        display: none;
    }

    .rating-choice-button:hover
    {
        color: blueColor300;
    }
</style>

{#if isOpen }
    <div class="rating-choice-container">
        <button class="rating-choice-button" on:click={ openHostRating }>
            { choices[ 0 ].text }
        </button>
        <div class="separator"></div>
        <button class="rating-choice-button" on:click={ openGuestRating }>
            { choices[ 1 ].text }
        </button>
    </div>
{/if}
