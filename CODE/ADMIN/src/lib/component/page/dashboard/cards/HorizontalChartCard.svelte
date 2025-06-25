<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import DashboardTag from '../DashboardTag.svelte';
    import PeriodSelect from '../PeriodSelect.svelte';
    import Button from '$component/element/Button.svelte';

    // -- VARIABLES

    /** @type {{tag?: string, tagColor?: string, title?: string, total?: any, handleAction?: any, actionText?: string, children?: import('svelte').Snippet}} */
    let {
            tag = $bindable( 'New' ),
            tagColor = $bindable( 'green' ),
            title = 'admin-dashboard-line-chart-label',
            total = $bindable( Math.floor( Math.random() * 10_000 ) ),
            handleAction = () => { console.log( 'Action' ) },
            actionText = 'action-label',
            children
        } = $props();
    let type = $state('all');

    // -- FUNCTIONS

    function shortenTotal(
        number
        )
    {
        let shortnedNumber;

        if ( number > 1_000 )
        {
            let dividedNumber = number / 1_000;
            shortnedNumber = Number.isInteger( dividedNumber ) ? dividedNumber : dividedNumber.toFixed( 1 );
            shortnedNumber += 'K';
        }
        else
        {
            shortnedNumber = number;
        }

        return shortnedNumber;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../constant.styl';
    @import '../../../../../mixin.styl';

    // -- ELEMENTS

    article
    {
        width: 49%;
        aspect-ratio: 2 / 1;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        background-color: white;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        font-size: 1vw;
        font-weight: 500;
        color: grayColor;
        @media( max-width: 1200px )
        {
            width: 100%;
        }

        @media( max-width: 750px )
        {
            aspect-ratio: 1 / 1;
        }
    }

    span
    {
        font-size: 1.5vw;
        font-weight: 600;
        color: grayColor100
        @media( max-width: 1200px )
        {
            font-size: 3vw;
        }

        @media( max-width: 750px )
        {
            font-size: 5vw;
        }
    }

    // -- CLASSES

    .horizontal-card-head
    {
        min-height: 36px;
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .horizontal-card-head.right
    {
        justify-content: flex-end;
    }

    .horizontal-card-content
    {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: row;
    }

    .horizontal-card-left
    {
        width: 35%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .horizontal-card-right
    {
        width: 65%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .horizontal-card-text
    {
        display: flex;
        flex-direction: column;
        gap: 10px;

        font-size: 4vw;
        font-weight: 500;
        @media( max-width: 1200px )
        {
            font-size: 6vw;
        }

        @media( max-width: 750px )
        {
            font-size: 8vw;
        }
    }

    .horizontal-card-buttons
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>

<article class="horizontal-card">
    <div class="horizontal-card-content">
        <div class="horizontal-card-left">
            <div class="horizontal-card-head">
                <DashboardTag
                    text={ tag }
                    color={ tagColor }
                />
            </div>
            <div class="horizontal-card-text" title={ String( total ) }>
                <span>
                    { getLocalizedTextBySlug( title, $languageTagStore ) }
                </span>
                { shortenTotal( total ) }
            </div>
            <div class="horizontal-card-buttons">
                <Button invertColor={ true } on:click={ handleAction }>
                    { getLocalizedTextBySlug( actionText, $languageTagStore ) }
                </Button>
            </div>
        </div>
        <div class="horizontal-card-right">
            <div class="horizontal-card-head right">
                <PeriodSelect bind:value={ type }/>
            </div>
            {@render children?.()}
            <div></div>
        </div>
    </div>
</article>
