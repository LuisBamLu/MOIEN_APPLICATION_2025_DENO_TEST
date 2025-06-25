<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getMap, getLocalizedText, getTimeZoneFromLocation } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import Loading from '$component/element/Loading.svelte';
    import PropertyHeading from '$component/page/property/PropertyHeading.svelte';
    import PropertyDetail from '$component/page/property/PropertyDetail.svelte';
    import PropertyDescription from '$component/page/property/PropertyDescription.svelte';
    import PropertyEquipment from '$component/page/property/PropertyEquipment.svelte';
    import PropertyLocation from '$component/page/property/PropertyLocation.svelte';
    import PropertyHost from '$component/page/property/PropertyHost.svelte';
    import PropertyRentalReview from '$component/page/property/PropertyRentalReview.svelte';
    import PropertyReserve from '$component/page/property/PropertyReserve.svelte';
    import PropertyPark from '$component/page/property/PropertyPark.svelte';
    import PropertyRules from '$component/page/property/PropertyRules.svelte';
    import PropertyVisit from '$component/page/property/PropertyVisit.svelte';
    import PropertyScheduleVisit from '$component/page/property/PropertyScheduleVisit.svelte';
    import PropertyVisitResultModal from '$component/page/property/PropertyVisitResultModal.svelte';
    import PropertyCancellationPolicy from '$component/page/property/PropertyCancellationPolicy.svelte';
    import Seo from '$component/element/Seo.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import PropertyVerifyIdentityModal from '$component/page/property/PropertyVerifyIdentityModal.svelte';
    import { navigate } from 'svelte-routing';
    import { currencyConversionByConversionCodeMapStore } from '$store/currencyConversionByConversionCodeMapStore';

    // -- VARIABLES

    export let id;

    let isLoading = true;
    let property;
    let profile;
    let averageRating;
    let profilePropertyArrayLength;
    let propertyRentalReviewArray = [];
    let visit = null;
    let visitResult = '';
    let documentTypeMap;
    let documentArray = [];
    let profileDocumentByTypeIdMap;
    let isScheduleVisitModalOpen = false;
    let isVisitResultModalOpen = false;
    let userHasAllDocuments = false;
    let hasCompleteRentalFile = false;
    let propertyFeatureByTypeIdMap = {};
    let propertyLeaseContract = null;
    let rentalBookingArray = [];
    let rentalDayByDateMap = {};
    let propertyTimeZone = null;
    let questionArray =
        [
            {
                title: 'Question 1',
                profile:
                    {
                        firstName: 'First Name 1',
                        imagePath: ''
                    },
                description: 'Description 1',
                answer: 'Answer 1'
            },
            {
                title: 'Question 2',
                profile:
                    {
                        firstName: 'First Name 2',
                        imagePath: ''
                    },
                description: 'Description 2',
                answer: 'Answer 2'
            },
            {
                title: 'Question 3',
                profile:
                    {
                        firstName: 'First Name 3',
                        imagePath: ''
                    },
                description: 'Description 3',
                answer: 'Answer 3'
            }
        ];

    // -- FUNCTIONS

    function getUserHasAllDocuments(
        )
    {
        for ( let documentTypeId of property.requiredLongTermDocumentTypeIdList )
        {
            if ( !profileDocumentByTypeIdMap[ documentTypeId ] )
            {
                return false;
            }
        }

        return true;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let data = await fetchData( `/api/page/property/${ id }`, { method: 'POST', credentials: 'include' } );
                property = data.property;
                profile = data.profile;
                profilePropertyArrayLength = data.profilePropertyCount;
                propertyRentalReviewArray = data.propertyRentalReviewArray;
                visit = data.visit;
                documentTypeMap = data.documentTypeMap;
                documentArray = data.documentArray;
                profileDocumentByTypeIdMap = data.profileDocumentByTypeIdMap;
                userHasAllDocuments = getUserHasAllDocuments();
                hasCompleteRentalFile = data.hasCompleteRentalFile;
                propertyFeatureByTypeIdMap = getMap( property.featureArray, 'typeId' );
                questionArray = data.questionArray;
                propertyLeaseContract = data.propertyLeaseContract;
                rentalBookingArray = data.rentalBookingArray;
                rentalDayByDateMap = data.rentalDayByDateMap;
                averageRating = property.averageRating ? property.averageRating : 0;
                propertyTimeZone = getTimeZoneFromLocation( property.latitude, property.longitude, property.countryCode );

                propertyRentalReviewArray.sort(
                    ( a, b ) =>
                    new Date( b.creationTimestamp ).getTime() - new Date( a.creationTimestamp ).getTime()
                    );
            }
            catch
            {
                navigate( '/' + $languageTagStore + '/search' );
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

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .property
    {
        overflow-y: scroll;
        height: calc( 100dvh - 4.5rem );

        +media( desktop )
        {
            overflow-y: default;
            margin: auto;
            height: auto;
            max-width: pageMaxContentWidth;
            padding: 1.5rem 2rem 5rem 2rem;
        }
    }

    .property-container
    {
        padding: 0 1rem 10rem 1rem;

        +media( desktop )
        {
            padding: 0;

            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
    }

    .property-container-main
    {
        max-width: 46rem;

        flex: 1;

        +media( tablet )
        {
            margin-right: 1rem;
        }
    }

    .property-container-reserve
    {
        width: 100%;

        +media( desktop )
        {
            max-width: 27.875rem;
        }
    }

    .property-rules-container
    {
        border-top: 1px solid lightGrayBorderColor;
        padding: 1.5rem 0;
    }
</style>

{#if property }
    <Seo
        metaTitle={ property.title }
        title={ getLocalizedText( property.title, $languageTagStore )  }
        metaDescription={ property.description }
        imagePath={ property.imagePath }
        url="https://moien.com/"
        path={`property/${ id }`}
    />
{/if}

{#if isLoading }
    <div class="display-flex justify-content-center">
        <Loading/>
    </div>
{:else if property }
    <div class="property">
        <PropertyHeading
            propertyId={ property.id }
            title={ property.title }
            averageRating={ averageRating }
            countryName={ property.countryName }
            cityName={ property.cityName }
            imagePathArray={ property.imagePathArray }
            userProfile={ profile }
        />
        <div class="property-container">
            <div class="property-container-main">
                <PropertyDetail
                    userProfile={ profile }
                    bedroomCount={ Number( propertyFeatureByTypeIdMap[ 'bedroom-count' ]?.value ) }
                    bathroomCount={ Number( propertyFeatureByTypeIdMap[ 'bathroom-count' ]?.value ) }
                    totalArea={ Number( propertyFeatureByTypeIdMap[ 'property-area' ]?.value ) }
                />
                <PropertyDescription description={ property.description }/>
                {#if visit }
                    <PropertyVisit
                        propertyTimeZone={ propertyTimeZone }
                        visit={ visit }
                        bind:isScheduleVisitModalOpen={ isScheduleVisitModalOpen }
                    />
                {/if}
                <PropertyPark
                    freeParking={ true }
                    freeCancellationHours={ 48 }
                />
                <PropertyEquipment featureArray={ property.featureArray }/>
                <PropertyLocation
                    propertyLatitude={ property.latitude }
                    propertyLongitude={ property.longitude }
                    countryName={ property.countryName }
                    cityName={ property.cityName }
                />
                <PropertyHost
                    property={ property }
                    profile={ profile }
                    profilePropertyArrayLength={ profilePropertyArrayLength }
                />
                <PropertyRentalReview propertyRentalReviewArray={ propertyRentalReviewArray }/>
                <div class="property-rules-container">
                    <PropertyRules featureByTypeIdMap={ propertyFeatureByTypeIdMap }/>
                </div>
                <PropertyCancellationPolicy featureByTypeIdMap={ propertyFeatureByTypeIdMap }/>
            </div>
            <div class="property-container-reserve">
                <PropertyReserve
                    property={ property }
                    cityName={ property.cityName }
                    featureByTypeIdMap={ propertyFeatureByTypeIdMap }
                    propertyLeaseContract={ propertyLeaseContract }
                    profileDocumentByTypeIdMap={ profileDocumentByTypeIdMap }
                    rentalBookingArray={ rentalBookingArray }
                    rentalDayByDateMap={ rentalDayByDateMap }
                    profile={ profile }
                    bind:isScheduleVisitModalOpen={ isScheduleVisitModalOpen }
                    bind:visit={ visit }
                />
            </div>
        </div>
    </div>
    {#if isScheduleVisitModalOpen }
        <PropertyScheduleVisit
            property={ property }
            userHasAllDocuments={ userHasAllDocuments }
            hasCompleteRentalFile={ hasCompleteRentalFile }
            propertyTimeZone={ propertyTimeZone }
            bind:isOpen={ isScheduleVisitModalOpen }
            bind:visit={ visit }
            bind:isVisitResultModalOpen={ isVisitResultModalOpen }
            bind:visitResult={ visitResult }
        />
    {/if}
    {#if isVisitResultModalOpen  }
        <PropertyVisitResultModal
            documentTypeMap={ documentTypeMap }
            requiredDocumentTypeIdArray={ property.requiredLongTermDocumentTypeIdList }
            profileDocumentByTypeIdMap={ profileDocumentByTypeIdMap }
            bind:isOpen={ isVisitResultModalOpen }
            bind:visitResult={ visitResult }
        />
    {/if}
    <PropertyVerifyIdentityModal property={ property }/>
{/if}
