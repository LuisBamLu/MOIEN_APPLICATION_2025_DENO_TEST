<script>
    // -- IMPORTS

    import { getContext, onMount } from 'svelte';
    import { getJsonText, getLocalizedTextBySlug, isNaN } from 'senselogic-gist';
    import { fetchData, flyFade, hostUrl } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { defaultLocationStore } from '$store/locationStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { cityArrayStore } from '$store/cityArrayStore';
    import { countryArrayStore } from '$store/countryArrayStore';
    import { propertyTypeArrayStore } from '$store/propertyTypeArrayStore';
    import { rentalTypeArrayStore } from '$store/rentalTypeArrayStore';
    import Error from '$component/element/Error.svelte';
    import Success from '$component/element/Success.svelte';
    import Loading from '$component/element/Loading.svelte';
    import FileInputSection from '$component/page/ad/FileInputSection.svelte';
    import SecondaryHeader from '$component/page/ad/SecondaryHeader.svelte';
    import SuccessModal from '$src/lib/component/page/ad/SuccessModal.svelte';
    import AdPageStep1 from '$component/page/ad/AdPageStep1.svelte';
    import AdPageStep3 from '$component/page/ad/AdPageStep3.svelte';
    import AdPageStep4 from '$component/page/ad/AdPageStep4.svelte';
    import AdPageStep5 from '$component/page/ad/AdPageStep5.svelte';
    import AdPageStep6 from '$component/page/ad/AdPageStep6.svelte';
    import AdPageStep7 from '$component/page/ad/AdPageStep7.svelte';
    import AdPageStep8 from '$component/page/ad/AdPageStep8.svelte';
    import AdPageStep9 from '$component/page/ad/AdPageStep9.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import AdPageStep2 from '../component/page/ad/LocationSection.svelte';
    import { toast } from '../toast';

    // -- VARIABLES

    export let propertyId = null;
    let propertyTypeArray = $propertyTypeArrayStore;
    let countryArray = $countryArrayStore;
    let cityArray = $cityArrayStore;
    let heatingTypeArray;
    let energyDiagnosisArray;
    let spaceTypeMap;
    let bedTypeArray;
    let documentTypeArray;
    let rentalTypeArray = $rentalTypeArrayStore;
    let profileDefaultCity;
    let isLoading = true;
    let errorArray = [];
    let success = getContext( 'success' );
    let successMessage;
    let activeStep = 1;
    let previousStep = 1;
    let property =
        {
            id: null,
            typeId: null,
            rentalTypeId: null,
            title: null,
            description: null,
            streetName: '',
            buildingNumber: null,
            apartmentNumber: null,
            cityId: null,
            cityName: '',
            countryCode: null,
            countryName: '',
            showsPreciseLocation: false,
            latitude: profileDefaultCity ? profileDefaultCity.latitude : $defaultLocationStore.latitude,
            longitude: profileDefaultCity ? profileDefaultCity.longitude : $defaultLocationStore.longitude,
            shortTermDailyPrice: null,
            shortTermExtendedStayDailyPrice: null,
            shortTermProlongedStayDailyPrice: null,
            managerUserId: $profileSignedInStore.userId,
            userId: $profileSignedInStore.userId,
            heatingTypeId: null,
            energyDiagnosisId: null,
            isAvailableForShortTerm: true,
            isAvailableForLongTerm: false,
            longTermMonthlyPrice: 0,
            requiredLongTermDocumentTypeIdList: [],
            requiresCompleteRequestForVisits: false,
            imagePathArray: []
        };
    let roomMap = {};
    let form;
    let longTermStepArray = [ 5, 6, 7, 9, 10 ];
    let shortTermStepArray = [ 5, 8, 9, 10 ];
    let longTermStepIndex = 0;
    let shortTermStepIndex = 0;
    let buttonTextSlug = 'next-label';
    let propertyFeatureByTypeIdMap = {};
    let isAddressValid = false;
    let missingLocationFields =
        {
            country: false,
            city: false,
        };
    let transitionDirection;
    let isSuccessModalOpen = false;
    let isSubmitting = false;

    // -- FUNCTIONS

    function goToNextStep(
        )
    {
        if ( activeStep === 2 && !isAddressValid )
        {
            toast.error( 'address-not-valid-label' );

            return;
        }
        if ( activeStep >= 5 )
        {
            if ( property.isAvailableForLongTerm && property.isAvailableForShortTerm )
            {
                activeStep++;
            }
            else if ( property.isAvailableForLongTerm )
            {
                if ( longTermStepArray.length > longTermStepIndex )
                {
                    longTermStepIndex++;
                }

                activeStep = longTermStepArray[ longTermStepIndex ];
            }
            else
            {
                if ( shortTermStepArray.length > shortTermStepIndex )
                {
                    shortTermStepIndex++;
                }

                activeStep = shortTermStepArray[ shortTermStepIndex ];
            }
        }
        else
        {
            activeStep++;
        }
    }

    // ~~

    function goToPreviousStep(
        )
    {
        if ( activeStep > 6 )
        {
            if ( property.isAvailableForLongTerm && property.isAvailableForShortTerm )
            {
                activeStep--;
            }
            else if ( property.isAvailableForLongTerm )
            {
                if ( longTermStepIndex > 0 )
                {
                    longTermStepIndex--;
                }

                activeStep = longTermStepArray[ longTermStepIndex ];
            }
            else
            {
                if ( shortTermStepIndex > 0 )
                {
                    shortTermStepIndex--;
                }

                activeStep = shortTermStepArray[ shortTermStepIndex ];
            }
        }
        else
        {
            activeStep--;
        }
    }

    // ~~

    function handleFeatureChange(
        event
        )
    {
        if ( propertyFeatureByTypeIdMap[ event.featureTypeId ] === undefined )
        {
            propertyFeatureByTypeIdMap[ event.featureTypeId ] = { typeId: event.featureTypeId, value: null, isPromoted: false };
        }

        propertyFeatureByTypeIdMap[ event.featureTypeId ].value = event.value;

        if ( event.featureTypeId === 'room-count'
             || event.featureTypeId === 'bedroom-count'
             || event.featureTypeId === 'bathroom-count'
             || event.featureTypeId === 'living-room-count'
             || event.featureTypeId === 'kitchen-count'
             || event.featureTypeId === 'dining-room-count'
             || event.featureTypeId === 'office-count'
             || event.featureTypeId === 'game-room-count'
             || event.featureTypeId === 'other-room-count'
             || event.featureTypeId === 'lavatory-count' )
        {
            let totalRoomCount =
                Number( propertyFeatureByTypeIdMap[ 'bedroom-count' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'bathroom-count' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'living-room-count' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'kitchen-count' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'dining-room-count' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'office-count' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'game-room-count' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'other-room-count' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'lavatory-count' ]?.value ?? 0 );

            if ( propertyFeatureByTypeIdMap[ 'room-count' ] === undefined )
            {
                propertyFeatureByTypeIdMap[ 'room-count' ] = { typeId: 'room-count', value: 0, isPromoted: false };
            }

            if ( propertyFeatureByTypeIdMap[ 'room-count' ].value < totalRoomCount )
            {
                propertyFeatureByTypeIdMap[ 'room-count' ].value = totalRoomCount;
            }
        }

        if ( event.featureTypeId === 'bedroom-count'
             || event.featureTypeId === 'living-room-count'
             || event.featureTypeId === 'office-count'
             || event.featureTypeId === 'other-room-count' )
        {
            populateRoomMapFromFeatureValueByTypeIdMap();
        }

        if ( event.featureTypeId === 'room-area'
             || event.featureTypeId === 'property-area'
             || event.featureTypeId === 'garden-area'
             || event.featureTypeId === 'balcony-area'
             || event.featureTypeId === 'terrace-area' )
        {
            let totalPropertyArea =
                Number( propertyFeatureByTypeIdMap[ 'room-area' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'garden-area' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'balcony-area' ]?.value ?? 0 )
                + Number( propertyFeatureByTypeIdMap[ 'terrace-area' ]?.value ?? 0 );

            if ( propertyFeatureByTypeIdMap[ 'property-area' ] === undefined )
            {
                propertyFeatureByTypeIdMap[ 'property-area' ] = { typeId: 'property-area', value: 0, isPromoted: false };
            }

            if ( propertyFeatureByTypeIdMap[ 'property-area' ].value < totalPropertyArea )
            {
                propertyFeatureByTypeIdMap[ 'property-area' ].value = totalPropertyArea;
            }
        }
    }

    // ~~

    function populatePropertyFeatureByTypeIdMapFromFeatureArray(
        )
    {
        for ( let feature of property.featureArray )
        {
            propertyFeatureByTypeIdMap[ feature.typeId ] = feature;
            delete propertyFeatureByTypeIdMap[ feature.typeId ].type;

            if ( feature.typeId.includes( 'count' ) || feature.typeId.includes( 'area' ) )
            {
                if ( isNaN( Number( feature.value ) ) )
                {
                    propertyFeatureByTypeIdMap[ feature.typeId ].value = Number( Boolean( feature.value ) );
                }
                else
                {
                    propertyFeatureByTypeIdMap[ feature.typeId ].value = Number( feature.value );
                }
            }
        }
    }

    // ~~

    function createDefaultRoomObject(
        )
    {
        let roomObject = {};

        for ( let bedType of bedTypeArray )
        {
            roomObject[ bedType.id ] = 0;
        }

        return roomObject;
    };

    // ~~

    function populateRoomMapFromFeatureValueByTypeIdMap(
        )
    {
        let bedroomCount = Number( propertyFeatureByTypeIdMap[ 'bedroom-count' ]?.value );
        let livingRoomCount = Number( propertyFeatureByTypeIdMap[ 'living-room-count']?.value );
        let officeCount = Number( propertyFeatureByTypeIdMap[ 'office-count' ]?.value );
        let otherRoomCount = Number( propertyFeatureByTypeIdMap[ 'other-room-count' ]?.value );
        roomMap[ 'bedroom-array' ] = Array.from( { length: bedroomCount }, createDefaultRoomObject );
        roomMap[ 'living-room-array' ] = Array.from( { length: livingRoomCount }, createDefaultRoomObject );
        roomMap[ 'office-array' ] = Array.from( { length: officeCount }, createDefaultRoomObject );
        roomMap[ 'other-room-array' ] = Array.from( { length: otherRoomCount }, createDefaultRoomObject );
    }

    // ~~

    function validateStep(
        )
    {
        errorArray = [];

        if ( activeStep === 1 )
        {
            if ( !property.typeId )
            {
                toast.error( 'property-warning-property-type' );

                return true;
            }

            if ( !propertyFeatureByTypeIdMap[ 'property-area' ] || propertyFeatureByTypeIdMap[ 'property-area' ].value < 1 )
            {
                toast.error( 'property-warning-total-area' );

                return true;
            }

            if ( !property.heatingTypeId )
            {
                toast.error( 'property-warning-heating-type' );

                return true;
            }

            if ( !property.energyDiagnosisId )
            {
                toast.error( 'property-warning-energy-diagnosis' );

                return true;
            }
        }
        else if ( activeStep === 2 )
        {
            if ( !property.countryCode )
            {
                toast.error( 'property-warning-country' );

                return true;
            }

            if ( !property.cityId )
            {
                toast.error(  'property-warning-city' );

                return true;
            }

            if ( property.showsPreciseLocation )
            {
                if ( !property.latitude || !property.longitude )
                {
                    toast.error( 'property-warning-latitude-longitude' );

                    return true;
                }
            }

            if ( !property.streetName )
            {
                toast.error( 'property-warning-street-name' );

                return true;
            }

            if ( !property.buildingNumber )
            {
                toast.error( 'property-warning-building-number' );

                return true;
            }
        }
        else if ( activeStep === 3 )
        {
            if ( Object.entries( propertyFeatureByTypeIdMap ).length === 0 )
            {
                toast.error( 'property-warning-features' );

                return true;
            }
        }
        else if ( activeStep === 5 )
        {
            if ( !property.isAvailableForShortTerm && !property.isAvailableForLongTerm  )
            {
                toast.error( 'property-warning-term' );

                return true;
            }

            if ( !( 'cancellation-policy' in propertyFeatureByTypeIdMap ) )
            {
                toast.error( 'cancellation-policy-warning-message' );

                return true;
            }
        }
        else if ( activeStep === 8 )
        {
            if ( !property.rentalTypeId )
            {
                toast.error( 'property-warning-rental-type' );

                return true;
            }

            if ( !property.shortTermDailyPrice )
            {
                toast.error( 'property-warning-daily-price' );

                return true;
            }

            if ( !property.shortTermExtendedStayDailyPrice )
            {
                toast.error( 'property-warning-weekly-daily-price' );

                return true;
            }

            if ( !property.shortTermProlongedStayDailyPrice )
            {
                toast.error( 'property-warning-monthly-daily-price' );

                return true;
            }
        }
        else if ( activeStep === 9 )
        {
            if ( !property.title )
            {
                toast.error( 'property-warning-title' );

                return true;
            }

            if ( !property.description )
            {
                toast.error( 'property-warning-description' );

                return true;
            }

            if ( hasPhoneNumber( property.title ) )
            {
                toast.error( 'property-warning-title-phone-number' );

                return true;
            }

            if ( hasPhoneNumber( property.description ) )
            {
                toast.error( 'property-warning-description-phone-number' );

                return true;
            }
        }
        else if ( activeStep === 10 )
        {
            if ( property.imagePathArray.length < 6 )
            {
                toast.error( 'property-warning-images-length' );

                return true;
            }
        }

        if ( errorArray.length )
        {
            return true;
        }

        return false;
    }

    // ~~

    async function handleSubmit(
        e
        )
    {
        let foundErrors = validateStep();

        if ( foundErrors )
        {
            return false;
        }
        else
        {
            if ( activeStep !== 10 )
            {
                goToNextStep();
            }
            else
            {
                delete property.featureByIdMap;
                delete property.featureArray;

                if ( e.submitter === null )
                {
                    property.statusId = 'offline';
                }
                else
                {
                    property.statusId = 'online'
                }

                isSubmitting = true;
                let response
                    = await fetch(
                        hostUrl + '/api/set-ad',
                        {
                            method: 'POST',
                            credentials: 'include',
                            body:
                                getJsonText(
                                    {
                                        property,
                                        propertyFeatureByTypeIdMap,
                                        roomMap,
                                        type: propertyId ? 'edit' : null
                                    }
                                    )
                        }
                        );

                if ( response.ok )
                {
                    let data = await response.text();
                    propertyId = data;
                    isSuccessModalOpen = true;
                }
                else
                {
                    errorArray = [];
                    let result = await response.json();
                    toast.error( result.error );
                    activeStep = 1;
                    shortTermStepIndex = 0;
                    longTermStepIndex = 0;
                }

                isSubmitting = false;
            }
        }
    }

    // ~~

    function hasPhoneNumber(
        value
        )
    {
        return ( /(\d{7,})/ ).test( value.replace( /[\s()+\-\.]|ext/gi, '' ) );
    }

    // ~~

    function updateLongTermMonthlySalaryRequested(
        )
    {
        property.requiredLongTermMonthlyIncome = Number( ( property.longTermMonthlyPrice * 3.33335 ).toFixed( 2 ) );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( propertyId !== null )
            {
                let pageData = await fetchData( '/api/page/ads/' + propertyId, { method: 'POST', credentials: 'include' } );

                property = pageData.property;
                let bedArray = pageData.bedArray;
                let spaceArray = pageData.spaceArray;
                heatingTypeArray = pageData.heatingTypeArray;
                energyDiagnosisArray = pageData.energyDiagnosisArray;
                spaceTypeMap = pageData.spaceTypeMap;
                bedTypeArray = pageData.bedTypeArray;
                documentTypeArray = pageData.documentTypeArray;

                populatePropertyFeatureByTypeIdMapFromFeatureArray();
                populateRoomMapFromFeatureValueByTypeIdMap();

                let newRoomMap = {};

                for ( let space of spaceArray )
                {
                    if ( newRoomMap[ space.typeId ] === undefined )
                    {
                        newRoomMap[ space.typeId ] = [];
                    }

                    newRoomMap[ space.typeId ].push( space.id );
                }

                for ( let bed of bedArray )
                {
                    let spaceTypeArray = [ 'bedroom', 'living-room', 'office', 'other-room' ];

                    for ( let spaceType of spaceTypeArray )
                    {
                        if ( newRoomMap[ spaceType ] !== undefined )
                        {
                            let key = spaceType + '-array';
                            let spaceIndex = newRoomMap[ spaceType ].indexOf( bed.spaceId );

                            if ( spaceIndex >= 0 )
                            {
                                if ( roomMap[ key ][ spaceIndex ] === undefined )
                                {
                                    if ( !propertyFeatureByTypeIdMap[ spaceType + '-count' ] )
                                    {
                                        propertyFeatureByTypeIdMap[ spaceType + '-count' ] =
                                            {
                                                typeId: spaceType + '-count',
                                                value: 0,
                                                isPromoted: false
                                            };
                                    }

                                    propertyFeatureByTypeIdMap[ spaceType + '-count' ].value = spaceIndex + 1;
                                    roomMap[ key ][ spaceIndex ] = createDefaultRoomObject();
                                }

                                roomMap[ key ][ spaceIndex ][ bed.typeId ] = bed.count;
                            }
                        }
                    }
                }
            }
            else
            {
                let pageData = await fetchData( '/api/page/ads/new', { method: 'POST', credentials: 'include' } );
                heatingTypeArray = pageData.heatingTypeArray;
                energyDiagnosisArray = pageData.energyDiagnosisArray;
                spaceTypeMap = pageData.spaceTypeMap;
                bedTypeArray = pageData.bedTypeArray;
                documentTypeArray = pageData.documentTypeArray;
            }

            isLoading = false
        }
        );

    // ~~

    $:
    {
        property.longTermMonthlyPrice;
        updateLongTermMonthlySalaryRequested();
    }

    // ~~

    $:
    {
        if ( activeStep === 10 && property.imagePathArray.length > 5 )
        {
            buttonTextSlug = 'submit-label';
        }
        else
        {
            buttonTextSlug = 'next-label';
        }
    }

    // ~~

    $: property.isAvailableForShortTerm =
        String( propertyFeatureByTypeIdMap[ 'is-furnished' ]?.value ) === 'true'
        ? property.isAvailableForShortTerm
        : false;

    // ~~

    $:
    {
        let stepDirection =
            activeStep > previousStep
            ? 'forward'
            : activeStep < previousStep
            ? 'backward'
            : null;
        transitionDirection =
            stepDirection === 'forward'
            ? 50
            : ( stepDirection === 'backward' ? -50 : 0 );
        previousStep = activeStep;
    }

    // ~~

    $: transitionDirection;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';

    // -- CLASSES

    .loading-container
    {
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'new-ad-page-title', $languageTagStore ) }
    </title>
</svelte:head>

<SecondaryHeader
    handleBack={ goToPreviousStep }
    bind:activeStep={ activeStep }
/>
{#if isLoading }
    <div class="loading-container" >
        <Loading/>
    </div>
{:else}
    <form
        bind:this={ form }
        on:submit|preventDefault={ handleSubmit }
    >
        <div class="ad-page-container">
            {#each errorArray as error }
                {#key errorArray }
                    <Error error={ error }/>
                {/key}
            {/each}
            <Success success={ successMessage }/>
            {#key activeStep}
                <div
                    in:flyFade={ { x: transitionDirection } }
                    class="display-flex flex-direction-column gap-150"
                >
                    {#if activeStep === 1 }
                        <AdPageStep1
                            propertyTypeArray={ propertyTypeArray }
                            heatingTypeArray={ heatingTypeArray }
                            energyDiagnosisArray={ energyDiagnosisArray }
                            handleFeatureChange={ handleFeatureChange }
                            bind:property={ property }
                            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                        />
                    {:else if activeStep === 2 }
                        <AdPageStep2
                            countryArray={ countryArray }
                            cityArray={ cityArray }
                            bind:countryCode={ property.countryCode }
                            bind:countryName={ property.countryName }
                            bind:cityId={ property.cityId }
                            bind:cityName={ property.cityName }
                            bind:streetName={ property.streetName }
                            bind:buildingNumber={ property.buildingNumber }
                            bind:apartmentNumber={ property.apartmentNumber }
                            bind:propertyTypeId={ property.typeId }
                            bind:showsPreciseLocation={ property.showsPreciseLocation }
                            bind:latitude={ property.latitude }
                            bind:longitude={ property.longitude }
                            bind:errorArray={ errorArray }
                            bind:missingFields={ missingLocationFields }
                            on:addressValidationSuccess={ () => isAddressValid = true }
                        />
                    {:else if activeStep === 3 }
                        <AdPageStep3
                            handleFeatureChange={ handleFeatureChange }
                            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                        />
                    {:else if activeStep === 4 }
                        <AdPageStep4
                            bedTypeArray={ bedTypeArray }
                            spaceTypeMap={ spaceTypeMap }
                            handleFeatureChange={ handleFeatureChange }
                            bind:roomMap={ roomMap }
                            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                        />
                    {:else if activeStep === 5 }
                        <AdPageStep5
                            handleFeatureChange={ handleFeatureChange }
                            bind:property={ property }
                            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                        />
                    {:else if activeStep === 6 }
                        <AdPageStep6
                            handleFeatureChange={ handleFeatureChange }
                            bind:property={ property }
                            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                        />
                    {:else if activeStep === 7 }
                        <AdPageStep7
                            documentTypeArray={ documentTypeArray }
                            handleFeatureChange={ handleFeatureChange }
                            bind:property={ property }
                            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                        />
                    {:else if activeStep === 8 }
                        <AdPageStep8
                            rentalTypeArray={ rentalTypeArray }
                            handleFeatureChange={ handleFeatureChange }
                            bind:property={ property }
                            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                        />
                    {:else if activeStep === 9 }
                        <AdPageStep9
                            bind:property={ property }
                            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                        />
                    {:else if activeStep === 10 }
                        <FileInputSection bind:fileArray={ property.imagePathArray } />
                    {/if}
                </div>
            {/key}
        </div>
        <div class="ad-page-button-container">
            <ModalButton
                type="button"
                variant="light"
                text={ getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
                fullWidth={ false }
                disabled={ activeStep !== 10 || isSubmitting }
                on:click={ () => form.requestSubmit() }
            />
            <ModalButton
                type="submit"
                text={ getLocalizedTextBySlug( buttonTextSlug, $languageTagStore ) }
                fullWidth={ false }
                bind:isLoading={ isSubmitting }
            />
        </div>
    </form>
    {#if isSuccessModalOpen }
        <SuccessModal
            propertyId={ propertyId }
            bind:isOpen={ isSuccessModalOpen }
        />
    {/if}
{/if}
