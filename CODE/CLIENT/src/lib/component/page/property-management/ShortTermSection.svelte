<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import FormAccordion from '$component/element/FormAccordion.svelte';
    import Accordion from '$component/element/Accordion.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import HouseRulesModal from './HouseRulesModal.svelte';
    import BookingCalendarModal from './BookingCalendarModal.svelte';

    // -- VARIABLES

    export let property;
    let isEditingHouseRules = false;
    let isEditingBookingCalendar = false;
</script>

<FormAccordion label={ getLocalizedTextBySlug( 'filter-short-term-label', $languageTagStore ) } >
    <div class="display-flex flex-direction-column gap-100 padding-100">
        <EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'my-ads-page-short-term-stay-management', $languageTagStore ) } >
            <Accordion
                label={ getLocalizedTextBySlug( 'property-management-page-booking-calendar-and-rates-label', $languageTagStore ) }
                bind:isEditing={ isEditingBookingCalendar }
            >
                <BookingCalendarModal
                    property={ property }
                    bind:isOpen={ isEditingBookingCalendar }
                />
            </Accordion>
        </EditLeaseContractPageSection>
        <EditLeaseContractPageSection
            label={ getLocalizedTextBySlug( 'property-management-page-parameters-and-rules-label', $languageTagStore ) }
        >
            <Accordion label={ getLocalizedTextBySlug( 'property-management-page-booking-parameters-label', $languageTagStore ) } />
            <Accordion
                label={ getLocalizedTextBySlug( 'house-rules-label', $languageTagStore ) }
                bind:isEditing={ isEditingHouseRules }
            >
                <HouseRulesModal id={ property.id } bind:isOpen={ isEditingHouseRules } />
            </Accordion>
            <Accordion label={ getLocalizedTextBySlug( 'property-management-page-regulations-label', $languageTagStore ) } />
            <Accordion label={ getLocalizedTextBySlug( 'property-management-page-cohosts-label', $languageTagStore ) } />
        </EditLeaseContractPageSection>
    </div>
</FormAccordion>
