// -- IMPORTS

import { heatingTypeService } from '../../service/heating_type_service';

// -- FUNCTIONS

export async function getHeatingType(
    request,
    reply
    )
{
    return (
        {
            heatingTypeArray : await heatingTypeService.getCachedHeatingTypeArray()
        }
        );
}
