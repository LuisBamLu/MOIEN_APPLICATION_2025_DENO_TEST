<script>
    // -- IMPORTS

    import { fly } from 'svelte/transition';

    // -- VARIABLES

    /** @type {{delay?: number, isRunning?: boolean, closeToast: any, type?: string, hide: any, progress: any, theme?: string}} */
    let {
        delay = 1000,
        isRunning = true,
        closeToast,
        type = 'default',
        hide,
        progress,
        theme = 'dark'
    } = $props();

    let isHidden = hide || progress === 0;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS
</style>

<div class="progress-bar-wrapper" data-hidden={ isHidden }>
    <div class="progress-bar-background progress-bar-theme-{ theme } progress-bar-type-{ type }"></div>

    <div
        role="progressbar"
        aria-hidden={ isHidden }
        aria-label="notification timer"
></div>
</div>
