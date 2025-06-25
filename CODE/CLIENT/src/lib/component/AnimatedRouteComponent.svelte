<script>
    // -- IMPORTS

    import { linear } from 'svelte/easing';
    import { fade } from 'svelte/transition';
</script>

<style lang="stylus">
    // -- CLASSES

    .route-wrapper
    {
        overflow-x: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;

        min-height: 100%;
    }
</style>

<div
    class="route-wrapper"
    out:fade={ { duration: 350, easing: linear } }
    in:fade={ { delay: 350, duration: 350, easing: linear } }
>
    <slot/>
</div>
