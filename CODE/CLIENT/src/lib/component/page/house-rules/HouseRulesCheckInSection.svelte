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
    let checkInTime = null;

    // -- FUNCTIONS

    function handleChangeCheckInTime(
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

        featureByTypeIdMap[ 'check-in-time' ].value[ 0 ] = checkInTime;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( featureByTypeIdMap[ 'check-in-time' ] )
            {
                checkInTime = JSON.parse( featureByTypeIdMap[ 'check-in-time' ].value )[ 0 ];
            }
        }
        );
</script>

<EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'house-rules-page-check-in-time-label', $languageTagStore ) }>
    <LabelledInput
        label={ getLocalizedTextBySlug( 'house-rules-page-check-in-time-helper', $languageTagStore ) }
        type='time'
        onChange={ handleChangeCheckInTime }
        bind:value={ checkInTime }
    />
</EditLeaseContractPageSection>
