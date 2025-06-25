<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import DashboardTag from '../DashboardTag.svelte';
    import PeriodSelect from '../PeriodSelect.svelte';
    import Button from '$component/element/Button.svelte';
    import { navigate } from 'svelte5-router';

    // -- VARIABLES

    /** @type {{tag?: string, tagColor?: string, title?: string, total?: number, handleAction?: any, actionText?: string}} */
    let {
        tag = 'EUR',
        tagColor = 'yellow',
        title = 'title-label',
        total = 2_648,
        handleAction = () => { navigate( '/admin/edit-view/payment' ) },
        actionText = 'action-label'
    } = $props();
    let type = $state('all');

    // -- FUNCTIONS

    function shortenTotal(
        number
        )
    {
        let units =
        [
            { value: 1_000_000_000_000, symbol: 'T' },
            { value: 1_000_000_000, symbol: 'B' },
            { value: 1_000_000, symbol: 'M' },
            { value: 1_000, symbol: 'K' }
        ];

        for ( let unit of units )
        {
            if ( number >= unit.value )
            {
                let dividedNumber = number / unit.value;

                let shortnedNumber =
                    Number.isInteger( dividedNumber )
                    ? dividedNumber
                    : dividedNumber.toFixed( 1 );

                return `${ shortnedNumber }${ unit.symbol }`;
            }
        }

        return number;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../constant.styl';
    @import '../../../../../mixin.styl';

    // -- ELEMENTS

    article
    {
        width: 24%;
        aspect-ratio: 1 / 1;
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
            width: 48%;
        }

        @media( max-width: 750px )
        {
            width: 100%;
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

    .data-card-head
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .data-card-text
    {
        width: 100%;

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

    .data-card-buttons
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>

<article class="data-card">
    <div class="data-card-head">
        <DashboardTag
            text={ tag }
            color={ tagColor }
        />
        <PeriodSelect bind:value={ type }/>
    </div>
    <div class="data-card-text" title={ String( total ) }>
        <span>
            { getLocalizedTextBySlug( title, $languageTagStore ) }
        </span>
        { `€${ shortenTotal( total ) }` }
    </div>
    <div class="data-card-buttons">
        <Button invertColor={ true } on:click={ handleAction }>
            { getLocalizedTextBySlug( actionText, $languageTagStore ) }
        </Button>
    </div>
</article>
