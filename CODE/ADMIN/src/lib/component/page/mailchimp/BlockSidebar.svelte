<script>
    // -- IMPORTS

    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { slide } from 'svelte/transition';
    import { pageTitle } from '$store/pageTitleStore';
    import { draggable, dropzone } from '$lib/drag_and_drop';

    // -- CONSTANTS

    const blockArray =
        [
            { type: 'heading', label: 'Heading', content: '<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border: 0px; border-radius: 0px; border-collapse: separate;"><tbody><tr><td valign="top" class="mceTextBlockContainer" style="padding: 12px 24px;"><div data-block-id="50" data-rich-text="true" class="mceText" id="dataBlockId-50" style="width: 100%;"><div><div contenteditable="true" translate="no" tabindex="-1" class="ProseMirror"><h1 class="empty-node"><br class="ProseMirror-trailingBreak"></h1></div></div></div></td></tr></tbody></table>' },
            { type: 'paragraph', label: 'Paragraph', content: '<p>paragraph</p>' },
            {
                type: 'button',
                label: 'Button',
                content: `<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" style="padding: 12px 24px;" class="mceBlockContainer" align="center"><div><!--[if !mso]><!--></div><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" data-block-id="51" data-rich-text="true" class="mceButtonContainer"><tbody><tr class="mceStandardButton"><td valign="top" class="mceButton" style="background-color: rgb(0, 0, 0); border-radius: 0px; text-align: center;"><a target="_blank" data-href="" data-button-block-id="51" class="mceButtonLink" tabindex="-1" style="background-color: rgb(0, 0, 0); border-radius: 0px; border: 2px solid rgb(0, 0, 0); color: rgb(255, 255, 255); display: block; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, Verdana, sans-serif; font-size: 16px; font-weight: normal; font-style: normal; padding: 16px 28px; text-decoration: none; min-width: 30px; text-align: center; direction: ltr; letter-spacing: 0px;"><div><div contenteditable="true" translate="no" tabindex="-1" class="ProseMirror">Add button text</div></div></a></td></tr></tbody></table><div><!--<![endif]--></div><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" data-block-id="51" data-rich-text="true" class="mceButtonContainer"><tbody><tr>
                <!--[if mso]>
                <td align="center">
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
                                xmlns:w="urn:schemas-microsoft-com:office:word"
                                href=""
                                style="v-text-anchor:middle; width:166.84px; height:53.6px;"
                                arcsize="0%"
                                strokecolor="#000000"
                                strokeweight="2px"
                                fillcolor="#000000">
                    <v:stroke dashstyle="solid"/>
                    <w:anchorlock />
                    <center style="
                        color: #ffffff;
                        display: block;
                        font-family: 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif;
                        font-size: 16;
                        font-style: normal;
                        font-weight: normal;
                        letter-spacing: 0px;
                        text-decoration: none;
                        text-align: center;
                        direction: ltr;"
                    >
                        undefined
                    </center>
                    </v:roundrect>
                </td>
                <![endif]-->
                </tr></tbody></table></td></tr><tr><td valign="top" style="padding: 0px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border: 0px; border-radius: 0px; border-collapse: separate;"><tbody><tr><td valign="top" class="mceTextBlockContainer" style="padding: 12px 24px;"><div data-block-id="50" data-rich-text="true" class="mceText" id="dataBlockId-50" style="width: 100%;"><div><div contenteditable="true" translate="no" tabindex="-1" class="ProseMirror"><p class="empty-node"><br class="ProseMirror-trailingBreak"></p></div></div></div></td></tr></tbody></table></td></tr></tbody></table>`
            },
            {
                type: 'divider',
                label: 'Divider',
                content: `<tr><td style="background-color:transparent;padding-top:20px;padding-bottom:20px;padding-right:24px;padding-left:24px" valign="top" class="mceBlockContainer"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: transparent; width: 100%; cursor: grab;" role="presentation" class="mceDividerContainer" data-block-id="52" draggable="true"><tbody><tr><td style="min-width:100%;border-top-width:2px;border-top-style:solid;border-top-color:#000000;line-height:0;font-size:0" valign="top" class="mceDividerBlock">&nbsp;</td></tr></tbody></table><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" data-block-id="51" data-rich-text="true" class="mceButtonContainer"><tbody><tr>
                <!--[if mso]>
                <td align="center">
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
                            xmlns:w="urn:schemas-microsoft-com:office:word"
                            href=""
                            style="v-text-anchor:middle; width:166.84px; height:53.6px;"
                            arcsize="0%"
                            strokecolor="#000000"
                            strokeweight="2px"
                            fillcolor="#000000">
                <v:stroke dashstyle="solid"/>
                <w:anchorlock />
                <center style="
                    color: #ffffff;
                    display: block;
                    font-family: 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif;
                    font-size: 16;
                    font-style: normal;
                    font-weight: normal;
                    letter-spacing: 0px;
                    text-decoration: none;
                    text-align: center;
                    direction: ltr;"
                >
                    undefined
                </center>
                </v:roundrect>
                </td>
                <![endif]-->
                    </tr></tbody></table></td></tr>`
            }
        ];
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    button
    {
        cursor: pointer;
    }

    // -- CLASSES

    .left-side
    {
        z-index: 11;
        position: relative;

        height: calc( 100dvh - 7vh );
        width: auto;
        border-left: 1px solid grayColor800;

        display: flex;
        flex-direction: column;
        flex-shrink: 0;

        background-color: white;

        transition: all 0.3s cubic-bezier( 0.76, 0, 0.27, 1 );

        +media( smaller-48em )
        {
            z-index: sidebarZIndex;
            position: fixed;
            left: 0;

            width: 20.5em;
            border-right: 1px solid grayColor700;
        }
    }

    .left-side-button
    {
        display: none;
    }

    .logo
    {
        top: 0;

        height: 4.25rem;

        line-height: 4.25rem;
        font-size: 0.9375rem;
        font-weight: bold;
        letter-spacing: 0.25rem;
        text-align: center;
        text-transform: uppercase;
        color: whiteColor;
        color: blueColor;
    }

    .side-wrapper
    {
        overflow: auto;
        height: 100%;
        padding: 0 0.5rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .side-menu
    {
        white-space: nowrap;
        div
        {
            margin-right: 0.5rem;
        }

        .navigate-button,
        button
        {
            width: 100%;
            border-radius: 0.5rem;
            padding: 0.75rem 1.25rem;

            display: flex;
            align-items: center;

            background: transparent;

            font-size: 0.85rem;
            font-weight: bold;
            text-decoration: none;
            color: blueColor;
            &:hover
            {
                background-color: grayColor900;
            }

            &:not(:last-child)
            {
                margin-bottom: 1.25rem;
            }
        }

        .navigate-button.is-active
        {
            background: #E6FAF3;

            color: greenColor;
        }
    }

    .leave
    {
        position: absolute;
        top: -100%;
        left: 0;

        height: 100%;
        width: 100%;
        padding: 0 1.25rem;

        display: flex;
        align-items: center;

        background-color: blueColor;

        color: grayColor950;

        transition: 0.3s;
    }

    .accordion-text
    {
        width: 100%;

        text-align: left;
    }

    .chevron
    {
        transform: rotate( 90deg );

        transition: 0.4s all ease;
    }

    .chevron.is-opened
    {
        transform: rotate( 0 );
    }

    .accordion-list
    {
        margin-bottom: 1rem;
    }
</style>

<div class="left-side" transition:slide={ { axis : 'x' } }>
    <button class="left-side-button">
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18">
            </line>
        </svg>
        <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
    </button>
    <div class="side-wrapper">
    <div class="side-menu">
        {#each blockArray as block, blockIndex }
            <div
                class="navigate-button"
                draggable="true"
                use:draggable={ getJsonText( block ) }
            >
                <div class="icon size-150"></div>
                { getLocalizedTextBySlug( block.label, $languageTagStore ) }
            </div>
        {/each}
    </div>
    </div>
</div>
