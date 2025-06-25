<script>
    // -- IMPORTS

    import { createEventDispatcher, onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { featureTypeByCategoryAndSubCategoryArrayStore } from '$store/featureTypeByCategoryAndSubCategoryArrayStore';

    // -- VARIABLES

    export let propertyFeatureByTypeIdMap;
    let cancellationPolicyArray = [];
    let isLoading = true;
    let openedCancellationPolicyId = '';
    let dispatch = createEventDispatcher();

    let cancellationPolicyFeatureType = $featureTypeByCategoryAndSubCategoryArrayStore[ 'equipment-and-services' ]
        .subCategory[ 'general' ]
        .featureTypeArray
        .find( ( featureType ) => featureType.id === 'cancellation-policy' );

    // -- FUNCTIONS

    function handleFeatureChange(
        featureTypeId,
        value
        )
    {
        dispatch( 'change', { featureTypeId: featureTypeId, value } );
    }

    // ~~

    async function fetchCancellationPolicyArray(
        )
    {
        isLoading = true;

        try
        {
            let data = await fetchData(
                '/admin/api/cancellation-policy/list',
                {
                    method: 'POST'
                }
                );

            cancellationPolicyArray = data.cancellationPolicyArray;
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

    // ~~

    function generateCancellationPolicyText(
        cancellationPolicy
        )
    {
        let text = '';

        if ( cancellationPolicy.id === 'flexible' )
        {
            text = `
                Free cancellation up to 24 hours before arrival, beyond that, before arrival,
                the 1st night and service charges are due.
                    ¨fr:Annulation gratuite jusqu'à 24h avant l'arrivée, Au-delà, avant l'arrivée,
                    la 1ere nuit et les frais de services sont dûs
                    ¨de:Kostenlose Stornierung bis 24 Stunden vor Ankunft, danach werden die 1.
                    Nacht und die Servicegebühren fällig.`
        }

        if ( cancellationPolicy.id === 'moderate' )
        {
            text = `
            Free cancellation up to 5 days before arrival, beyond that, the 1st night, service
            charges and 50% of the reservation are due.
                    ¨fr:Annulation gratuite jusqu'à 5 jours avant l'arrivée, au-delà avant
                    l'arrivée, la 1ere nuit, les frais de services et 50% de la réservation sont dûs
                    ¨de:Kostenlose Stornierung bis 5 Tage vor Anreise, danach werden die 1. Nacht,
                    die Servicegebühren und 50% der Reservierung fällig.`
        }

        if ( cancellationPolicy.id === 'strict' )
        {
            text = `
                Free cancellation within 48 hours of reservation, beyond 14 days prior to arrival,
                1st night, service charge and 50% of reservation are due, beyond 7 days prior to
                arrival, no refund possible.
                    ¨fr:l'annulation est gratuite pendant les 48h qui suivent la réservation, Au-delà,
                    14 jours avant l'arrivée, la 1ere nuit, les frais de services et 50% de la
                    réservation sont dûs, Au-delà, 7 jours avant l'arrivée, plus de remboursement
                    possible.
                    ¨de:Kostenlose Stornierung innerhalb von 48 Stunden nach der Reservierung, ab 14
                    Tage vor der Ankunft werden die 1. Nacht, die Servicegebühr und 50 % der
                    Reservierung fällig, ab 7 Tage vor der Ankunft ist keine Rückerstattung möglich.`
        }

        return text;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( propertyFeatureByTypeIdMap[ 'cancellation-policy' ] )
            {
                openedCancellationPolicyId = propertyFeatureByTypeIdMap[ 'cancellation-policy' ].value;
            }

            await fetchCancellationPolicyArray();
        }
        );

</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- ELEMENTS

    li
    {
        width: 100%;

        color: grayColor500;
    }

    li + li
    {
        border-top: 1px solid grayColor700;
    }

    input[type="radio"]
    {
        height: 1.5rem;
        width: 1.5rem;
        border: 2px solid #DEDEE6;
        border-radius: 50%;

        background: #EFEFF3;

        color: greenColor500;
        -webkit-appearance: none;
        appearance: none;
        position: relative;

        margin: 0;
        padding: 0;

        display: inline-block;

        transition: all 0.15s ease-out 0s;
    }

    input[type="radio"]:checked
    {
        border: 2px solid greenColor500;

        background: greenColor500;
    }

    input[type="radio"]:checked::before
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate( -50%, -50% );

        height: 1.5rem;
        width: 1.5rem;

        display:flex;
        justify-content:center;
        align-items:center;

        content: url( 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0yLjQ1ODMzIDMuNTI2MzJMNC45NTgzMyA2LjA1MjYzTDkuNTQxNjcgMUwxMSAyLjI2MzE2TDQuOTU4MzMgOUwxIDUuMjEwNTNMMi40NTgzMyAzLjUyNjMyWiIgZmlsbD0id2hpdGUiIHN0cm9rZT0id2hpdGUiLz4NCjwvc3ZnPg0K' );

        color: white;
    }

    label
    {
        flex: 1;
    }

    section
    {
        padding-bottom: 0.75rem;
    }

    // -- CLASSES

    .is-active
    {
        font-weight: 600;
    }

    .input-radio-container
    {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<div>
    {#if !isLoading }
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'cancellation-policy-label', $languageTagStore )}
        </div>
        <ul>
            {#each cancellationPolicyArray as cancellationPolicy }
                <li>
                    <header class="padding-vertical-75 display-flex justify-content-space-between align-items-center">
                        <label
                            class:is-active={ cancellationPolicy.id === openedCancellationPolicyId }
                            for="cancellation-policy-{ cancellationPolicy.id }"
                        >
                            { getLocalizedText( cancellationPolicy.name, $languageTagStore ) }
                        </label>
                        <div class="input-radio-container">
                            <input
                                type="radio"
                                name="cancellation-policy"
                                id="cancellation-policy-{ cancellationPolicy.id }"
                                checked={ ( propertyFeatureByTypeIdMap[ 'cancellation-policy' ]?.value ?? '' ) === cancellationPolicy.id }
                                value={ cancellationPolicy.id }
                                bind:group={ openedCancellationPolicyId }
                                on:change={ () => handleFeatureChange( cancellationPolicyFeatureType.id, cancellationPolicy.id ) }
                            />
                        </div>
                    </header>
                    {#if openedCancellationPolicyId === cancellationPolicy.id }
                        <section transition:slide>
                            {@html getLocalizedText( generateCancellationPolicyText( cancellationPolicy ), $languageTagStore ) }
                        </section>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</div>
