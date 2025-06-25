<script>
    // -- IMPORTS

    import { getNormalCaseFromSnakeCaseString, inputTypeFromDataTypeMap } from '$lib/base';
    import { getLocalizedText, isBoolean } from 'senselogic-gist';
    import LabelledSelect from '$component/element/LabelledSelect.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import Input from '$component/element/Input.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import PropertyRequiredDocumentInput from './PropertyRequiredDocumentInput.svelte';

    // -- VARIABLES

    /** @type {{property: any, propertyTypeArray: any, heatingTypeArray: any, energyDiagnosisArray: any, propertyStatusArray: any, rentalTypeArray: any}} */
    let {
        property = $bindable(),
        propertyTypeArray,
        heatingTypeArray,
        energyDiagnosisArray,
        propertyStatusArray,
        rentalTypeArray
    } = $props();
</script>

<div class="display-flex flex-direction-column gap-100 margin-top-100">
    {#each Object.entries( property ) as [ fieldName, fieldValue ] }
        {#if !fieldName.includes( 'Array' )
            && fieldName !== 'imagePath'
            && fieldName !== 'featureByIdMap'
            && fieldName !== 'id'
            && fieldName !== 'creationTimestamp'
            && fieldName !== 'updateTimestamp'
            && fieldName !== 'managerUserId'
            && fieldName !== 'userId'
            && fieldName !== 'date'
            && fieldName !== 'countryCode'
            && fieldName !== 'countryName'
            && fieldName !== 'cityId'
            && fieldName !== 'cityName'
            && fieldName !== 'streetName'
            && fieldName !== 'buildingNumber'
            && fieldName !== 'apartmentNumber'
            && fieldName !== 'showsPreciseLocation'
            && fieldName !== 'latitude'
            && fieldName !== 'longitude'
        }
            {#if fieldName === 'title' || fieldName === 'description' }
                <InputLocalizedForm
                    languageArray={ $languageArrayStore }
                    itemsString={ fieldValue }
                    isMultiLine={ fieldName === 'description' }
                    on:update={ ( event ) => property[ fieldName ] = event.detail.text  }
                />
            {:else if fieldName === 'typeId' }
                <LabelledSelect
                    label={ getNormalCaseFromSnakeCaseString( fieldName ) }
                    bind:value={ property.typeId }
                >
                    {#each propertyTypeArray as propertyType }
                        <option value={ propertyType.id }>
                            { getLocalizedText( propertyType.name, $languageTagStore ) }
                        </option>
                    {/each}
                </LabelledSelect>
            {:else if fieldName === 'heatingTypeId' }
                <LabelledSelect
                    label={ getNormalCaseFromSnakeCaseString( fieldName ) }
                    bind:value={ property.heatingTypeId }
                >
                    {#each heatingTypeArray as heatingType }
                        <option value={ heatingType.id }>
                            { getLocalizedText( heatingType.name, $languageTagStore ) }
                        </option>
                    {/each}
                </LabelledSelect>
            {:else if fieldName === 'energyDiagnosisId' }
                <LabelledSelect
                    label={ getNormalCaseFromSnakeCaseString( fieldName ) }
                    bind:value={ property.energyDiagnosisId }
                >
                    {#each energyDiagnosisArray as energyDiagnosis }
                        <option value={ energyDiagnosis.id }>
                            { getLocalizedText( energyDiagnosis.name, $languageTagStore ) }
                        </option>
                    {/each}
                </LabelledSelect>
            {:else if fieldName === 'statusId' }
                <LabelledSelect
                    label={ getNormalCaseFromSnakeCaseString( fieldName ) }
                    bind:value={ property.statusId }
                >
                    {#each propertyStatusArray as propertyStatus }
                        <option value={ propertyStatus.id }>
                            { getLocalizedText( propertyStatus.name, $languageTagStore ) }
                        </option>
                    {/each}
                </LabelledSelect>
            {:else if fieldName === 'rentalTypeId' }
                <LabelledSelect
                    label={ getNormalCaseFromSnakeCaseString( fieldName ) }
                    bind:value={ property.rentalTypeId }
                >
                    {#each rentalTypeArray as rentalType }
                        <option value={ rentalType.id }>
                            { getLocalizedText( rentalType.name, $languageTagStore ) }
                        </option>
                    {/each}
                </LabelledSelect>
            {:else if fieldName === 'requiredLongTermDocumentTypeIdList' }
                <PropertyRequiredDocumentInput bind:requiredDocumentTypeIdArray={ property.requiredLongTermDocumentTypeIdList } />
            {:else}
                {#if isBoolean( fieldValue ) }
                    <LabelledSwitch label={ getNormalCaseFromSnakeCaseString( fieldName ) } bind:value={ property[ fieldName ] } />
                {:else}
                    <Input
                        name={ fieldName }
                        label={ getNormalCaseFromSnakeCaseString( fieldName ) }
                        type={ inputTypeFromDataTypeMap[ typeof fieldValue ] ?? 'text' }
                        bind:value={ property[ fieldName ] }
                    />
                {/if}
            {/if}
        {/if}
    {/each}
</div>
