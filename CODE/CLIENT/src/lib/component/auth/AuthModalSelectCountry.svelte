<script>
    // -- IMPORTS

    import { clickOutside } from '$lib/base';
    import { getStorageImagePath } from '$lib/storage';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { countryArrayStore } from '$store/countryArrayStore';

    // -- VARIABLES

    export let selected = null;
    export let phonePrefix = null;
    let placeholder = getLocalizedTextBySlug( 'location-search-placeholder', $languageTagStore );
    let placeholderNoResults = getLocalizedTextBySlug( 'location-search-no-results-label', $languageTagStore );
    let label = 'name';
    let filteredOptions;
    let searchTerm = getLocalizedText( ( selected && selected[ label ] ) ? selected[ label ] : '' );
    let isDropdownOpen = false;

    // -- FUNCTIONS

    function selectOption(
        option
        )
    {
        selected = option;
        phonePrefix = option.phonePrefix;
        isDropdownOpen = false;
    }

    // -- STATEMENTS

    $: filteredOptions =
        $countryArrayStore
            .filter(
                option =>
                {
                    return option &&
                        option[ label ] &&
                        option[ label ].toLowerCase().includes( searchTerm.toLowerCase() )
                }
                );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .auth-modal-select-country
    {
        position: relative;

        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .auth-modal-select-country-toggler
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .auth-modal-select-country-toggler-container
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .auth-modal-select-country-input
    {
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background-color: grayColor900;
    }

    .auth-modal-select-country-input-inner
    {
        width: 100%;

        background-color: transparent;
    }

    .auth-modal-select-country-input-inner::placeholder
    {
        color: blackColor;
    }

    .auth-modal-select-country-input-inner:focus-visible
    {
        outline: unset;
    }

    .auth-modal-select-country-dropdown
    {
        position: relative;

        width: 100%;

        background-color: grayColor950;
    }

    .auth-modal-select-country-dropdown-container
    {
        position: absolute;
        top: 3rem;

        overflow-y: auto;
        margin: 0;
        margin-bottom: 0.5rem;
        max-height: 10rem;
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0;
        padding-bottom: 0.5rem;

        background-color: grayColor950;
    }

    .auth-modal-select-country-dropdown-item
    {
        border-radius: 0.75rem;
        padding: 0.5rem 1rem;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;

        cursor: pointer;
        transition: background-color 400ms ease-in-out;
        &:hover
        {
            +media( desktop )
            {
                background-color: grayBackgroundColor;

                transition: background-color 400ms ease-in-out;
            }
        }
    }
</style>

<div class="auth-modal-select-country" use:clickOutside on:clickOutside={ () => isDropdownOpen = false }>
    {#if !isDropdownOpen }
        <button class="auth-modal-select-country-toggler" on:click|preventDefault={ () => isDropdownOpen = true }>
            <div class="auth-modal-select-country-toggler-container">
                <div class="font-size-75 font-weight-500 color-gray">
                    { getLocalizedTextBySlug( 'filter-country-region-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-700 color-black">
                    {#if selected }
                        { getLocalizedText( selected.name, $languageTagStore ) }
                        ( { selected.phonePrefix } )
                    {/if}
                </div>
                {#if selected }
                    <input
                        name="phone-prefix"
                        value={ selected.phonePrefix }
                        hidden
                    />
                {/if}
            </div>
            <div class="gray-right-caret-icon size-150 auth-modal-select-country-toggler-chevron">
            </div>
        </button>
    {:else}
        <div class="auth-modal-select-country-dropdown">
            <div class="auth-modal-select-country-input">
                <input
                    class="font-size-90 font-weight-700 color-black auth-modal-select-country-input-inner"
                    type="text"
                    bind:value={ searchTerm }
                    placeholder={ placeholder }
                />
            </div>
            <div class="auth-modal-select-country-dropdown-container">
                {#if filteredOptions.length === 0 }
                    <div class="font-size-75 font-weight-700 color-black auth-modal-select-country-dropdown-item">
                        { placeholderNoResults }
                    </div>
                {:else}
                    {#each filteredOptions as option }
                        <button class="auth-modal-select-country-dropdown-item" on:click|preventDefault={ () => selectOption( option ) }>
                            <div class="green-place-icon size-150 auth-modal-select-country-dropdown-item-icon"
                                style=
                                {
                                    option.iconImagePath
                                    ? `background: url( '${ getStorageImagePath( option.iconImagePath, 640 ) }') no-repeat center center / contain`
                                    : ''
                                }
                            >
                            </div>
                            <div class="font-size-75 font-weight-700 color-black auth-modal-select-country-dropdown-item-label">
                                { getLocalizedText( option[ label ], $languageTagStore ) }
                                ( { option.phonePrefix } )
                            </div>
                        </button>
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</div>
