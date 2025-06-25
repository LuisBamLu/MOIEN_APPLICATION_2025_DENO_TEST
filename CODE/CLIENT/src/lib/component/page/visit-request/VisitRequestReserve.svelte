<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug, getRandomTuid } from 'senselogic-gist';
    import { fetchData, getFormattedPrice, getLocalizedMonthName } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { navigate } from 'svelte-routing';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let property = {};
    export let visit;
    export let isScheduleResultModalOpen;
    export let scheduleResult;
    export let leaseContract;
    export let propertyFeatureByTypeIdMap;
    export let visitDone = false;
    let longTermAgencyFee = getExtraFee( 'long-term-agency-fee' );
    let longTermMonthlyCharge = getExtraFee( 'long-term-monthly-charges' );
    let longTermAnnualTaxes = getExtraFee( 'long-term-annual-taxes' );
    let longTermMonthlyExtraFee = longTermMonthlyCharge + longTermAnnualTaxes / 12;
    let longTermTotalMonthlyPrice = property.longTermMonthlyPrice + longTermMonthlyExtraFee;
    let longTermTotalFirstMonthPrice = property.longTermMonthlyPrice + longTermAgencyFee + longTermMonthlyExtraFee;
    let isSubmitting = false;
    let isCancelling = false;

    // -- FUNCTIONS

    async function handleUpdateVisit(
        visitData,
        previousVisitId = undefined
        )
    {
        if ( visit.status !== 'rescheduled-by-host' || previousVisitId !== undefined )
        {
            if ( previousVisitId )
            {
                isCancelling = true;
            }
            else
            {
                isSubmitting = false;
            }

            let result
                = await fetchData(
                    '/api/update-rental-visit',
                    {
                        method: 'POST',
                        credentials: 'include',
                        body:
                            JSON.stringify(
                                {
                                    visitId: visit.id,
                                    visit: visitData,
                                    previousVisitId: previousVisitId
                                }
                                )
                    }
                    );

            if ( previousVisitId !== undefined )
            {
                isCancelling = false;
                scheduleResult = 'declined';
            }
            else if ( result.error )
            {
                isSubmitting = false;
                scheduleResult = 'failed';
            }
            else
            {
                isSubmitting = false;
                scheduleResult = 'booked';
                visit = result.visit;
            }

            isScheduleResultModalOpen = true;
        }
    }

    // ~~

    async function handleProposeLeaseContract(
        )
    {
        isSubmitting = true;
        let result
            = await fetchData(
                '/api/update-lease-contract/' + leaseContract.id,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                            leaseContract:
                                {
                                    propertyId: property.id,
                                    lessorUserProfileId: $profileSignedInStore.userId,
                                    tenantUserProfileId: visit.visitorUserId,
                                    monthlyRent: property.longTermMonthlyPrice
                                },
                            type: 'propose lease contract'
                        }
                        )
                }
                );

        isSubmitting = false;
        navigate( '/dashboard/edit-lease-contract/' + result.leaseContract.id );
    }

    // ~~

    function getExtraFee(
        featureTypeId
        )
    {
        return valueToNumber( propertyFeatureByTypeIdMap[ featureTypeId ]?.value ?? 0 );
    }

    // ~~

    function valueToNumber(
        value
        )
    {
        return ( Number.isNaN( Number( value ) ) ? 0 : Number( value ) );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .visit-request-reserve
    {
        width: 100%;

        flex-direction: column;
        gap: 1rem;

        +media( desktop )
        {
            z-index: 1;
            position: -webkit-sticky;
            position: sticky;
            top: 5.5rem;

            max-width: 24.875rem;
            border-radius: 1.5rem;
            padding: 1.5rem;

            display: flex;

            background-color: grayColor950;
            box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        }
    }

    .visit-request-reserve-toggler
    {
        border: 2px solid grayColor700;
        border-radius: 1rem;

        display: none;

        background-color: grayColor900;

        cursor: pointer;

        +media( desktop )
        {
            display: flex;
        }
    }

    .visit-request-reserve-toggler-item
    {
        width: 50%;
        border-radius: 0.5rem;
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        padding: 1rem 1.5rem;

        background-color: transparent;

        text-align: center;

        cursor: pointer;
        transition: background-color 400ms ease-in-out, color 400ms ease-in-out;

        +media( desktop )
        {
            &:hover
            {
                background-color: grayColor950;

                color: greenColor;

                transition: background-color 400ms ease-in-out, color 400ms ease-in-out;
            }
        }
    }

    .visit-request-reserve-toggler-item.is-selected
    {
        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: greenColor;
    }

    .visit-request-reserve-long-term
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .visit-request-reserve-price-rules
    {
        border: 2px solid grayColor700;
        border-radius: 1rem;
        padding: 1.25rem 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        background-color: grayColor900;
    }

    .visit-request-price-rules-container,
    .visit-request-price-rules-total-container
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .visit-request-price-rules-total-container
    {
        border-top: 1px solid grayColor700;
        padding-top: 1rem;
    }
</style>

<div class="visit-request-reserve">
    <div class="visit-request-reserve-toggler">
        <button class="font-size-90 font-weight-700 color-gray visit-request-reserve-toggler-item">
            { getLocalizedTextBySlug( 'short-term-label', $languageTagStore ) }
        </button>
        <button
            class="font-size-90 font-weight-700 color-gray visit-request-reserve-toggler-item"
            class:is-selected={ true }
        >
            { getLocalizedTextBySlug( 'long-term-label', $languageTagStore ) }
        </button>
    </div>
    <div class="visit-request-reserve-long-term">
        <div class="visit-request-reserve-price-rules">
            <div class="visit-request-price-rules-container">
                <div class="font-size-90 font-weight-500 color-gray  visit-request-price-rules-label">
                    { getLocalizedTextBySlug( 'filter-price-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-700 color-black visit-request-price-rules-label">
                    { getFormattedPrice( property.longTermMonthlyPrice, $languageTagStore ) }
                </div>
            </div>
            <div class="visit-request-price-rules-container">
                <div class="font-size-90 font-weight-500 color-gray  visit-request-price-rules-label">
                    { getLocalizedTextBySlug( 'extra-fees-monthly-charges-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-700 color-black visit-request-price-rules-label">
                    { getFormattedPrice( longTermMonthlyCharge, $languageTagStore ) }
                </div>
            </div>
            <div class="visit-request-price-rules-container">
                <div class="font-size-90 font-weight-500 color-gray  visit-request-price-rules-label">
                    { getLocalizedTextBySlug( 'extra-fees-annual-taxes-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-700 color-black visit-request-price-rules-label">
                    { getFormattedPrice( longTermAnnualTaxes, $languageTagStore ) }
                </div>
            </div>
            <div class="visit-request-price-rules-container">
                <div class="font-size-90 font-weight-500 color-gray  visit-request-price-rules-label">
                    { getLocalizedTextBySlug( 'extra-fees-agency-fee-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-700 color-black visit-request-price-rules-label">
                    { getFormattedPrice( longTermAgencyFee, $languageTagStore ) }
                </div>
            </div>
            {#if longTermAgencyFee > 0 }
                <div class="visit-request-price-rules-total-container">
                    <div class="font-size-100 font-weight-500 color-black visit-request-price-rules-total-label">
                        { getLocalizedTextBySlug( 'total-first-month-label', $languageTagStore ) }
                    </div>
                    <div class="font-size-90 font-weight-700 color-black visit-request-price-rules-total-price">
                        { getFormattedPrice( longTermTotalFirstMonthPrice, $languageTagStore ) }
                    </div>
                </div>
            {/if}
            <div class="visit-request-price-rules-total-container">
                <div class="font-size-100 font-weight-700 color-black visit-request-price-rules-total-label">
                    { getLocalizedTextBySlug( 'total-label', $languageTagStore ) }
                </div>
                <div class="font-size-100 font-weight-700 color-black visit-request-price-rules-total-price">
                    { getFormattedPrice( longTermTotalMonthlyPrice, $languageTagStore ) }
                </div>
            </div>
        </div>
        <div class="font-size-90 font-weight-500 color-black visit-request-reserve-long-term-avaiability">
            { getLocalizedTextBySlug( 'available-from-label', $languageTagStore ) } { getLocalizedMonthName( 6 ) }, 2024
        </div>
        {#if visit.status === 'pending' }
            <ModalButton
                variant="contained"
                text={ getLocalizedTextBySlug( 'visit-request-page-accept-visit-request-label', $languageTagStore ) }
                bind:isLoading={ isSubmitting }
                on:click={ () => handleUpdateVisit( { status: 'booked' } ) }
            />
        {:else if visitDone }
            <ModalButton
                variant="contained"
                text="Propose lease contract"
                bind:isLoading={ isSubmitting }
                on:click={ handleProposeLeaseContract }
            />
        {/if}
        <ModalButton
            variant="light"
            text=
                {
                    visitDone
                    ? getLocalizedTextBySlug( 'visit-request-page-archive-visit-request-label', $languageTagStore )
                    : getLocalizedTextBySlug( 'visit-request-page-decline-visit-request-label', $languageTagStore )
                }
            bind:isLoading={ isCancelling }
            on:click={ () => handleUpdateVisit( {}, visit.id ) }
        />
    </div>
</div>
