// -- IMPORTS

import { rentalTypeService } from '../../service/rental_type_service';

// -- FUNCTIONS

export async function getRentalType(
    request,
    reply
    )
{
    return (
        {
            rentalTypeArray : await rentalTypeService.getCachedRentalTypeArray()
        }
        );
}
