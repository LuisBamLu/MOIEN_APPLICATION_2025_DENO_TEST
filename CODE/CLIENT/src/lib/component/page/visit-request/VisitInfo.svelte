<script>
    // -- IMPORTS

    import { navigate } from 'svelte-routing';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import PropertyMiniCard from '$component/element/PropertyMiniCard.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import PropertyLocation from '$component/page/property/PropertyLocation.svelte';
    import ProfileImage from '../../layout/ProfileImage.svelte';
    import { getFormattedPrice } from '$src/lib/base';
    import { profileSignedInStore } from '$src/lib/store/profileStore';

    // -- VARIABLES

    export let property;
    export let visit;
    export let visitDate;
    export let isRescheduleModalOpen;
    export let visitorProfile;
    export let completeRentalFile;
    export let leaseSignatory;
    export let employmentStatusByIdMap;
    export let propertyTimeZone;

    // -- FUNCTIONS

    function contactCandidate(
        )
    {
        navigate( '/conversation/' + property.id + '/' + visit.visitorUserId + '/' + 'contact' );
    }
</script>

<style lang="stylus">
    // - IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // - CLASSES

    .visit-request-page-info-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;

        +media( desktop )
        {
            width: 60%;
            max-width: 46rem;
        }
    }

    .visit-request-section
    {
        padding: 1.5rem 0;

        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .visit-request-section-header
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .visit-icon-and-text-container
    {
        width: 100%;

        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .visit-request-page-candidate-description-container
    {
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .candidate-information
    {
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
</style>

<div class="visit-request-page-info-container">
    <div class="property-card-and-visit-information-container">
        <PropertyMiniCard
            bookingData={ { ...property, profile: $profileSignedInStore } }
        />
        <div class="visit-request-section">
            <div class="visit-request-section-header">
                <div class="font-size-125 font-weight-600 color-gray-100">
                    { getLocalizedTextBySlug( 'visit-request-visit-information-label', $languageTagStore ) }
                </div>
                <div class="visit-icon-and-text-container">
                    <div class="green-clock-icon size-150" />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        {
                            visitDate.toLocaleString(
                                $languageTagStore,
                                {
                                    timeZone: propertyTimeZone,
                                    dateStyle: 'long',
                                    timeStyle: 'full',
                                    hour12: false
                                }
                                )
                        }
                    </div>
                </div>
            </div>
            <ModalButton
                variant="outlined"
                text={ getLocalizedTextBySlug( 'visit-request-modify-visit-schedule-label', $languageTagStore ) }
                on:click={ () => isRescheduleModalOpen = true }
            />
        </div>
        <div class="visit-request-section">
            <div class="visit-request-section-header candidate-information">
                <div class="visit-request-section-header-text-container">
                    <div class="font-size-125 font-weight-600 color-gray-100">
                        { getLocalizedTextBySlug( 'visit-request-visit-information-label', $languageTagStore ) }
                    </div>
                    <div class="visit-request-page-candidate-description-container" >
                        <div class="font-size-90 font-weight-500 color-gray-300">
                            { visitorProfile.firstName } { visitorProfile.lastName }
                        </div>
                        {#if completeRentalFile }
                            <div class="font-size-90 font-weight-500 color-gray-300">
                                &#183;
                            </div>
                            <div class="font-size-90 font-weight-700 color-green-300">
                                {
                                    getLocalizedTextBySlug(
                                        'visit-request-page-complete-rental-file-label',
                                        $languageTagStore
                                        )
                                }
                            </div>
                        {/if}
                    </div>
                </div>
                <ProfileImage profile={ visitorProfile } size="medium" />
            </div>
            <div class="visit-icon-and-text-container">
                <div class="green-verified-icon size-150" />
                <div class="font-size-90 font-weight-500 color-gray-300">
                   { getLocalizedTextBySlug( 'visit-request-page-verified-user-label', $languageTagStore ) }
                </div>
            </div>
            {#if leaseSignatory.monthlyIncome }
                <div class="visit-icon-and-text-container">
                    <div class="green-coins-icon size-150" />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getFormattedPrice( leaseSignatory.monthlyIncome, $languageTagStore ) }
                        { getLocalizedTextBySlug( 'rental-file-page-monthly-income-label', $languageTagStore ) }
                    </div>
                </div>
            {/if}
            {#if leaseSignatory.employmentStatus }
                <div class="visit-icon-and-text-container">
                    <div class="green-suitcase-icon size-150" />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        {
                            getLocalizedText(
                                employmentStatusByIdMap[ leaseSignatory.employmentStatus ].name,
                                $languageTagStore
                                )
                        }
                    </div>
                </div>

            {/if}
            {#if leaseSignatory.hasGuarantor }
                <div class="visit-icon-and-text-container">
                    <div class="green-user-check-icon size-150" />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getLocalizedTextBySlug( 'visit-request-page-has-guarantor-label', $languageTagStore ) }
                    </div>
                </div>
            {/if}
            {#if visitorProfile.phonePrefix && visitorProfile.phoneNumber }
                <div class="visit-icon-and-text-container">
                    <div class="green-phone-icon size-150" />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { visitorProfile.phonePrefix } { visitorProfile.phoneNumber }
                    </div>
                </div>
            {/if}
            <ModalButton
                variant="outlined"
                text={ getLocalizedTextBySlug( 'visit-request-contact-candidate-label', $languageTagStore ) }
                on:click={ contactCandidate }
            />
        </div>
        <div class="visit-request-section">
            <div class="visit-request-section-header">
                <div class="font-size-125 font-weight-600 color-gray-100">
                    { getLocalizedTextBySlug( 'filter-location-label', $languageTagStore ) }
                </div>
                <div class="visit-icon-and-text-container">
                    <div class="green-place-icon size-150" />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { property.buildingNumber }
                        { property.streetName },
                        { getLocalizedText( property.cityName, $languageTagStore ) },
                        {#if property.countryName }
                            { getLocalizedText( property.countryName, $languageTagStore ) }
                        {:else}
                            { property.countryCode }
                        {/if}
                    </div>
                </div>
                <PropertyLocation
                    showLabel={ false }
                    countryName={ property.countryName }
                    cityName={ property.cityName }
                    propertyLatitude={ property.latitude }
                    propertyLongitude={ property.longitude }
                />
            </div>
        </div>
    </div>
</div>
