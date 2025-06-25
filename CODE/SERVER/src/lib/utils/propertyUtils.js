// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { spaceTypeService } from '../service/space_type_service'

// -- FUNCTIONS

export async function createSpaceDataArray(
    roomMap,
    propertyFeatureByTypeIdMap,
    propertyId,
    userId
    )
{
    let spaceTypeArray = await spaceTypeService.getCachedSpaceTypeArray();
    let spaceDataArray = []

    for ( let spaceType of spaceTypeArray )
    {
        let spaceTypeCount = propertyFeatureByTypeIdMap[ spaceType.id + '-count' ]?.value || 0;

        for ( let spaceTypeIndex = 0; spaceTypeIndex < spaceTypeCount; spaceTypeIndex++ )
        {
            let spaceData =
                {
                    id: getRandomTuid(),
                    propertyId: propertyId,
                    userId: userId,
                    name: spaceType.name,
                    typeId: spaceType.id,
                };

            if ( spaceType.id === 'bedroom'
                 || spaceType.id === 'living-room'
                 || spaceType.id === 'office'
                 || spaceType.id === 'other-room' )
            {
                if ( roomMap[ spaceType.id + '-array' ].length > 0 )
                {
                    spaceData.bedCountBySpaceTypeIdMap = roomMap[ spaceType.id + '-array' ][ spaceTypeIndex ];
                }
            }

            spaceDataArray.push( spaceData );
        }
    }

    return spaceDataArray;
}

// ~~

export function createBedDataArray(
    spaceDataArray
    )
{
    let bedDataArray = []

    for ( let spaceData of spaceDataArray )
    {
        if ( spaceData.bedCountBySpaceTypeIdMap !== undefined )
        {
            for ( let [ spaceTypeId, bedCount ] of Object.entries( spaceData.bedCountBySpaceTypeIdMap ) )
            {
                if ( bedCount !== 0 )
                {
                    let bedData =
                        {
                            id: getRandomTuid(),
                            propertyId: spaceData.propertyId,
                            spaceId: spaceData.id,
                            typeId: spaceTypeId,
                            count: bedCount,
                            personCount: 1,
                            userId: spaceData.userId
                        };

                    bedDataArray.push( bedData )
                }
            }
        }

        delete spaceData.bedCountBySpaceTypeIdMap;
    }

    return bedDataArray;
}
