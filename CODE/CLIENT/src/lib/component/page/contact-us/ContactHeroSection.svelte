<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from "senselogic-gist";
    import Button from "../../element/Button.svelte";
    import Image from "../../element/Image.svelte";
    import LabelledInput from "../../element/LabelledInput.svelte";
    import { languageTagStore } from "$src/lib/store/languageTagStore";
    import { fetchData } from "$src/lib/base";
    import { toast } from "$src/lib/toast";

    // -- VARIABLES

    let formValues = {
        name: '',
        email: '',
        message: ''
    };
    let formInitialValues = { ...formValues };
    let languageTag = $languageTagStore
    let isLoading = false;

    // -- FUNCTIONS

    function handleInputChange(
        event
        )
    {
        let { name, value } = event.target;
        formValues = { ...formValues, [name]: value };
    }

    // ~~

    async function handleSubmit()
    {
        let formData = new FormData()
        isLoading = true

        try
        {
            formData.append( 'languageTag', languageTag )

            for ( let key in formValues )
            {
                formData.append(key, formValues[key])
            }

            let response = await fetchData(
                '/api/contact-us',
                {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                }
            )

            if ( response.error )
            {
                toast.error( response.error )
                console.error( response.error )
                isLoading = false
            }
            else
            {
                toast.success( 'message-sent-successfully-label' )
                formValues = { ...formInitialValues }
                isLoading = false
            }
        }
        catch( error )
        {
            console.error( error )
        }
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
    }

    span
    {
        display: flex;
        gap: .75rem;
        align-items: center;

        line-height: 1.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-style: normal;
        color: grayColor100;
    }

    // -- CLASSES

    .hero-container
    {
        width: 100%;

        display: flex;
        justify-content: space-between;

        +media( desktop )
        {
            margin-top: 5rem;
            height: auto;
            border-radius: 1.5rem;
            padding: 3rem;

            gap: 3rem;

            background-color: white;
        }
    }

    .separator
    {
        display: none;

        +media( desktop )
        {
            width: 1px;

            display: flex;

            background-color: grayColor700;
        }
    }

    .form-container
    {
        height: auto;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.75rem;
        justify-content: space-between;
    }

    .image-container
    {
        display: none;

        +media( desktop )
        {
            height: auto;
            width: 100%;
            border-radius: 1.5rem;

            display: flex;
            justify-content: center;
        }
    }

    :global(.info-image)
    {
        overflow: hidden;
        height: auto;
        width: 100%;
        border-radius: 1rem;

        object-fit: cover;
    }

    .form-group
    {
        margin: 12px 0;

        display: flex;
        flex-direction: column;
        gap: 12px;
        justify-content: center;
        align-items: flex-start;
        align-self: stretch;
    }

    .text-input
    {
        width: 100%;
        border: 1px solid black;
        border-radius: 4px;
        padding: 8px;

        background-color: white;
    }

    .textarea-input
    {
        height: 9rem;
        border: 2px solid grayColor800;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;

        background: grayColor950;

        resize: none;
        transition: all 200ms ease-in-out;
        &:focus-within
        {
            outline: none;
            border-color: greenColor900;

            box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
        }

        &::placeholder
        {
            color: grayColor500;
        }
    }
</style>

<div class="hero-container">
    <div class="form-container">
        <h2>{ getLocalizedTextBySlug( 'contact-us-button-label', $languageTagStore ) }</h2>
        <form
            class="contact-us-form"
            on:submit|preventDefault={ handleSubmit }
        >
            <div class="form-group">
                <span>{ getLocalizedTextBySlug( 'name-label', $languageTagStore ) }</span>
                <LabelledInput
                    name="name"
                    onChange={ handleInputChange }
                    bind:value={ formValues.name }
                    placeholder="{ getLocalizedTextBySlug( 'type-your-name-placeholder-label', $languageTagStore ) }"
                    type="text"
                />
            </div>
            <div class="form-group">
                <span>{ getLocalizedTextBySlug( 'personal-information-email', $languageTagStore ) }</span>
                <LabelledInput
                    name="email"
                    onChange={ handleInputChange }
                    bind:value={ formValues.email }
                    placeholder="{ getLocalizedTextBySlug( 'type-your-email-placeholder-label', $languageTagStore ) }"
                    type="email"
                />
            </div>
            <div class="form-group">
                <span>
                    { getLocalizedTextBySlug( 'message-label', $languageTagStore ) }
                    <img src="/image/icon/info_contact.svg" alt="info" />
                </span>
                <textarea
                    name="message"
                    class="textarea-input"
                    placeholder="{ getLocalizedTextBySlug( 'type-your-message-placeholder-label', $languageTagStore ) }"
                    on:change={ handleInputChange }
                    bind:value={ formValues.message }
                />
            </div>
            <div class="button-container">
                    <Button
                        variant="contained"
                        type="submit"
                        loading={ isLoading }
                    >
                        { getLocalizedTextBySlug( 'submit-label', $languageTagStore ) }
                    </Button>
            </div>
        </form>
    </div>
    <div class="separator"></div>
    <div class="image-container">
        <Image
            class="info-image"
            imagePath={ '/global/contact-us/contactus.avif' }
            imageSize={ 1920 }
        />
    </div>
</div>
