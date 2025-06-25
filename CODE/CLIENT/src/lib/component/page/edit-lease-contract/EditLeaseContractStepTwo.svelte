<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { getTimelessISOStringFromDate } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import LabelledInput from '$component/element/LabelledInput.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';

    // -- VARIABLES

    export let leaseContract;
    export let leaseDuration;
    export let tenantNoticeMonthCount;
    export let lessorNoticeMonthCount;
    export let validationFunction = validateStep

    // -- FUNCTIONS

    function addMonthCountToDateISOString(
        dateISOString,
        monthCount
        )
    {
        let date = new Date( dateISOString );

        if ( !isNaN( date.getTime() ) )
        {
            return getTimelessISOStringFromDate(
                new Date(
                    new Date( dateISOString )
                        .setMonth(
                            new Date( dateISOString )
                                .getMonth() + Number( monthCount )
                            )
                    )
                );
        }
    }

    // ~~

    function validateStep(
        )
    {
        let errorArray = []

        if ( !leaseContract.startingDate )
        {
            errorArray.push( 'edit-lease-contract-page-fill-in-effective-date-error' );
        }

        if ( !leaseContract.endingDate )
        {
            errorArray.push( 'edit-lease-contract-page-fill-in-effective-date-error' );
        }

        if ( !leaseContract.tenantNoticePeriod )
        {
            errorArray.push( 'edit-lease-contract-page-fill-in-tenant-notice-error' );
        }

        if ( !leaseContract.tenantNoticePeriod )
        {
            errorArray.push( 'edit-lease-contract-page-fill-in-lessor-notice-error' );
        }

        return errorArray;
    }
    // -- STATEMENTS

    if ( leaseContract.endingDate )
    {
        leaseDuration =
            ( new Date( leaseContract.endingDate ).getFullYear()
              - new Date( leaseContract.startingDate ).getFullYear() )
            * 12;
        leaseDuration -= new Date( leaseContract.startingDate ).getMonth();
        leaseDuration += new Date( leaseContract.endingDate ).getMonth();
    }

    // ~~

    if ( leaseContract.lessorNoticePeriod )
    {
        lessorNoticeMonthCount =
            ( new Date( leaseContract.lessorNoticePeriod ).getFullYear()
              - new Date( leaseContract.startingDate ).getFullYear() )
            * 12;
        lessorNoticeMonthCount -= new Date( leaseContract.startingDate ).getMonth();
        lessorNoticeMonthCount += new Date( leaseContract.lessorNoticePeriod ).getMonth();
    }

    // ~~

    if ( leaseContract.tenantNoticePeriod )
    {
        tenantNoticeMonthCount =
            ( new Date( leaseContract.tenantNoticePeriod ).getFullYear()
              - new Date( leaseContract.startingDate ).getFullYear() )
            * 12;
        tenantNoticeMonthCount -= new Date( leaseContract.startingDate ).getMonth();
        tenantNoticeMonthCount += new Date( leaseContract.tenantNoticePeriod ).getMonth();
    }
</script>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-desired-effective-date-of-lease-label', $languageTagStore ) }
>
    <LabelledInput
        label={ getLocalizedTextBySlug( 'edit-lease-contract-page-effective-date-of-lease-label', $languageTagStore )  }
        type="date"
        variant=""
        onChange={ () => leaseContract.endingDate = addMonthCountToDateISOString( leaseContract.startingDate, leaseDuration ) }
        bind:value={ leaseContract.startingDate }
    />
</EditLeaseContractPageSection>
<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-what-is-the-duration-of-the-lease-label', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'edit-lease-contract-page-what-is-the-duration-of-the-lease-helper', $languageTagStore ) }
>
    <LabelledInput
        label={ getLocalizedTextBySlug( "edit-lease-contract-page-duration-of-the-lease-label", $languageTagStore ) }
        suffix={ getLocalizedTextBySlug( 'month-label', $languageTagStore ).toLowerCase() }
        type="number"
        variant=""
        min={ 12 }
        max={ 48 }
        onChange={ () => leaseContract.endingDate = addMonthCountToDateISOString( leaseContract.startingDate, leaseDuration ) }
        bind:value={ leaseDuration }
    />
</EditLeaseContractPageSection>
<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'edit-lease-contract-page-what-is-the-notice-period-label', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'edit-lease-contract-page-what-is-the-notice-period-helper', $languageTagStore ) }
>
    <LabelledInput
        label={ getLocalizedTextBySlug( "edit-lease-contract-page-tenant-notice-label", $languageTagStore ) }
        suffix={ getLocalizedTextBySlug( 'month-label', $languageTagStore ).toLowerCase() }
        type="number"
        variant=""
        min={ 0 }
        onChange=
            {
                () =>
                {
                    leaseContract.tenantNoticePeriod
                        = addMonthCountToDateISOString( leaseContract.startingDate, tenantNoticeMonthCount )
                }
            }
        bind:value={ tenantNoticeMonthCount }
    />
    <LabelledInput
        label={ getLocalizedTextBySlug( "edit-lease-contract-page-lessor-notice-label", $languageTagStore ) }
        suffix={ getLocalizedTextBySlug( 'month-label', $languageTagStore ).toLowerCase() }
        type="number"
        variant=""
        min={ 0 }
        onChange=
            {
                () =>
                {
                    leaseContract.lessorNoticePeriod
                        = addMonthCountToDateISOString( leaseContract.startingDate, lessorNoticeMonthCount )
                }
            }
        bind:value={ lessorNoticeMonthCount }
    />
</EditLeaseContractPageSection>
