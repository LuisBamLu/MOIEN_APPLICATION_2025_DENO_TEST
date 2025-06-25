<script>
    // -- IMPORTS

    import { getSign } from 'senselogic-gist';
    import { formatPercentage } from '$lib/base';

    // -- VARIABLES

    /** @type {{text?: string, value?: any, icon?: string, variation?: any, subtext?: any}} */
    let {
        text = '',
        value = null,
        icon = 'gray-100-mailchimp',
        variation = null,
        subtext = null
    } = $props();

    let variationInPercentage = formatPercentage( variation );
    let variationSign = getSign( variation );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .monitor-performance-section-content-card
    {
        margin-top: 1rem;
        margin-left: 1rem;
        margin-right: 2rem;

        display: flex;
        flex: 1 1 0;
        flex-direction: column;
        justify-content: flex-start;
    }

    .monitor-performance-section-content-card-content
    {
        margin: 0;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .monitor-performance-section-content-card-content-value
    {
        margin-top: 0.25rem;
        margin-left: 2rem;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .pill-container
    {
        margin-top: 0.25rem;
    }

    .pill
    {
        border-radius: 1.875rem;
        padding: 0.25rem 0.5rem;

        display: inline-flex;
        gap: 0.25rem;
        align-items: center;

        background-color: #f6f6f4;

        color: grayColor100;
    }

    .pill.is-down
    {
        background-color: rgba( 242, 95, 37, 0.1 );

        color: #a73205;
    }

    .pill.is-up
    {
        background-color: rgba( 0,193,78, 0.1 );

        color: #008547;
    }

    .is-up-icon,
    .is-down-icon
    {
        fill: currentColor;
    }

    .is-up-icon
    {
        transform: rotate( 0.5turn );
    }

    .monitor-performance-section-content-card-content-header
    {
        margin-top: -1rem;
        margin-left: -1rem;

        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .margin-header
    {
        margin-top: 1rem;
        margin-left: 1rem;
    }
</style>

<div class="monitor-performance-section-content-card">
    <div class="monitor-performance-section-content-card-content">
        <div class="monitor-performance-section-content-card-content-header">
            <span class="{ icon }-icon size-150 margin-header"></span>
            <p class="font-size-100 margin-header">{ text }</p>
        </div>
        <span class="monitor-performance-section-content-card-content-value">
            <p class="font-size-150 margin-left-100">{ value }</p>
            {#if variation !== null }
                <div class="pill-container">
                    <span
                        class="pill"
                        class:is-down={ variationSign === -1 }
                        class:is-up={ variationSign === 1 }
                    >
                        <span class="size-100">
                            {#if variationSign === 0 }
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M14 9C14 9.26522 14 9.5 14 9.5C14 9.5 14 9.5 14 10H2C2 10 2 10 2 9.5C2 9.26743 2 9.26522 2 9C2 8.73478 2 8.71846 2 8.5C2 8 2 8 2 8H14C14 8 14 8.28201 14 8.5C14 9 14 8.73478 14 9Z"/>
                                </svg>
                            {:else}
                                <svg xmlns="http://www.w3.org/2000/svg" class:is-down-icon={ variationSign === -1 } class:is-up-icon={ variationSign === 1 } viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                                    <path d="M8.8 10.422 9 2H7l.2 8.422L3.174 6.76 1.827 8.24 8 13.85l6.173-5.611-1.346-1.48L8.8 10.422Z"/>
                                </svg>
                            {/if}
                        </span>

                        <p class="font-size-75 font-weight-700">{ variationInPercentage }</p>
                    </span>
                </div>
            {/if}
            {#if subtext !== null }
                <p class="font-size-75 margin-left-100">{ subtext }</p>
            {/if}
        </span>
    </div>
</div>
