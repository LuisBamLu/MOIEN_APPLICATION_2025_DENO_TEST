<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';

    // -- VARIABLES

    export let featureByTypeIdMap;
    let isLoading = true;
    let propertyRules =
        {
            childrenAllowed: false,
            infantAllowed: false,
            petsAllowed: false,
            smokingAllowed: false,
            partiesAllowed: false,
        };
    let checkInTime;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                if ( featureByTypeIdMap[ 'check-in-time' ] )
                {
                    checkInTime = featureByTypeIdMap[ 'check-in-time' ].value;
                }

                if ( featureByTypeIdMap[ 'allows-children' ] )
                {
                    propertyRules.childrenAllowed = ( featureByTypeIdMap[ 'allows-children' ].value === 'true' );
                }

                if ( featureByTypeIdMap[ 'allows-babies' ] )
                {
                    propertyRules.infantAllowed = ( featureByTypeIdMap[ 'allows-babies' ].value === 'true' );
                }

                if ( featureByTypeIdMap[ 'allows-pets' ] )
                {
                    propertyRules.petsAllowed = ( featureByTypeIdMap[ 'allows-pets' ].value === 'true' );
                }

                if ( featureByTypeIdMap[ 'allows-smoking' ] )
                {
                    propertyRules.smokingAllowed = ( featureByTypeIdMap[ 'allows-smoking' ].value === 'true' );
                }

                if ( featureByTypeIdMap[ 'allows-parties' ] )
                {
                    propertyRules.partiesAllowed = ( featureByTypeIdMap[ 'allows-parties' ].value === 'true' );
                }
            }
            catch ( error )
            {
                console.error( error );
            }
            finally
            {
                isLoading = false;
            }
        }
    )
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-reserve-short-term-rules
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .property-reserve-short-term-rule
    {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
    }
</style>

{#if isLoading }
    <Loading />
{:else}
    <div class="property-reserve-short-term-rules">
        <div class="font-size-100 font-weight-700 color-black property-reserve-short-term-rules-label">
            { getLocalizedTextBySlug( 'house-rules-label', $languageTagStore ) }
        </div>
        <div class="property-reserve-short-term-rule">
            <div class="green-recent-icon size-150 property-reserve-short-term-rule-icon">
            </div>
            <div class="font-size-90 font-weight-500 color-gray property-reserve-short-term-rule-label">
                {#if checkInTime }
                    { getLocalizedText( featureByTypeIdMap[ 'check-in-time' ].type.name, $languageTagStore ) }
                    { `${ checkInTime.slice( 2, 7 ) } - ${ checkInTime.slice( 10, 15 ) }` }
                {:else}
                    { getLocalizedTextBySlug( 'no-check-in-time', $languageTagStore ) }
                {/if}
            </div>
        </div>
        <div class="property-reserve-short-term-rule">
            <div class="{ propertyRules.childrenAllowed ? 'green-children-icon' : 'red-400-x-circle-icon' } size-150 property-reserve-short-term-rule-icon">
            </div>
            <div class="font-size-90 font-weight-500 color-gray property-reserve-short-term-rule-label">
                {#if propertyRules.childrenAllowed }
                    { getLocalizedText( featureByTypeIdMap[ 'allows-children' ].type.name, $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'no-children-allowed', $languageTagStore ) }
                {/if}
            </div>
        </div>
        <div class="property-reserve-short-term-rule">
            <div class="{ propertyRules.infantAllowed ? 'green-baby-icon' : 'red-400-x-circle-icon' } size-150 property-reserve-short-term-rule-icon">
            </div>
            <div class="font-size-90 font-weight-500 color-gray property-reserve-short-term-rule-label">
                {#if propertyRules.infantAllowed }
                    { getLocalizedText( featureByTypeIdMap[ 'allows-babies' ].type.name, $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'no-babies-allowed', $languageTagStore ) }
                {/if}
            </div>
        </div>
        <div class="property-reserve-short-term-rule">
            <div class="{ propertyRules.petsAllowed ? 'green-pet-icon' : 'red-400-x-circle-icon' } size-150 property-reserve-short-term-rule-icon">
            </div>
            <div class="font-size-90 font-weight-500 color-gray property-reserve-short-term-rule-label">
                {#if propertyRules.petsAllowed }
                    { getLocalizedText( featureByTypeIdMap[ 'allows-pets' ].type.name, $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'no-pets-allowed', $languageTagStore ) }
                {/if}
            </div>
        </div>
        <div class="property-reserve-short-term-rule">
            <div class="{ propertyRules.smokingAllowed ? 'green-smoking-icon' : 'red-400-x-circle-icon' } size-150 property-reserve-short-term-rule-icon">
            </div>
            <div class="font-size-90 font-weight-500 color-gray property-reserve-short-term-rule-label">
                {#if propertyRules.smokingAllowed }
                    { getLocalizedText( featureByTypeIdMap[ 'allows-smoking' ].type.name, $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'no-smoking-allowed', $languageTagStore ) }
                {/if}
            </div>
        </div>
        <div class="property-reserve-short-term-rule">
            <div class="{ propertyRules.partiesAllowed ? 'green-party-icon' : 'red-400-x-circle-icon' } size-150 property-reserve-short-term-rule-icon">
            </div>
            <div class="font-size-90 font-weight-500 color-gray property-reserve-short-term-rule-label">
                {#if propertyRules.partiesAllowed }
                    { getLocalizedText( featureByTypeIdMap[ 'allows-parties' ].type.name, $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'no-parties-allowed', $languageTagStore ) }
                {/if}
            </div>
        </div>
    </div>
{ /if}
