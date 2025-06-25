<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalRoot from '../../modal/ModalRoot.svelte';
    import ModalHeader from '../../modal/ModalHeader.svelte';
    import ModalContent from '../../modal/ModalContent.svelte';
    import ModalActions from '../../modal/ModalActions.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import ModalButton from '../../modal/ModalButton.svelte';
    import { onMount, setContext } from 'svelte';
    import { fetchData } from '$src/lib/base';
    import BookingCalendarStep1 from './BookingCalendarStep1.svelte';
    import Loading from '../../element/Loading.svelte';
    import BookingCalendarStep2 from './BookingCalendarStep2.svelte';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { writable } from 'svelte/store';
    import { toast } from '$src/lib/toast';
    import { fly, slide } from 'svelte/transition';

    // -- VARIABLES

    export let property;
    export let isOpen = false;
    let activeStep = 1;
    let rentalDayArray = writable( [] );
    let rentalDayByDateMap = writable( {} );
    let rentalBookingArray = [];
    let dateArray = [];
    let isAvailable = property.isAvailableForShortTerm;
    let price = property.shortTermDailyPrice;
    let hasShortTermExtendedStayDiscount = property.hasShortTermExtendedStayDiscount ?? false;
    let shortTermExtendedStayDailyPrice = property.shortTermExtendedStayDailyPrice;
    let hasShortTermProlongedStayDiscount = property.hasShortTermProlongedStayDiscount ?? false;
    let shortTermProlongedStayDailyPrice = property.shortTermProlongedStayDailyPrice;
    let comment = '';
    let isLoading = true;
    let isSubmitting = false;

    // -- FUNCTIONS

    async function handleSubmit(
        )
    {
        for ( let date of dateArray )
        {
            if ( $rentalDayByDateMap[ date ] === undefined )
            {
                $rentalDayByDateMap[ date ] = {};
            }

            $rentalDayByDateMap[ date ] =
                {
                    ...$rentalDayByDateMap[ date ],
                    date: date,
                    propertyId: property.id,
                    isAvailableForShortTerm: isAvailable,
                    shortTermDailyPrice: Number( price ),
                    hasShortTermExtendedStayDiscount: hasShortTermExtendedStayDiscount,
                    shortTermExtendedStayDailyPrice: Number( shortTermExtendedStayDailyPrice ),
                    hasShortTermProlongedStayDiscount: hasShortTermProlongedStayDiscount,
                    shortTermProlongedStayDailyPrice: Number( shortTermProlongedStayDailyPrice ),
                    comment: comment,
                    userId: $profileSignedInStore.userId
                };
        }

        isSubmitting = true;
        let data
            = await fetchData(
                '/api/rental-day/add/' + property.id,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                            rentalDayArray: Object.values( $rentalDayByDateMap )
                        }
                        )
                }
                );
        isSubmitting = false;

        if ( data.error )
        {
            toast.error( getLocalizedTextBySlug( data.error, $languageTagStore ) )
        }
        else
        {
            for ( let rentalDay of data.rentalDayArray )
            {
                $rentalDayByDateMap[ rentalDay.date ] = rentalDay;
            }

            $rentalDayArray = Object.values( $rentalDayByDateMap );
            toast.success( 'Booking calendar updated successfully' );
            setTimeout( () => activeStep = 1, 1000 );
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result
                = await fetchData(
                    '/api/page/booking-calendar/' + property.id,
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                    );

            if ( result.error )
            {
               console.error( getLocalizedTextBySlug( result.error, $languageTagStore ) );
            }

            $rentalDayArray = result.rentalDayArray;
            $rentalDayByDateMap = result.rentalDayByDateMap;
            rentalBookingArray = result.rentalBookingArray;
            isLoading = false;
        }
        );

    // ~~

    setContext( 'rentalDayByDateMap', rentalDayByDateMap );

    // ~~

    setContext( 'rentalDayProperty', property );
</script>

<style lang="stylus">
    // -- CLASSES

    .booking-calendar-modal-content-container
    {
        width: 100%;
    }
</style>

<ModalRoot bind:isOpen={ isOpen }>
    <ModalHeader
        title=
            {
                getLocalizedTextBySlug(
                    activeStep === 1
                    ? 'property-management-page-booking-calendar-and-rates-label'
                    : 'edit-label',
                    $languageTagStore
                    )
            }
        onClose={ () => isOpen = false }
    />
        <ModalContent>
            {#if isLoading }
                <Loading />
            {:else}
                <div
                    class="booking-calendar-modal-content-container"
                    in:slide
                    out:slide
                >
                    {#if activeStep === 1 }
                        <div
                            class="display-flex flex-direction-column gap-100"
                            in:fly={ { x: -400 } }
                        >
                            <BookingCalendarStep1
                                rentalBookingArray={ rentalBookingArray }
                                bind:dateArray={ dateArray }
                            />
                        </div>
                    {:else}
                        <div
                            class="display-flex flex-direction-column gap-100"
                            in:fly={ { x: -400 } }
                        >
                            <BookingCalendarStep2
                                property={ property }
                                dateArray={ dateArray }
                                bind:isAvailable={ isAvailable }
                                bind:price={ price }
                                bind:hasShortTermExtendedStayDiscount={ hasShortTermExtendedStayDiscount }
                                bind:shortTermExtendedStayDailyPrice={ shortTermExtendedStayDailyPrice }
                                bind:hasShortTermProlongedStayDiscount={ hasShortTermProlongedStayDiscount }
                                bind:shortTermProlongedStayDailyPrice={ shortTermProlongedStayDailyPrice }
                                bind:comment={ comment }
                            />
                        </div>
                    {/if}
                </div>
            {/if}
        </ModalContent>
        {#if activeStep === 1 }
            {#if dateArray.length > 0 }
                <ModalActions>
                    <ModalButton
                        text={ getLocalizedTextBySlug( 'cancel-label', $languageTagStore ) }
                        variant="text"
                        on:click={ () => dateArray = [] }
                    />
                    <ModalButton
                        text={ getLocalizedTextBySlug( 'edit-label', $languageTagStore ) }
                        variant="contained"
                        on:click={ () => activeStep++ }
                    />
                </ModalActions>
            {/if}
        {:else}
            <ModalActions>
                <ModalButton
                    text={ getLocalizedTextBySlug( 'cancel-label', $languageTagStore ) }
                    variant="text"
                    on:click={ () => activeStep-- }
                />
                <ModalButton
                    text={ getLocalizedTextBySlug( 'submit-label', $languageTagStore ) }
                    variant="contained"
                    isLoading={ isSubmitting }
                    on:click={ handleSubmit }
                />
            </ModalActions>
        {/if}
</ModalRoot>
