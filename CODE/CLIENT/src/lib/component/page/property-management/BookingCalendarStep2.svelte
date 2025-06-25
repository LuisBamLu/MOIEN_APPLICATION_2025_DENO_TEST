<script>
    // -- IMPORTS

    import EditLeaseContractPageSection from '../edit-lease-contract/EditLeaseContractPageSection.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import LabelledSwitch from '../../element/LabelledSwitch.svelte';
    import LabelledInput from '../../element/LabelledInput.svelte';

    // -- VARIABLES

    export let isAvailable = true;
    export let price = 0;
    export let hasShortTermExtendedStayDiscount = false;
    export let shortTermExtendedStayDailyPrice = 0;
    export let hasShortTermProlongedStayDiscount = false;
    export let shortTermProlongedStayDailyPrice = 0;
    export let comment = '';
    export let property = {};
</script>

<EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'availability-label', $languageTagStore ) }>
    <LabelledSwitch
        label={ getLocalizedTextBySlug( 'available-label', $languageTagStore ) }
        bind:value={ isAvailable }
    />
</EditLeaseContractPageSection>
{#if isAvailable }
    <EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'filter-price-label', $languageTagStore ) }>
        <LabelledInput
            label={ getLocalizedTextBySlug( 'price-per-night-label', $languageTagStore ) }
            type="number"
            suffix=" €"
            bind:value={ price }
        />
        <LabelledSwitch
            label={ getLocalizedTextBySlug( 'property-management-page-extended-stay-discount-label', $languageTagStore ) }
            onChange=
                {
                    ( value ) =>
                    {
                        if ( value )
                        {
                            shortTermExtendedStayDailyPrice
                                = price * ( property.shortTermExtendedStayDailyPrice / property.shortTermDailyPrice );
                            shortTermExtendedStayDailyPrice = Number( shortTermExtendedStayDailyPrice.toFixed( 2 ) );
                        }
                    }
                }
            bind:value={ hasShortTermExtendedStayDiscount }
        />
        {#if hasShortTermExtendedStayDiscount }
            <LabelledInput
                label={ getLocalizedTextBySlug( 'ad-costs-week-per-night-label', $languageTagStore ) }
                type="number"
                suffix=" €"
                bind:value={ shortTermExtendedStayDailyPrice }
            />
        {/if}
        <LabelledSwitch
            label={ getLocalizedTextBySlug( 'property-management-page-prolonged-stay-discount-label', $languageTagStore ) }
            onChange=
                {
                    ( value ) =>
                    {
                        if ( value )
                        {
                            shortTermProlongedStayDailyPrice
                                = price * ( property.shortTermProlongedStayDailyPrice / property.shortTermDailyPrice );
                            shortTermProlongedStayDailyPrice = Number( shortTermProlongedStayDailyPrice.toFixed( 2 ) );
                        }
                    }
                }
            bind:value={ hasShortTermProlongedStayDiscount }
        />
        {#if hasShortTermProlongedStayDiscount }
            <LabelledInput
                label={ getLocalizedTextBySlug( 'ad-costs-month-per-night-label', $languageTagStore ) }
                type="number"
                suffix=" €"
                bind:value={ shortTermProlongedStayDailyPrice }
            />
        {/if}
    </EditLeaseContractPageSection>
{/if}
<EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'comment-label', $languageTagStore ) }>
    <LabelledInput
        placeholder={ getLocalizedTextBySlug( 'property-management-page-write-a-note-helper', $languageTagStore ) }
        bind:value={ comment }
    />
</EditLeaseContractPageSection>
