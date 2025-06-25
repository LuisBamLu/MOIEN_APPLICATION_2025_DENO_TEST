<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import { getFloorInteger, getJsonText, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let featureByTypeIdMap;
    let cancellationPolicy = null;
    let isLoading = true;
    let isCancellationPolicyListCollapsed = true;
    let cancellationPolicyFeature;

    // -- FUNCTIONS

    async function fetchCancellationPolicyArray(
        )
    {
        let data
            = await fetchData(
                '/admin/api/cancellation-policy/' + cancellationPolicyFeature.value + '/get',
                {
                    method: 'POST',
                    body: getJsonText( { type: 'getCancellationPolicyById' } )
                }
                );

        cancellationPolicy = data.cancellationPolicy;
    }

    // ~~

    function toggleCancellationPolicyCollapsed(
        )
    {
        isCancellationPolicyListCollapsed = !isCancellationPolicyListCollapsed;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                if ( featureByTypeIdMap[ 'cancellation-policy' ] )
                {
                    cancellationPolicyFeature = featureByTypeIdMap[ 'cancellation-policy' ];
                    await fetchCancellationPolicyArray();
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
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    li + li
    {
        border-top: 1px solid grayColor800;
    }

    button
    {
        width: fit-content;
    }

    // -- CLASSES

    .property-cancellation-policy-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .icon
    {
        flex-shrink: 0;
    }
</style>

{#if !isLoading && cancellationPolicy }
    <div class="property-cancellation-policy-container">
        <p class="padding-bottom-25 font-size-100 font-weight-700 color-gray-100">
            { getLocalizedText( cancellationPolicyFeature.type.name, $languageTagStore ) }
        </p>
        {#if !isCancellationPolicyListCollapsed }
            <ul transition:slide>
                {#if cancellationPolicy.partialRefundMinimumDayCount !== null
                    && cancellationPolicy.partialRefundRatio >= 0
                    && cancellationPolicy.partialRefundRatio !== 1
                    && cancellationPolicy.partialRefundMinimumDayCount > 0
                }
                    <li class="display-flex gap-100 padding-vertical-75 border-color-gray-800 border-style-solid font-size-90 color-gray-100">
                        <div class="icon green-check-icon size-150"/>
                        {
                            getLocalizedTextBySlug(
                                'properties-partial-refund-text',
                                {
                                    percentage: cancellationPolicy.partialRefundRatio ,
                                    hourCount: cancellationPolicy.partialRefundMinimumDayCount * 24,
                                    dayCount: cancellationPolicy.partialRefundMinimumDayCount
                                },
                                $languageTagStore
                                )
                        }
                    </li>
                {:else if cancellationPolicy.penaltyDayCount !== null && cancellationPolicy.penaltyDayCount > 0 }
                    <li class="display-flex gap-100 padding-vertical-75 border-color-gray-800 border-style-solid font-size-90 color-gray-100">
                        <div class="icon red-400-x-circle-icon size-150"/>
                        {
                            getLocalizedTextBySlug(
                                'properties-no-refund-text',
                                {
                                    hourCount: cancellationPolicy.penaltyDayCount * 24,
                                    dayCount: cancellationPolicy.penaltyDayCount
                                },
                                $languageTagStore
                                )
                        }
                    </li>
                {/if}
                {#if cancellationPolicy.fullRefundMinimumDayCount !== null && cancellationPolicy.fullRefundMinimumDayCount > 0 }
                    <li class="display-flex gap-100 padding-vertical-75 border-color-gray-800 border-style-solid font-size-90 color-gray-100">
                        <div class="icon green-check-icon size-150"/>
                        {
                            getLocalizedTextBySlug(
                                'properties-cancellation-free-of-charge-text',
                                {
                                    hourCount: cancellationPolicy.fullRefundMinimumDayCount * 24,
                                    dayCount: cancellationPolicy.fullRefundMinimumDayCount
                                },
                                $languageTagStore
                                )
                        }
                    </li>
                {/if}
            </ul>
        {/if}
        <button
            class="font-size-90 font-weight-700 line-height-125 color-green"
            on:click={ toggleCancellationPolicyCollapsed }
        >
            {
                isCancellationPolicyListCollapsed
                ? getLocalizedTextBySlug( 'show-more-label', $languageTagStore )
                : getLocalizedTextBySlug( 'show-less-label', $languageTagStore )
            }
        </button>
    </div>
{/if}
