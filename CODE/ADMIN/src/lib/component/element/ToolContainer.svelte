<script>
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { listModeStore } from '$store/listModeStore';
    import IconButton from './IconButton.svelte';
    import Input from './Input.svelte';

    // -- VARIABLES

    /** @type {{onClick?: any, href?: any, label?: string, value: any}} */
    let {
        onClick = null,
        href = null,
        label = 'search-by-title',
        value = $bindable()
    } = $props();
    let isLoading = true;

    // -- FUNCTIONS

    function toggleListMode(
        )
    {
        if ( $listModeStore === 'grid' )
        {
            $listModeStore = 'rows';
        }
        else
        {
            $listModeStore = 'grid';
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .tool-container
    {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
</style>

<form class="tool-container" onsubmit={bubble('submit')}>
    <Input
        name="searchTerm"
        type="search"
        label={ getLocalizedTextBySlug( label, $languageTagStore ) }
        bind:value
        fullWidth
    >
        {#snippet endAdornment()}
            <IconButton type="submit">
                    <div class="gray-search-icon size-150"></div>
            </IconButton>
        {/snippet}
    </Input>

    {#if href }
        <IconButton handleClick={ toggleListMode }>
            <div class="blue-{ $listModeStore }-icon size-200"></div>
        </IconButton>

        <IconButton>
            <a href={ href }>
                <div class="blue-add-icon size-200"></div>
            </a>
        </IconButton>
    {/if}

    {#if onClick }
        <IconButton handleClick={ onClick }>
            <div class="blue-add-icon size-200"></div>
        </IconButton>
    {/if}
</form>
