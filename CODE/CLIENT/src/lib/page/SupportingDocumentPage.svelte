<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug, getJsonText } from 'senselogic-gist';
    import { fetchData, hostUrl } from '$lib/base';
    import { isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import { languageTagStore } from '$store/languageTagStore';
    import LabelledCheckbox from '$component/element/LabelledCheckbox.svelte';
    import Loading from '$component/element/Loading.svelte';
    import Error from '$component/element/Error.svelte';
    import FileInput from '$src/lib/component/backoffice/FileInput.svelte';
    import SupportingDocumentAccordion from '$component/page/supporting-document/SupportingDocumentAccordion.svelte';
    import DocumentTypeInput from '$component/page/supporting-document/DocumentTypeInput.svelte';
    import CountryOfIssueInput from '$component/page/supporting-document/CountryOfIssueInput.svelte';
    import IssueDateInput from '$component/page/supporting-document/IssueDateInput.svelte';
    import PayrollMonthInput from '$component/page/supporting-document/PayrollMonthInput.svelte';
    import { documentStatusByIdMapStore } from '$store/documentStatusStore';
    import { documentTypeArrayStore, documentTypeByIdMapStore } from '$store/documentTypeStore';
    import AccountMobileHeader from '$component/page/account/AccountMobileHeader.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { toast } from '../toast';

    // -- VARIABLES

    let documentArray = [];
    let documentStatusMap;
    let documentTypeMap;
    let documentTypeArray;
    let document =
        {
            typeId: null,
            issueDate: null,
            payrollIssueMonth: null,
            countryCode: null
        };
    let stepArray = [ 'Initial Page', 'Document List', 'New Document' ];
    let activeStepIndex = 0;
    let checked = false;
    let fileArray = new Array();
    let errorArray = [];
    let isLoading = true;
    let isSubmitting = false;

    // -- FUNCTIONS

    function goToNextStep(
        )
    {
        if ( activeStepIndex < stepArray.length - 1 )
        {
            activeStepIndex++;
        }
        else
        {
            activeStepIndex = 0;
        }
    }

    // ~~

    function validateDocumentData(
        )
    {
        errorArray = [];

        if ( !document.typeId )
        {
            errorArray.push( 'supporting-documents-page-document-type-error' );
        }

        if ( !document.issueDate )
        {
            errorArray.push( 'supporting-documents-page-document-date-of-issue-error' );
        }

        if ( ( document.typeId === 'passport' || document.typeId === 'id-card' ) && !document.countryCode )
        {
            errorArray.push( 'supporting-documents-page-document-country-of-issue-error' );
        }

        if ( ( document.typeId === 'payroll' || document.typeId === 'proof-of-residence' || document.typeId === 'tax-sheet' )
             && !document.payrollIssueMonth )
        {
            errorArray.push( 'supporting-documents-page-document-payroll-issue-month-error' );
        }

        if ( errorArray.length !== 0 )
        {
            for ( let error of errorArray )
            {
                toast.error( error );
            }

            return true;
        }

        return false;
    }

    // ~~

    async function handleSubmit(
        )
    {
        if ( stepArray[ activeStepIndex ] !== 'New Document' )
        {
            goToNextStep();
        }
        else
        {
            let foundError = validateDocumentData();

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
                        body: getJsonText(
                            {
                                documentData:
                                    {
                                        ...document,
                                        filePath: fileArray[ 0 ]
                                    }
                            }
                            ),
                        credentials: 'include'
                    }
                    );

            if ( !response.ok )
            {
                let result = await response.json();

                if ( result.error )
                {
                    errorArray = [ ...errorArray, result.error ];
                }
            }
            else
            {
                let result = await response.json();

                documentArray = [ ...documentArray, result.document ];
            }

            isSubmitting = false;
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( !isLoadingProfile && !$profileSignedInStore )
            {
                navigate( '/' );
            }

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

            documentStatusMap = pageData.documentStatusMap;
            documentTypeArray = pageData.documentTypeArray;
            documentTypeMap = pageData.documentTypeMap;

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .supporting-document-container
    {
        margin-bottom: 4rem;
        height: unset;
        padding: 2rem 1.5rem;

        display:flex;
        flex-direction: column;
        gap: 1.5rem;
        justify-content: unset;
        align-items: center;

        +media( desktop )
        {
            margin-bottom: unset;
        }
    }

    .supporting-document-heading-text
    {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        align-items: center;

        text-align: center;
    }

    .supporting-document-list
    {
        width: 100%;

        display:flex;
        flex-direction: column;
    }

    .supporting-document-input-list
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .supporting-document-authorize-group
    {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
</style>

<AccountMobileHeader title={ getLocalizedTextBySlug( 'profile-page-supporting-documents', $languageTagStore ) }  />
{#if isLoading }
    <Loading />
{:else}
    <form
        class="supporting-document-container"
        on:submit|preventDefault={ handleSubmit }
    >
        {#if stepArray[ activeStepIndex ] === 'Initial Page' }
            <img
                src="/image/supporting-documents/heading.svg"
                alt="heading"
                class="supporting-document-heading-image"
            />
            <div class="supporting-document-heading-text">
                <div class="font-size-100 font-weight-700 color-black">
                    { getLocalizedTextBySlug( 'supporting-documents-page-title', $languageTagStore ) }
                </div>
                <div class="font-size-75 font-weight-500 color-black">
                    { getLocalizedTextBySlug( 'supporting-documents-subtitle', $languageTagStore ) }
                </div>
            </div>
        {:else}
            {#if stepArray[ activeStepIndex ] === 'New Document' }
                <div class="supporting-document-input-list">
                    <DocumentTypeInput documentTypeArray={ documentTypeArray } bind:documentTypeId={ document.typeId } />
                    {#if document.typeId }
                        {#if document.typeId === 'id-card' || document.typeId === 'passport' }
                            <CountryOfIssueInput bind:countryCode={ document.countryCode } />
                        {:else}
                            <PayrollMonthInput bind:payrollIssueMonth={ document.payrollIssueMonth } />
                        {/if}
                        <IssueDateInput bind:issueDate={ document.issueDate } />
                    {/if}
                </div>
                <div class="supporting-document-authorize-group">
                    <div class="font-size-90 font-weight-500 color-gray-100">
                        { getLocalizedTextBySlug( 'supporting-documents-page-authorize-checkbox-label', $languageTagStore ) }
                    </div>
                    <div class="supporting-document-checkbox">
                        <LabelledCheckbox
                            label={ getLocalizedTextBySlug( 'supporting-documents-page-authorize-checkbox-text', $languageTagStore ) }
                            checked={ checked }
                        />
                    </div>
                </div>
            {/if}
            <FileInput
                fullWidth={ true }
                fileInputName="file-path"
                acceptedType="image/*,application/pdf"
                maxFileCount={ 1 }
                bind:fileArray={ fileArray }
            />
            {#if stepArray[ activeStepIndex ] === 'Document List' }
                <div class="supporting-document-list">
                    {#each documentArray as document }
                        <SupportingDocumentAccordion document={ document }/>
                    {/each}
                </div>
            {/if}
        {/if}
        <ModalButton
            type="submit"
            text=
                {
                    stepArray[ activeStepIndex ] === 'Initial Page'
                    ? getLocalizedTextBySlug( 'supporting-documents-page-add-document-label', $languageTagStore )
                    : stepArray[ activeStepIndex ] === 'Document List'
                    ? getLocalizedTextBySlug( 'next-label', $languageTagStore )
                    : stepArray[ activeStepIndex ] === 'New Document'
                    ? getLocalizedTextBySlug( 'submit-label', $languageTagStore )
                    : ''
                }
            isLoading={ isSubmitting }
        />
    </form>
{/if}
