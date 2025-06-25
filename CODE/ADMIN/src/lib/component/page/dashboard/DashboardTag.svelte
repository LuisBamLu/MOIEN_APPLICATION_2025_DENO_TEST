<script>
    // -- VARIABLES

    /** @type {{text?: string, color?: string, time?: boolean, line?: boolean}} */
    let {
        text = '',
        color = '',
        time = false,
        line = false
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .tag
    {
        border-radius: 1rem;
        padding: 0.5vw 1vw;

        display: flex;
        flex-direction: row;
        gap: 0.5vw;
        justify-content: center;
        align-items: center;

        background-color: grayColor800;

        font-size: 1vw;
        font-weight: 600;
        &.red
        {
            background-color: redColor800;

            color: redColor100;
        }
        &.blue
        {
            background-color: blueColor900;

            color: blueColor300;
        }
        &.green
        {
            background-color: greenColor800;

            color: greenColor100;
        }
        &.yellow
        {
            background-color: yellowColor800;

            color: yellowColor100;
        }
    }

    .tag.line
    {
        @media( max-width: 1200px )
        {
            padding: 0.5rem 1rem;

            font-size: 1rem;
        }
    }
</style>

<div
    class="tag"
    class:red={ color === 'red' }
    class:blue={ color === 'blue' }
    class:green={ color === 'green' }
    class:yellow={ color === 'yellow' }
    class:line={ !line }
>
    {#if time }
        <div class="clock-icon size-100"></div>
        { text }
    {:else}
        { text }
    {/if}
</div>
