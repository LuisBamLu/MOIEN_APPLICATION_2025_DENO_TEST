<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    /** @type {{statistic: any, legend: any, color: any}} */
    let { statistic, legend, color } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- STYLES

    .notification-data-card
    {
        width: 100%;
        min-width: 15em;
        border-radius: 0.5rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .notification-data-card.red
    {
        border: 1px solid redColor600;

        background-color: redColor900;

        color: redColor100;
    }

    .notification-data-card.green
    {
        border: 1px solid greenColor600;

        background-color: greenColor900;

        color: greenColor100;
    }

    .notification-data-card.blue
    {
        border: 1px solid blueColor600;

        background-color: blueColor950;

        color: blueColor300;
    }

    .notification-data-value
    {
        padding-bottom: 1rem;

        font-size: 1.5rem;
        font-weight: bold;
    }

    .notification-data-legend
    {
        font-size: 0.8rem;
        font-weight: bold;
    }
</style>

<div
    class="notification-data-card"
    class:red={ color === 'red'}
    class:green={ color === 'green'}
    class:blue={ color === 'blue'}
>
    <div class="notification-data-value">
        { statistic || 'N/A' }
    </div>
    <div class="notification-data-legend">
        { getLocalizedTextBySlug( legend, $languageTagStore ) }
    </div>
</div>
