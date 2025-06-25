<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-header
    {
        height: 5rem;
        width: 100vw;
        border-bottom: 1px solid grayColor800;
        border-right: 1px solid grayColor800;
        padding: 2rem 2rem 1rem;

        background: grayColor900;

        +media( tablet )
        {
            width: auto;
        }
    }

    .conversation-header-title
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .conversation-header-title h1
    {
        line-height: 2rem;
    }
</style>

<div class="conversation-header" id="conversation-header">
    <div class="conversation-header-title">
        <h1 class="font-size-150 color-gray-100 font-weight-600">
            { getLocalizedTextBySlug( 'conversation-list-title', $languageTagStore ) }
        </h1>
        <div class="green-note-pencil-icon size-150"/>
    </div>
</div>
