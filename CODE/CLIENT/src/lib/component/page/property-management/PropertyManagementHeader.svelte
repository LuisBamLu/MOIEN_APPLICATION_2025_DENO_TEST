<script>
    // -- IMPORTS

    import { link } from "svelte-routing";

    // -- VARIABLES

    export let label
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl';

    // -- CLASSES

    .secondary-header
    {
        z-index: 401;
        position: sticky;
        top: 0rem;
        left: 0;

        width: var( --viewport-width );
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem 1.5rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: pageBackgroundColor;

        +media( desktop )
        {
            top: 0rem;
        }
    }

    .secondary-header-button
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>

<div class="secondary-header">
    <a class="secondary-header-button" href="/dashboard/ads" use:link>
        <div class="gray-left-arrow-icon size-150"  />
        <div class="font-size-90 font-weight-700 color-gray-100">
            { label }
        </div>
    </a>
</div>
