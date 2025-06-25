<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from "senselogic-gist";
    import { languageTagStore } from "$store/languageTagStore";
    import Tag from "$component/element/Tag.svelte";

    // -- VARIABLES

    export let selectedTerm = null;
</script>

<style lang="stylus">
    // -- CLASSES

    .house-management-term-selection
    {
        margin-top: 1rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }
</style>

<div class="house-management-term-selection">
    <Tag
        name={ 'long-term' }
        label={ getLocalizedTextBySlug( '', $languageTagStore ) }
        isSelected={ selectedTerm == 'long' }
    />
    <Tag
        name={ 'short-term' }
        label={ getLocalizedTextBySlug( '', $languageTagStore ) }
        isSelected={ selectedTerm == 'short' }
    />
</div>
