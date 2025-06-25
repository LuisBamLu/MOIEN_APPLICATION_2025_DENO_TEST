<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from "senselogic-gist";
    import { languageTagStore } from "$store/languageTagStore";
    import Column from "$component/element/charts/Column.svelte";
    import Line from "$component/element/charts/Line.svelte";
    import Area from "$component/element/charts/Area.svelte";

    // -- VARIABLES

    export let selectedTerm = null;
    export let propertyData = null;

    // -- FUNCTIONS

    function handlePropertyDataBySelectedTerm(
        term
        )
    {
        if (term === 'long')
        {
            return propertyData.longTerm;
        }
        else if ( term === 'short' )
        {
            return propertyData.shortTerm;
        }

        return null;
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .house-management-statistics
    {
        padding 2rem

        background whiteColor
        border-radius 0.125rem
        box-shadow 0 2px 8px rgba(0,0,0,0.05)

        h2
        {
            margin-bottom 1.5rem

            font-size 1.5rem
            font-weight 600
            color grayColor100
        }
    }

    .house-management-statistics-charts
    {
        display flex
        gap 2rem
        justify-content space-between
        align-items flex-start
    }
</style>

<div class="house-management-statistics">
    {#if selectedTerm == 'long' }
        <h2>
            { getLocalizedTextBySlug( '', $languageTagStore ) }
        </h2>
        <div class="house-management-statistics-charts">
            <Column title='Columns'/>
            <Line title='Lines'/>
            <Area title='Area'/>
        </div>
    {:else if selectedTerm == 'short' }
        <h2>
            { getLocalizedTextBySlug( '', $languageTagStore ) }
        </h2>
        <div class="house-management-statistics-charts">
            <Column title='Columns'/>
            <Line title='Lines'/>
            <Area title='Area'/>
        </div>
    {/if}
</div>
