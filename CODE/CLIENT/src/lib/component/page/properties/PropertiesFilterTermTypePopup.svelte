<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';

    // -- FUNCTIONS

    function handleTermTypeSelected(
        featureTypeId
        )
    {
        filterParameterByKeyMapStore.set(
            {
                propertyParameters: {},
                locationParameters: {},
                bookingParameters: {},
                featureParameters: {}
            }
            );

        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };
                let isCurrentlySelected = updatedParameters.propertyParameters[ featureTypeId ];

                delete updatedParameters.propertyParameters[ 'isAvailableForShortTerm' ];
                delete updatedParameters.propertyParameters[ 'isAvailableForLongTerm' ];

                if ( !isCurrentlySelected )
                {
                    updatedParameters.propertyParameters[ featureTypeId ] = true;
                }

                return updatedParameters;
            }
            );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    .properties-filter-term-type-popup
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
    }

    .properties-filter-term-type-popup-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .properties-filter-term-type-popup-items
    {
        width: 100%;

        display: flex;
        gap: 1rem;
    }

    .properties-filter-term-type-popup-item
    {
        height: 8rem;
        width: 100%;
        border: 2px solid grayColor700;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;

        background-color: whiteColor;

        transition: all 400ms ease-in-out;
    }

    .properties-filter-term-type-popup-item-icon,
    .properties-filter-term-type-popup-item-label
    {
        transition: all 400ms ease-in-out;
    }

    :global( .properties-filter-term-type-popup-item.is-selected )
    {
        border-color: greenColor800;

        background-color: greenColor950;

        transition: border 400ms ease-in-out;
        .properties-filter-term-type-popup-item-icon
        {
            background-color: greenColor300;
        }

        .properties-filter-term-type-popup-item-label
        {
            color: greenColor300;
        }
    }

    .properties-filter-term-type-popup-item-icon
    {
        height: 60%;
        width: 60%;

        +media( desktop )
        {
            max-height: 10vw;
            max-width: 10vw;
        }
    }
</style>

<div class="properties-filter-term-type-popup">
    <div class="properties-filter-term-type-popup-container">
        <div class="properties-filter-term-type-popup-items">
            <button
                class="properties-filter-term-type-popup-item"
                class:is-selected={ $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForShortTerm' ] }
                on:click={ () => handleTermTypeSelected( 'isAvailableForShortTerm' ) }
            >
                <div class="gray-backpack-icon properties-filter-term-type-popup-item-icon"/>
                <div class="font-size-90 font-weight-700 color-gray-550 properties-filter-term-type-popup-item-label">
                    { getLocalizedTextBySlug( 'term-type-short-term' ) }
                </div>
            </button>
            <button
                class="properties-filter-term-type-popup-item"
                class:is-selected={ $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForLongTerm' ] }
                on:click={ () => handleTermTypeSelected( 'isAvailableForLongTerm' ) }
            >
                <div class="gray-house-icon properties-filter-term-type-popup-item-icon"/>
                <div class="font-size-90 font-weight-700 color-gray-550 properties-filter-term-type-popup-item-label">
                    { getLocalizedTextBySlug( 'term-type-long-term' ) }
                </div>
            </button>
        </div>
    </div>
</div>
