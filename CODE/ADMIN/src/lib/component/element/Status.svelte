<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{name?: string, color?: string}} */
    let { name = 'Inactive', color = 'red' } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // CLASSES

    .status
    {
        width: fit-content;
        border-radius: 1.25rem;
        padding: 0.25rem 1rem 0.3125rem 1rem;

        display: flex;
        gap: 0.25rem;
        justify-content: center;
        align-items: center;

        font-size: var( --font-size, 0.9rem );

        +media( smaller-48em )
        {
            margin-left: auto;
        }
    }

    .status::first-letter
    {
        text-transform: uppercase;
    }

    .red
    {
        border: 1px solid redColor700;

        background: redColor900;

        color: redColor700;
    }

    .green
    {
        border: 1px solid greenColor800;

        background: greenColor800;

        color: greenColor100;
    }

    .orange
    {
        border: 1px solid #F4BD50;

        background: #FFF6E5;

        color: #F4BD50;
    }

    .gray
    {
        border: 1px solid grayColor600;

        background: grayColor950;

        color: grayColor500;
    }
</style>

<span class="status font-weight-500 { color }">
    { getLocalizedText( name, $languageTagStore ) }
</span>
