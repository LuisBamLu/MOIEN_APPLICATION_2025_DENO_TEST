<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Switch from 'senselogic-flow/Switch.svelte';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import AccountBankingInformationAccountModal from '$component/page/account/AccountBankingInformationAccountModal.svelte';

    // -- VARIABLES

    export let isOpen = false;
    export let onClose = () => {};
    let selectedAccount = '';
    let isBeneficiaryModalOpen = false;
    let automaticTransfer = true;
    let amountToTransfer = 3000;
    let communication = 'Denis Dimitrov - 10 rue Lou Koster - Rent payment - Aug 20230';
    let transferToAccountStepArray = [ 'selectAccount', 'confirmAccount', 'success', 'error' ];
    let activeStep = 0;
    let accountCreditArray =
        [
            {
                id: crypto.randomUUID(),
                beneficiary: 'M. Olivier RAGUIN',
                number: 'FR 6789 7889 4567 8956 4567',
                bank: 'WB02084',
            },
            {
                id: crypto.randomUUID(),
                beneficiary: 'M. Olivier RAGUIN 2',
                number: 'FR 4567 7889 8956 4567 6789',
                bank: 'WB02084',
            },
            {
                id: crypto.randomUUID(),
                beneficiary: 'Fabiano Test',
                number: 'FR 1234 4567 7890 4567 6789',
                bank: 'TEST',
            }
        ];
    let selectedBeneficiary = {};
    let isLoading = true;

    // -- CONSTANTS

    const accountCreditCount = accountCreditArray.length;

    // -- FUNCTIONS

    function handleToggleBeneficiaryModalOpen(
        )
    {
        isBeneficiaryModalOpen = !isBeneficiaryModalOpen;
    }

    // ~~

    function handleNextStep(
        )
    {
        if ( activeStep + 1 < transferToAccountStepArray.length )
        {
            activeStep += 1;
        }
    }

    // ~~

    function getBeneficiaryAccount(
        )
    {
        selectedBeneficiary =
        {
            bankAccount: accountCreditArray.find( account => account.Id === selectedAccount ),
            amountToTransfer,
            communication
        };
    }

    // -- STATEMENTS

    $:
    {
        selectedAccount;
        getBeneficiaryAccount();
    }

    // ~~

    onMount(
        async () =>
        {
            let data
                = await fetchData(
                    '/api/get-payment-method-map',
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                    );
            accountCreditArray = data.bankAccountArray;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .account-finance-statistics-content
    {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
        align-self: stretch;
    }

    .account-finance-statistics-content-title
    {
        padding-bottom: 0.25rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        align-self: stretch;
    }

    .account-finance-statistics-account-item
    {
        border: 2px solid grayColor800;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        gap: 0.75rem;
        align-items: center;
        align-self: stretch;

        background: grayColor950;
    }

    .account-finance-statistics-account-item-detail
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        align-items: flex-start;
    }

    .account-finance-statistics-account-item-radio
    {
        accent-color: greenColor500;
        outline: none;
        height: 1rem;
        width: 1rem;
        border: none;

        background: white;
    }

    .account-finance-statistics-account-item.is-default
    {
        border: 2px solid greenColor900;

        background: greenColor900;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .account-finance-statistics-button
    {
        height: 3.5rem;
        border-radius: 0.5rem;
        padding: 0.75rem 2.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;
    }

    .account-finance-statistics-account-amount-input
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 6px;
        align-items: flex-start;
    }

    .account-finance-statistics-account-amount-input,
    .account-finance-statistics-account-item-detail,
    .account-finance-statistics-account-item-detail span,
    .account-finance-statistics-account-item-detail input
    {
        width: 100%;
    }

    .account-finance-statistics-account-item-detail input
    {
        outline: none;
    }

    .account-finance-statistics-account-item-detail:focus-within
    {
        border-bottom: 2px solid greenColor500;
    }

    .account-finance-statistics-account-switch
    {
        padding: 1rem 0px;

        display: flex;
        gap: 0.75rem;
        align-items: center;
        align-self: stretch;
    }

    .account-finance-statistics-account-switch > span
    {
        width: 100%;
    }

    .is-account-credit-empty
    {
        height: 9rem;
        width: 100%;
        border: 2px solid blueColor900;
        border-radius: 1rem;
        padding: 1rem 1.5rem;

        background: blueColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: blueColor300;
    }

    :global( .transfer-to-account-feedback-modal)
    {
        padding: 2rem 1.5rem;
        padding-bottom: 16.25rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        align-self: stretch;
    }

    :global( .transfer-to-account-error-modal )
    {
        background: redColor900;
    }

    :global( .transfer-to-account-success-modal )
    {
        background: greenColor900;
    }

    .transfer-to-account-error-text
    {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-self: stretch;

        font-size: 0.75rem;
    }

    .text-align-center
    {
        text-align: center;
    }
</style>

<ModalRoot isOpen={ transferToAccountStepArray[ activeStep ] === 'selectAccount' && isOpen }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'account-balance-transfer-to-banking-information-account-modal-account-label', $languageTagStore ) }
        onClose={ onClose }
    />
    <ModalContent>
        <div class="account-finance-statistics-content">
            <span class="account-finance-statistics-content-title font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'transfer-to-account-modal-choose-the-account-to-credit-label', $languageTagStore ) }
            </span>
            {#if isLoading }
                <Loading />
            {:else}
                {#each accountCreditArray as accountCredit }
                    <label
                        class="account-finance-statistics-account-item"
                        class:is-default={ selectedAccount === accountCredit.Id }
                    >
                        <div class="account-finance-statistics-account-item-detail">
                            <span class="font-size-90 font-weight-700 color-gray-100">
                                { accountCredit.OwnerName }
                            </span>
                            <span class="font-size-75 font-weight-500 color-gray-100">
                                { accountCredit.IBAN } &#x2022; { accountCredit.BIC }
                            </span>
                        </div>
                        <input
                            value={ accountCredit.Id }
                            bind:group={ selectedAccount }
                            name="selectedAccount"
                            class="account-finance-statistics-account-item-radio"
                            type="radio"
                        >
                    </label>
                {/each}
            {/if}
        </div>
        <button
            on:click={ handleToggleBeneficiaryModalOpen }
            class="account-finance-statistics-button font-size-100 font-weight-700 color-blue"
            class:is-account-credit-empty={ accountCreditCount === 0 }
        >
            <div class="blue-plus-circle-icon size-150"></div>
            { getLocalizedTextBySlug( 'transfer-to-account-modal-add-a-beneficiary-label', $languageTagStore ) }
        </button>
        <div class="account-finance-statistics-content">
            <div class="account-finance-statistics-content-title">
                <span class="font-size-100 font-weight-700 color-gray-100">
                    { getLocalizedTextBySlug( 'transfer-to-account-modal-amount-label', $languageTagStore ) }
                </span>
                <span class="font-size-75 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'account-page-amount-must-be-greater-than-text', $languageTagStore ) }
                </span>
            </div>
            <label class="account-finance-statistics-account-amount-input">
                <div class="account-finance-statistics-account-item-detail">
                    <span class="font-size-90 font-weight-500 color-gray-100">
                        { getLocalizedTextBySlug( 'transfer-to-account-modal-automatic-banking-label', $languageTagStore ) }
                    </span>
                    <input
                        class="font-size-75 font-weight-500 color-gray"
                        name="amounToTransfer"
                        bind:value={ amountToTransfer }
                    />
                </div>
            </label>
            <label class="account-finance-statistics-account-amount-input">
                <div class="account-finance-statistics-account-item-detail">
                    <span class="font-size-90 font-weight-500 color-gray-100">
                        { getLocalizedTextBySlug( 'transfer-to-account-modal-communication-label', $languageTagStore ) }
                    </span>
                    <input
                        class="font-size-75 font-weight-500 color-gray"
                        name="communication"
                        bind:value={ communication }
                    />
                </div>
            </label>
            <div class="account-finance-statistics-account-switch">
                <span class="font-size-90 font-weight-700 color-gray-300">
                    { getLocalizedTextBySlug( 'transfer-to-account-modal-automatic-banking-label', $languageTagStore ) }
                </span>
                <Switch value={ automaticTransfer }/>
            </div>
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton
            variant="light"
            text={ getLocalizedTextBySlug( 'cancel-label', $languageTagStore ) }
            on:click={ onClose }
        />
        <ModalButton
            variant="contained"
            text={ getLocalizedTextBySlug( 'onboarding-next-label', $languageTagStore ) }
            on:click={ handleNextStep }
            disabled={ !selectedAccount }
        />
    </ModalActions>
</ModalRoot>
<AccountBankingInformationAccountModal
    onClose={ handleToggleBeneficiaryModalOpen }
    isOpen={ isBeneficiaryModalOpen }
/>
<AccountBankingInformationAccountModal
    onClose={ () => { activeStep = 0; } }
    isOpen={ transferToAccountStepArray[ activeStep ] === 'confirmAccount' }
    account={ selectedBeneficiary }
    handleTransfer={ handleNextStep }
/>
<ModalRoot isOpen={ transferToAccountStepArray[ activeStep ] === 'success' }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'account-transfer-to-account-modal-success-title', $languageTagStore ) }
        onClose={ () => ( activeStep = 0 ) }
    />
    <ModalContent className="transfer-to-account-feedback-modal transfer-to-account-success-modal">
        <img src="/image/supporting-documents/heading.svg" alt="">
        <div class="transfer-to-account-error-text">
            <span class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'account-transfer-to-account-modal-success-label', $languageTagStore ) }
            </span>
            <span class="font-size-75 font-weight-500 color-gray text-align-center">
                {
                    getLocalizedTextBySlug(
                        'account-transfer-to-account-modal-success-text',
                        { beneficiaryName: selectedBeneficiary.beneficiary },
                        $languageTagStore
                        )
                }
            </span>
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton
            variant="contained"
            text={ getLocalizedTextBySlug( 'account-transfer-to-account-modal-success-button', $languageTagStore ) }
            on:click={  () => { onClose(); activeStep = 0; } }
        />
    </ModalActions>
</ModalRoot>
<ModalRoot isOpen={ transferToAccountStepArray[ activeStep ] === 'error' }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'account-transfer-to-account-modal-error-label', $languageTagStore ) }
        onClose={ () => ( activeStep = 0 ) }
    />
    <ModalContent className="transfer-to-account-feedback-modal transfer-to-account-error-modal">
        <img src="/image/supporting-documents/heading.svg" alt="">
        <div class="transfer-to-account-error-text">
            <span class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'account-transfer-to-account-modal-error-label', $languageTagStore ) }
            </span>
            <span class="font-size-75 font-weight-500 color-gray text-align-center">
                {
                    getLocalizedTextBySlug(
                        'account-transfer-to-account-modal-error-text',
                        { beneficiaryName: selectedBeneficiary.beneficiary },
                        $languageTagStore
                        )
                }
            </span>
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton
            variant="error"
            text={ getLocalizedTextBySlug( 'account-transfer-to-account-modal-error-button', $languageTagStore ) }
            on:click={  () => { activeStep = 1; } }
        />
    </ModalActions>
</ModalRoot>
