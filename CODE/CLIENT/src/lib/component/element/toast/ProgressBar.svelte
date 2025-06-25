<script>
    // -- VARIABLES

    export let delay = 1000;
    export let isRunning = true;
    export let closeToast;
    export let type = 'default';
    export let hide;
    export let progress;
    export let theme = 'dark';

    let isHidden = hide || progress === 0;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS
</style>

<div class="progress-bar-wrapper" data-hidden={ isHidden }>
    <div class="progress-bar-background progress-bar-theme-{ theme } progress-bar-type-{ type }"/>

    <div
        role="progressbar"
        aria-hidden={ isHidden }
        aria-label="notification timer"
    />
</div>
