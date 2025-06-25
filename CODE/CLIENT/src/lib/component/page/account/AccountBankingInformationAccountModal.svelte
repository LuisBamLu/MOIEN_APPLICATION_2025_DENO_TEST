<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import AccountInput from '$component/page/account/AccountInput.svelte';

    // -- VARIABLES

    export let isOpen = false;
    export let onClose = () => {};
    export let account = {};
    let isNewAccount = Object.values( account ).length === 0;
    let form;
    let isSubmitting = false;

    // -- FUNCTIONS

    async function handleCreateAccountSubmit(
        )
    {
        let data
            = await fetchData(
                '/api/create-bank-account',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                            bankAccount:
                                {
                                    ...account,
                                    bank: 'BNPAFRPP',
                                    accountNumber: 'FR7630004000031234567890143'
                                }
                        }
                    )
                }
                );

       isOpen = false;
    }

    // ~~

    async function handleCreatePayoutSubmit(
        )
    {
        isSubmitting = true;

        let data
            = await fetchData(
                '/api/create-payout',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                            ...account
                        }
                    )
                }
                );

        isSubmitting = false;

        isOpen = false;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .account-banking-information-account-content
    {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: stretch;
    }

    .account-banking-information-account-field
    {
        border-bottom: 1px solid grayColor800;
        padding: 0.75rem 0px;

        display: flex;
        gap: 0.75rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;
    }

    .account-banking-information-account-field-label
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 0.375rem;
        align-items: flex-start;
    }

    .account-banking-information-account-field-input
    {
        outline: none;
        width: 100%;
        border: none;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader title="Summery" onClose={ onClose }/>

    <ModalContent>
        {#if isNewAccount }
            <form
                class="account-banking-information-account-content"
                bind:this={ form }
                on:submit|preventDefault={ handleCreateAccountSubmit }
            >
                <div class="account-banking-information-account-field">
                    <div class="account-banking-information-account-field-label font-size-100 font-weight-500 color-black">
                        <label for="beneficiary">
                            { getLocalizedTextBySlug( 'banking-information-account-modal-beneficiary-label', $languageTagStore ) }
                        </label>
                        <input
                            id="beneficiary" name="beneficiary"
                            class="account-banking-information-account-field-input"
                            type="text"
                            bind:value={ account.ownerName }
                        >
                    </div>
                </div>
                 <div class="account-banking-information-account-field">
                    <div class="account-banking-information-account-field-label font-size-100 font-weight-500 color-black">
                        <label for="account">
                            { getLocalizedTextBySlug( 'banking-information-account-modal-account-label', $languageTagStore ) }
                        </label>
                        <input
                            value='FR7630004000031234567890143'
                            id="account"
                            name="account"
                            class="account-banking-information-account-field-input"
                            type="text"
                        >
                    </div>
                </div>
                <div class="account-banking-information-account-field">
                    <div class="account-banking-information-account-field-label font-size-100 font-weight-500 color-black">
                        <label for="bank">
                            { getLocalizedTextBySlug( 'banking-information-account-modal-bank-label', $languageTagStore ) }
                        </label>
                        <input
                            value='BNPAFRPP'
                            id="bank"
                            name="bank"
                            class="account-banking-information-account-field-input"
                            type="text"
                        >
                    </div>
                </div>
                 <div class="account-banking-information-account-field">
                    <div class="account-banking-information-account-field-label font-size-100 font-weight-500 color-black">
                        <label for="date">
                            { getLocalizedTextBySlug( 'banking-information-account-modal-date-label', $languageTagStore ) }
                        </label>
                        <input
                            id="date"
                            name="date"
                            class="account-banking-information-account-field-input"
                            type="text"
                            bind:value={ account.date }
                        >
                    </div>
                </div>
                <div class="account-banking-information-account-field">
                    <div class="account-banking-information-account-field-label font-size-100 font-weight-500 color-black">
                        <label for="communication">
                            { getLocalizedTextBySlug( 'transfer-to-account-modal-communication-label', $languageTagStore ) }
                        </label>
                        <input
                            id="communication"
                            name="communication"
                            class="account-banking-information-account-field-input"
                            type="text"
                            bind:value={ account.communication }
                        >
                    </div>
                </div>
                <div class="account-banking-information-account-field">
                    <div class="account-banking-information-account-field-label font-size-100 font-weight-500 color-black">
                        <label for="amount">
                            {
                                getLocalizedTextBySlug(
                                    'transfer-to-account-modal-amount-of-banking-information-account-modal-transfer-label',
                                    $languageTagStore
                                    )
                            }
                        </label>
                        <input
                            id="amount"
                            name="amount"
                            class="account-banking-information-account-field-input"
                            type="text"
                            bind:value={ account.amount }
                        >
                    </div>
                </div>
            </form>
        {:else}
            <form
                class="account-banking-information-account-content"
                bind:this={ form }
                on:submit|preventDefault={ handleCreatePayoutSubmit }
            >
                <AccountInput
                    label={ getLocalizedTextBySlug( 'banking-information-account-modal-beneficiary-label', $languageTagStore ) }
                    initialValue={ account.bankAccount.OwnerName }
                    editable={ true }
                >
                    <input
                        name="beneficiary"
                        class="account-banking-information-account-field-input"
                        bind:value={ account.bankAccount.OwnerName }
                    >
                </AccountInput>
                <AccountInput
                    label={ getLocalizedTextBySlug( 'banking-information-account-modal-account-label', $languageTagStore ) }
                    initialValue={ account.bankAccount.IBAN }
                    editable={ true }
                >
                    <input
                        name="account"
                        class="account-banking-information-account-field-input"
                        bind:value={ account.bankAccount.IBAN }
                    >
                </AccountInput>
                <AccountInput
                    label={ getLocalizedTextBySlug( 'banking-information-account-modal-bank-label', $languageTagStore ) }
                    initialValue={ account.bankAccount.BIC }
                    editable={ true }
                >
                    <input
                        name="bank"
                        class="account-banking-information-account-field-input"
                        bind:value={ account.bankAccount.BIC }
                    >
                </AccountInput>
                <AccountInput
                    label={ getLocalizedTextBySlug( 'banking-information-account-modal-date-label', $languageTagStore ) }
                    initialValue={ account.date }
                    editable={ true }
                >
                    <input
                        name="bank"
                        class="account-banking-information-account-field-input"
                        bind:value={ account.date }
                    >
                </AccountInput>
                <AccountInput
                    label={ getLocalizedTextBySlug( 'transfer-to-account-modal-communication-label', $languageTagStore ) }
                    initialValue={ account.communication }
                    editable={ true }
                >
                    <input
                        name="communication"
                        class="account-banking-information-account-field-input"
                        bind:value={ account.communication }
                    >
                </AccountInput>
                <AccountInput
                    label=
                    {
                        getLocalizedTextBySlug(
                            'transfer-to-account-modal-amount-of-banking-information-account-modal-transfer-label',
                            $languageTagStore
                            )
                    }
                    initialValue={ account.amount }
                    editable={ true }
                >
                    <input
                        name="amount"
                        class="account-banking-information-account-field-input"
                        bind:value={ account.amount }
                    >
                </AccountInput>
            </form>
        {/if}
    </ModalContent>
    <ModalActions>
        <ModalButton variant="light" text={ getLocalizedTextBySlug( 'back-label', $languageTagStore ) } on:click={ onClose }/>
        <ModalButton
            variant="contained"
            text={ getLocalizedTextBySlug( 'banking-information-account-modal-transfer-label', $languageTagStore ) }
            bind:isLoading={ isSubmitting }
            on:click={ () => form.requestSubmit() }
        />
    </ModalActions>
</ModalRoot>
