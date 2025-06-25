<script>
    // -- VARIABLES

    /** @type {{icon: any, size?: number}} */
    let { icon, size = 150 } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';
</style>

<div class="{ icon }-icon size-{ size }"></div>
