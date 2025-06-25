<script>
    // -- IMPORTS

    import { generateFilePath } from '$lib/filePath.js';
    import { getLocalizedText } from 'senselogic-gist';
    import { languageCode } from 'senselogic-gist';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let imagePath = '';
    export let languageData = [ 'en' ];
    export let metaDescription = '';
    export let metaKeywords = '';
    export let metaTitle;
    export let title = '';
    export let path;
    export let url;

    let language = languageCode;
    let specificLanguage;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            language = await languageCode;
            specificLanguage = languageData.find(
                ( item ) =>
                {
                    return item.code === languageCode;
                }
                )?.text?.en ?? 'English';
        }
        );
</script>

<svelte:head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"/>
    <meta name="description" content={ getLocalizedText( metaDescription ?? '' ) }/>
    <meta name="keywords" content={ getLocalizedText( metaKeywords ?? '' ) }/>
    <meta name="author" content="MOIEN"/>
    <meta name="robots" content="index, follow"/>

    <meta property="og:title" content={ getLocalizedText( metaTitle ?? '' ) }/>
    <meta property="og:description" content={ getLocalizedText( metaDescription ?? '' ) }/>
    <meta property="og:image" content={ generateFilePath(imagePath, '') }/>
    <meta property="og:url" content={ `${ url }${ language }/${ path }` }/>
    <meta property="og:type" content="website"/>
    <meta property="og:site_name" content="MOIEN"/>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="title" content={ getLocalizedText( metaTitle ?? '' ) }/>
    <meta name="language" content={ specificLanguage }/>
    <meta name="revisit-after" content="10 days"/>
    <meta name="format-detection" content="telephone=no"/>
    <meta name="HandheldFriendly" content="true"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="theme-color" content="#FFFFFF"/>
    <meta name="msapplication-config" content="/browserconfig.xml"/>
    <meta name="msapplication-TileColor" content="#FFFFFF"/>
    <meta name="msapplication-TileImage" content={ generateFilePath( imagePath, '' ) }/>

    <meta name="twitter:card" content={ getLocalizedText( metaTitle ?? '' ) }/>
    <meta name="twitter:title" content={ getLocalizedText( metaTitle ?? '' ) }/>
    <meta name="twitter:description" content={ getLocalizedText( metaDescription ?? '' ) }/>
    <meta name="twitter:image" content={ generateFilePath( imagePath, '' ) }/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content={ getLocalizedText( metaTitle ?? '' ) }/>
    <meta name="twitter:description" content={ getLocalizedText( metaDescription ?? '' ) }/>
    <meta name="twitter:url" content={ `${ url }${ language }/${ path }` }/>
    <meta name="twitter:label" content="Website by"/>
    <meta name="twitter:data" content='Moien'/>
    <meta name="twitter:image" content={ generateFilePath( imagePath, '' ) }/>

    <link rel='icon' type='image/png' href='/favicon.png'>
    <link rel='icon' sizes='192x192' href='/favicon.png'>

    {#if path !== 'blog' }
        <title>Moïen{ title ? ` - ${ title }` : '' }</title>
    {/if}

    <link rel="alternate" hreflang="en" href={ `${ url }en/${ path }` }/>
    <link rel="alternate" hreflang="fr" href={ `${ url }fr/${ path }` }/>
    <link rel="alternate" hreflang="de" href={ `${ url }de/${ path }` }/>
    <link rel='apple-touch-icon' href='/favicon.png'>
    <link rel='apple-touch-icon' sizes='76x76' href='/favicon.png'>
    <link rel='apple-touch-icon' sizes='120x120' href='/favicon.png'>
    <link rel='apple-touch-icon' sizes='152x152' href='/favicon.png'>
    <link rel="canonical" href={ `${ url }${ language }/${ path }` }/>
</svelte:head>
