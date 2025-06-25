<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import CounterInput from '../../element/CounterInput.svelte';
    import { createEventDispatcher } from 'svelte';

    // -- VARIABLES

    export let bedTypeArray;
    export let spaceTypeMap;
    export let roomArrayByTypeIdMap; // a room is a bedCountByTypeIdMap.
    export let bedCount;
    let dispatch = createEventDispatcher();
    let isShowingAll = false;
    $: filteredBedTypeArray = bedTypeArray.slice( 0, ( isShowingAll ? bedTypeArray.length - 1 : 6 ) );

    // -- FUNCTIONS

    function handleCountChange(
        event
        )
    {
        let temp = bedCount;
        let roomTypeArray = [ 'bedroom-array', 'living-room-array', 'office-array', 'other-room-array']
        let bedTypeIdArray =
            [
                'single-bed',
                'double-bed',
                'queen-bed',
                'king-bed',
                'bunk-bed',
                'sofa-bed',
                'futon',
                'air-mattress',
                'crib',
                'toddler-bed',
                'hammock',
                'water-bed',
                'floor-mattress'
            ];

        bedCount = -1;

        for ( let roomType of roomTypeArray )
        {
            if ( roomArrayByTypeIdMap[ roomType ] !== undefined )
            {
                for ( let room of roomArrayByTypeIdMap[ roomType ] )
                {
                    for ( let bedType of bedTypeIdArray )
                    {
                        bedCount += room[ bedType ];
                    }
                }
            }
        }

        if ( bedCount < 0 )
        {
            bedCount = temp;
        }
        else
        {
            bedCount += 1;
        }

        dispatch( 'changeBedCount', bedCount );
    }
</script>

<div class="ad-page-section">
    <div class="bed-section-header-container">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'ad-types-of-bed-label', $languageTagStore ) }
        </div>
        <div class="font-size-75 font-weight-500 color-black">
            { getLocalizedTextBySlug( 'ad-types-of-beds-helper', $languageTagStore ) }
        </div>
        <div class="bed-list">
            {#if roomArrayByTypeIdMap[ 'bedroom-array' ] !== undefined }
                {#each roomArrayByTypeIdMap[ 'bedroom-array' ] as  bedroom, bedroomIndex }
                    <Accordion label="{ getLocalizedText( spaceTypeMap[ 'bedroom' ].name, $languageTagStore ) } { bedroomIndex +  1 }">
                        <div class="bed-list">
                            {#each filteredBedTypeArray as bedType }
                                <div class="ad-page-section-list-option alternate">
                                    <div class="font-size-90 font-weight-500 color-gray-100">
                                        { getLocalizedText( bedType.name, $languageTagStore ) }
                                    </div>
                                    <CounterInput
                                        name={ bedType.id }
                                        maxCount={ 10 }
                                        bind:count={ bedroom[ bedType.id ] }
                                        on:change={ event => handleCountChange( event ) }
                                    />
                                </div>
                            {/each}
                            <button
                                class="font-size-90 font-weight-500 color-gray-100 margin-top-75"
                                type="button"
                                on:click={ () => isShowingAll = !isShowingAll }
                            >
                                {#if isShowingAll }
                                    { getLocalizedTextBySlug( 'ad-show-less-label', $languageTagStore ) }
                                {:else}
                                    { getLocalizedTextBySlug( 'ad-show-all-label', $languageTagStore ) }
                                {/if}
                            </button>
                        </div>
                    </Accordion>
                {/each}
            {/if}
            {#if roomArrayByTypeIdMap[ 'living-room-array' ] !== undefined }
                {#each roomArrayByTypeIdMap[ 'living-room-array' ] as livingRoom, livingRoomIndex }
                    <Accordion label="{ getLocalizedText( spaceTypeMap[ 'living-room' ].name, $languageTagStore ) } { livingRoomIndex +  1 }">
                        <div class="bed-list">
                            {#each filteredBedTypeArray as bedType }
                                <div class="ad-page-section-list-option alternate">
                                    <div class="font-size-90 font-weight-500 color-gray-100">
                                        { getLocalizedText( bedType.name, $languageTagStore ) }
                                    </div>
                                    <CounterInput
                                        name={ bedType.id }
                                        maxCount={ 10 }
                                        bind:count={ livingRoom[ bedType.id ] }
                                        on:change={ event => handleCountChange( event ) }
                                    />
                                </div>
                            {/each}
                            <button
                                class="font-size-90 font-weight-500 color-gray-100 margin-top-75"
                                type="button"
                                on:click={ () => isShowingAll = !isShowingAll }
                            >
                                {#if isShowingAll }
                                    { getLocalizedTextBySlug( 'ad-show-less-label', $languageTagStore ) }
                                {:else}
                                    { getLocalizedTextBySlug( 'ad-show-all-label', $languageTagStore ) }
                                {/if}
                            </button>
                        </div>
                    </Accordion>
                {/each}
            {/if}
            {#if roomArrayByTypeIdMap[ 'office-array' ] !== undefined }
                {#each roomArrayByTypeIdMap[ 'office-array' ] as office, officeIndex }
                    <Accordion label="{ getLocalizedText( spaceTypeMap[ 'office' ].name, $languageTagStore ) } { officeIndex +  1 }">
                        <div class="bed-list">
                            {#each filteredBedTypeArray as bedType }
                                <div class="ad-page-section-list-option alternate">
                                    <div class="font-size-90 font-weight-500 color-gray-100">
                                        { getLocalizedText( bedType.name, $languageTagStore ) }
                                    </div>
                                    <CounterInput
                                        name={ bedType.id }
                                        maxCount={ 10 }
                                        bind:count={ office[ bedType.id ] }
                                        on:change={ event => handleCountChange( event ) }
                                    />
                                </div>
                            {/each}
                            <button
                                class="font-size-90 font-weight-500 color-gray-100 margin-top-75"
                                type="button"
                                on:click={ () => isShowingAll = !isShowingAll }
                            >
                                {#if isShowingAll }
                                    { getLocalizedTextBySlug( 'ad-show-less-label', $languageTagStore ) }
                                {:else}
                                    { getLocalizedTextBySlug( 'ad-show-all-label', $languageTagStore ) }
                                {/if}
                            </button>
                        </div>
                    </Accordion>
                {/each}
            {/if}
            {#if roomArrayByTypeIdMap[ 'other-room-array' ] !== undefined }
                {#each roomArrayByTypeIdMap[ 'other-room-array' ]  as otherRoom, otherRoomIndex }
                    <Accordion label="{ getLocalizedText( spaceTypeMap[ 'other-room' ].name, $languageTagStore ) } { otherRoomIndex +  1 }">
                        <div class="bed-list">
                            {#each filteredBedTypeArray as bedType }
                                <div class="ad-page-section-list-option alternate">
                                    <div class="font-size-90 font-weight-500 color-gray-100">
                                        { getLocalizedText( bedType.name, $languageTagStore ) }
                                    </div>
                                    <CounterInput
                                        name={ bedType.id }
                                        maxCount={ 10 }
                                        bind:count={ otherRoom[ bedType.id ] }
                                        on:change={ event => handleCountChange( event ) }
                                    />
                                </div>
                            {/each}
                            <button
                                class="font-size-90 font-weight-500 color-gray-100 margin-top-75"
                                type="button"
                                on:click={ () => isShowingAll = !isShowingAll }
                            >
                                {#if isShowingAll }
                                    { getLocalizedTextBySlug( 'ad-show-less-label', $languageTagStore ) }
                                {:else}
                                    { getLocalizedTextBySlug( 'ad-show-all-label', $languageTagStore ) }
                                {/if}
                            </button>
                        </div>
                    </Accordion>
                {/each}
            {/if}
        </div>
    </div>
</div>
