<script>
    import { preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { createEventDispatcher, onMount } from 'svelte';
    import Button from '../Button.svelte';
    import ModalActions from '../modal/ModalActions.svelte';
    import ModalButton from '../modal/ModalButton.svelte';
    import ModalContent from '../modal/ModalContent.svelte';
    import ModalHeader from '../modal/ModalHeader.svelte';
    import ModalRoot from '../modal/ModalRoot.svelte';
    import Select from '../Select.svelte';
    import { getRandomTuid, getLocalizedTextBySlug, getLocalizedText, getJsonObject, getJsonText, isArray, logError } from 'senselogic-gist';
    import Input from '../Input.svelte';
    import IconButton from '../IconButton.svelte';
    import { urlParamsStore } from '$store/urlParamsStore';
    import { fetchData, hostUrl, isObjectEmpty } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Switch from '../Switch.svelte';
    import Svelecte from 'svelecte';

    // -- CONSTANTS

    const dispatch = createEventDispatcher();
    const validOperatorArray =
        [
            { operatorName: 'eq', operatorLabel: 'is equal to' },
            { operatorName: 'neq', operatorLabel: 'is not equal to' },
            { operatorName: 'gt', operatorLabel: 'is greater than' },
            { operatorName: 'lt', operatorLabel: 'is less than' },
            { operatorName: 'gte', operatorLabel: 'is greater than or equal to' },
            { operatorName: 'lte', operatorLabel: 'is less than or equal to' },
            { operatorName: 'like', operatorLabel: 'contains' },
            { operatorName: 'ilike', operatorLabel: 'contains (case-insensitive)' },
            { operatorName: 'in', operatorLabel: 'is one of' },
            { operatorName: 'is', operatorLabel: 'is (null, not null, true, false)' }
        ];

    // -- VARIABLES

    /** @type {{filterableColumnByColumnNameMap: any}} */
    let { filterableColumnByColumnNameMap } = $props();
    let filterArray = $state([]);
    let isFilterModalOpen = $state(false);
    let filterCount = filterArray.length;
    let filterFormElement = $state();

    // -- FUNCTIONS

    function handleOpenEvent(
        )
    {
        isFilterModalOpen = true;
    }

    // ~~

    function handleCloseEvent(
        )
    {
        isFilterModalOpen = false;
    }

    // ~~

    function handleFilterEvent(
        )
    {
        updateURLWithFilter();
        window.location.reload();

        dispatch('filter');
        isFilterModalOpen = false;
    }

    // ~~

    function appendFilter(
        )
    {
        let newFilter = getEmptyFilter();

        filterArray =  [ ...filterArray, newFilter ];
    }

    // ~~

    function removeFilterById(
        filterId
        )
    {
        filterArray = filterArray.filter( filter => filter.id !== filterId );
    }

    // ~~

    function getEmptyFilter(
        )
    {
        return (
            {
                id: getRandomTuid(),
                column: '',
                operator: '',
                value: ''
            }
            );
    }

    // ~~

    function updateURLWithFilter(
        deleteFilterParam = true
        )
    {
        urlParamsStore.update(
            ( urlParams ) =>
            {
                if ( deleteFilterParam )
                {
                    urlParams.delete( 'filter' );
                }

                for ( let filter of filterArray )
                {
                    if ( filter.column
                        && filter.operator
                        && filter.value )
                    {
                        let filterValue = [ filter.column, filter.operator, filter.value ].join( ':' );

                        urlParams.append( 'filter', filterValue );
                    }
                }

                return urlParams;
            }
            );
    }

    // ~~

    function clearFilterItem(
        filterId
        )
    {
        filterArray = filterArray.map(
            filter => filter.id === filterId
                ? getEmptyFilter()
                : filter
            );
    }

    // ~~

    function getIsFilterEmpty(
        filter
        )
    {
        return (
            filter.column.trim() === ''
            || filter.operator.trim() === ''
            || ( filter.value === null || filter.value.trim() === '' )
            );
    }

    // ~~

    async function getSimplifiedProfileArray(
        )
    {
        try
        {
            let response = await fetchData(
                '/admin/api/get-simplified-profile-array',
                { method: 'GET', credentials: 'include' }
                );
        }
        catch ( error )
        {
            logError( error );
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            let urlFilterParam = $urlParamsStore.getAll( 'filter' );

            updateURLWithFilter( false );

            if ( typeof urlFilterParam === 'string' )
            {
                let [ column, operator, value ] = urlFilterParam.split( ':' );
                let newFilterItem =
                    {
                        id: getRandomTuid(),
                        column: column.trim(),
                        operator: operator.trim(),
                        value: value.trim()
                    };

                filterArray = [ newFilterItem ];
            }
            else if ( isArray( urlFilterParam ) )
            {
                let urlFilterArray = urlFilterParam;

                for ( let filter of urlFilterArray )
                {
                    let [ column, operator, value ] = filter.split( ':' );
                    let newFilterItem =
                        {
                            id: getRandomTuid(),
                            column: column.trim(),
                            operator: operator.trim(),
                            value: value.trim()
                        };

                    filterArray = [ ...filterArray, newFilterItem ];
                }
            }
            else
            {
                filterArray = [ getEmptyFilter() ];
            }
        }
        );
    let isApplyFilterButtonDisabled = $derived(filterArray.some(
        ( filter, filterIndex ) =>
            getIsFilterEmpty( filter )
        ));
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .search-bar-filter
    {
        width: auto;
        border-left: 1px solid rgba(0, 0, 0, 0.23);
        padding-left: 0.5vw;

        display: flex;
        align-items: center;
        float: right;

        background-color: white;

        cursor: pointer;
    }

    .search-bar-term-searched
    {
        margin-left: 0.5vw;

        display: flex;
        flex-direction: row;

        color: grayColor500;
    }

    // :global( .sv_dropdown.is-open )
    // {
    //     z-index: 9999 !important;
    //     position: fixed !important;
    // }

    // :global( .sv_dropdown )
    // {
    //     min-width: auto !important;
    // }

    .user-select
    {
        border: 1px solid red;
    }
</style>

<button
    class="search-bar-filter"
    onclick={handleOpenEvent}
>
    <div class="green-400-filter-icon size-100"></div>
    <div class="search-bar-term-searched">
        <div class="font-size-85 color-gray-900">
            { getLocalizedTextBySlug( 'filter-your-filters-label', $languageTagStore ) }
        </div>
    </div>
</button>

<ModalRoot isOpen={ isFilterModalOpen } onClose={ handleCloseEvent }>
    <ModalHeader title="Filter" onClose={ handleCloseEvent }/>

    <ModalContent>
        <form bind:this={ filterFormElement } onsubmit={preventDefault(handleFilterEvent)}>
            {#if isArray( filterArray ) && filterArray.length === 0 }
                <div class="padding-lateral-75">
                    <h5 class="font-size-90 line-height-125 color-gray-100">{ getLocalizedTextBySlug( 'no-filters-applied-to-this-view-text', $languageTagStore ) }</h5>
                    <p class="font-size-75 line-height-100 color-gray-300">{ getLocalizedTextBySlug( 'add-a-column-below-to-filter-the-view-text', $languageTagStore ) }</p>
                </div>
            {/if}
            {#each filterArray as { column, operator, value, id }, filterIndex ( id ) }
                {@const validColumn = filterableColumnByColumnNameMap[ column[ filterIndex ] ] }
                <div class="display-flex gap-50 align-items-center justify-content-space-between">
                    <Select name="column" bind:value={ column[ filterIndex ] } --input-root-width="30%" required>
                        {#each Object.entries( filterableColumnByColumnNameMap ) as [ validColumnName, { columnLabel } ], i }
                            <option value={ validColumnName }>{ columnLabel }</option>
                        {/each}
                    </Select>

                    <Select name="operator" bind:value={ operator[ filterIndex ] } --input-root-width="30%" required>
                        {#each validOperatorArray as validOperator, i }
                            <option value={ validOperator.operatorName }>{ validOperator.operatorLabel }</option>
                        {/each}
                    </Select>

                    {#if column.trim() === '' }
                        <Input
                            bind:value={ value[ filterIndex ] }
                            type="text"
                            name="value"
                            required
                            --input-root-width="30%"
                        />
                    {:else}
                        {#if validColumn !== undefined }
                            {#if validColumn.type === 'text' }
                                <Input
                                    bind:value={ value[ filterIndex ] }
                                    type="text"
                                    name="value"
                                    required
                                    --input-root-width="30%"
                                />
                            {:else if validColumn.type === 'select' }
                                <Select name="value" bind:value={ value[ filterIndex ] } --input-root-width="30%">
                                    {#each validColumn.optionArray as option }
                                        <option value={ option.value }>{ getLocalizedText( option.label, $languageTagStore ) }</option>
                                    {/each}
                                </Select>
                            {:else if validColumn.type === 'timestamp' }
                                <Input
                                    bind:value={ value[ filterIndex ] }
                                    type="date"
                                    name="value"
                                    required
                                    --input-root-width="30%"
                                />
                            {:else if validColumn.type === 'boolean' }
                                <Select name="value" bind:value={ value[ filterIndex ] } --input-root-width="30%">
                                    {#each [ { value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' } ] as option }
                                        <option value={ option.value }>{ getLocalizedText( option.label, $languageTagStore ) }</option>
                                    {/each}
                                </Select>
                            <!-- {:else if validColumn.type === 'profile' }
                                <Svelecte
                                    bind:value={ value }
                                    fetch={ hostUrl + '/admin/api/get-simplified-profile-array?searchTerm=[query]' }
                                    fetchProps={ { credentials: 'include', method: 'POST' } }
                                    placeholder=""
                                    minQuery={ 3 }
                                    class="user-select"
                                /> -->
                            {:else}
                                <Input
                                    bind:value={ value[ filterIndex ] }
                                    type="text"
                                    name="value"
                                    required
                                    --input-root-width="30%"
                                />
                            {/if}
                        {/if}
                    {/if}

                    <IconButton on:click={ () => removeFilterById( id ) }>
                        <span class="gray-close-icon size-90"></span>
                    </IconButton>
                </div>
            {/each}
        </form>
    </ModalContent>

    <ModalActions>
        <ModalButton on:click={ appendFilter }>
            {#snippet icon()}

                    <span style="flex-shrink: 0;" class="white-plus-icon size-100"></span>

                    {/snippet}
            Add filter
        </ModalButton>
        <ModalButton type="submit" disabled={ isApplyFilterButtonDisabled } on:click={ () => filterFormElement.requestSubmit() }>Apply filter</ModalButton>
    </ModalActions>
</ModalRoot>
