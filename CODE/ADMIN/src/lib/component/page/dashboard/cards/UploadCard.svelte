<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import DashboardTag from '../DashboardTag.svelte';
    import Button from '$component/element/Button.svelte';
    import UploadButton from '$src/lib/component/element/UploadButton.svelte';

    // -- VARIABLES

    let type = $state('');

    // -- FUNCTIONS

    function handleDownload(
        )
    {
        if ( type === '' )
        {
            alert( 'Select a type' );
        }
        else
        {
            let link = document.createElement( 'a' );
            link.href = '/admin/template/new_users_template.' + type;
            link.download = 'template.' + type;

            link.click();
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../constant.styl';
    @import '../../../../../mixin.styl';

    // -- ELEMENTS

    article
    {
        width: 24%;
        aspect-ratio: 1 / 1;
        border: 2px solid blueColor900;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        background-color: blueColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        font-size: 1vw;
        font-weight: 500;
        color: blueColor300;
        @media( max-width: 1200px )
        {
            width: 48%;
        }

        @media( max-width: 750px )
        {
            width: 100%;
        }
    }

    select
    {
        outline: none;
        border: 1px solid blueColor500;
        border-radius: 0.5vw;
        padding: 0.5vw;

        background-color: blueColor950;

        font-size: 1vw;
        font-weight: 700;
        color: blueColor500;
        &:hover
        {
            border: 1px solid blueColor500;

            color: blueColor500;
        }
        &:focus
        {
            border: 1px solid blueColor500;

            color: blueColor500;
        }

        @media( max-width: 1200px )
        {
            padding: 0.5rem;

            font-size: 1rem;
        }
    }

    // -- CLASSES

    .upload-card-head
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .upload-card-text
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 10px;

        font-size: 1vw;
        @media( max-width: 1200px )
        {
            font-size: 1.5vw;
        }

        @media( max-width: 750px )
        {
            font-size: 2.5vw;
        }
    }

    .upload-card-buttons
    {
        margin-top: 1vh;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>

<article class="upload-card">
    <div class="upload-card-head">
        <DashboardTag
            text={ getLocalizedTextBySlug( 'upload-label', $languageTagStore ) }
            color="blue"
        />
        <select name="type" bind:value={ type }>
            <option value="" disabled hidden>
                { getLocalizedTextBySlug( 'select-label', $languageTagStore ) }
            </option>
            <option value="csv">
                CSV
            </option>
            <option value="json">
                JSON
            </option>
        </select>
    </div>
    <div class="upload-card-text">
        <span>
            { getLocalizedTextBySlug( 'upload-article-title', $languageTagStore ) }
        </span>
        { getLocalizedTextBySlug( 'upload-article-text', $languageTagStore ) }
    </div>
    <div class="upload-card-buttons">
        <UploadButton />
        <Button fullWidth={ true } invertColor={ true } on:click={ handleDownload }>
            <div class="blue-download-icon size-150"></div>
            { getLocalizedTextBySlug( 'download-text-label', $languageTagStore ) }
        </Button>
    </div>
</article>
