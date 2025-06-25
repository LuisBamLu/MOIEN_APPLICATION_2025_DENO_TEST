<script>
    import { languageTagStore } from "$src/lib/store/languageTagStore";
    import { getLocalizedTextBySlug } from "senselogic-gist";

    // -- VARIABLES

    let contactInformation = {
        phone: '+1 234 567 89',
        email: 'contact@moien.com',
        address: '9 rue du Laboratoire, L1911 Luxemborug'
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../mixin.styl';
    @import '../../../../constant.styl';

    // -- ELEMENTS

    h2
    {
        line-height: 3rem;
        font-size: 2.5rem;
        font-weight: 700;
        font-style: normal;
        letter-spacing: -0.4px;
        color: blueColor100;

        +media( desktop )
        {
            display: flex;
            justify-content: center;
        }
    }

    // -- CLASSES

    .contact-information
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        justify-content: center;
    }

    .information-container
    {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;

        +media( desktop )
        {
            width: 100%;

            flex-direction: row;
            justify-content: space-between;
        }
    }

    .information-content
    {
        display: flex;
        gap: 20px;
        align-items: flex-start;
        align-self: stretch;

        +media( desktop )
        {
            justify-content: center;
            // justify-content: space-between;

            width: 80%;
        }
    }

    .information-values
    {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: start;
        h2
        {
            line-height: 1.625rem;
            font-size: 1.25rem;
            font-weight: 600;
            font-style: normal;
            color: grayColor100;
        }

        p
        {
            line-height: 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            font-style: normal;
            color: grayColor300;
        }
    }

    .separator-container
    {
        display: none;

        +media( desktop )
        {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            align-self: stretch;
        }
    }

    .separator
    {
        display: none;

        +media( desktop )
        {
            height: 100%;
            width: 1px;

            display: flex;

            background-color: grayColor700;
        }
    }
</style>

<div class="contact-information">
    <h2>{ getLocalizedTextBySlug( 'customer-service-label', $languageTagStore ) }</h2>
    <div class="information-container">
        <!-- <div class="information-content">
            <div class="green-phone-icon  size-200"></div>
            <div class="information-values">
                <h2>{ getLocalizedTextBySlug( 'auth-phone-number-placeholder', $languageTagStore ) }</h2>
                <p>{contactInformation.phone}</p>
            </div>
        </div>
        <div class="separator-container">
            <div class="separator"></div>
        </div> -->
        <div class="information-content">
            <div class="green-email-icon size-200"></div>
            <div class="information-values">
                <h2>{ getLocalizedTextBySlug( 'personal-information-email', $languageTagStore ) }</h2>
                <p>{ contactInformation.email }</p>
            </div>
        </div>
        <div class="separator-container">
            <div class="separator"></div>
        </div>
        <div class="information-content">
            <div class="green-pin-icon size-200"></div>
            <div class="information-values">
                <h2>{ getLocalizedTextBySlug( 'personal-information-address', $languageTagStore ) }</h2>
                <p>{contactInformation.address}</p>
            </div>
        </div>
    </div>
</div>
