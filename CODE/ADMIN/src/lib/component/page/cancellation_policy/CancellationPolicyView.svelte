<script>
    import { run, createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    // -- IMPORTS

    import { getLocalizedTextBySlug, isObject } from 'senselogic-gist';
    import Input from '$component/element/Input.svelte';
    import { cancellationPolicyArrayStore } from '$store/cancellationPolicyStore';
    import { fetchData, isObjectEmpty, getTextSlug, isDefinedAndNotNull } from '$lib/base';
    import { getLocalizedText } from 'senselogic-gist';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { toast } from '$lib/toast';
    import Button from '$component/element/Button.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import Tooltip from '$component/element/Tooltip.svelte';

    // -- VARIABLES

    /** @type {{cancellationPolicy?: any}} */
    let { cancellationPolicy = $bindable({}) } = $props();
    let isEditing = isDefinedAndNotNull( cancellationPolicy.id );
    let isSubmitting = false;

    // -- FUNCTIONS

    function handleUpdateLocalizedInput(
        event
        )
    {
        cancellationPolicy[ event.detail.name ] = event.detail.text;
    }

    // ~~

    run(() => {
        if ( !isEditing )
        {
            cancellationPolicy.name, cancellationPolicy.id = getTextSlug( getLocalizedText( cancellationPolicy.name || '', $languageTagStore ) );
        }
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    fieldset
    {
        overflow-x: hidden;
        padding-top: 1rem;

        display: grid;
        grid-template-columns: 1fr;
        row-gap: 1rem;
        column-gap: 1rem;

        scroll-snap-type: y mandatory;
        -ms-overflow-style: none;
        scrollbar-width: none;
        width: 100%;

        +media( desktop )
        {
            grid-template-columns: 1fr 1fr;
        }
    }

    fieldset::-webkit-scrollbar
    {
        width: 0px;

        background: transparent;
    }

    // -- CLASSES

    .row
    {
        grid-column: 1 / 3;
    }
</style>

<form onchange={bubble('change')}>
    <fieldset>
        <div class="row">
            <Input fullWidth label="ID" name="id" bind:value={ cancellationPolicy.id } readonly={ !isEditing }/>
        </div>
        <div class="row">
            <InputLocalizedForm
                name="name"
                label="Name"
                itemsString={ cancellationPolicy.name }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdateLocalizedInput }
            />
        </div>
        <div class="row">
            <Input type="number" fullWidth label="Number" name="number" bind:value={ cancellationPolicy.number }/>
        </div>
        <Input type="number" fullWidth label="Partial Refund Min. (Days)" name="partialRefundMinimumDayCount" bind:value={ cancellationPolicy.partialRefundMinimumDayCount }>
            <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <Tooltip placement="top" title={ getLocalizedTextBySlug( 'partial-refund-minimum-day-count-title', $languageTagStore ) } slot="end-adornment">
                <div class="border-radius-999 question-mark-icon size-100">
                    <div class="gray-question-mark-icon size-90"></div>
                </div>
            </Tooltip>
        </Input>
        <Input type="number" fullWidth label="Partial Refund Ratio" name="partialRefundRatio" bind:value={ cancellationPolicy.partialRefundRatio }>
            <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <Tooltip placement="left" title={ getLocalizedTextBySlug( 'partial-refund-ratio-title', $languageTagStore ) } slot="end-adornment">
                <div class="border-radius-999 question-mark-icon size-100">
                    <div class="gray-question-mark-icon size-90"></div>
                </div>
            </Tooltip>
        </Input>
        <Input type="number" fullWidth label="Full Refund Min. (Days)" name="fullRefundMinimumDayCount" bind:value={ cancellationPolicy.fullRefundMinimumDayCount }>
            <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <Tooltip placement="top" title={ getLocalizedTextBySlug( 'full-refund-minimum-day-count-title', $languageTagStore ) } slot="end-adornment">
                <div class="border-radius-999 question-mark-icon size-100">
                    <div class="gray-question-mark-icon size-90"></div>
                </div>
            </Tooltip>
        </Input>
        <Input type="number" fullWidth label="Penalty (Days)" name="penaltyDayCount" bind:value={ cancellationPolicy.penaltyDayCount }>
            <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <Tooltip placement="top" title={ getLocalizedTextBySlug( 'penalty-day-count-title', $languageTagStore )} slot="end-adornment">
                <div class="border-radius-999 question-mark-icon size-100">
                    <div class="gray-question-mark-icon size-90"></div>
                </div>
            </Tooltip>
        </Input>
    </fieldset>
</form>
