<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import DatePicker from 'senselogic-flow/DatePicker.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import InputModal from '$component/element/InputModal.svelte';

    // -- VARIABLES

    export let issueDate;
    let dateText = null;
    let isEditing;
    let selectedIssueDate = issueDate ? new Date( issueDate ) : new Date();

    // -- FUNCTIONS

    function save(
        )
    {
        issueDate = selectedIssueDate.toISOString();
        dateText = selectedIssueDate.toLocaleString( $languageTagStore, { dateStyle: 'short' } );

        isEditing = false;
    }

    // ~~

    function clear(
        )
    {
        issueDate = null;
        selectedIssueDate = null;
        dateText = null;
    }

    // ~~

    function handleDateChange(
        event
        )
    {
        selectedIssueDate = event;
    }
</script>

<Accordion
    value={ dateText }
    label={ getLocalizedTextBySlug( 'supporting-documents-page-date-of-issue', $languageTagStore ) }
    closeOnValueChange={ false }
    bind:isEditing={ isEditing }
>
    <InputModal
        heading={ getLocalizedTextBySlug( 'supporting-documents-page-date-of-issue', $languageTagStore ) }
        save={ save }
        clear={ clear }
        bind:isEditing={ isEditing }
    >
        <DatePicker date={ selectedIssueDate } onChange={ handleDateChange } />
    </InputModal>
</Accordion>
