<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import CallToAction from '$component/element/CallToAction.svelte';
    import FormAccordion from '$component/element/FormAccordion.svelte';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
</script>

<FormAccordion label={ getLocalizedTextBySlug( 'filter-long-term-label', $languageTagStore ) } >
    <div class="display-flex flex-direction-column gap-100 padding-100">
        <EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'property-management-page-visits-label', $languageTagStore ) }>
            <Accordion label={ getLocalizedTextBySlug( 'property-management-page-view-current-and-past-visits-label', $languageTagStore ) }/>
        </EditLeaseContractPageSection>
        <EditLeaseContractPageSection
            label={ getLocalizedTextBySlug( 'property-management-page-contract-templates-label', $languageTagStore ) }
            helper={ getLocalizedTextBySlug( 'property-management-page-contract-templates-text', $languageTagStore ) }
        >
            <a class="font-size-100 font-weight-700 color-green" href="#" download>
                { getLocalizedTextBySlug( 'property-management-page-download-lease-contract-label', $languageTagStore ) }
            </a>
            <a class="font-size-100 font-weight-700 color-green" href="#" download>
                { getLocalizedTextBySlug( 'property-management-page-download-inventory-label', $languageTagStore ) }
            </a>
        </EditLeaseContractPageSection>
        <EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'property-management-page-subletting-label', $languageTagStore ) }>
            <CallToAction
                title={ getLocalizedTextBySlug( 'ad-subletting-label', $languageTagStore ) }
                actionLabel={ getLocalizedTextBySlug( 'read-the-article-label', $languageTagStore ) }
                type="error"
            />
            <LabelledSwitch
                label={ getLocalizedTextBySlug( 'property-management-page-authorize-subletting-label', $languageTagStore ) }
                value={ false }
                borderBottom={ true }
            />
        </EditLeaseContractPageSection>
        <EditLeaseContractPageSection
            label={ getLocalizedTextBySlug( 'edit-lease-contract-page-digital-package-label', $languageTagStore ) }
            helper={ getLocalizedTextBySlug( 'property-management-page-digital-pack-text', $languageTagStore ) }
        >
            <LabelledSwitch
                label={ getLocalizedTextBySlug( 'edit-lease-contract-page-subscribe-to-digital-package-label', $languageTagStore ) }
                value={ false }
            />
        </EditLeaseContractPageSection>
    </div>
</FormAccordion>
