<script>
    import { preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import Loading from '$component/element/Loading.svelte';
    import PageTitle from '$component/element/PageTitle.svelte';
    import Button from '$component/element/Button.svelte';
    import { fetchData, formatDate, formatPercentage } from '$lib/base';
    import { getJsonText, getMap, logError } from 'senselogic-gist';
    import { onMount } from 'svelte';
    import Alert from '$component/element/Alert.svelte';
    import MonitorPerfomance from '$component/page/mailchimp/MonitorPerfomance.svelte';
    import MonitorPerfomanceCardList from '$component/page/mailchimp/MonitorPerfomanceCardList.svelte';
    import MonitorPerformanceCard from '$component/page/mailchimp/MonitorPerformanceCard.svelte';
    import MonitorPerformanceDetailRow from '$component/page/mailchimp/MonitorPerformanceDetailRow.svelte';
    import Status from '$component/element/Status.svelte';
    import IframeEditor from '$component/page/mailchimp/IframeEditor.svelte';
    import { toast } from '$lib/toast';
    import BlockSidebar from '$component/page/mailchimp/BlockSidebar.svelte';
    import { slide } from 'svelte/transition';
    import Input from '$component/element/Input.svelte';
    import Select from '$component/element/Select.svelte';
    import Switch from 'senselogic-flow/Switch.svelte';
    import IconButton from '$component/element/IconButton.svelte';
    import { campaignStatusSendingMapByStatus } from '$store/mailchimpCampaignStore';
    import * as Modal from '$component/element/modal';

    // -- CONTANTS

    const dateFormatOptionMap =
        {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

    // -- VARIABLES

    /** @type {{campaignId?: any}} */
    let { campaignId = null } = $props();

    let campaignSendChecklist = $state({});
    let campaign = $state({});
    let isCampaignLoading = $state(true);
    let isCampaignSendChecklistLoading = $state(true);
    let stepArray = [ 'checklist', 'view-report', 'new' ];
    let currentStep = $state(0);
    let activeAccordionIndex = $state(null);
    let isEditableInputNameEnabled = $state(false);
    let sendTime = $state(null);
    let isConfirmSendCampaignModalOpen = $state(false);
    let verifiedDomainArray = $state([]);

    // -- FUNCTIONS

    async function handleScheduleCampaign(
        )
    {
        try
        {
            let localDate = new Date( sendTime );
            let sendTimeUTC = new Date( localDate.getTime() - localDate.getTimezoneOffset() * 60000 ).toISOString();

            let response = await fetchData(
                '/api/admin/page/mailchimp/campaign/schedule/' + campaignId,
                {
                    method: 'POST',
                    body: getJsonText(
                        {
                            sendTime: sendTimeUTC
                        }
                    )
                }
                );

            getCampaign();
            handleActiveAccordion( null );
        }
        catch
        {
            toast.error( 'User does not have access to the requested operation' );
        }
    }

    async function handleApplyTemplateToCampaign(
        templateId
        )
    {
        try
        {
            let url = '/api/admin/page/mailchimp/campaign/' + campaignId + '/template/set';
            await fetchData(
                url,
                {
                    method: 'POST',
                    body: getJsonText(
                        {
                            html: `<!DOCTYPE html><html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\"><head>\n<!--[if gte mso 15]>\n<xml>\n<o:OfficeDocumentSettings>\n<o:AllowPNG/>\n<o:PixelsPerInch>96</o:PixelsPerInch>\n</o:OfficeDocumentSettings>\n</xml>\n<![endif]-->\n<meta charset=\"UTF-8\" />\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n<title>*|MC:SUBJECT|*</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin=\"\" />\n<style>          img{-ms-interpolation-mode:bicubic;} \n          table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} \n          .mceStandardButton, .mceStandardButton td, .mceStandardButton td a{mso-hide:all !important;} \n          p, a, li, td, blockquote{mso-line-height-rule:exactly;} \n          p, a, li, td, body, table, blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%;} \n          @media only screen and (max-width: 480px){\n            body, table, td, p, a, li, blockquote{-webkit-text-size-adjust:none !important;} \n          }\n          .mcnPreviewText{display: none !important;} \n          .bodyCell{margin:0 auto; padding:0; width:100%;}\n          .ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font{line-height:100%;} \n          .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} \n          a[x-apple-data-detectors]{color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;} \n            body{height:100%; margin:0; padding:0; width:100%; background: #ffffff;}\n            p{margin:0; padding:0;} \n            table{border-collapse:collapse;} \n            td, p, a{word-break:break-word;} \n            h1, h2, h3, h4, h5, h6{display:block; margin:0; padding:0;} \n            img, a img{border:0; height:auto; outline:none; text-decoration:none;} \n            a[href^=\"tel\"], a[href^=\"sms\"]{color:inherit; cursor:default; text-decoration:none;} \n            li p {margin: 0 !important;}\n            .ProseMirror a {\n                pointer-events: none;\n            }\n            @media only screen and (max-width: 640px){\n                .mceClusterLayout td{padding: 4px !important;} \n            }\n            @media only screen and (max-width: 480px){\n                body{width:100% !important; min-width:100% !important; } \n                body.mobile-native {\n                    -webkit-user-select: none; user-select: none; transition: transform 0.2s ease-in; transform-origin: top center;\n                }\n                body.mobile-native.selection-allowed a, body.mobile-native.selection-allowed .ProseMirror {\n                    user-select: auto;\n                    -webkit-user-select: auto;\n                }\n                colgroup{display: none;}\n                img{height: auto !important;}\n                .mceWidthContainer{max-width: 660px !important;}\n                .mceColumn{display: block !important; width: 100% !important;}\n                .mceColumn-forceSpan{display: table-cell !important; width: auto !important;}\n                .mceColumn-forceSpan .mceButton a{min-width:0 !important;}\n                .mceBlockContainer{padding-right:16px !important; padding-left:16px !important;} \n                .mceTextBlockContainer{padding-right:16px !important; padding-left:16px !important;} \n                .mceBlockContainerE2E{padding-right:0px; padding-left:0px;} \n                .mceSpacing-24{padding-right:16px !important; padding-left:16px !important;}\n                .mceImage, .mceLogo{width: 100% !important; height: auto !important;} \n                .mceFooterSection .mceText, .mceFooterSection .mceText p{font-size: 16px !important; line-height: 140% !important;}\n            }\n            div[contenteditable=\"true\"] {outline: 0;}\n            .ProseMirror h1.empty-node:only-child::before,\n            .ProseMirror h2.empty-node:only-child::before,\n            .ProseMirror h3.empty-node:only-child::before,\n            .ProseMirror h4.empty-node:only-child::before {\n                content: 'Heading';\n            }\n            .ProseMirror p.empty-node:only-child::before, .ProseMirror:empty::before {\n                content: 'Start typing...';\n            }\n            .mceImageBorder {display: inline-block;}\n            .mceImageBorder img {border: 0 !important;}\nbody, #bodyTable { background-color: rgb(244, 244, 244); }.mceText, .mcnTextContent, .mceLabel { font-family: \"Helvetica Neue\", Helvetica, Arial, Verdana, sans-serif; }.mceText, .mcnTextContent, .mceLabel { color: rgb(0, 0, 0); }.mceText p { margin-bottom: 0px; }.mceText label { margin-bottom: 0px; }.mceText input { margin-bottom: 0px; }.mceSpacing-12 .mceInput + .mceErrorMessage { margin-top: -6px; }.mceText p { margin-bottom: 0px; }.mceText label { margin-bottom: 0px; }.mceText input { margin-bottom: 0px; }.mceSpacing-24 .mceInput + .mceErrorMessage { margin-top: -12px; }.mceInput { background-color: transparent; border: 2px solid rgb(208, 208, 208); width: 60%; color: rgb(77, 77, 77); display: block; }.mceInput[type=\"radio\"], .mceInput[type=\"checkbox\"] { float: left; margin-right: 12px; display: inline; width: auto !important; }.mceLabel > .mceInput { margin-bottom: 0px; margin-top: 2px; }.mceLabel { display: block; }.mceText p, .mcnTextContent p { color: rgb(0, 0, 0); font-family: \"Helvetica Neue\", Helvetica, Arial, Verdana, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.5; mso-line-height-alt: 150%; text-align: center; direction: ltr; }.mceText a, .mcnTextContent a { color: rgb(0, 0, 0); font-style: normal; font-weight: normal; text-decoration: underline; direction: ltr; }.mceSectionBody .mceText p, .mceSectionBody .mcnTextContent p { }.mceSectionFooter .mceText p, .mceSectionFooter .mcnTextContent p { }.mceSectionFooter .mceText a, .mceSectionFooter .mcnTextContent a { font-style: normal; }\n@media only screen and (max-width: 480px) {\n            .mceText p { margin: 0px; font-size: 16px !important; line-height: 1.5 !important; mso-line-height-alt: 150%; }\n          }\n@media only screen and (max-width: 480px) {\n            .mceBlockContainer { padding-left: 16px !important; padding-right: 16px !important; }\n          }\n#dataBlockId-9 p, #dataBlockId-9 h1, #dataBlockId-9 h2, #dataBlockId-9 h3, #dataBlockId-9 h4, #dataBlockId-9 ul { text-align: center; }</style></head>\n<body>\n<!--*|IF:MC_PREVIEW_TEXT|*-->\n<!--[if !gte mso 9]><!----><span class=\"mcnPreviewText\" style=\"display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;\">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->\n<!--*|END:IF|*-->\n<div style=\"display: none; max-height: 0px; overflow: hidden;\"> ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ </div><!--MCE_TRACKING_PIXEL-->\n<center>\n<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" id=\"bodyTable\" style=\"background-color: rgb(244, 244, 244);\">\n<tbody><tr>\n<td class=\"bodyCell\" align=\"center\" valign=\"top\">\n<table id=\"root\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tbody data-block-id=\"3\" class=\"mceWrapper\"><tr><td style=\"background-color:transparent\" valign=\"top\" align=\"center\" class=\"mceSectionHeader\"><!--[if (gte mso 9)|(IE)]><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"660\" style=\"width:660px;\"><tr><td><![endif]--><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:660px\" role=\"presentation\"><tbody><tr><td style=\"background-color:#ffffff\" valign=\"top\" class=\"mceWrapperInner\"><table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" data-block-id=\"2\"><tbody><tr class=\"mceRow\"><td style=\"background-position:center;background-repeat:no-repeat;background-size:cover\" valign=\"top\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\"><tbody><tr><td style=\"padding-top:0;padding-bottom:0\" valign=\"top\" class=\"mceColumn\" data-block-id=\"-4\" colspan=\"12\" width=\"100%\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\"><tbody><tr><td style=\"padding-top:48px;padding-bottom:24px;padding-right:24px;padding-left:24px\" valign=\"top\" class=\"mceBlockContainer\" align=\"center\"><span class=\"mceImageBorder\" style=\"border:0;border-radius:0;vertical-align:top;margin:0\"><img data-block-id=\"1\" width=\"130\" height=\"auto\" style=\"width:130px;height:auto;max-width:130px !important;border-radius:0;display:block\" alt=\"logo\" src=\"https://cdn-images.mailchimp.com/template_images/email/logo-placeholder.png\" class=\"mceLogo\" /></span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody><tbody data-block-id=\"7\" class=\"mceWrapper\"><tr><td style=\"background-color:transparent\" valign=\"top\" align=\"center\" class=\"mceSectionBody\"><!--[if (gte mso 9)|(IE)]><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"660\" style=\"width:660px;\"><tr><td><![endif]--><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:660px\" role=\"presentation\"><tbody><tr><td style=\"background-color:#ffffff\" valign=\"top\" class=\"mceWrapperInner\"><table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" data-block-id=\"6\"><tbody><tr class=\"mceRow\"><td style=\"background-position:center;background-repeat:no-repeat;background-size:cover\" valign=\"top\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\"><tbody><tr><td style=\"padding-top:0;padding-bottom:0\" valign=\"top\" class=\"mceColumn\" data-block-id=\"-5\" colspan=\"12\" width=\"100%\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\"><tbody><tr><td style=\"padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0\" valign=\"top\" class=\"mceBlockContainer\" align=\"center\"><span class=\"mceImageBorder\" style=\"border:0;border-radius:0;vertical-align:top;margin:0\"><img data-block-id=\"4\" width=\"564\" height=\"auto\" style=\"width:564px;height:auto;max-width:564px !important;border-radius:0;display:block\" alt=\"image placeholder\" src=\"https://cdn-images.mailchimp.com/template_images/email/default_image_placeholder.png\" class=\"mceImage\" /></span></td></tr><tr><td style=\"padding-top:0;padding-bottom:0;padding-right:0;padding-left:0\" valign=\"top\"><table width=\"100%\" style=\"border:0;border-radius:0;border-collapse:separate\"><tbody><tr><td style=\"padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px\" class=\"mceTextBlockContainer\"><div data-block-id=\"5\" class=\"mceText\" id=\"dataBlockId-5\" style=\"width:100%\"><p class=\"last-child\"><br /></p></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody><tbody data-block-id=\"13\" class=\"mceWrapper\"><tr><td style=\"background-color:transparent\" valign=\"top\" align=\"center\" class=\"mceSectionFooter\"><!--[if (gte mso 9)|(IE)]><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"660\" style=\"width:660px;\"><tr><td><![endif]--><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:660px\" role=\"presentation\"><tbody><tr><td style=\"background-color:#ffffff\" valign=\"top\" class=\"mceWrapperInner\"><table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" data-block-id=\"12\"><tbody><tr class=\"mceRow\"><td style=\"background-position:center;background-repeat:no-repeat;background-size:cover\" valign=\"top\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\"><tbody><tr><td style=\"padding-top:0;padding-bottom:0\" valign=\"top\" class=\"mceColumn\" data-block-id=\"-6\" colspan=\"12\" width=\"100%\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\"><tbody><tr><td style=\"background-color:#f4f4f4;padding-top:8px;padding-bottom:8px;padding-right:8px;padding-left:8px\" valign=\"top\"><table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" data-block-id=\"11\" id=\"section_6441fd95c847ec180b0551adcf31da90\" class=\"mceFooterSection\"><tbody><tr class=\"mceRow\"><td style=\"background-color:#f4f4f4;background-position:center;background-repeat:no-repeat;background-size:cover;padding-top:0px;padding-bottom:0px\" valign=\"top\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"12\" width=\"100%\" role=\"presentation\"><tbody><tr><td style=\"padding-top:0;padding-bottom:0\" valign=\"top\" class=\"mceColumn\" data-block-id=\"-3\" colspan=\"12\" width=\"100%\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\"><tbody><tr><td style=\"padding-top:0;padding-bottom:0;padding-right:0;padding-left:0\" valign=\"top\" align=\"center\"><table width=\"100%\" style=\"border:0;border-radius:0;border-collapse:separate\"><tbody><tr><td style=\"padding-left:16px;padding-right:16px;padding-top:12px;padding-bottom:12px\" class=\"mceTextBlockContainer\"><div data-block-id=\"9\" class=\"mceText\" id=\"dataBlockId-9\" style=\"display:inline-block;width:100%\"><p class=\"last-child\"><a href=\"*|ARCHIVE|*\"><span style=\"font-size: 11px\">View email in browser</span></a><span style=\"font-size: 11px\"><br />*|IFNOT:ARCHIVE_PAGE|**|LIST:ADDRESSLINE|**|END:IF|*<br /></span><a href=\"*|UPDATE_PROFILE|*\"><span style=\"font-size: 11px\">update your preferences</span></a><span style=\"font-size: 11px\"> or </span><a href=\"*|UNSUB|*\"><span style=\"font-size: 11px\">unsubscribe</span></a></p></div></td></tr></tbody></table></td></tr><tr><td valign=\"top\" class=\"mceLayoutContainer\" align=\"center\"><table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\" data-block-id=\"-2\"><tbody><tr class=\"mceRow\"><td style=\"background-position:center;background-repeat:no-repeat;background-size:cover\" valign=\"top\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\"><tbody><tr><td valign=\"top\" class=\"mceColumn\" data-block-id=\"-7\" colspan=\"12\" width=\"100%\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" role=\"presentation\"><tbody><tr><td valign=\"top\" align=\"center\"><div><div data-block-id=\"10\"><a href=\"http://eepurl.com/i8m1qI\" target=\"_blank\" rel=\"noopener noreferrer\"><img style=\"max-width:100%\" width=\"137\" height=\"53\" alt=\"Email Marketing Powered by Mailchimp\" title=\"Mailchimp Email Marketing\" src=\"https://cdn-images.mailchimp.com/monkey_rewards/intuit-mc-rewards-2.png\" /></a></div></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table>\n</td>\n</tr>\n</tbody></table>\n</center>\n</body></html>`
                        }
                        )
                }
                );
            await getCampaign();
        }
        catch( error )
        {
            logError( error );
        }
    }

    // ~~

    async function handleSaveCampaign(
        )
    {
        try
        {
            await fetchData(
                '/api/admin/page/mailchimp/campaign/' + campaignId + '/set',
                {
                    method: 'POST',
                    body: getJsonText(
                        {
                            campaign:
                                {
                                    recipientMap: campaign.recipientMap,
                                    settingMap: campaign.settingMap
                                }
                        }
                        )
                }
                );

            getCampaign();
            getCampaignSendChecklist();
            handleActiveAccordion( null );
            isEditableInputNameEnabled = false;
        }
        catch ( error )
        {
            logError( error );
        }
    }

    // ~~

    function handleActiveAccordion(
        accordionIndex
        )
    {
        if ( activeAccordionIndex === accordionIndex )
        {
            activeAccordionIndex = null;
        }
        else
        {
            activeAccordionIndex = accordionIndex;
        }
    }

    // ~~

    function handleNextStep(
        )
    {
        currentStep = currentStep + 1;
    }

    // ~~

    function handlePreviousStep(
        )
    {
        currentStep = currentStep - 1;

        return true;
    }

    // ~~

    async function getCampaignSendChecklist(
        )
    {
        let response = await fetchData(
            '/api/admin/page/mailchimp/campaign/checklist/' + campaignId,
            { method: 'POST' }
            );

        campaignSendChecklist = response;
    }

    // ~~

    async function getCampaign(
        )
    {
        let response = await fetchData(
            '/api/admin/page/mailchimp/campaign/' + campaignId,
            { method: 'POST' }
            );

        campaign = response;

        if ( !campaign.content.html )
        {
            await handleApplyTemplateToCampaign();
        }
    }

    // ~~

    async function getCampaignReport(
        )
    {
        try
        {
            let report = await fetchData(
                '/api/admin/page/mailchimp/campaign/report/' + campaignId,
                { method: 'POST' }
                );

            return report;
        }
        catch ( error )
        {
            logError( error );
        }
    }

    // ~~

    async function handleSendCampaign(
        )
    {
        try
        {
            if ( !campaignSendChecklist.isReadyToSend )
            {
                toast.error( 'Your Campaign is not ready to send. See the checklist.' );

                return;
            }

            let response = await fetchData(
                '/api/admin/page/mailchimp/campaign/send/' + campaignId,
                { method: 'POST' }
                );

            await getCampaign();
            isConfirmSendCampaignModalOpen = false;
            handleNextStep();
            toast.success( 'Nice job! Your email is sending.' );
        }
        catch ( error )
        {
            logError( error );
        }
    }

    // ~~

    function handleEnableEditableInputName(
        )
    {
        isEditableInputNameEnabled = true;
    }

    // ~~

    async function getVerifiedDomainArray(
        )
    {
        let response = await fetchData(
            '/admin/api/mailchimp/verified-domain/list',
            { method: 'POST' }
            );

        verifiedDomainArray = response.domainArray;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                if ( campaignId === 'new' ) return currentStep = 3;

                await getCampaign();
                await getCampaignSendChecklist();
                await getVerifiedDomainArray();

                if ( 'status' in campaign
                     && ( campaign.status === 'sent' || campaign.status === 'sending' ) )
                {
                    currentStep = 1;
                }
            }
            catch ( error )
            {
                logError( error );
            }
            finally
            {
                isCampaignLoading = false;
                isCampaignSendChecklistLoading = false;
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    button
    {
        width: 7.5rem;
        border-radius: 0.75rem;
        padding: 0.5rem 1rem;

        background: blueColor;

        font-size: 0.75rem;
        color: whiteColor;

        cursor: pointer;
    }

    button[disabled]
    {
        opacity: 0.5;

        cursor: not-allowed;
    }

    // -- STYLES

    .page-container
    {
        min-height: 100dvh;
        padding-top: 7vh;

        display: flex;

        background-color: grayColor900;
    }

    .main-section
    {
        overflow: auto;
        overflow-x: hidden;
        height: calc( 100dvh - 7vh );
        width: 100%;
        padding: 0 3vh 2rem;

        display: flex;
        flex-direction: column;
        gap: 2vh;

        +media( desktop )
        {
            max-width: calc( 100dvw - 13em );
        }
    }

    .checklist-container
    {
        padding-top: 3rem;
        padding-bottom: 3rem;

        flex-grow: 1;
    }

    .iframe-container
    {
        position: relative;

        padding: 3rem 1.5rem;

        flex: 0 0 23.9375rem;

        +media( desktop )
        {
            margin-top: 1.5rem;
            margin-left: 1.5rem;
        }
    }

    .iframe
    {
        pointer-events: none;
    }

    .checklist-section
    {
        display: grid;
        grid-template-columns: 1fr;

        +media( desktop )
        {
            grid-template-columns: 1fr 29.75rem;
        }
    }

    .iframe-content
    {
        position: sticky;
        top: 5rem;
        transform-origin: 0px 0px;
        transform: scale( 0.419 );

        height: 0;
        width: 100%;
        min-width: 800px;
    }

    .checklist-accordion
    {
        width: max-content;
    }

    .checklist-accordion,
    .checklist-accordion-details
    {
        width: 100%;
        padding: 1rem 0;

        display: flex;
    }

    .checklist-accordion-details
    {
        flex: 1;
        gap: 1rem;
    }

    .iframe-editor-container
    {
        height: fit-content;
    }

    .icon
    {
        flex-shrink: 0;
    }

    .template-list
    {
        display: grid;
        grid-template-columns: repeat( auto-fill, minmax( 200px, 1fr ) );
        gap: 0.5rem;
    }

    .template-list div
    {
        overflow: hidden;
        height: 300px;
    }

    .template-type:first-letter
    {
        text-transform: uppercase;
    }

    .template-item
    {
        position: relative;
    }

    .template-item-cover
    {
        position: absolute;

        inset: 0 0 0 0;
        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;
        transition: background-color 400ms cubic-bezier( 0.76, 0, 0.27, 1 );
    }

    .template-item-cover:hover
    {
        background-color: rgba( 0, 0, 0, 0.5 );
        button
        {
            opacity: 1;
        }
    }

    .template-item-cover button
    {
        opacity: 0;

        transition: opacity 400ms cubic-bezier( 0.76, 0, 0.27, 1 );
    }

    .email-template-name-form
    {
        margin: 0 0 1.25rem;
    }

    .email-template-name
    {
        border: 2px dashed grayColor700;
        border-radius: 4px;
        padding: 0.5rem;

        display: inline-block;

        line-height: 2.5rem;
        font-size: 1.5rem;

        cursor: text;
    }

    .email-template-name.is-hidden
    {
        display: none;
    }
</style>

<Modal.Root
    isOpen={ isConfirmSendCampaignModalOpen }
    onClose={ () => isConfirmSendCampaignModalOpen = false }
    --max-height="50%"
>
    <Modal.Header title="Ready to send?" onClose={ () => isConfirmSendCampaignModalOpen = false }/>

    <Modal.Content>
        <span class="text-align-center">
            <p>You’re about to send an email to:</p>
            <p>{ campaign.settingMap.fromName }</p>
            <p>{ campaign.recipientMap.recipientCount } subscribers</p>
        </span>
    </Modal.Content>

    <Modal.Actions>
        <Modal.Button on:click={ () => isConfirmSendCampaignModalOpen = false }>Cancel</Modal.Button>
        <Modal.Button on:click={ handleSendCampaign }>Send now</Modal.Button>
    </Modal.Actions>
</Modal.Root>

<div class="page-container">
    <Sidebar/>
    {#if stepArray[ currentStep ] === 'editor' }
        <BlockSidebar/>
    {/if}

    <main class="display-flex flex-direction-column gap-100 main-section">
        {#if isCampaignSendChecklistLoading || isCampaignLoading }
            <Loading/>
        {:else}
            {#if stepArray[ currentStep ] === 'checklist' }
                <PageTitle
                    title="Campaign"
                >
                    <!-- <svelte:fragment slot="button">
                        <Button
                            on:click=
                                {
                                    campaign.contentType === 'template'
                                        ? handleNextStep
                                        : () => toast.warning( 'Only campaigns of type template can be edited here.' )
                                }
                            disabled=
                                {
                                    activeAccordionIndex !== null
                                        || [ 'sent', 'canceled', 'sending' ].includes( campaign.status )
                                }
                        >
                            Edit layout
                        </Button>
                    </svelte:fragment> -->
                    {#snippet button()}

                            <Button on:click={ () => isConfirmSendCampaignModalOpen = true }>Send</Button>

                                    {/snippet}
                </PageTitle>

                <form class="email-template-name-form" onsubmit={preventDefault(handleSaveCampaign)}>
                    <div class="page-header">
                        <div
                            class="email-template-name"
                            class:is-hidden={ isEditableInputNameEnabled }
                            onclick={handleEnableEditableInputName}
                            role="button"
                        >
                            { campaign.settingMap.title || 'Untitled' }
                        </div>
                        {#if isEditableInputNameEnabled }
                            <Input
                                name="name"
                                type="text"
                                label={ 'Name' }
                                bind:value={ campaign.settingMap.title }
                            >
                                <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <IconButton type="submit" slot="end-adornment">
                                    <div class="green-100-check-icon size-150"></div>
                                </IconButton>
                            </Input>
                        {/if}
                    </div>
                </form>

                <section class="checklist-section">
                    <div class="checklist-container">
                        <div class="checklist-accordion">
                            <div class="checklist-accordion-details">
                                <span class="green-100-check-icon icon size-150"></span>
                                <div class="checklist-accordion-text">
                                    <h2>To</h2>
                                    {#if campaign.settingMap }
                                        <span>All subscribed contacts in the audience { campaign.recipientMap.listName }.</span>
                                        { campaign.recipientMap.recipientCount } recipients
                                    {/if}
                                    {#if activeAccordionIndex === 0 }
                                        <div class="checklist-accordion-details-content margin-top-100" transition:slide>
                                            <div class="input-row">
                                                <span class="font-weight-700 line-height-150 color-gray-100">Send to</span>
                                                <Select fullWidth name="segment" value="all">
                                                    <option value="all">All email subscribers ({ campaign.recipientMap.recipientCount } subscribers)</option>
                                                </Select>
                                            </div>

                                            <div class="margin-top-100 display-flex gap-50">
                                                <button onclick={handleSaveCampaign} type="button">Save</button>
                                                <button type="button" onclick={() => handleActiveAccordion( null )}>Cancel</button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                            <div>
                                <button type="button" disabled={ activeAccordionIndex !== null } onclick={() => handleActiveAccordion( 0 )}>Edit recipients</button>
                            </div>
                        </div>

                        <div class="checklist-accordion">
                            <div class="checklist-accordion-details">
                                <span class="{ ( campaign.settingMap.replyTo && campaign.settingMap.fromName ) ? 'size-150 green-100-check' : 'size-100 red-400-close' }-icon icon"></span>
                                <div>
                                    <h2>From</h2>
                                    <span>{ campaign.settingMap.fromName || '' } • { campaign.settingMap.replyTo || '' }</span>
                                    {#if activeAccordionIndex === 1 }
                                        <div class="checklist-accordion-details-content" transition:slide>
                                            <div class="input-row space-between inline">
                                                <div class="input-row flex-grow">
                                                    <span class="font-weight-700 line-height-150 color-gray-100">Name</span>
                                                    <Input
                                                        name="listName"
                                                        fullWidth
                                                        bind:value={ campaign.settingMap.fromName }
                                                        helperText="We recommend using something subscribers will instantly recognize, like your company name."
                                                    />
                                                </div>
                                                <div class="input-row flex-grow">
                                                    <span class="font-weight-700 line-height-150 color-gray-100">Email address</span>

                                                    <Select fullWidth name="replyTo" bind:value={ campaign.settingMap.replyTo }>
                                                        {#each verifiedDomainArray as verifiedDomain }
                                                            <option value={ verifiedDomain.verificationEmail }>
                                                                { verifiedDomain.verificationEmail }
                                                            </option>
                                                        {/each}
                                                    </Select>
                                                </div>
                                            </div>

                                            <div class="margin-top-100 display-flex gap-50">
                                                <button onclick={handleSaveCampaign} type="button">Save</button>
                                                <button type="button" onclick={() => handleActiveAccordion( null )}>Cancel</button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                            <div>
                                <button type="button" disabled={ activeAccordionIndex !== null } onclick={() => handleActiveAccordion( 1 )}>Edit from</button>
                            </div>
                        </div>

                        <div class="checklist-accordion">
                            <div class="checklist-accordion-details">
                                <span class="{ ( campaign.settingMap.subjectLine ) ? 'size-150 green-100-check' : 'size-100 red-400-close' }-icon icon"></span>
                                <div>
                                    <h2>Subject</h2>
                                    <span>What's the subject line for this email?</span>
                                    {#if activeAccordionIndex === 2 }
                                        <div class="checklist-accordion-details-content" transition:slide>
                                            <div class="input-row">
                                                <span class="font-weight-700 line-height-150 color-gray-100">Subject</span>
                                                <Input
                                                    name="subjectLine"
                                                    bind:value={ campaign.settingMap.subjectLine }
                                                />
                                            </div>
                                            <div class="input-row">
                                                <span class="font-weight-700 line-height-150 color-gray-100">Preview Text</span>
                                                <Input
                                                    name="previewText"
                                                    bind:value={ campaign.settingMap.previewText }
                                                    helperText="Preview text appears in the inbox after the subject line."
                                                />
                                            </div>

                                            <div class="margin-top-100 display-flex gap-50">
                                                <button onclick={handleSaveCampaign} type="button">Save</button>
                                                <button type="button" onclick={() => handleActiveAccordion( null )}>Cancel</button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                            <div>
                                <button type="button" disabled={ activeAccordionIndex !== null } onclick={() => handleActiveAccordion( 2 )}>Edit subject</button>
                            </div>
                        </div>

                        <div class="checklist-accordion">
                            <div class="checklist-accordion-details">
                                <span class="green-100-check-icon icon size-150"></span>
                                <div>
                                    <h2>Send Time</h2>
                                    <span>When should we send this email?</span>
                                    {#if activeAccordionIndex === 3 }
                                        <div class="checklist-accordion-details-content" transition:slide>
                                            <div class="input-row">

                                                <Switch
                                                    bind:value={ campaign.settingMap.timewarp }
                                                    ariaLabel="Schedule"
                                                />

                                                {#if campaign.settingMap.timewarp }
                                                    <Input
                                                        name="sendTime"
                                                        bind:value={ sendTime }
                                                        type="datetime-local"
                                                        min={ new Date().toISOString() }
                                                    />
                                                {/if}
                                            </div>

                                            <div class="margin-top-100 display-flex gap-50">
                                                <button onclick={handleScheduleCampaign} type="button">Save</button>
                                                <button type="button" onclick={() => handleActiveAccordion( null )}>Cancel</button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                            <div>
                                <button type="button" disabled={ activeAccordionIndex !== null } onclick={() => handleActiveAccordion( 3 )}>Edit send time</button>
                            </div>
                        </div>

                        <div class="checklist-accordion">
                            <div class="checklist-accordion-details">
                                <span class="green-100-check-icon icon size-150"></span>
                                <div>
                                    <h2>Content</h2>
                                    {#each campaignSendChecklist.itemArray as item }
                                        {#if item.type === 'error' }
                                            <p>
                                                { item.details }
                                            </p>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                            <div>
                                <!-- <button type="button" disabled={ activeAccordionIndex !== null } on:click={ handleNextStep }>Edit design</button> -->
                            </div>
                        </div>
                    </div>

                    <div class="iframe-container">
                        <div class="iframe-content">
                            <iframe title="Email preview" tabindex="-1" scrolling="no" class="iframe" width="100%" height="1200px" srcdoc={ campaign.content.html }></iframe>
                        </div>
                    </div>
                </section>
            {:else if stepArray[ currentStep ] === 'editor' }
                <PageTitle
                    title="Campaign"
                    onBack={ handlePreviousStep }
                >
                    {#snippet button()}

                            <Button on:click={ () => isConfirmSendCampaignModalOpen = true }>Send</Button>

                                            {/snippet}
                </PageTitle>

                <div class="iframe-editor-container">
                    <IframeEditor
                        bind:html={ campaign.content.html }
                        campaignId={ campaignId }
                    />
                </div>
            {:else if stepArray[ currentStep ] === 'view-report' }
                <PageTitle
                    title="Campaign"
                />

                {#await getCampaignReport() }
                    <Loading/>
                {:then report}
                    <MonitorPerfomance
                        title="Analytics"
                        --border-top-width="0"
                    >
                        <div class="display-flex flex-direction-column">
                            <MonitorPerformanceDetailRow
                                text="Recipients"
                                value={ report.emailSentCount }
                            />
                            <MonitorPerformanceDetailRow
                                text="Audience"
                                value={ report.listName }
                            />
                            <MonitorPerformanceDetailRow
                                text="Subject"
                                value={ report.subjectLine }
                            />
                            <MonitorPerformanceDetailRow
                                text="Status"
                                --border-bottom="0"
                            >
                                {@const formattedSendTime = formatDate( report.sendTime, dateFormatOptionMap ) }
                                <span class="margin-top-25 display-flex align-items-center">
                                    <Status
                                        color={ campaignStatusSendingMapByStatus[ campaign.status ].color }
                                        name={ campaignStatusSendingMapByStatus[ campaign.status ].name }
                                        --font-size="0.75rem"
                                    />
                                    <span class="font-size-75 margin-lateral-50">
                                        { formattedSendTime || '' }
                                    </span>
                                </span>
                            </MonitorPerformanceDetailRow>
                        </div>
                    </MonitorPerfomance>

                    <MonitorPerfomance
                        title="Email performance"
                    >
                        <MonitorPerfomanceCardList>
                            <MonitorPerformanceCard
                                text="Open rate"
                                subtext={ `${ report.openMap.uniqueOpenCount || 0 } opened` }
                                value={ formatPercentage( report.openMap.openRate ) }
                            />

                            <MonitorPerformanceCard
                                text="Click rate"
                                subtext={ `${ report.clickMap.uniqueClickCount || 0 } clicked` }
                                value={ formatPercentage( report.clickMap.clickRate ) }
                            />

                            <MonitorPerformanceCard
                                text="Bounce rate"
                                subtext={ `${ report.bounceMap.softBounceCount || report.bounceMap.hardBounceCount || 0 } bounced` }
                                value={ formatPercentage( ( ( report.bounceMap.softBounceCount || report.bounceMap.hardBounceCount ) / report.openMap.uniqueOpenCount ) || 0 ) }
                            />

                            <MonitorPerformanceCard
                                text="Unsubscribe rate"
                                subtext={ `${ report.unsubscribeCount || 0 } unsubscribed` }
                                value={ formatPercentage( ( report.unsubscribeCount / report.openMap.uniqueOpenCount ) || 0 )  }
                            />
                        </MonitorPerfomanceCardList>
                    </MonitorPerfomance>
                {:catch error}
                    <Alert type="error" text={ error.message || error.error }/>
                {/await}
            {:else}
                <div class="text-center">
                    <h1>Error: Invalid step</h1>
                </div>
            {/if}
        {/if}
    </main>
</div>
