<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug, getMapById } from 'senselogic-gist';
    import Switch from 'senselogic-flow/Switch.svelte';
    import { fetchData, getFormattedPrice } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import Alert from '$component/element/Alert.svelte';
    import Loading from '$component/element/Loading.svelte';
    import FormAccordion from '$component/element/FormAccordion.svelte';
    import CounterInput from '$component/element/CounterInput.svelte';
    import LabelledInput from '$component/element/LabelledInput.svelte';
    import LabelledSelect from '$component/element/LabelledSelect.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import AccountInput from '$component/page/account/AccountInput.svelte';
    import PeopleModal from '$component/page/rental-file/PeopleModal.svelte';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    let isLoading = true;
    let currencyArray = [];
    let employmentStatusArray = [];
    let isHousingModalOpen = false;
    let isSignatoryModalOpen =false;
    let leaseContract =
        {
            adultCount: 0,
            childrenCount: 0,
            infantCount: 0,
            hasPet: false
        };
    let signatoryCount = 1;
    let signatoryArray =
        [
            {
                monthlyIncome: 3000,
                employmentStatus: '',
                hasGuarantor: true
            },
        ];
    let isSubmitting = false;
    $: employmentStatusByIdMap = getMapById( employmentStatusArray );

    // -- FUNCTIONS

    function handleSignatoryCountChange(
        )
    {
        if ( signatoryArray.length < signatoryCount )
        {
            signatoryArray.push(
                {
                    monthlyIncome: 3000,
                    employmentStatus: '',
                    hasGuarantor: true
                }
                );
            signatoryArray = signatoryArray;
        }
        else
        {
            signatoryArray.pop();
            signatoryArray = signatoryArray;
        }
    }

    // ~~

    function monthlyIncomeValidation(
        )
    {
        let monthlyIncome = signatoryArray[ 0 ].monthlyIncome;
        let currency = signatoryArray[ 0 ].currency;

        if ( isNaN( monthlyIncome ) || monthlyIncome < 0 )
        {
            toast.error( 'monthly-income-not-valid-label' )
            return false
        }
        else if ( currency !== 'EUR' && currency !== 'USD' )
        {
            toast.error( 'currency-not-supported' )
            return false
        }
        else if ( monthlyIncome > 1000000000 )
        {
            toast.error( 'monthly-income-not-valid-label' )
            return false
        }
        else
        {
            return true
        }
    }

    // ~~

    async function submit(
        )
    {
        isSubmitting = true;

        let validation = monthlyIncomeValidation();

        if ( !validation )
        {
            isSubmitting = false;
            return;
        }

        let result
            = await fetchData(
                '/api/update-lease-contract/' + leaseContract.id,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                            leaseContract,
                            signatoryArray,
                            type: 'rental-file'
                        }
                        )
                }
                );

        if ( result.error )
        {
            toast.error( result.error );
        }
        else
        {
            toast.success( 'update-profile-update-successful' );
        }

        isSubmitting = false;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let pageData = await fetchData( '/api/page/rental-file', { method: 'POST', credentials: 'include' } );
            currencyArray = pageData.currencyArray;
            employmentStatusArray = pageData.employmentStatusArray;
            leaseContract = pageData.leaseContract;

            if ( pageData.signatoryArray.length )
            {
                signatoryArray = pageData.signatoryArray;
                signatoryCount = signatoryArray.length;
            }

            leaseContract.hasPet = leaseContract.hasPet ?? false;

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- CLASSES

    .rental-file-content
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .labelled-switch
    {
        padding: 1rem 0;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .monthly-income-inputs-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
</style>

{#if isLoading }
    <Loading />
{:else}
    <div class="rental-file-content" class:wait={ isSubmitting }>
        <Alert
            type="informative"
            text={ getLocalizedTextBySlug( 'rental-file-page-alert', $languageTagStore ) }
        />
        <div class="page-section-container">
            <Accordion
                label={ getLocalizedTextBySlug( 'rental-file-page-housing-people-label', $languageTagStore ) }
                helper={ getLocalizedTextBySlug( 'rental-file-page-housing-people-helper', $languageTagStore ) }
                bind:isEditing={ isHousingModalOpen }
            >
                <PeopleModal
                    label={ getLocalizedTextBySlug( 'rental-file-page-housing-people-label', $languageTagStore ) }
                    bind:isOpen={ isHousingModalOpen }
                    bind:leaseContract={ leaseContract }
                />
            </Accordion>
            <Accordion
                label={ getLocalizedTextBySlug( 'rental-file-page-lease-signatories-label', $languageTagStore ) }
                helper={ getLocalizedTextBySlug( 'rental-file-page-housing-people-helper', $languageTagStore ) }
                bind:isEditing={ isSignatoryModalOpen }
            >
                <CounterInput
                    minCount={ 1 }
                    maxCount={ Math.max( 5, leaseContract.adultCount ) }
                    bind:count={ signatoryCount }
                    on:change={ handleSignatoryCountChange }
                />
            </Accordion >
            <div class="labelled-switch">
                <div class="font-size-90 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'guest-pet-label', $languageTagStore ) }
                </div>
                <Switch bind:value={ leaseContract.hasPet } />
            </div>
        </div>
        <div class="page-section-container">
            <div class="font-size-100 font-weight-700 color-gray-100">
                {#if signatoryArray.length < 2 }
                    { getLocalizedTextBySlug( 'rental-file-page-signatory-information-label', $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'rental-file-page-signatories-information-label', $languageTagStore ) }
                {/if}
            </div>
            {#if signatoryArray.length < 2 }
                <AccountInput
                    hasButton={ false }
                    label={ getLocalizedTextBySlug( 'rental-file-page-monthly-income-label', $languageTagStore ) }
                    editable={ true }
                    initialValue=
                        {
                            typeof signatoryArray[ 0 ].monthlyIncome === 'number'
                            ? getFormattedPrice(
                                signatoryArray[ 0 ].monthlyIncome,
                                $languageTagStore,
                                signatoryArray[ 0 ].currency ?? 'EUR'
                                )
                            : null
                        }
                >
                    <div class="monthly-income-inputs-container">
                        <LabelledInput
                            label={ getLocalizedTextBySlug( 'transfer-to-account-modal-amount-label', $languageTagStore ) }
                            bind:value={ signatoryArray[ 0 ].monthlyIncome }
                        />
                        <LabelledSelect
                            label={ getLocalizedTextBySlug( 'ad-search-currency-label', $languageTagStore ) }
                            bind:value={ signatoryArray[ 0 ].currency }
                        >
                            {#each currencyArray as currency }
                                <option value={ currency.code }>
                                    { getLocalizedText( currency.singularName ) } { currency.symbol }
                                </option>
                            {/each}
                        </LabelledSelect>
                        <div class="font-size-75 font-weight-500 color-gray-300">
                            { getLocalizedTextBySlug( 'rental-file-page-monthly-income-helper', $languageTagStore ) }
                        </div>
                    </div>
                </AccountInput>
                <AccountInput
                    hasButton={ false }
                    label={ getLocalizedTextBySlug( 'rental-file-page-work-status-label', $languageTagStore ) }
                    helper={ getLocalizedTextBySlug( 'rental-file-page-work-status-helper', $languageTagStore ) }
                    editable={ true }
                    initialValue=
                        {
                            getLocalizedText(
                                employmentStatusByIdMap[ signatoryArray[ 0 ].employmentStatus ]
                                    ? employmentStatusByIdMap[ signatoryArray[ 0 ].employmentStatus ].name
                                    : '',
                                $languageTagStore
                                )
                        }
                >
                    <LabelledSelect
                        label={ getLocalizedTextBySlug( 'rental-file-page-work-status-label', $languageTagStore ) }
                        bind:value={ signatoryArray[ 0 ].employmentStatus }
                    >
                        {#each employmentStatusArray as employmentStatus }
                            <option value={ employmentStatus.id }>
                                { getLocalizedText( employmentStatus.name, $languageTagStore ) }
                            </option>
                        {/each}
                    </LabelledSelect>
                </AccountInput>
                <div class="labelled-switch">
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getLocalizedTextBySlug( 'rental-file-page-signatory-has-a-guarantor-label', $languageTagStore ) }
                    </div>
                    <Switch bind:value={ signatoryArray[ 0 ].hasGuarantor } />
                </div>
            {:else}
                {#each signatoryArray as signatory, index }
                    <FormAccordion
                        label="{ getLocalizedTextBySlug( 'rental-file-page-signatory-label', $languageTagStore ) } { index + 1 }"
                    >
                        <AccountInput
                            label={ getLocalizedTextBySlug( 'rental-file-page-monthly-income-label', $languageTagStore ) }
                            editable={ true }
                            initialValue=
                                {
                                    signatory.monthlyIncome
                                    ? getFormattedPrice(
                                        signatory.monthlyIncome,
                                        $languageTagStore,
                                        signatory.currency ?? 'EUR'
                                        )
                                    : null
                                }
                        >
                            <div class="monthly-income-inputs-container">
                                <LabelledInput
                                    label={ getLocalizedTextBySlug( 'transfer-to-account-modal-amount-label', $languageTagStore ) }
                                    bind:value={ signatory.monthlyIncome }
                                />
                                <LabelledSelect
                                    label={ getLocalizedTextBySlug( 'ad-search-currency-label', $languageTagStore ) }
                                    value={ 'EUR' }
                                >
                                    {#each currencyArray as currency }
                                        <option value={ currency.code }>
                                            { getLocalizedText( currency.singularName ) } { currency.symbol }
                                        </option>
                                    {/each}
                                </LabelledSelect>
                                <div class="font-size-75 font-weight-500 color-gray-300">
                                    { getLocalizedTextBySlug( 'rental-file-page-monthly-income-helper', $languageTagStore ) }
                                </div>
                            </div>
                        </AccountInput>
                        <AccountInput
                            label={ getLocalizedTextBySlug( 'rental-file-page-work-status-label', $languageTagStore ) }
                            helper={ getLocalizedTextBySlug( 'rental-file-page-work-status-helper', $languageTagStore ) }
                            editable={ true }
                            initialValue=
                                {
                                    getLocalizedText(
                                        employmentStatusByIdMap[ signatory.employmentStatus ]
                                        ? employmentStatusByIdMap[ signatory.employmentStatus ].name
                                        : '',
                                        $languageTagStore
                                        )
                                }
                        >
                            <LabelledSelect
                                label={ getLocalizedTextBySlug( 'rental-file-page-work-status-label', $languageTagStore ) }
                                bind:value={ signatory.employmentStatus }
                            >
                                {#each employmentStatusArray as employmentStatus }
                                    <option value={ employmentStatus.id }>
                                        { getLocalizedText( employmentStatus.name, $languageTagStore ) }
                                    </option>
                                {/each}
                            </LabelledSelect>
                        </AccountInput>
                        <div class="labelled-switch">
                            <div class="font-size-90 font-weight-500 color-gray-300">
                                { getLocalizedTextBySlug( 'rental-file-page-signatory-has-a-guarantor-label', $languageTagStore ) }
                            </div>
                            <Switch bind:value={ signatory.hasGuarantor } />
                        </div>
                    </FormAccordion>
                {/each}
            {/if}
        </div>
        <div class="display-flex justify-content-center">
            <ModalButton
                fullWidth={ false }
                text={ getLocalizedTextBySlug( 'submit-label', $languageTagStore ) }
                isLoading={ isSubmitting }
                on:click={ submit }
            />
        </div>
    </div>
{/if}
