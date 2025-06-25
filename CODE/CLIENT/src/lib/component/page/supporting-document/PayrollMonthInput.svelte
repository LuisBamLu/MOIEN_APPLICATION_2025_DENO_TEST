<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import InputModal from '$component/element/InputModal.svelte';

    // -- VARIABLES

    export let payrollIssueMonth;
    let isEditing = false;
    let monthName = payrollIssueMonth ? getMonthNameFromNumber( payrollIssueMonth - 1 ) : null;
    let selectedMonth = payrollIssueMonth;

    // -- FUNCTIONS

    function getMonthNameFromNumber(
        monthNumber
        )
    {
        let date = new Date();
        date.setMonth( monthNumber );

        return date.toLocaleString( $languageTagStore, { month: 'long' } );
    }

    // ~~

    async function save(
        )
    {
        payrollIssueMonth = selectedMonth;
        // Note: using setMonth() January is 0, February is 1, and so on.
        monthName = getMonthNameFromNumber( payrollIssueMonth - 1 );
        isEditing = false;
    }

    // ~~

    async function clear(
        )
    {
        payrollIssueMonth = null;
        monthName = null;
        selectedMonth = null;
    }
</script>

<Accordion
    value={ monthName }
    label={ getLocalizedTextBySlug( 'supporting-documents-page-payroll-issue-month', $languageTagStore ) }
    closeOnValueChange={ false }
    bind:isEditing={ isEditing }
>
    <InputModal
        heading={ getLocalizedTextBySlug( 'supporting-documents-page-payroll-issue-month', $languageTagStore ) }
        save={ save }
        clear={ clear }
        bind:isEditing={ isEditing }
    >
        {#each { length: 12 } as _, index }
            <div class="document-type-radio-group">
                <label class="radio-input-container">
                    <input
                        type="radio"
                        name="payroll-issue-month"
                        value={ index + 1 }
                        bind:group={ selectedMonth }
                    />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getMonthNameFromNumber( index ) }
                    </div>
                </label>
            </div>
        {/each}
    </InputModal>
</Accordion>
