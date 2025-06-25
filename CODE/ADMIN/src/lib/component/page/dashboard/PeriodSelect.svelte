<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{value: any}} */
    let { value = $bindable() } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    select
    {
        outline: none;
        border: 1px solid grayColor800;
        border-radius: 0.5rem;
        padding: 0.5rem;

        background-color: white;

        font-size: 1vw;
        font-weight: 700;
        color: grayColor500;
        &:hover
        {
            border: 1px solid blueColor500;

            color: blueColor500;
        }
        &:focus
        {
            border: 1px solid blueColor500;

            color: blueColor500;
        }

        @media( max-width: 1200px )
        {
            padding: 0.5rem;

            font-size: 1rem;
        }
    }
</style>

<select name="period" bind:value>
    <option value="day">
        { getLocalizedTextBySlug( 'day-label', $languageTagStore ) }
    </option>
    <option value="week">
        { getLocalizedTextBySlug( 'week-label', $languageTagStore ) }
    </option>
    <option value="month">
        { getLocalizedTextBySlug( 'month-label', $languageTagStore ) }
    </option>
    <option value="all" selected>
        { getLocalizedTextBySlug( 'conversation-filter-all-label', $languageTagStore ) }
    </option>
</select>
