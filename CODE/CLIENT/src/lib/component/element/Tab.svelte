<script>
    // -- VARIABLES

    export let label = '';
    export let isActive = false;
    export let elementReference = null;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .tab
    {
        border: 1px solid transparent;
        border-color: var( --tab-border-color, transparent );
        border-radius: 1.5rem;
        padding: 0.75rem 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background: var( --tab-background-color, grayColor950 );

        white-space: nowrap;
        color: var( --tab-color, grayColor600 );

        cursor: pointer;
        transition: all 400ms ease-in-out;
        &:hover
        {
            border-color: var( --tab-hover-border-color, grayColor600 );

            background-color: var( --tab-hover-background-color, whiteColor );
            .tab-label
            {
                color: var( --tab-hover-color, grayColor600 );
            }
        }
    }

    .tab.is-active,
    .tab.is-active:hover
    {
        border-color: transparent;

        background-color: var( --active-tab-background-color, greenColor800 );
        .tab-label
        {
            color: var( --active-tab-color, greenColor100 );
        }
    }
</style>

<button
    class="tab"
    class:is-active={ isActive }
    bind:this={ elementReference }
    on:click
>
    <div class="font-size-75 font-weight-600 color-gray-600 tab-label">
        { label }
    </div>
</button>
