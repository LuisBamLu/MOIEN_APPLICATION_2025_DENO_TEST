<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import LabelledInput from '$component/element/LabelledInput.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let featureByTypeIdMap = {};
    export let propertyId;
    let checkOutTime = null;

    // -- FUNCTIONS

    function handleChangeCheckOutTime(
        )
    {
        if ( !featureByTypeIdMap[ 'check-in-time' ] )
        {
            featureByTypeIdMap[ 'check-in-time' ] =
                {
                    typeId: 'check-in-time',
                    value: new Array( 2 ),
                    propertyId: propertyId
                };
        }

        featureByTypeIdMap[ 'check-in-time' ].value[ 1 ] = checkOutTime;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( featureByTypeIdMap[ 'check-in-time' ] )
            {
                checkOutTime = JSON.parse( featureByTypeIdMap[ 'check-in-time' ].value )[ 1 ];
            }
        }
        );
</script>

<EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'house-rules-page-check-out-time-label', $languageTagStore ) }>
    <LabelledInput
        label={ getLocalizedTextBySlug( 'house-rules-page-check-out-time-helper', $languageTagStore ) }
        type='time'
        onChange={ handleChangeCheckOutTime }
        bind:value={ checkOutTime }
    />
</EditLeaseContractPageSection>
