<script>
    // -- IMPORTS
    import { languageArrayStore } from "$src/lib/store/languageArrayStore";
    import { profileSignedInStore } from "$src/lib/store/profileStore";
    import { getLocalizedTextBySlug } from "senselogic-gist";

    // -- VARIABLES

    export let isNumberFocused = false;
    export let isHolderFocused = false;
    export let isValidFocused = false;
    export let isCvvFocused = false;
    export let cardIssuer = ''
    export let cardHolder =''
    export let cvv = ''
    export let cardNumber;
    export let cardExpiration;
    export let isFlipped = false;
    export let isCvvVisible = false;
    export let isCardDisplayed = false;

    // -- FUNCTIONS

    function formatCardNumber(
        value = ''
        )
    {
        if (isCardDisplayed)
        {
            return value.replace(/(.{4})/g, '$1 ').trim();
        }

        let maxLength = 19;
        let digits = value.replace(/\D/g, '').slice(0, maxLength);
        let numFilledGroups = Math.ceil(digits.length / 4);
        let groups = [];

        for ( let i = 0; i < numFilledGroups; i++ )
        {
          let start = i * 4;
          let end = start + 4;
          groups.push( digits.slice( start, end ) );
        }

        let totalGroups = 4;
        let remainingGroups = totalGroups - groups.length;

        for ( let i = 0; i < remainingGroups; i++ )
        {
          groups.push('••••');
        }

        return groups.join(' ');
    }

</script>

<style lang="stylus">
    // -- IMPORTS
    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES
    .wrapper
    {
        perspective: 1000px;
    }

    .card-container
    {
        position: relative;

        height: 17rem;
        width: 22.5rem;
        transform-style: preserve-3d;
        transition: transform 1s ease;

        +media( tablet )
        {
            width: 27.5rem;
        }
    }

    .card-container.flipped
    {
        transform: rotateY(180deg);
    }

    .card
    {
        position: absolute;
        top: 0;
        left: 0;

        height: 100%;
        width: 100%;
        backface-visibility: hidden;
        border-radius: 1rem;
        padding: 1.5rem;

        background: linear-gradient(90deg, blueColor300 0%, blueColor100 100%);

        color: grayColor900;
    }

    .front-container
    {
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .card.back
    {
        transform: rotateY(180deg);

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .card-heading
    {
        margin-bottom: 1.75rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card-chip
    {
        height: auto;
        width: 2.5rem;
    }

    .card-number-container
    {
        margin-bottom: 1.5rem;
        min-width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .card-number
    {
        width: 100%;
        min-width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .card-info
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card-details
    {
        text-align: center;
    }

    .card-details label
    {
        display: block;

        font-size: 0.75rem;
        color: grayColor800;
    }

    .card-details span
    {
        font-size: 0.9rem;
        font-weight: bold;
    }

    .card-number span
    {
        min-width: 100%;

        display: inline-block;

        font-family: monospace;
        font-size: 1.5rem;
        font-weight: bold;
        letter-spacing: 2px;
        text-align: left;
    }

    .card-number label
    {
        display: flex;

        font-size: 0.75rem;
        color: grayColor800;
    }

    .card-details-back
    {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
    }

    .card-details-holder,
    .card-details-valid
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .card-details-cvv
    {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .card-details-cvv span
    {
        font-family: monospace;
    }

    .focused
    {
        box-sizing: border-box;
        outline: 1px solid grayColor800;
        width: 100%;
        border-radius: 8px;

        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(5px);

        transition: outline 0.4s ease-in-out,
                    background-color 0.5s ease-in-out,
                    backdrop-filter 0.5s ease-in-out,
                    transform 0.4s ease-in-out;
    }

    .back-container
    {
        height: 100%;
        padding: 1.5rem 0;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .black-strip
    {
        margin-bottom: 4rem;
        height: 1.75rem;
        width: 100%;
        border-radius: 4px;

        flex-shrink: 0;
        align-self: stretch;

        background: var(--Gray-90, linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%),
            linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%),
            linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%),
            linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%),
            linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #171717);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    label
    {
        padding: 0 0.5rem;
    }

    span
    {
        padding: 0.3rem 0.5rem 0.3rem 0.5rem;

        text-transform: uppercase;
    }
</style>

<div class="wrapper">
    <div class="card-container" class:flipped={isFlipped}>
        <div class="card front">
            <div class="front-container">
                <div class="card-heading">
                    {#if cardIssuer}
                        <div class="{ cardIssuer }-icon size-350"></div>
                    {:else}
                        <div class="mastercard-icon size-350"></div>
                    {/if}
                    <div class="moien-happy-logo-icon size-200" />
                </div>
                <div class="card-number-container">
                    <div class="card-number">
                        <div>
                            <span class={isNumberFocused ? 'focused' : ''}>
                                { formatCardNumber( cardNumber ) }
                            </span>
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-details">
                        <div class="card-details-holder">
                            <label>
                                { getLocalizedTextBySlug( 'banking-information-card-modal-holder-name-label', $languageArrayStore ) }
                            </label>
                            <span class="{ isHolderFocused ? 'focused' : '' }">
                                {cardHolder || `xxxx xxxx`}
                            </span>
                        </div>
                    </div>
                    <div class="card-details">
                        <div class="card-details-valid">
                            <label>
                                { getLocalizedTextBySlug( 'valid-thru-label', $languageArrayStore ) }
                            </label>
                            <span class="{ isValidFocused ? 'focused' : '' }">
                                { cardExpiration || 'MM/YY' }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card back">
            <div class="back-container">
                <div class="black-strip"></div>
                <div class="card-details-back">
                    <div class="card-details">
                        <div class="card-details-cvv">
                            <label>CVV</label>
                            <span class="{isCvvFocused ? 'focused' : ''}">
                                { isCvvVisible ? ( cvv || '•••' ) : '•'.repeat( cvv?.length || 3 ) }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
