<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import RadioCardGroup from '$component/element/RadioCardGroup.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';

    // -- VARIABLES

    export let leaseContract = {};
    let repaintOptionArray =
        [
            {
                label: getLocalizedTextBySlug( 'yes-label', $languageTagStore ),
                value: true
            },
            {
                label: getLocalizedTextBySlug( 'no-label', $languageTagStore ),
                value: false
            },
        ];
</script>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-require-tenant-to-repaint-property-label', $languageTagStore ) }
>
    <RadioCardGroup
        optionArray={ repaintOptionArray }
        bind:selected={ leaseContract.requiresRepaint }
    />
</EditLeaseContractPageSection>
