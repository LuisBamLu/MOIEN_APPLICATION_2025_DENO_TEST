<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { draggable, dropzone } from '$lib/drag_and_drop';
    import { getJsonObject, getJsonText, logError } from 'senselogic-gist';
    import { fetchData } from '$lib/base';

    // -- VARIABLES

    /** @type {{html?: string, campaignId?: any}} */
    let { html = $bindable(''), campaignId = null } = $props();

    let bodyContentElement = $state();

    // -- FUNCTIONS

    async function handleBlurEvent(
        )
    {
        html = bodyContentElement.innerHTML;

        await handleSaveCampaign();
        await fetchData(
            '/api/admin/page/mailchimp/campaign/' + campaignId + '/template/set',
            {
                method: 'POST',
                body: getJsonText( { html } )
            }
            );
    }

    // ~~

    async function handleSaveCampaign(
        )
    {
        try
        {
            // await fetchData(
            //     '/api/admin/page/mailchimp/campaign/' + campaignId + '/set',
            //     {
            //         method: 'POST',
            //         body: getJsonText(
            //             {
            //                 campaign:
            //                     {
            //                         status: 'saved'
            //                     }
            //             }
            //             )
            //     }
            //     );
        }
        catch ( error )
        {
            logError( error );
        }
    }

    // ~~

    function applyDropzone(
        )
    {
        setTimeout(
            () =>
            {
                let emailDropZoneElementArray = document.getElementsByClassName( 'emailDropZone' );

                for ( let emailDropZoneElement of emailDropZoneElementArray )
                    {
                        console.log( emailDropZoneElement );
                        dropzone(
                            emailDropZoneElement,
                            {
                                handleOnDropzoneEvent(
                                    dataBlockId,
                                    event
                                    )
                                {
                                    let sourceBlock = document.querySelector( '[data-block-id="' + dataBlockId + '"]' );

                                    if ( sourceBlock && emailDropZoneElement )
                                    {
                                        emailDropZoneElement.insertAdjacentElement( 'beforeend', sourceBlock );
                                    }
                                }
                            }
                            );
                    }
            },
            100
            );
    }

    // ~~

    function applyOnChangeEvent(
        )
    {
        let editableElementArray = document.querySelectorAll( '[contenteditable="true"]' );

        for ( let editableElement of editableElementArray )
        {
            editableElement.addEventListener( 'blur', handleBlurEvent );
        }
    }

    // ~~

    function removeOnChangeEvent(
        )
    {
        let editableElementArray = bodyContentElement.querySelectorAll( '[contenteditable="true"]' );

        for ( let editableElement of editableElementArray )
        {
            editableElement.removeEventListener( 'blur', handleBlurEvent );
            editableElement.removeAttribute( 'contenteditable' );
        }
    }

    // ~~

    function applyContentEditable(
        )
    {
        let editableElementArray =
            [
                ...bodyContentElement.getElementsByTagName( 'h1' ),
                ...bodyContentElement.getElementsByTagName( 'h2' ),
                ...bodyContentElement.getElementsByTagName( 'h3' ),
                ...bodyContentElement.getElementsByTagName( 'h4' ),
                ...bodyContentElement.getElementsByTagName( 'h5' ),
                ...bodyContentElement.getElementsByTagName( 'h6' ),
                ...bodyContentElement.getElementsByTagName( 'p' ),
                ...bodyContentElement.getElementsByTagName( 'span' ),
                ...bodyContentElement.getElementsByTagName( 'a' ),
                ...bodyContentElement.getElementsByTagName( 'button' )
            ];

        for ( let editableElement of editableElementArray )
        {
            editableElement.setAttribute( 'contenteditable', 'true' );
            editableElement.addEventListener( 'blur', handleBlurEvent );
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            applyDropzone();
            applyContentEditable();

            let tableElementArray = bodyContentElement.querySelectorAll( 'table' );

            for ( let tableElement of tableElementArray )
            {
                draggable( tableElement, null );
            }

            return () => removeOnChangeEvent();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- ELEMENTS

    img
    {
        -ms-interpolation-mode: bicubic;
    }

    table,
    td
    {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
    }

    p,
    a,
    li,
    td,
    blockquote
    {
        mso-line-height-rule: exactly;
    }

    p,
    a,
    li,
    td,
    body,
    table,
    blockquote
    {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
    }

    body
    {
        margin: 0;
        height: 100%;
        width: 100%;
        padding: 0;

        background: #ffffff;
    }

    p
    {
        margin: 0;
        padding: 0;
    }

    table
    {
        border-collapse: collapse;
    }

    td,
    p,
    a
    {
        word-break: break-word;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6
    {
        margin: 0;
        padding: 0;

        display: block;
    }

    img,
    a img
    {
        outline: none;
        height: auto;
        border: 0;

        text-decoration: none;
    }

    a[ href^="tel" ],
    a[ href^="sms" ]
    {
        text-decoration: none;
        color: inherit;

        cursor: default;
    }

    li p
    {
        margin: 0 !important;
    }

    .mceStandardButton,
    .mceStandardButton td,
    .mceStandardButton td a
    {
        mso-hide: all !important;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass td,
    .ExternalClass div,
    .ExternalClass span,
    .ExternalClass font
    {
        line-height: 100%;
    }

    a[x-apple-data-detectors]
    {
        line-height: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        text-decoration: none !important;
        color: inherit !important;
    }

    .ProseMirror a
    {
        pointer-events: none;
    }

    div[ contenteditable="true" ]
    {
        outline: 0;
    }

    .mceImageBorder img
    {
        border: 0 !important;
    }

    .mceText h1
    {
        margin-bottom: 0px;
    }

    .mceText p
    {
        margin-bottom: 0px;
    }

    .mceText label
    {
        margin-bottom: 0px;
    }

    .mceText input
    {
        margin-bottom: 0px;
    }

    .mceText h1
    {
        margin-bottom: 0px;
    }

    .mceText p
    {
        margin-bottom: 0px;
    }

    .mceText label
    {
        margin-bottom: 0px;
    }

    .mceText input
    {
        margin-bottom: 0px;
    }

    .mceText p,
    .mcnTextContent p
    {
        line-height: 1.5;
        font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif;
        font-size: 16px;
        font-weight: normal;
        color: rgb( 0, 0, 0 );
        mso-line-height-alt: 150%;
        direction: ltr;
        text-align: center;
    }

    .mceText h1,
    .mcnTextContent h1
    {
        line-height: 1.5;
        font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif;
        font-size: 31px;
        font-weight: bold;
        color: rgb( 0, 0, 0 );
        mso-line-height-alt: 150%;
        direction: ltr;
        text-align: center;
    }

    .mceText a,
    .mcnTextContent a
    {
        direction: ltr;
        font-weight: normal;
        font-style: normal;
        text-decoration: underline;
        color: rgb( 0, 0, 0 );
    }

    .mceSectionHeader .mceText h1,
    .mceSectionHeader .mcnTextContent h1
    {
    }

    .mceSectionFooter .mceText p,
    .mceSectionFooter .mcnTextContent p
    {
    }

    .mceSectionFooter .mceText a,
    .mceSectionFooter .mcnTextContent a
    {
        font-style: normal;
    }

    #dataBlockId-13 p,
    #dataBlockId-13 h1,
    #dataBlockId-13 h2,
    #dataBlockId-13 h3,
    #dataBlockId-13 h4,
    #dataBlockId-13 ul
    {
        text-align: center;
    }

    // -- CLASSES

    :global( .dropzone-droppable )
    {
        outline: 3px solid #A6F4C5;
        outline-offset: 0.25rem;
    }

    :global( .dropzone-droppable ) *
    {
        pointer-events: none;
    }

    .is-focused
    {
        border: 2px solid red;
    }

    .mcnPreviewText
    {
        display: none !important;
    }

    .bodyCell
    {
        margin: 0 auto;
        width: 100%;
        padding: 0;
    }

    .ReadMsgBody
    {
        width: 100%;
    }

    .ExternalClass
    {
        width: 100%;
    }

    .ProseMirror h1.empty-node:only-child::before,
    .ProseMirror h2.empty-node:only-child::before,
    .ProseMirror h3.empty-node:only-child::before,
    .ProseMirror h4.empty-node:only-child::before
    {
        content: 'Heading';
    }

    .ProseMirror p.empty-node:only-child::before,
    .ProseMirror:empty::before
    {
        content: 'Start typing...';
    }

    .mceImageBorder
    {
        display: inline-block;
    }

    body,
    #bodyTable
    {
        background-color: rgb( 244, 244, 244 );
    }

    .mceText,
    .mcnTextContent,
    .mceLabel
    {
        font-family: "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif;
    }

    .mceText,
    .mcnTextContent,
    .mceLabel
    {
        color: rgb( 0, 0, 0 );
    }

    .mceSpacing-12 .mceInput + .mceErrorMessage
    {
        margin-top: -6px;
    }

    .mceSpacing-24 .mceInput + .mceErrorMessage
    {
        margin-top: -12px;
    }

    .mceInput
    {
        width: 60%;
        border: 2px solid rgb( 208, 208, 208 );

        display: block;

        background-color: transparent;

        color: rgb( 77, 77, 77 );
    }

    .mceInput[ type="radio" ],
    .mceInput[ type="checkbox" ]
    {
        margin-right: 12px;
        width: auto !important;

        display: inline;
        float: left;
    }

    .mceLabel > .mceInput
    {
        margin-top: 2px;
        margin-bottom: 0px;
    }

    .mceLabel
    {
        display: block;
    }

    @media only screen and ( max-width: 480px )
    {
        body,
        table,
        td,
        p,
        a,
        li,
        blockquote
        {
            -webkit-text-size-adjust: none !important;
        }
    }

    @media only screen and ( max-width: 480px )
    {
        .mceText p
        {
            margin: 0px;

            line-height: 1.5 !important;
            font-size: 16px !important;
            mso-line-height-alt: 150%;
        }
    }

    @media only screen and ( max-width: 480px )
    {
        .mceText h1
        {
            line-height: 1.5 !important;
            font-size: 31px !important;
            mso-line-height-alt: 150%;
        }
    }

    @media only screen and ( max-width: 640px )
    {
        .mceClusterLayout td
        {
            padding: 4px !important;
        }
    }

    @media only screen and ( max-width: 480px )
    {
        body
        {
            width: 100% !important;
            min-width: 100% !important;
        }

        body.mobile-native
        {
            -webkit-user-select: none;
            transform-origin: top center;

            user-select: none;
            transition: transform 0.2s ease-in;
        }

        body.mobile-native.selection-allowed a,
        body.mobile-native.selection-allowed .ProseMirror
        {
            user-select: auto;
            -webkit-user-select: auto;
        }

        colgroup
        {
            display: none;
        }

        img
        {
            height: auto !important;
        }

        .mceWidthContainer
        {
            max-width: 660px !important;
        }

        .mceColumn
        {
            width: 100% !important;

            display: block !important;
        }

        .mceColumn-forceSpan
        {
            width: auto !important;

            display: table-cell !important;
        }

        .mceColumn-forceSpan .mceButton a
        {
            min-width: 0 !important;
        }

        .mceBlockContainer
        {
            padding-left: 16px !important;
            padding-right: 16px !important;
        }

        .mceTextBlockContainer
        {
            padding-left: 16px !important;
            padding-right: 16px !important;
        }

        .mceBlockContainerE2E
        {
            padding-left: 0px;
            padding-right: 0px;
        }

        .mceSpacing-24
        {
            padding-left: 16px !important;
            padding-right: 16px !important;
        }

        .mceImage,
        .mceLogo
        {
            height: auto !important;
            width: 100% !important;
        }

        .mceFooterSection .mceText,
        .mceFooterSection .mceText p
        {
            line-height: 140% !important;
            font-size: 16px !important;
        }
    }
</style>

<div
    class="body-content"
    bind:this={ bodyContentElement }
    use:dropzone=
    {
        {
            handleOnDropzoneEvent(
                dataBlock,
                event
                )
            {
                let targetElement = event.target;

                try
                {
                    let block = getJsonObject( dataBlock );
                    targetElement.insertAdjacentHTML( 'beforeend', block.content );
                    applyOnChangeEvent();
                }
                catch
                {
                    let dataBlockId = dataBlock;
                    let sourceBlock = bodyContentElement.querySelector( '[data-block-id="' + dataBlockId + '"]' );

                    if ( sourceBlock && targetElement )
                    {
                        targetElement.insertAdjacentElement( 'beforeend', sourceBlock );
                    }
                }
            }
        }
    }
>
    {@html html }
</div>
