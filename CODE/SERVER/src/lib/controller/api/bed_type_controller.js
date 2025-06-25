// -- IMPORTS

import { bedTypeService } from '../../service/bed_type_service';

// -- FUNCTIONS

export async function getBedType(
    request,
    reply
    )
{
    return (
        {
            bedTypeArray : await bedTypeService.getCachedBedTypeArray()
        }
    )
}
