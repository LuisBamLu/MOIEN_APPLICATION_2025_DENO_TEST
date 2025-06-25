<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { maxBugdetShortTermStore, maxBugdetLongTermStore } from '$store/bookingStore';
    import { createEventDispatcher } from 'svelte';
    import ValuePicker from 'senselogic-flow/ValuePicker.svelte';

    // -- VARIABLES

    export let termType;
    let minimumValue = 0;
    let maximumValue = 4000;
    let defaultValues = [ 0, 400 ];
    let step = 50;
    let values = defaultValues;
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleBudgetChange(
        valueArray
        )
    {
        if ( termType === 'short-term' )
        {
            dispatch(
                'budgetSelected',
                {
                    minimumDailyBudget: valueArray[ 0 ],
                    maximumDailyBudget: valueArray[ 1 ]
                }
                );
        }
        else if ( termType === 'long-term' )
        {
            dispatch(
                'budgetSelected',
                {
                    minimumMonthlyBudget: valueArray[ 0 ],
                    maximumMonthlyBudget: valueArray[ 1 ]
                }
                );
        }
    }

    // -- STATEMENTS

    if ( termType === 'short-term' )
    {
        maximumValue = $maxBugdetShortTermStore;
        step = 50;
    }
    else if ( termType === 'long-term' )
    {
        maximumValue = $maxBugdetLongTermStore;
        step = 100;
    }
    else
    {
        maximumValue = $maxBugdetShortTermStore;
        step = 50;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .filter-budget-content
    {
        display: flex;
        flex-direction: column;
        gap: 1rem
    }
</style>

<div class="filter-budget">
    <div class="filter-budget-content">
        <div class="font-size-150 font-weight-600 color-gray-100 filter-budget-title">
            { getLocalizedTextBySlug( 'budget-title' ) }
        </div>
        <div class="font-size-90 font-weight-500 color-gray filter-budget-description">
            {#if termType === 'short-term' }
                { getLocalizedTextBySlug( 'budget-per-night-text' ) }
            {:else if termType === 'long-term'}
                { getLocalizedTextBySlug( 'budget-per-month-text' ) }
            {:else}
                { getLocalizedTextBySlug( 'budget-per-night-text' ) }
            {/if}
        </div>
    </div>
    <div class="filter-budget-container">
        <ValuePicker
            limitArray={ [ minimumValue, maximumValue ] }
            valueArray={ values }
            valuePrecision={ step }
            valueSuffix=" €"
            onChange={ handleBudgetChange }
        />
    </div>
</div>
