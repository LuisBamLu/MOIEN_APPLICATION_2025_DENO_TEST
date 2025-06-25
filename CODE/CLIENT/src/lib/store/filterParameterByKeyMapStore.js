// -- IMPORTS

import { writable } from 'svelte/store';

// -- VARIABLES

export let mapCenterStore = writable( {} );
export let filterParameterByKeyMapStore = writable(
    {
        propertyParameters: {},
        locationParameters: {},
        bookingParameters: {},
        featureParameters: {},
        propertyIdArray: null
    }
    );

// -- FUNCTIONS

export function updatePropertyParameters(
    newPropertyParams
    )
{
    filterParameterByKeyMapStore.update(
        current =>
        (
            {
                ...current,
                propertyParameters:
                {
                    ...current.propertyParameters,
                    ...newPropertyParams
                }
            }
        )
        );
}

// ~~

export function updateLocationParameters(
    newLocationParams
    )
{
    filterParameterByKeyMapStore.update(
        current =>
        (
            {
                ...current,
                locationParameters:
                {
                    ...current.locationParameters,
                    ...newLocationParams
                }
            }
        )
        );
}

// ~~

export function updateBookingParameters(
    newBookingParams
    )
{
    filterParameterByKeyMapStore.update(
        current =>
        (
            {
                ...current,
                bookingParameters:
                {
                    ...current.bookingParameters,
                    ...newBookingParams
                }
            }
        )
        );
}

// ~~

export function updateFeatureParameters(
    newFeatureParams
    )
{
    filterParameterByKeyMapStore.update(
        current =>
        (
            {
                ...current,
                featureParameters:
                {
                    ...current.featureParameters,
                    ...newFeatureParams
                }
            }
        )
        );
}
