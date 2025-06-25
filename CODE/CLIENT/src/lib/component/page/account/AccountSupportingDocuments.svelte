<script>
    // -- IMPORTS

    import { fetchData, hostUrl } from '$lib/base';
    import { onMount } from 'svelte';
    import DocumentTypeInput from '../supporting-document/DocumentTypeInput.svelte';
    import { documentStatusByIdMapStore } from '$store/documentStatusStore';
    import { documentTypeArrayStore, documentTypeByIdMapStore } from '$store/documentTypeStore';
    import CountryOfIssueInput from '../supporting-document/CountryOfIssueInput.svelte';
    import FileInput from '$component/backoffice/FileInput.svelte';
    import SupportingDocumentAccordion from '../supporting-document/SupportingDocumentAccordion.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import Error from '$component/element/Error.svelte';
    import Loading from '$component/element/Loading.svelte';
    import { toast } from '$lib/toast';

    // -- VARIABLES

    export let showDocumentList = true;
    let documentArray = [];
    let errorArray = [];
    let document = {};
    let fileArray = new Array();
    let isLoading = true;
    let isSubmitting = false;
    let pendingDocumentArray = [];
    let acceptedDocumentArray = [];

    // -- FUNCTIONS

    function validateDocumentData(
        )
    {
        errorArray = [];

        if ( !document.typeId )
        {
            errorArray.push( 'supporting-documents-page-document-type-error' );
        }

        if ( !document.countryCode )
        {
            errorArray.push( 'supporting-documents-page-document-country-of-issue-error' );
        }

        if ( errorArray.length !== 0 )
        {
            return true
        }

        return false;
    }

    // ~~

    async function getUsersDocumentsByStatus(
        )
    {
        try
        {
            let data = await fetchData( '/api/page/user-documents', { method: 'POST', credentials: 'include' } );

            if ( data.length === 0 )
            {
                return;
            }
            else
            {
                let userDocumentArray = data;
                pendingDocumentArray = userDocumentArray.filter( ( document ) => document.validationStatusId === 'pending' );
                acceptedDocumentArray = userDocumentArray.filter( ( document ) => document.validationStatusId === 'accepted' );
            }
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    // ~~

    async function handleSubmit(
        )
    {
        let foundError = validateDocumentData();

        if ( pendingDocumentArray.length > 0 )
        {
            let existingPendingDocument = pendingDocumentArray.filter( ( item ) => item.typeId === document.typeId );

            if ( existingPendingDocument.length > 0 )
            {
                toast.error( 'document-in-analysis-label' )
                return false;
            }
        }

        if ( acceptedDocumentArray.length > 0 )
        {
            let existingAcceptedDocument = acceptedDocumentArray.filter( ( item ) => item.typeId === document.typeId );

            if ( existingAcceptedDocument.length > 0 )
            {
                toast.error( 'document-type-already-accepted-label' )
                return false;
            }
        }

        if ( foundError )
        {
            return false;
        }

        isSubmitting = true;

        let response
            = await fetch(
                hostUrl + '/api/document/new',
                {
                    method: 'POST',
                    body: getJsonText( { documentData: { ...document, filePath: fileArray[ 0 ] } } ),
                    credentials: 'include'
                }
                );

        if ( !response.ok )
        {
            let result = await response.json();

            if ( result.error )
            {
                toast.error( result.error );
                errorArray = [ ...errorArray, result.error ];
            }
        }
        else
        {
            let result = await response.json();

            documentArray = [ ...documentArray, result.document ];
            pendingDocumentArray = [ ...pendingDocumentArray, result.document ];

            document = {};
            fileArray = new Array();
            errorArray = [];
            toast.success( 'document-sent-label' )
        }

        isSubmitting = false;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let pageData = await fetchData(
                '/api/page/supporting-document',
                {
                    method: 'POST',
                    credentials: 'include'
                }
                );

            documentArray = pageData.documentArray;

            if ( $documentStatusByIdMapStore === null )
            {
                $documentStatusByIdMapStore = pageData.documentStatusMap;
            }

            if ( $documentTypeArrayStore === null )
            {
                $documentTypeArrayStore = pageData.documentTypeArray;
            }

            if ( $documentTypeByIdMapStore === null )
            {
                $documentTypeByIdMapStore = pageData.documentTypeMap;
            }

            await getUsersDocumentsByStatus();

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .supporting-document-list
    {
        width: 100%;

        display:flex;
        flex-direction: column;
    }

    .warning-message-container
    {
        width: 100%;

        display: flex;
        flex-direction: row;
        gap: .3rem;
        justify-content: flex-start;
        align-items: center;
    }

    .text
    {
        color: blueColor100;
    }
</style>

{#if isLoading }
    <Loading />
{:else}
    {#key pendingDocumentArray}
    <form
        class="supporting-document-form"
        on:submit|preventDefault={ handleSubmit }
    >
        {#key errorArray }
            {#each errorArray as error }
                <Error error={ error } />
            {/each}
        {/key}
        <DocumentTypeInput
            documentTypeArray={ $documentTypeArrayStore }
            bind:documentTypeId={ document.typeId }
        />
        <CountryOfIssueInput bind:countryCode={ document.countryCode } />
        <div class="display-flex flex-direction-column gap-100 padding-vertical-150">
            <div class="warning-message-container">
                <div class="informative-icon size-150 icon" />
                <div class="font-size-75 font-weight-500 color-gray-300 text">
                    { getLocalizedTextBySlug( 'image-size-warning-message-label', $languageTagStore ) }
                </div>
            </div>
            <FileInput
                fullWidth={ true }
                fileInputName="file-path"
                acceptedType="image/*,application/pdf"
                maxFileCount={ 1 }
                bind:fileArray={ fileArray }
            />
            <div class="display-flex justify-content-center">
                <ModalButton
                    fullWidth={ false }
                    text={ getLocalizedTextBySlug( 'submit-label', $languageTagStore ) }
                    isLoading={ isSubmitting }
                />
            </div>
        </div>
    </form>
    {#if showDocumentList }
        <div class="supporting-document-list">
            {#each documentArray as document }
                <SupportingDocumentAccordion
                    document={ document }
                    bind:documentArray={ documentArray }
                />
            {/each}
        </div>
    {/if}
    {/key}
{/if}
