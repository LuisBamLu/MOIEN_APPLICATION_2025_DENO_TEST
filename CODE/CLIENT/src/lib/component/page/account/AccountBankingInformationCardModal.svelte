<script>
    // -- IMPORTS

    import { getJsonText, getLocalizedTextBySlug, isNumber } from 'senselogic-gist';
    import { capitalizedCardNameByCardBrandMap, fetchData, getCardBrandByCardNumber } from '$lib/base.js';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import AccountInput from '$component/page/account/AccountInput.svelte';
    import Error from '$component/element/Error.svelte';
    import { toast } from '$lib/toast';
    import LabelledInput from '../../element/LabelledInput.svelte';
    import PaymentCardDisplay from '../../element/PaymentCardDisplay.svelte';
    import { createEventDispatcher } from 'svelte';
    import ConfirmModal from '../../element/ConfirmModal.svelte';

    // -- VARIABLES

    export let isOpen = false;
    export let onClose = () => {};
    export let card = {};
    let dispatch = createEventDispatcher()
    let isNewCard = Object.values( card ).length === 0;
    let errorMessageSlugArray = [];
    let form;
    let isSubmitting = false;
    $: cardIssuer = getCardBrandByCardNumber(card.number ?? '');
    let isNumberFocused = false;
    let isHolderFocused = false;
    let isValidFocused = false;
    let isCvvFocused = false;
    let isCardFlipped = false;
    let isCvvVisible = false;
    let isConfirmationModalOpen = false;

    // -- FUNCTIONS

    async function handleSubmit(
        )
    {
        isSubmitting = true;
        let foundErrors = validateInput();

        if ( foundErrors )
        {
            errorMessageSlugArray = errorMessageSlugArray;
            isSubmitting = false;

            return false;
        }

        let { cardRegistration }
            = await fetchData(
                '/api/create-card-registration',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: getJsonText(
                        {
                            cardType: cardIssuer
                        }
                        )
                }
                );

        let response
            = await fetch(
                cardRegistration.CardRegistrationURL,
                {
                    method: 'POST',
                    body: new URLSearchParams(
                        {
                            accessKeyRef: cardRegistration.AccessKey,
                            data: cardRegistration.PreregistrationData,
                            cardNumber: card.number,
                            cardExpirationDate: card.expirationDate.split( '/' ).join( '' ),
                            cardCvx: card.cvv
                        }
                        )
                        .toString(),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
                );

        if ( !response.ok )
        {
            let error = await response.text();
            toast.error( error );
            isSubmitting = false;

            return;
        }

        let cardData = await response.text();
        cardRegistration.RegistrationData = cardData;

        try
        {
            let cardResult
                = await fetchData(
                    '/api/update-card-registration',
                    {
                        method: 'POST',
                        credentials: 'include',
                        body: getJsonText( { cardRegistration: cardRegistration } )
                    }
                    );

            isSubmitting = false;
            dispatch('cardRegistered')
            onClose( cardResult.card );
            isOpen = false;
        }
        catch( error )
        {
            toast.error( error.message );
            isSubmitting = false;

            return;
        }
    }

    // ~~

    function handleCardExpirationDateChange(
        event
    )
    {
        let input = event.target.value;
        let previousValue = card.expirationDate ?? '';

        if ( input.length > 5 )
        {
            input = input.substring(0, 5);
        }

        if ( input.length >= 2 && !input.includes( '/' ) )
        {
            let month = parseInt( input.substring( 0, 2 ), 10 );

            if ( month >= 1 && month <= 12 )
            {
                input = `${ input.substring( 0, 2 ) }/${ input.substring( 2, 4 ) }`;
            }
            else
            {
                event.target.value = previousValue;
                return;
            }
        }

        if ( input.length === 2 && input.endsWith('/') )
        {
            let month = input[0];

            if (month >= 1 && month <= 9)
            {
                input = `0${month}/`;
            }
            else
            {
                event.target.value = previousValue;
                return;
            }
        }

        for ( let i = 0; i < input.length; i++ )
        {
            let char = input[i];

            if ( i !== 2 && isNaN( Number( char ) ) )
            {
                event.target.value = previousValue;
                return;
            }
        }

        if ( input.length >= 3 && input[2] !== '/' )
        {
            if (input.length === 4 && !isNaN( Number( input ) ) )
            {
                input = `${ input.substring( 0, 2 ) }/${ input.substring( 2, 4 ) }`;
            }
            else
            {
                event.target.value = previousValue;
                return;
            }
        }

        event.target.value = input;
        card.expirationDate = input;
}

    // ~~

    function validateInput(
        )
    {
        errorMessageSlugArray = [];

        if ( !card.holder || card.holder === '' )
        {
            errorMessageSlugArray.push( 'empty-cardholder-error-message' )
        }

        if ( !card.cvv || isNaN( Number( card.cvv ) ) || card.cvv.length !== 3 )
        {
            errorMessageSlugArray.push( 'invalid-cvv-error-message' );
        }

        if ( !card.expirationDate || card.expirationDate === '' )
        {
            errorMessageSlugArray.push( 'empty-expiration-date-error-message' );
        }
        else
        {
            if ( card.expirationDate.includes( '/' ) && card.expirationDate.length === 5 )
            {
                let currentDate = new Date();
                let expirationDate = new Date();
                let [ expirationMonth, expirationYear ] = card.expirationDate.split( '/' );

                if ( isNaN( Number( expirationMonth ) )
                     || isNaN( Number( expirationYear ) )
                     || Number( expirationMonth ) > 12 )
                {
                    errorMessageSlugArray.push( 'invalid-expiration-date-error-message' );
                }
                else
                {
                    expirationDate.setFullYear(
                        Number( expirationYear ) + 2000,
                        Number( expirationMonth ),
                        1
                        );

                    if ( currentDate.getTime() > expirationDate.getTime() )
                    {
                        errorMessageSlugArray.push( 'expired-card-error-message' );
                    }
                }
            }
            else
            {
                errorMessageSlugArray.push( 'invalid-expiration-date-format-error-message' );
            }
        }

        return errorMessageSlugArray.length > 0;
    }

    // ~~

    async function handleDeactivateCard(
        )
    {
        isSubmitting = true;

        try
        {
            let result
            = await fetchData(
                '/api/set-card',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: getJsonText( { card: { Id: card.value, Active: false } } )
                }
                );

            toast.success( 'card-deactivated-successfully-label' );
            dispatch( 'cardDeactivated' )
        }
        catch( error )
        {
            toast.error( `account-transfer-to-account-modal-error-label` );

            return;
        }
        finally
        {
            isSubmitting = false;
            isConfirmationModalOpen = false;
            onClose();
        }
    }

    // ~~

    function handleCvvBlur(
        )
    {
        setTimeout( () =>
        {
            if ( !isCvvFocused )
            {
                isCardFlipped = false;
            }
        }, 100);
    }

    // ~~

    function toggleCvvVisibility(
        event
        )
    {
        event.preventDefault();
        isCvvVisible = !isCvvVisible;
    }

    // ~~

    function resetFlip(
        )
    {
        isCvvFocused = false;
        isCardFlipped = false;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .account-banking-information-card-content
    {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: stretch;
    }

    .account-banking-information-card-content.wait
    {
        cursor: wait;
    }

    .account-banking-information-card-field
    {
        border-bottom: 1px solid grayColor800;
        padding: 0.75rem 0px;

        display: flex;
        gap: 0.75rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;
    }

    .account-banking-information-card-field-label
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 0.375rem;
        align-items: flex-start;
    }

    .account-banking-information-card-field-input
    {
        outline: none;
        width: 100%;
        border: none;
    }

    .account-banking-information-make-default-button,
    .account-banking-information-delete-button
    {
        height: 3.5rem;
        border: 1px solid blueColor;
        border-radius: var( --Rounded-Corners-Btns, 8px );
        padding: 0.75rem 2.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;

        background: grayColor900;
    }

    .account-banking-information-credit-card-box
    {
        height: 12.5rem;
        width: 21.5rem;
        border: 2px solid grayColor800;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        justify-content: space-between;
        align-items: flex-start;

        background: linear-gradient(140deg, greenColor500, blueColor300);
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: white;
    }

    .card-container
    {
        margin-bottom: 2rem;

        display: flex;
        flex-direction: column;
    }

    .account-banking-information-credit-card-box-text
    {
        width: 100%;

        text-align: right;
    }

    .account-banking-information-edit-credit-card-field
    {
        border-bottom: 1px solid grayColor800;
        padding: 0.75rem 0px;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
        align-self: stretch;
    }

    .account-banking-information-edit-credit-card-number
    {
        border: 2px solid colorGray800;
        border-radius: 0.75rem;
        padding: 0.5rem 0.75rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        align-self: stretch;

        background: grayColor950;
    }

    .account-banking-information-delete-button
    {
        border: none;

        color: redColor300;
    }

    .expiry-date-cvv-container
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
    }

    .account-banking-information-card-field-input-wrapper {
        position: relative;

        display: flex;
        align-items: center;
    }

    .cvv-toggle-button {
        position: absolute;
        right: 10px;

        border: none;

        background: none;

        font-size: 16px;

        cursor: pointer;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader
        title=
            {
                getLocalizedTextBySlug(
                    isNewCard
                    ? 'banking-information-card-modal-new-card-label'
                    : 'your-card-label',
                    $languageTagStore
                    )
            }
        onClose={ onClose }
    />
    {#if isNewCard }
        <ModalContent>
                <form
                    class="account-banking-information-card-content"
                    class:wait={ isSubmitting }
                    on:submit|preventDefault={ handleSubmit }
                    bind:this={ form }
                >
                    {#key errorMessageSlugArray }
                        {#each errorMessageSlugArray as errorMessage }
                            <Error error={ errorMessage } />
                        {/each}
                    {/key}
                    <div class="card-container">
                            <PaymentCardDisplay
                                cardIssuer={ cardIssuer }
                                cardHolder={ card.holder }
                                cvv={ card.cvv }
                                cardNumber={ card.number }
                                cardExpiration={ card.expirationDate }
                                isCvvFocused={ isCvvFocused }
                                isHolderFocused={ isHolderFocused }
                                isNumberFocused={ isNumberFocused }
                                isValidFocused={ isValidFocused }
                                isFlipped={ isCardFlipped }
                                isCvvVisible={ isCvvVisible }
                            />
                    </div>
                    <div class="account-banking-information-card-field">
                        <div class="account-banking-information-card-field-label font-size-100 font-weight-500 color-black">
                            <label for="cardNumber">
                                { getLocalizedTextBySlug( 'banking-information-card-modal-card-number-label', $languageTagStore ) }
                            </label>
                            <input
                                bind:value={ card.number }
                                id="cardNumber"
                                maxlength="19"
                                name="cardNumber"
                                class="account-banking-information-card-field-input"
                                type="text"
                                placeholder="xxxx xxxx xxxx xxxx"
                                on:input={ (e) => {
                                    let rawInput = /** @type {HTMLInputElement} */ (e.target).value.replace( /\D/g, '').slice(0, 19 );
                                    card.number = rawInput
                                }}

                                on:focus={ () =>
                                    {
                                        resetFlip()
                                        isNumberFocused = true
                                    }
                                }
                                on:blur={ () => isNumberFocused = false }
                            >
                        </div>
                        <div class="{ cardIssuer }-icon size-250"/>
                    </div>
                     <div class="account-banking-information-card-field">
                        <div class="account-banking-information-card-field-label font-size-100 font-weight-500 color-black">
                            <label for="cardHolder">
                                { getLocalizedTextBySlug( 'banking-information-card-modal-holder-name-label', $languageTagStore ) }
                            </label>
                            <input
                                id="cardHolder"
                                name="cardHolder"
                                class="account-banking-information-card-field-input"
                                type="text"
                                maxlength="30"
                                placeholder={ getLocalizedTextBySlug( 'name-label', $languageTagStore ) }
                                bind:value={ card.holder }
                                on:focus={ () =>
                                    {
                                        resetFlip()
                                        isHolderFocused = true
                                    }
                                }
                                on:blur={ () => isHolderFocused = false }
                            >
                        </div>
                    </div>
                    <div class="expiry-date-cvv-container">
                        <div class="account-banking-information-card-field">
                            <div class="account-banking-information-card-field-label font-size-100 font-weight-500 color-black">
                                <label for="expiryDate">
                                    { getLocalizedTextBySlug( 'banking-information-card-modal-expiry-date-label', $languageTagStore ) }
                                </label>
                                <input
                                    id="expiryDate"
                                    name="expiryDate"
                                    class="account-banking-information-card-field-input"
                                    type="text"
                                    placeholder="MM/YY"
                                    value={ card.expirationDate ?? '' }
                                    on:keyup={ handleCardExpirationDateChange }
                                    on:focus={ () =>
                                        {
                                            resetFlip()
                                            isValidFocused = true
                                        }
                                    }
                                    on:blur={ () => isValidFocused = false }
                                >
                            </div>
                        </div>
                        <div class="account-banking-information-card-field">
                            <div class="account-banking-information-card-field-label font-size-100 font-weight-500 color-black">
                                <label for="cardCvv">CVV</label>
                                <div class="account-banking-information-card-field-input-wrapper">
                                    {#if isCvvVisible}
                                        <input
                                            id="cardCvv"
                                            name="cardCvv"
                                            class="account-banking-information-card-field-input"
                                            type="text"
                                            placeholder="123"
                                            minlength="3"
                                            maxlength="3"
                                            bind:value={card.cvv}
                                            on:focus={ () =>
                                                {
                                                    isCvvFocused = true;
                                                    isCardFlipped = true;
                                                }
                                            }
                                            on:blur={handleCvvBlur}
                                        >
                                    {:else}
                                        <input
                                            id="cardCvvHidden"
                                            name="cardCvv"
                                            class="account-banking-information-card-field-input"
                                            type="password"
                                            placeholder="123"
                                            minlength="3"
                                            maxlength="3"
                                            bind:value={card.cvv}
                                            on:focus={ () =>
                                                {
                                                    isCvvFocused = true;
                                                    isCardFlipped = true;
                                                }
                                            }
                                            on:blur={ handleCvvBlur }
                                        >
                                    {/if}
                                    <button
                                        type="button"
                                        class="cvv-toggle-button"
                                        on:click={ toggleCvvVisibility }
                                    >
                                        {#if isCvvVisible}
                                            <div class="green-eye-icon size-100"/>
                                        {:else}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        {/if}
                                    </button>
                                </div>
                            </div>
                        </div>
                </form>
                <!-- <button class="account-banking-information-make-default-button font-size-100 font-weight-700 color-blue">
                    { getLocalizedTextBySlug( 'banking-information-card-modal-make-default-label', $languageTagStore ) }
                </button> -->
        </ModalContent>
        <ModalActions>
            <ModalButton
                variant="error-secondary"
                text={ getLocalizedTextBySlug( 'cancel-label', $languageTagStore ) }
                disabled={ isSubmitting }
                on:click={ onClose }
            />
            <ModalButton
                variant="contained"
                text={ getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
                isLoading={ isSubmitting }
                on:click={ () => form.requestSubmit() }
            />
        </ModalActions>
    {:else}
        <ModalContent>
            <PaymentCardDisplay
                cardIssuer={ card.icon }
                cardHolder={ card.cardHolder }
                cardNumber={ card.number }
                cardExpiration={ card.expiration }
                isCardDisplayed={ true }
            />
            <ConfirmModal
                isOpen={ isConfirmationModalOpen }
                onConfirm={ handleDeactivateCard }
                onCancel={ () => isConfirmationModalOpen = false }
                confirmationText={ getLocalizedTextBySlug( 'confirm-card-deletion-label', $languageTagStore ) }
            />
        </ModalContent>
        <ModalActions>
            <ModalButton
                variant="error-secondary"
                text={ getLocalizedTextBySlug( 'delete-label', $languageTagStore ) }
                disabled={ isSubmitting }
                on:click={ () => isConfirmationModalOpen = true }
            />
            <ModalButton
                variant="contained"
                disabled={ true }
                text={ getLocalizedTextBySlug( 'banking-information-card-modal-make-default-label', $languageTagStore ) }
                isLoading={ isSubmitting }
                on:click={ () => form.requestSubmit() }
            />
        </ModalActions>
    {/if}
</ModalRoot>
