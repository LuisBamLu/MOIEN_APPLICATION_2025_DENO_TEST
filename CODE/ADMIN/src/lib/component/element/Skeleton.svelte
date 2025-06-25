<script>
    // -- VARIABLES

    /** @type {{width?: string, height?: string, variant?: string, unit?: string, children?: import('svelte').Snippet}} */
    let {
        width = '100',
        height = '100',
        variant = 'rectangular',
        unit = '%',
        children
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .skeleton
    {
        height: 1.2em;
        border-radius: 50%;

        display: block;

        background-color: grayColor700;
        -webkit-animation: shimmer 2s ease-in-out 0.5s infinite;
        animation: shimmer 2s ease-in-out 0.5s infinite;
    }

    .rectangular
    {
        border-radius: 0;
    }

    .circular
    {
        border-radius: 50%;

        flex-shrink: 0;
    }

    .rounded
    {
        border-radius: 4px;
    }

    @keyframes shimmer
    {
        0%, 100%
        {
            opacity: 1;
        }

        50%
        {
            opacity: 0.4;
        }
    }
</style>

<div
    class="skeleton { variant }"
    style="width: { width }{ unit };height: { height }{ unit }"
>
    {@render children?.()}
</div>
