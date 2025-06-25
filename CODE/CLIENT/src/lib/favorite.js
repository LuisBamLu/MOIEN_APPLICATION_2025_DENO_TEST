// -- IMPORTS

import { isArray } from 'senselogic-gist';
import { fetchData } from '$lib/base';

// -- FUNCTIONS

export async function handlePropertyFavorite(
    profileSignedInStore,
    propertyId,
    isFavorite
    )
{
    if ( !isArray( profileSignedInStore.favoritePropertyId ) )
    {
        profileSignedInStore.favoritePropertyId = [];
    }

    if ( isFavorite )
    {
        let propertyIndex = profileSignedInStore.favoritePropertyId.indexOf( propertyId );
        profileSignedInStore.favoritePropertyId.splice( propertyIndex, 1 );
    }
    else
    {
        profileSignedInStore.favoritePropertyId.push( propertyId );
    }

    await fetchData( '/api/profile/set-favorite-property',
    {
        method: 'POST',
        body: JSON.stringify(
            {
                profileId: profileSignedInStore.id,
                favoritePropertyId: profileSignedInStore.favoritePropertyId,
                type: 'updateProfileFavoriteProperty'
            }
            ),
        headers: { 'Content-Type': 'application/json' }
    }
    );

    return !isFavorite;
}

// ~~

export function checkPropertyFavorite(
    profileSignedInStore,
    propertyId
    )
{
    if ( isArray( profileSignedInStore?.favoritePropertyId ) )
    {
        return profileSignedInStore.favoritePropertyId.indexOf( propertyId ) > -1;
    }

    return false;
}
